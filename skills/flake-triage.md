# Flake Triage Standard

This skill defines the mandatory protocol for diagnosing test failures and determining whether a failure represents a **REAL BUG** in the application or a **FLAKY TEST** in the automation suite. Follow these instructions whenever a test failure or error trace is presented for triage.

---

## 1. Triage Workflow & Checklist

Work through each step systematically before making a conclusion:

### Step 1: Consistency Analysis
* **Question**: *Does the test fail reliably on every run, or only intermittently?*
  * **Consistent Failure (100% fail rate)**: Strongly points toward a **REAL BUG** or a deterministic breaking change.
  * **Intermittent Failure (passes on retry, fails occasionally)**: Strongly points toward a **FLAKY TEST** (timing, race conditions, network variance, or order dependence).
* **Mandatory Rule**: If the consistency is unknown or ambiguous, **prompt the user to re-run the test 3 to 5 times** (e.g., `npx playwright test <file> -g "<title>" --repeat-each 3`) before concluding.

---

### Step 2: Root Cause Identification
* **Question**: *Is the application behaving incorrectly, or is the test script flawed?*
  * **Application Failure Signals**:
    * Unexpected error banners, red borders, or toast notifications.
    * Server-side errors (HTTP 500, 404, unexpected 406).
    * Functional defect where valid user action produces an incorrect state.
  * **Test Script Failure Signals**:
    * `TimeoutError: locator.waitFor: Timeout exceeded` on a valid, visible element.
    * Strict mode violation (e.g., selector matched 2+ elements).
    * Race conditions (action attempted before hydration or animation completes).
    * Brittle selectors (deep CSS/XPath broken by minor layout changes).
    * Test pollution (failure caused by residual storage state, cookies, or database data left by a preceding test).

---

### Step 3: Trace & DOM Evidence Inspection
* **Question**: *In the Playwright trace, was the app genuinely broken, or was the test script looking too early / in the wrong place?*
  * Open and inspect the trace (`npx playwright show-trace <trace.zip>`):
    * Inspect the **Action / Before / After snapshots** at the exact millisecond of failure.
    * Check the **Console log** for unhandled client-side JavaScript runtime exceptions.
    * Check the **Network tab**: Did an API request genuinely fail, or was the request still in-flight when the test gave up?

---

### Step 4: Definitive Classification

Provide an explicit, unambiguous classification header:

* **Classification: REAL BUG**
  * *Meaning*: The application violates documented specifications or exhibits defective behavior.
* **Classification: FLAKY TEST**
  * *Meaning*: The application is functioning correctly, but the test automation script is non-deterministic or brittle.

---

### Step 5: Actionable Recommendation

* **If classified as REAL BUG**:
  1. Do **NOT** alter the test to make it artificially pass.
  2. Invoke the [`bug-reporting`](file:///d:/AI/APECO-Test-1/skills/bug-reporting.md) standard to produce a developer-ready bug report with reproduction steps and trace evidence.
* **If classified as FLAKY TEST**:
  1. Do **NOT** file an application bug.
  2. Identify and prescribe the specific technical fix:
     * **Replace fragile locator**: Migrate to accessible locators (`getByRole`, `getByLabel`).
     * **Eliminate race condition**: Replace manual waits or immediate assertions with web-first assertions (e.g., `await expect(locator).toBeVisible()`).
     * **Fix test isolation**: Move shared state into an isolated fixture (`test.use({ storageState: ... })`) or reset browser context between tests.
     * **Resolve strict mode ambiguity**: Target unique containers or use `.first()` / `.filter()`.
