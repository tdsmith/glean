/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package mozilla.telemetry.glean.scheduler

import android.content.Context
import android.content.SharedPreferences
import androidx.annotation.VisibleForTesting
import android.text.format.DateUtils
import android.util.Log
import mozilla.telemetry.glean.Dispatchers
import mozilla.telemetry.glean.Glean
import mozilla.telemetry.glean.GleanMetrics.Pings
import mozilla.telemetry.glean.utils.getISOTimeString
import mozilla.telemetry.glean.utils.parseISOTimeString
import mozilla.telemetry.glean.private.TimeUnit
import java.util.Calendar
import java.util.Date
import java.util.Timer
import java.util.TimerTask

/**
 * MetricsPingScheduler facilitates scheduling the periodic assembling of metrics pings,
 * at a given time, trying its best to handle the following cases:
 *
 * - ping is overdue (due time already passed) for the current calendar day;
 * - ping is soon to be sent in the current calendar day;
 * - ping was already sent, and must be scheduled for the next calendar day.
 */
@Suppress("TooManyFunctions")
internal class MetricsPingScheduler(
    private val applicationContext: Context,
    migratedLastSentDate: String? = null
) {
    internal val sharedPreferences: SharedPreferences by lazy {
        applicationContext.getSharedPreferences(this.javaClass.canonicalName, Context.MODE_PRIVATE)
    }

    internal var timer: Timer? = null

    companion object {
        private const val LOG_TAG = "glean/MetricsPingSched"
        const val LAST_METRICS_PING_SENT_DATETIME = "last_metrics_ping_iso_datetime"
        const val DUE_HOUR_OF_THE_DAY = 4
        const val LAST_VERSION_OF_APP_USED = "last_version_of_app_used"
    }

    init {
        // When performing the data migration from glean-ac, this scheduler might be
        // provided with a date the 'metrics' ping was last sent. If so, save that in
        // the new storage and use it in this scheduler.
        migratedLastSentDate?.let { acLastSentDate ->
            updateSentDate(acLastSentDate)
        }
    }

    /**
     * Schedules the metrics ping collection at the due time.
     *
     * @param now the current datetime, a [Calendar] instance.
     * @param sendTheNextCalendarDay whether to schedule collection for the next calendar day
     *        or to attempt to schedule it for the current calendar day. If the latter and
     *        we're overdue for the expected collection time, the task is scheduled for immediate
     *        execution.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun schedulePingCollection(now: Calendar, sendTheNextCalendarDay: Boolean) {
        // Compute how many milliseconds until the next time the metrics ping
        // needs to collect data.
        val millisUntilNextDueTime = getMillisecondsUntilDueTime(sendTheNextCalendarDay, now)
        Log.d(LOG_TAG, "Scheduling the 'metrics' ping in ${millisUntilNextDueTime}ms")

        // Cancel any existing scheduled work. Does not actually cancel a
        // currently-running task.
        cancel()

        timer = Timer("glean.MetricsPingScheduler")
        timer?.schedule(MetricsPingTimer(this), millisUntilNextDueTime)
    }

    /**
     * Determines if the application is a different version from the last time it was run.
     * This is used to prevent mixing data from multiple versions of the application in the
     * same ping.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun isDifferentVersion(): Boolean {
        // Determine if the version has changed since the last time we ran.
        val packageInfo = applicationContext.packageManager.getPackageInfo(
            applicationContext.packageName, 0
        )
        val currentVersion = packageInfo.versionName?.let { it } ?: "Unknown"
        val lastVersion = try {
            sharedPreferences.getString(LAST_VERSION_OF_APP_USED, null)
        } catch (e: ClassCastException) {
            null
        }
        if (currentVersion != lastVersion) {
            sharedPreferences.edit()?.putString(LAST_VERSION_OF_APP_USED, currentVersion)?.apply()
            return true
        }
        return false
    }

    /**
     * Computes the time in milliseconds until the next metrics ping due time.
     *
     * @param sendTheNextCalendarDay whether or not to return the delay for today or tomorrow's
     *        [dueHourOfTheDay]
     * @param now the current datetime, a [Calendar] instance.
     * @param dueHourOfTheDay the due hour of the day, in the [0, 23] range.
     * @return the milliseconds until the due hour: if current time is before the due
     *         hour, then |dueHour - currentHour| is returned. If it's exactly on that hour,
     *         then 0 is returned. Same if we're past the due hour.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun getMillisecondsUntilDueTime(
        sendTheNextCalendarDay: Boolean,
        now: Calendar,
        dueHourOfTheDay: Int = DUE_HOUR_OF_THE_DAY
    ): Long {
        val nowInMillis = now.timeInMillis
        val dueTime = getDueTimeForToday(now, dueHourOfTheDay)
        val delay = dueTime.timeInMillis - nowInMillis
        return when {
            sendTheNextCalendarDay -> {
                // We're past the `dueHourOfTheDay` in the current calendar day.
                dueTime.add(Calendar.DAY_OF_MONTH, 1)
                dueTime.timeInMillis - nowInMillis
            }
            delay >= 0 -> {
                // The `dueHourOfTheDay` is in the current calendar day.
                // Return the computed delay.
                delay
            }
            else -> {
                // We're overdue and don't want to wait until tomorrow.
                0L
            }
        }
    }

    /**
     * Check if the provided time is after the ping due time.
     *
     * @param now a [Calendar] instance representing the current time.
     * @param dueHourOfTheDay the due hour of the day, in the [0, 23] range.
     * @return true if the current time is after the due hour, false otherwise.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun isAfterDueTime(
        now: Calendar,
        dueHourOfTheDay: Int = DUE_HOUR_OF_THE_DAY
    ): Boolean {
        val nowInMillis = now.timeInMillis
        val dueTime = getDueTimeForToday(now, dueHourOfTheDay)
        return (dueTime.timeInMillis - nowInMillis) < 0
    }

    /**
     * Create a [Calendar] object representing the due time for the current
     * calendar day.
     *
     * @param now a [Calendar] instance representing the current time.
     * @param dueHourOfTheDay the due hour of the day, in the [0, 23] range.
     * @return a new [Calendar] instance representing the due hour for the current calendar day.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun getDueTimeForToday(now: Calendar, dueHourOfTheDay: Int): Calendar {
        val dueTime = now.clone() as Calendar
        dueTime.set(Calendar.HOUR_OF_DAY, dueHourOfTheDay)
        dueTime.set(Calendar.MINUTE, 0)
        dueTime.set(Calendar.SECOND, 0)
        dueTime.set(Calendar.MILLISECOND, 0)
        return dueTime
    }

    /**
     * Performs startup checks to decide when to schedule the next metrics ping
     * collection.
     */
    fun schedule() {
        val now = getCalendarInstance()

        // If the version of the app is different from the last time we ran the app,
        // schedule the metrics ping for immediate collection. We only need to perform
        // this check at startup (when overduePingAsFirst is true).
        if (isDifferentVersion()) {
            @Suppress("EXPERIMENTAL_API_USAGE")
            Dispatchers.API.executeTask {
                collectPingAndReschedule(now, startupPing = true)
            }
            return
        }

        val lastSentDate = getLastCollectedDate()

        if (lastSentDate != null) {
            Log.d(LOG_TAG, "The 'metrics' ping was last sent on $lastSentDate")
        }

        // We expect to cover 3 cases here:
        //
        // (1) - the ping was already collected the current calendar day; only schedule
        //       one for collecting the next calendar day at the due time;
        // (2) - the ping was NOT collected the current calendar day, and we're later than
        //       the due time; collect the ping immediately;
        // (3) - the ping was NOT collected the current calendar day, but we still have
        //       some time to the due time; schedule for sending the current calendar day.

        val alreadySentToday = (lastSentDate != null) && DateUtils.isToday(lastSentDate.time)
        when {
            alreadySentToday -> {
                // The metrics ping was already sent today. Schedule it for the next
                // calendar day. This addresses (1).
                Log.i(LOG_TAG, "The 'metrics' ping was already sent today, ${now.time}.")
                schedulePingCollection(now, sendTheNextCalendarDay = true)
            }
            // The ping wasn't already sent today. Are we overdue or just waiting for
            // the right time?  This covers (2)
            isAfterDueTime(now) -> {
                Log.i(LOG_TAG, "The 'metrics' ping is scheduled for immediate collection, ${now.time}")
                // **IMPORTANT**
                //
                // The reason why we're collecting the "metrics" ping in the `Dispatchers.API`
                // context is that we want to make sure no other metric API adds data before
                // the ping is collected. All the exposed metrics API dispatch calls to the
                // engines through the `Dispatchers.API` context, so this ensures we are enqueued
                // before any other recording API call.
                //
                // * Do not change `Dispatchers.API.executeTask` to `Dispatchers.API.launch` as
                // this would break startup overdue ping collection. *
                // `executeTask` schedules the task for immediate execution on the
                // `Dispatchers.API` thread pool, before any other enqueued task. For more
                // context, see bug 1604861 and the implementation of
                // `collectPingAndReschedule`.
                @Suppress("EXPERIMENTAL_API_USAGE")
                Dispatchers.API.executeTask {
                    // This addresses (2).
                    collectPingAndReschedule(now, startupPing = true)
                }
            }
            else -> {
                // This covers (3).
                Log.i(LOG_TAG, "The 'metrics' collection is scheduled for today, ${now.time}")
                schedulePingCollection(now, sendTheNextCalendarDay = false)
            }
        }
    }

    /**
     * Triggers the collection of the "metrics" ping and schedules the
     * next collection.
     *
     * @param now a [Calendar] instance representing the current time.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun collectPingAndReschedule(now: Calendar, startupPing: Boolean = false) {
        Log.i(LOG_TAG, "Collecting the 'metrics' ping, now = ${now.time}, startup = $startupPing")
        if (startupPing) {
            // **IMPORTANT**
            //
            // During the Glean initialization, we require any metric recording to be
            // batched up and replayed after any startup metrics ping is sent. To guarantee
            // that, we dispatch this function from `Dispatchers.API.executeTask`. However,
            // Pings.metrics.submit() ends up calling `Dispatchers.API.launch` again which
            // will delay the ping collection task after any pending metric recording is
            // executed, breaking the 'metrics' ping promise of sending a startup 'metrics'
            // ping only containing data from the previous session.
            // To prevent that, we synchronously manually dispatch the 'metrics' ping, without
            // going through our public API.
            //
            // * Do not change this line without checking what it implies for the above wall
            // of text. *
            Glean.submitPingsByNameSync(listOf("metrics"))
        } else {
            Pings.metrics.submit()
        }
        // Update the collection date: we don't really care if we have data or not, let's
        // always update the sent date.
        updateSentDate(getISOTimeString(now, truncateTo = TimeUnit.Day))
        // Reschedule the collection.
        schedulePingCollection(now, sendTheNextCalendarDay = true)
    }

    /**
     * Get the date the metrics ping was last collected.
     *
     * @return a [Date] object representing the date the metrics ping was last collected, or
     *         null if no metrics ping was previously collected.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun getLastCollectedDate(): Date? {
        val loadedDate = try {
            sharedPreferences.getString(LAST_METRICS_PING_SENT_DATETIME, null)
        } catch (e: ClassCastException) {
            null
        }

        if (loadedDate == null) {
            Log.e(LOG_TAG, "MetricsPingScheduler last stored ping time was not valid")
        }

        return loadedDate?.let { parseISOTimeString(it) }
    }

    /**
     * Function to cancel any pending metrics ping timers
     */
    fun cancel() {
        timer?.cancel()
        timer = null
    }

    /**
     * Update the persisted date when the metrics ping is sent.
     *
     * This is called after sending a metrics ping to timestamp when the last ping was
     * sent in order to maintain the proper interval between pings.
     *
     * @param date the datetime string to store
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun updateSentDate(date: String) {
        sharedPreferences.edit()?.putString(LAST_METRICS_PING_SENT_DATETIME, date)?.apply()
    }

    /**
     * Utility function to mock date creation and ease tests. This is intended
     * to be used only in tests, by overriding the return value with mockito.
     */
    @VisibleForTesting(otherwise = VisibleForTesting.PRIVATE)
    internal fun getCalendarInstance(): Calendar = Calendar.getInstance()
}

/**
 * The class representing the task to be performed by the [Timer]. This is used by
 * [MetricsPingScheduler.schedulePingCollection] for scheduling the collection of the
 * "metrics" ping at the due hour.
 */
internal class MetricsPingTimer(val scheduler: MetricsPingScheduler) : TimerTask() {
    companion object {
        private const val LOG_TAG = "glean/MetricsPingTimer"
    }

    /**
     * The callback to submit the metrics ping at the scheduled time.
     */
    override fun run() {
        // Perform the actual work.
        val now = scheduler.getCalendarInstance()
        Log.d(LOG_TAG, "MetricsPingTimerTask run(), now = ${now.time}")
        scheduler.collectPingAndReschedule(now)
    }
}
