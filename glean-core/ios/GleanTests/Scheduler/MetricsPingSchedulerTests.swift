/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

@testable import Glean
import OHHTTPStubs
import XCTest

class MetricsPingSchedulerTests: XCTestCase {
    var expectation: XCTestExpectation?

    override func setUp() {
        Glean.shared.enableTestingMode()
    }

    override func tearDown() {
        expectation = nil
    }

    func testIsAfterDueTime() {
        let mps = MetricsPingScheduler()
        var fakeNow = DateComponents()
        var fakeDate = Date()

        // Must report false before the due time on the same calendar day
        // Shortly before
        fakeNow.year = 2015
        fakeNow.month = 6
        fakeNow.day = 11
        fakeNow.hour = 3
        fakeNow.minute = 0
        fakeDate = Calendar.current.date(from: fakeNow)!
        XCTAssertFalse(
            mps.isAfterDueTime(fakeDate, dueHourOfTheDay: 4),
            "isAfterDueTime must report false before the due time on the same calendar day"
        )
        // The same hour
        fakeNow.year = 2015
        fakeNow.month = 6
        fakeNow.day = 11
        fakeNow.hour = 4
        fakeNow.minute = 0
        fakeDate = Calendar.current.date(from: fakeNow)!
        XCTAssertFalse(
            mps.isAfterDueTime(fakeDate, dueHourOfTheDay: 4),
            "isAfterDueTime must report false before the due time on the same calendar day"
        )
        // Midnight
        fakeNow.year = 2015
        fakeNow.month = 6
        fakeNow.day = 11
        fakeNow.hour = 0
        fakeNow.minute = 0
        fakeDate = Calendar.current.date(from: fakeNow)!
        XCTAssertFalse(
            mps.isAfterDueTime(fakeDate, dueHourOfTheDay: 4),
            "isAfterDueTime must report false before the due time on the same calendar day"
        )

        // Must report true after the due time on the same calendar day
        // Shortly After
        fakeNow.year = 2015
        fakeNow.month = 6
        fakeNow.day = 11
        fakeNow.hour = 4
        fakeNow.minute = 1
        fakeDate = Calendar.current.date(from: fakeNow)!
        XCTAssertTrue(
            mps.isAfterDueTime(fakeDate, dueHourOfTheDay: 4),
            "isAfterDueTime must report false before the due time on the same calendar day"
        )
    }

    func testGetLastCollectedDate() {
        let mps = MetricsPingScheduler()

        // getLastCollectedDate must report nil when no stored date is available
        UserDefaults.standard.set(nil, forKey: MetricsPingScheduler.Constants.lastMetricsPingSentDateTime)
        XCTAssertNil(
            mps.getLastCollectedDate(),
            "getLastCollectedDate must report nil when no date is stored"
        )

        // getLastCollectedDate must report nil when the stored date is corrupted
        UserDefaults.standard.set(123, forKey: MetricsPingScheduler.Constants.lastMetricsPingSentDateTime)
        XCTAssertNil(
            mps.getLastCollectedDate(),
            "getLastCollectedDate must report nil if date is wrong type"
        )

        // getLastCollectedDate must report nil when the date is of unexpected format
        UserDefaults.standard.set("not-an-ISO-date", forKey: MetricsPingScheduler.Constants.lastMetricsPingSentDateTime)
        XCTAssertNil(
            mps.getLastCollectedDate(),
            "getLastCollectedDate must report nil when the date is of unexpected format"
        )

        // getLastCollectedDate must report the stored last collected date, if available
        let testDate = "2018-12-19T12:36:00.000-06:00"
        UserDefaults.standard.set(testDate, forKey: MetricsPingScheduler.Constants.lastMetricsPingSentDateTime)
        XCTAssertEqual(
            Date.fromISO8601String(dateString: testDate, precision: .millisecond),
            mps.getLastCollectedDate(),
            "getLastCollectedDate must report the stored last collected date, if available"
        )
    }

    func testSchedulePingCollection() {
        let mps = MetricsPingScheduler()
        let now = Date()

        UserDefaults.standard.set(nil, forKey: MetricsPingScheduler.Constants.lastMetricsPingSentDateTime)
        mps.collectPingAndReschedule(now)
        XCTAssertEqual(
            now.toISO8601String(precision: .second),
            mps.getLastCollectedDate()?.toISO8601String(precision: .second),
            "schedulePingCollection must update last sent date"
        )

        let fireDate = Calendar.current.date(
            bySettingHour: MetricsPingScheduler.Constants.dueHourOfTheDay,
            minute: 0,
            second: 0,
            of: Calendar.current.date(
                byAdding: .day,
                value: 1,
                to: now,
                wrappingComponents: true
            )!
        )!
        XCTAssertEqual(
            fireDate.toISO8601String(precision: .second),
            mps.timer?.fireDate.toISO8601String(precision: .second),
            "schedulePingCollection must schedule next collection on the next day"
        )
    }

    // swiftlint:disable function_body_length
    // REASON: Used in a test
    func testQueuedDataNotInOverdueMetricsPings() {
        // Reset Glean and do not start it right away
        Glean.shared.testDestroyGleanHandle()
        Dispatchers.shared.setTaskQueuing(enabled: true)

        // Set the last time the "metrics" ping was sent to now. This is required for us to not
        // send a metrics pings the first time we initialize Glean.
        let now = Date()
        Glean.shared.metricsPingScheduler.updateSentDate(now)

        // Create a metric and set its value. We expect this to be sent in the first ping
        // that gets generated the SECOND time we start Glean.
        let expectedStringMetric = StringMetricType(
            category: "telemetry",
            name: "expected_metric",
            sendInPings: ["metrics"],
            lifetime: Lifetime.ping,
            disabled: false
        )
        let expectedValue = "must-exist-in-the-first-ping"

        Glean.shared.resetGlean(clearStores: false)
        expectedStringMetric.set(expectedValue)

        // Destroy Glean, it will retain the recorded metric.
        Glean.shared.testDestroyGleanHandle()
        Dispatchers.shared.setTaskQueuing(enabled: true)

        // Create data and attempt to record data before Glean is initialized.  This will
        // be queued in the dispatcher.
        let stringMetric = StringMetricType(
            category: "telemetry",
            name: "canary_metric",
            sendInPings: ["metrics"],
            lifetime: Lifetime.ping,
            disabled: false
        )
        let canaryValue = "must-not-be-in-the-first-ping"
        stringMetric.set(canaryValue)

        // Set the last time the "metrics" ping was sent to yesterday, which should make
        // the ping overdue and trigger it at startup.
        let yesterday = Calendar.current.date(byAdding: Calendar.Component.day, value: -1, to: now)
        Glean.shared.metricsPingScheduler.updateSentDate(yesterday!)

        let host = URL(string: Configuration.Constants.defaultTelemetryEndpoint)!.host!
        stub(condition: isHost(host)) { data in
            let body = (data as NSURLRequest).ohhttpStubs_HTTPBody()
            let json = try! JSONSerialization.jsonObject(with: body!, options: []) as? [String: Any]
            XCTAssert(json != nil)
            let metrics = json?["metrics"] as? [String: Any]
            let strings = metrics?["string"] as? [String: Any]

            // Ensure there is only the expected metric
            XCTAssertEqual(1, strings?.count, "Must contain only the expected metric")

            // Check the received metric's value against the expected value
            let receivedValue = strings?["telemetry.expected_metric"] as? String
            XCTAssertEqual(expectedValue, receivedValue, "Values must match")

            DispatchQueue.main.async {
                // let the response get processed before we mark the expectation fulfilled
                self.expectation?.fulfill()
            }

            return OHHTTPStubsResponse(
                jsonObject: [],
                statusCode: 200,
                headers: ["Content-Type": "application/json"]
            )
        }

        // Set our expectation that will be fulfilled by the stub above
        expectation = expectation(description: "Metrics Ping Received")

        // Initialize Glean the SECOND time: it will send the expected string metric (stored from
        // the previous run) but must not send the canary string, which would be sent the next time
        // the "metrics" ping is collected after this one.
        // Glean.shared.initialize(uploadEnabled: true)
        Glean.shared.initialize(uploadEnabled: true)
        waitForExpectations(timeout: 5.0) { error in
            XCTAssertNil(error, "Test timed out waiting for upload: \(error!)")
        }

        // Clean up
        Glean.shared.resetGlean(clearStores: true)
        Glean.shared.testDestroyGleanHandle()
    }

    func testGleanPreservesLifetimeApplicationMetrics() {
        // Reset Glean and do not start it right away
        Glean.shared.testDestroyGleanHandle()
        Dispatchers.shared.setTaskQueuing(enabled: true)

        // Set the last time the "metrics" ping was sent to now. This is required for us to not
        // send a metrics pings the first time we initialize Glean.
        let now = Date()
        Glean.shared.metricsPingScheduler.updateSentDate(now)

        // Create a metric and set its value. We expect this to be sent in the first ping
        // that gets generated the SECOND time we start Glean.
        let testMetric = StringMetricType(
            category: "telemetry",
            name: "test_applifetime_metric",
            sendInPings: ["metrics"],
            lifetime: Lifetime.application,
            disabled: false
        )
        let expectedValue = "I-will-survive!"

        // Reset Glean and start it for the FIRST time, then record a value.
        Glean.shared.resetGlean(clearStores: false)
        testMetric.set(expectedValue)

        // Set the last time the "metrics" ping was sent to yesterday, which should make
        // the ping overdue and trigger it at startup.
        let yesterday = Calendar.current.date(byAdding: Calendar.Component.day, value: -1, to: now)
        Glean.shared.metricsPingScheduler.updateSentDate(yesterday!)

        // Set up the interception of the ping for inspection
        let host = URL(string: Configuration.Constants.defaultTelemetryEndpoint)!.host!
        stub(condition: isHost(host)) { data in
            let body = (data as NSURLRequest).ohhttpStubs_HTTPBody()
            let json = try! JSONSerialization.jsonObject(with: body!, options: []) as? [String: Any]
            XCTAssert(json != nil)
            let metrics = json?["metrics"] as? [String: Any]
            let strings = metrics?["string"] as? [String: Any]

            // Ensure there is only the expected metric
            XCTAssertEqual(1, strings?.count, "Must contain only the expected metric")

            // Check the received metric's value against the expected value
            let receivedValue = strings?["telemetry.test_applifetime_metric"] as? String
            XCTAssertEqual(expectedValue, receivedValue, "Values must match")

            DispatchQueue.main.async {
                // let the response get processed before we mark the expectation fulfilled
                self.expectation?.fulfill()
            }

            return OHHTTPStubsResponse(
                jsonObject: [],
                statusCode: 200,
                headers: ["Content-Type": "application/json"]
            )
        }

        // Set our expectation that will be fulfilled by the stub above
        expectation = expectation(description: "Metrics Ping Received")

        // Initialize Glean the SECOND time: it will send the expected string metric (stored from
        // the previous run) but must not send the canary string, which would be sent the next time
        // the "metrics" ping is collected after this one.
        // Glean.shared.initialize(uploadEnabled: true)
        Glean.shared.resetGlean(clearStores: false)
        waitForExpectations(timeout: 5.0) { error in
            XCTAssertNil(error, "Test timed out waiting for upload: \(error!)")
        }

        // Clean up
        Glean.shared.resetGlean(clearStores: true)
        Glean.shared.testDestroyGleanHandle()
    }

    // Simple mock of the MetricsPingScheduler to override the collectPingAndReschedule
    // function in order to make it easier to test.
    private class FakeMPS: MetricsPingScheduler {
        let mpsExpectation: XCTestExpectation?

        init(expectation: XCTestExpectation?) {
            mpsExpectation = expectation
        }

        override func collectPingAndReschedule(_: Date, startupPing _: Bool = false) {
            mpsExpectation?.fulfill()
        }
    }

    func testTimerInvocation() {
        // Set up the expectation
        expectation = expectation(description: "Timer fired")

        // Build the mock MPS passing in the expectation to be fulfilled later
        let mps = FakeMPS(expectation: expectation)

        // Set the last time the "metrics" ping was set to now. This will be updated if
        // the timer fires so we can detect the change to determine success
        let now = Date()
        mps.updateSentDate(now)
        // Converting to strings here because comparing dates is more difficult
        XCTAssertEqual(
            now.toISO8601String(precision: .second),
            mps.getLastCollectedDate()?.toISO8601String(precision: .second)
        )

        // Create a fake date/time that is just a few seconds before the 4 AM time so
        // that it will fire off after a few seconds.
        let fakeNow = Calendar.current.date(
            bySettingHour: MetricsPingScheduler.Constants.dueHourOfTheDay - 1,
            minute: 59,
            second: 55,
            of: now
        )!

        // Calling `schedulePingCollection` with our `fakeNow` should cause the timer to
        // be set to fire in @ 5 seconds
        mps.schedulePingCollection(fakeNow, sendTheNextCalendarDay: false)

        waitForExpectations(timeout: 10.0)
    }
}
