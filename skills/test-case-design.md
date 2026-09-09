# Test Case Design Standard

This skill defines the mandatory standard for designing comprehensive, production-ready test matrices from feature specifications and real-world exploration notes. Follow these instructions whenever requested to generate or update test cases.

---

## 1. Input Requirements

Before designing test cases, ensure you have:
1. **Target Feature Scope**: The specific module or flow to test (e.g., Login, Password Recovery, Workspace Navigation).
2. **Exploration Notes**: The project's factual exploration records (e.g., `notes/exploration-notes.md`).
   * **Rule**: All test cases must be grounded in actual application behavior, observed DOM structures, and verified locators. Do **not** use generic guesses or hypothetical forms.

---

## 2. Test Case Classification (Three Mandatory Categories)

Every feature test matrix must be divided into three distinct categories:

### A. Positive Cases
* **Definition**: Valid end-to-end workflows where the feature functions as intended with valid inputs.
* **Focus**: Happy paths, successful submissions, authorized redirections, and correct state transitions.

### B. Negative Cases
* **Definition**: Workflows where invalid, malformed, or unauthorized input is cleanly rejected.
* **Focus**: Empty required fields, incorrect credentials, invalid formats, unauthorized route access, and proper display of user-facing error messages/toasts.

### C. Edge Cases
* **Definition**: Boundary conditions and extreme input parameters.
* **Focus**: Minimum and maximum length limits, just-below-minimum (min - 1), just-above-maximum (max + 1), whitespace handling (leading, trailing, internal), special characters, and direct URL entry without session history.

---

## 3. Standard Test Case Format

Every test case must strictly follow this structure:

* **ID**: Unique, structured identifier following the convention `TC-[FEATURE]-[TYPE]-[SEQ]` (e.g., `TC-LOGIN-POS-01`, `TC-LOGIN-NEG-02`, `TC-LOGIN-EDGE-01`).
* **Title**: Clear, behavior-describing sentence stating what is being tested and the expected reaction (e.g., *"Login rejects empty password"* or *"Successful authentication redirects to workspace dashboard"*).
* **Preconditions**: Exact system, session, and browser state required before step 1 (e.g., *"Browser navigated to `/auth/login`, unauthenticated, clean storage"*).
* **Steps**: Ordered, numbered list of concrete user actions referencing real UI locators.
* **Expected Result**: Measurable, verifiable UI and network outcomes (e.g., specific toast text, visual error class, route URL, HTTP status code).
* **Regression Flag** *(Conditional)*: If the case covers a defect or unexpected behavior discovered during exploration, explicitly mark it as:  
  `[Planned Regression - Bug: <Reference/Requirement ID>]` with a brief note on the defect.

---

## 4. Execution Rules & Quality Criteria

1. **Behavioral Titles**: Never use vague titles such as *"Test password"* or *"Verify login"*. Use explicit behavior statements: *"Login rejects submission when username contains leading or trailing whitespace"*.
2. **Deterministic Steps**: Specify exact input values, button names, and expected URL transitions.
3. **No Placeholders**: Never use placeholder locators (e.g., `input#generic-id`). Extract verified locators directly from exploration notes.
4. **Comprehensive Regression Coverage**: Every defect logged in the exploration notes' `Surprises` table or flagged as `FAIL` in compliance tracking must have a corresponding planned regression test case.
5. **Traceability**: Map each test case to its governing requirement ID (e.g., `REQ-LOGIN-01`, `REQ-LOGIN-09`).
