/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import Glean
import Swifter
import XCTest

// swiftlint:disable force_cast
// REASON: Used in below test cases to cause errors if data is missing
class BaselinePingTest: XCTestCase {
    var app: XCUIApplication!
    var expectation: XCTestExpectation?
    var lastPingJson: [String: Any]?

    override func setUp() {
        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // UI tests must launch the application that they test.
        // Doing this in setup will make sure it happens for each test method.
        app = XCUIApplication()
    }

    override func tearDown() {
        self.lastPingJson = nil
        self.expectation = nil
    }

    func setupServer(expectPingType: String) -> HttpServer {
        return mockServer(expectPingType: expectPingType) { json in
            self.lastPingJson = json
            // Fulfill test's expectation once we parsed the incoming data.
            self.expectation?.fulfill()
        }
    }

    func testValidateBaselinePing() {
        let server = setupServer(expectPingType: "baseline")
        expectation = expectation(description: "Completed upload")

        app.launchArguments = ["USE_MOCK_SERVER", "\(try! server.port())"]
        app.launch()

        // Wait for 1 second: this should guarantee we have some valid duration in the
        // ping.
        sleep(1)

        // Trigger baseline ping by putting app into the background
        XCUIDevice.shared.press(XCUIDevice.Button.home)

        waitForExpectations(timeout: 5.0) { error in
            XCTAssertNil(error, "Test timed out waiting for upload: \(error!)")
        }

        let metrics = lastPingJson!["metrics"] as! [String: Any]

        // Make sure we have a 'duration' field with a reasonable value: it should be >= 1, since
        // we slept for 1000ms.
        XCTAssertTrue(metrics.keys.contains("timespan"), "Metrics should have timespans: \(metrics)")
        let timespans = metrics["timespan"] as! [String: Any]
        XCTAssertTrue(timespans.keys.contains("glean.baseline.duration"),
                      "Timespans should have baseline duration: \(timespans)")
        let duration = timespans["glean.baseline.duration"] as! [String: Any]
        let durationValue = duration["value"] as! UInt64
        XCTAssertTrue(durationValue >= 1, "Duration \(durationValue) should be positive")

        // Make sure there's no errors.
        let errors = metrics["labeled_counter"] as? [String: Any]

        for (id, _) in errors ?? [:] {
            XCTAssertFalse(id.starts(with: "glean.error."))
        }

        server.stop()
    }
}
