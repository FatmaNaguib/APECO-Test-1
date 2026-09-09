# Bug Reporting Standard

This skill defines the mandatory standard for converting failing Playwright tests and runtime traces into developer-ready, actionable bug reports. Follow these instructions whenever you are asked to document, report, or log a defect.

---

## 1. Mandatory Bug Report Structure

Every bug report must strictly adhere to the following schema:

```markdown
### [BUG-ID] <Specific Behavioural Title>

* **Severity**: <Critical | High | Medium | Low> — <One-line business/technical justification>
* **Environment**:
  * **Application URL**: <Exact target URL or route>
  * **App Version / Commit**: <Release tag, commit SHA, or deployed version>
  * **Browser / Platform**: <e.g., Chromium 128 / Windows 11>
* **Preconditions**:
  * <User session, authentication state, initial data requirements>

#### Steps to Reproduce
1. Navigate to `<URL>`.
2. <Action with exact UI element and input value>.
3. <Action with exact UI element and input value>.
4. <Final trigger action (e.g., Click 'Login')>.

#### Expected Result
<Clear, isolated statement of what the system should do according to specifications.>

#### Actual Result
<Clear, isolated statement of what actually happened (error text, HTTP code, lack of response). Never combine with Expected Result into a single sentence.>

#### Evidence & Artifacts
* **Playwright Trace**: `<path/to/trace.zip>` (Inspect with: `npx playwright show-trace <trace.zip>`)
* **Screenshot**: `![Defect Screenshot](<path/to/screenshot.png>)`
* **Console / Network Logs**:
  * Request: `<METHOD> <URL>` -> Status: `<HTTP Status>`
  * Console: `<Relevant console errors or unhandled exceptions>`
```

---

## 2. Guidelines for Fields

### Title
* Must be **behavioral and specific**. State the trigger and the observed failure.
  * **Bad**: *"Login broken"*, *"Password bug"*, *"Checkout fails"*.
  * **Good**: *"Login button does not respond when email contains trailing whitespace"*, *"Proceed to Checkout button fails to open payment modal on mobile viewport"*.

### Severity Definitions & Justifications
* **Critical**: System crash, data loss, security exposure, or complete block of core revenue/auth path with no workaround.
* **High**: Major feature or core workflow broken; workaround is difficult or absent.
* **Medium**: Functional defect on secondary feature, or major feature failure where an easy workaround exists.
* **Low**: Cosmetic defects, typography errors, minor UI misalignments, or missing lowercase/uppercase styling.

### Steps to Reproduce
* Write deterministic, unambiguous steps.
* Include exact test input values, field labels, and button texts.
* Someone unfamiliar with the test suite must be able to follow the steps and reproduce the issue manually.

### Expected vs. Actual Results
* **Always keep them separate**. Never merge them into a single sentence like *"Button should submit but it gave 500"*.
* Detail visible DOM changes, network status codes, and user feedback (or lack thereof).

---

## 3. Mandatory Quality Gate (Self-Check)

Before submitting or saving any bug report, answer this final question:

> **"Could a developer reproduce this defect from the steps alone, without asking questions or looking at the test code?"**

* If the answer is **NO**: The report is incomplete. Add the missing preconditions, exact values, or reproduction steps before finalizing.
* If the answer is **YES**: The bug report is complete and developer-ready.
