/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package mozilla.telemetry.glean.private

import mozilla.telemetry.glean.Glean
import mozilla.telemetry.glean.rust.LibGleanFFI
import mozilla.telemetry.glean.rust.toByte

/**
 * This implements the developer facing API for custom pings.
 *
 * Instances of this class type are automatically generated by the parsers at build time.
 *
 * The Ping API only exposes the [send] method, which schedules a ping for sending.
 */
class PingType(
    internal val name: String,
    includeClientId: Boolean,
    sendIfEmpty: Boolean
) {
    internal var handle: Long

    init {
        this.handle = LibGleanFFI.INSTANCE.glean_new_ping_type(
            name = name,
            include_client_id = includeClientId.toByte(),
            send_if_empty = sendIfEmpty.toByte()
        )
        Glean.registerPingType(this)
    }

    /**
     * Destroy this ping type.
     */
    protected fun finalize() {
        if (this.handle != 0L) {
            LibGleanFFI.INSTANCE.glean_destroy_ping_type(this.handle)
        }
    }

    /**
     * Collect and submit the ping for eventual upload.
     *
     * While the collection of metrics into pings happens synchronously, the
     * ping queuing and ping uploading happens asyncronously.
     * There are no guarantees that this will happen immediately.
     *
     * If the ping currently contains no content, it will not be queued.
     */
    fun submit() {
        Glean.submitPings(listOf(this))
    }

    /**
     * Collect and submit the ping for eventual upload.
     *
     * **THIS METHOD IS DEPRECATED.**  Use `submit()` instead.
     *
     * While the collection of metrics into pings happens synchronously, the
     * ping queuing and ping uploading happens asyncronously.
     * There are no guarantees that this will happen immediately.
     *
     * If the ping currently contains no content, it will not be queued.
     */
    @Deprecated("Renamed to submit()")
    fun send() {
        submit()
    }
}
