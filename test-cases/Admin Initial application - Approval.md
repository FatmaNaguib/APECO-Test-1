# APECO Admin Test Matrix: Initial Application - Submission for a Private School Permit - APECO Employee Review-1

This comprehensive test matrix is designed in strict adherence to the [Test Case Design Standard](file:///d:/AI/APECO-Test-1/skills/test-case-design.md), utilizing [admin-Initial-approval-exploration-notes.md](file:///d:/AI/APECO-Test-1/notes/admin-Initial-approval-exploration-notes.md) as the factual source of truth for all observed DOM locators, multi-step review wizard behaviors, modal state transitions, and verified regressions on the APECO Admin Portal.

---

# Feature 1: Super Admin Authentication, Queue Navigation & Header Routing

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-AUTH-POS-01` | Super admin authenticates successfully and lands on Agent Queue dashboard | Admin Authentication & Dashboard |
| **Positive** | `TC-ADMREV-AUTH-POS-02` | Direct deep linking to request details URL renders request metadata for authenticated admin | Deep Linking & Routing |
| **Positive** | `TC-ADMREV-AUTH-POS-03` | Header back button `button.new-back-btn` navigates cleanly back to Agent Queue dashboard | Dashboard Return Navigation |
| **Positive** | `TC-ADMREV-AUTH-POS-04` | Language toggle alternates Admin Portal review interface between English (LTR) and Arabic (RTL) | Admin Localization & Layout |
| **Negative** | `TC-ADMREV-AUTH-NEG-01` | Unauthenticated direct navigation to request details URL cleanly redirects to admin login page | Access Control & Route Guard |
| **Negative** | `TC-ADMREV-AUTH-NEG-02` | Admin login rejects invalid password with user-facing authentication error | Authentication Validation |
| **Negative** | `TC-ADMREV-AUTH-NEG-03` | Navigating to non-existent Request ID URL displays 404 or request not found notification | Route Guard & Error Handling |
| **Edge** | `TC-ADMREV-AUTH-EDGE-01` | Active review session expiration triggers session timeout notification and redirects cleanly to login | Session Expiry Graceful Handling |
| **Edge** | `TC-ADMREV-AUTH-EDGE-02` | Request details URL with trailing slash `/requests/request-details/14682/` normalizes cleanly without error | URL Normalization |
| **Edge** | `TC-ADMREV-AUTH-EDGE-03` | Login email input handles leading and trailing whitespace gracefully by auto-trimming | Whitespace Input Handling |

---

### 1. Positive Test Cases

#### `TC-ADMREV-AUTH-POS-01`
* **Title**: Super admin authenticates successfully and lands on Agent Queue dashboard
* **Coverage / Requirement Ref**: Admin Authentication & Dashboard
* **Preconditions**: Browser navigated to `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/login`, unauthenticated context.
* **Steps**:
  1. Click language toggle button `page.locator('button:has-text("English")')` if loaded in Arabic RTL.
  2. Enter `'admin.qc@hotmail.com'` into `page.getByPlaceholder('Type email address')`.
  3. Enter `'Adm1n#tro3eh'` into `page.getByPlaceholder('Type password')`.
  4. Click `page.getByRole('button', { name: 'Login' })`.
  5. Await URL transition to `/agent-queue`.
* **Expected Result**:
  * Authentication succeeds with `HTTP 200 OK`.
  * Browser URL is `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/agent-queue`.
  * Module title displays `"Agent Queue"` with request count badge.
  * KPI summary cards (*All Requests*, *Assigned to Me*, *Open*, *Closed*) and requests table are visible.

---

#### `TC-ADMREV-AUTH-POS-02`
* **Title**: Direct deep linking to request details URL renders request metadata for authenticated admin
* **Coverage / Requirement Ref**: Deep Linking & Routing
* **Preconditions**: Super admin has active authenticated session on Admin Portal.
* **Steps**:
  1. Direct navigate to `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/requests/request-details/14682`.
  2. Verify page header module title using `page.locator('.module-title')`.
  3. Verify applicant heading using `page.getByRole('heading', { level: 1 })`.
  4. Verify active step in stepper using `page.locator('nz-step.ant-steps-item-process, nz-step.ant-steps-item-active')`.
* **Expected Result**:
  * Browser navigates directly to `/requests/request-details/14682` without intermediate redirects.
  * `.module-title` displays `"Request Details"`.
  * `page.getByRole('heading', { level: 1 })` displays `"Applicant: Anas Mohamed"`.
  * Active stepper item has class `ant-steps-item-process` and text `"1 Application Information"`.

---

#### `TC-ADMREV-AUTH-POS-03`
* **Title**: Header back button `button.new-back-btn` navigates cleanly back to Agent Queue dashboard
* **Coverage / Requirement Ref**: Dashboard Return Navigation
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Locate the top navigation back button: `page.locator('button.new-back-btn')`.
  2. Click `page.locator('button.new-back-btn')`.
  3. Await route change.
* **Expected Result**:
  * Browser navigates to `/agent-queue`.
  * Agent Queue header title displays `"Agent Queue"` and request count.
  * Requests table grid renders without console errors or frozen overlays.

---

#### `TC-ADMREV-AUTH-POS-04`
* **Title**: Language toggle alternates Admin Portal review interface between English (LTR) and Arabic (RTL)
* **Coverage / Requirement Ref**: Admin Localization & Layout
* **Preconditions**: Super admin is on `/requests/request-details/14682` in English (LTR) mode.
* **Steps**:
  1. Click `page.locator('button:has-text("العربية"), button.lang-btn').first()`.
  2. Inspect document root attribute `dir` on `page.locator('html')`.
  3. Verify header title and action button labels (`اعتماد`, `إرجاع`, `رفض`).
  4. Click `page.locator('button:has-text("English")')`.
* **Expected Result**:
  * Document root flips to `dir="rtl"`.
  * Header title displays `"تفاصيل الطلب"` and action buttons render in Arabic with RTL layout.
  * Clicking `"English"` restores `dir="ltr"` and labels revert to English (`Request Details`, `Approve`, `Return`, `Reject`).

---

### 2. Negative Test Cases

#### `TC-ADMREV-AUTH-NEG-01`
* **Title**: Unauthenticated direct navigation to request details URL cleanly redirects to admin login page
* **Coverage / Requirement Ref**: Access Control & Route Guard
* **Preconditions**: Clean, unauthenticated browser context (no cookies or tokens in storage).
* **Steps**:
  1. Navigate directly to `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/requests/request-details/14682`.
  2. Await navigation events.
* **Expected Result**:
  * Route guard intercepts request and redirects browser to `/login`.
  * Admin login form (*Email*, *Password*, *Login*) is displayed.
  * No confidential application data or applicant details are leaked in network responses or DOM.

---

#### `TC-ADMREV-AUTH-NEG-02`
* **Title**: Admin login rejects invalid password with user-facing authentication error
* **Coverage / Requirement Ref**: Authentication Validation
* **Preconditions**: Browser navigated to `/login`.
* **Steps**:
  1. Enter `'admin.qc@hotmail.com'` into `page.getByPlaceholder('Type email address')`.
  2. Enter `'WrongPassword!2026'` into `page.getByPlaceholder('Type password')`.
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Network dispatches authentication request returning `HTTP 400` or `HTTP 401`.
  * User-facing error message is displayed (e.g., `"Invalid credentials"` or `"Invalid email or password"`).
  * System remains on `/login` and does not grant access to `/agent-queue`.

---

#### `TC-ADMREV-AUTH-NEG-03`
* **Title**: Navigating to non-existent Request ID URL displays 404 or request not found notification
* **Coverage / Requirement Ref**: Route Guard & Error Handling
* **Preconditions**: Super admin authenticated on Admin Portal.
* **Steps**:
  1. Navigate to `/requests/request-details/999999999`.
  2. Observe network response and UI rendering.
* **Expected Result**:
  * Backend returns `HTTP 404 Not Found` or error payload.
  * UI displays user-friendly error message or empty state notification.
  * Application does not crash with unhandled exception or white screen.

---

### 3. Edge Cases

#### `TC-ADMREV-AUTH-EDGE-01`
* **Title**: Active review session expiration triggers session timeout notification and redirects cleanly to login
* **Coverage / Requirement Ref**: Session Expiry Graceful Handling
* **Preconditions**: Super admin is reviewing `/requests/request-details/14682`; authentication token is cleared or expired.
* **Steps**:
  1. Clear authentication token from `localStorage` and browser cookies.
  2. Click `page.getByRole('button', { name: 'Approve', exact: true })` or trigger a review action.
* **Expected Result**:
  * API call returns `HTTP 401 Unauthorized`.
  * System displays session expired notification and cleanly redirects to `/login`.
  * User is prompted to re-authenticate without corrupting application state.

---

#### `TC-ADMREV-AUTH-EDGE-02`
* **Title**: Request details URL with trailing slash `/requests/request-details/14682/` normalizes cleanly without error
* **Coverage / Requirement Ref**: URL Normalization
* **Preconditions**: Super admin authenticated on Admin Portal.
* **Steps**:
  1. Navigate to `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/requests/request-details/14682/`.
  2. Inspect URL and rendered page contents.
* **Expected Result**:
  * Router normalizes the trailing slash or handles route matching correctly.
  * Request details page renders cleanly without 404 or broken stylesheet assets.

---

#### `TC-ADMREV-AUTH-EDGE-03`
* **Title**: Login email input handles leading and trailing whitespace gracefully by auto-trimming
* **Coverage / Requirement Ref**: Whitespace Input Handling
* **Preconditions**: Browser navigated to `/login`.
* **Steps**:
  1. Enter `'  admin.qc@hotmail.com  '` into `page.getByPlaceholder('Type email address')`.
  2. Enter `'Adm1n#tro3eh'` into `page.getByPlaceholder('Type password')`.
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Input is automatically trimmed upon submission.
  * Authentication succeeds and lands on `/agent-queue`.

---

# Feature 2: Review Wizard Stepper & Sequential Navigation Architecture

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-STEP-POS-01` | Stepper renders all 5 review steps with Step 1 active upon initial page load | Stepper Initialization |
| **Positive** | `TC-ADMREV-STEP-POS-02` | Forward sequential navigation traverses Step 1 through Step 5 via wizard Next button | Stepper Forward Flow |
| **Positive** | `TC-ADMREV-STEP-POS-03` | Backward sequential navigation traverses Step 5 to Step 1 via wizard Previous button | Stepper Backward Flow |
| **Negative** | `TC-ADMREV-STEP-NEG-01` | Clicking inactive upcoming stepper items is non-interactive and prevents non-linear skipping | Stepper Guardrails |
| **Negative** | `TC-ADMREV-STEP-NEG-02` | Generic un-scoped selector `button:has-text("Back")` triggers Playwright strict mode collision across dormant modals | `[Planned Regression - Bug: SURPRISE-05]` |
| **Negative** | `TC-ADMREV-STEP-NEG-03` | Step 1 review view keeps wizard Previous button disabled or hidden | Wizard Boundary Navigation |
| **Edge** | `TC-ADMREV-STEP-EDGE-01` | Review wizard consolidates exactly 5 numbered review steps omitting applicant Download Documents step | `[Planned Regression - Bug: SURPRISE-04]` |
| **Edge** | `TC-ADMREV-STEP-EDGE-02` | Rapid sequential clicks on wizard Next and Previous buttons maintain synchronized stepper state | Stepper State Synchronization |
| **Edge** | `TC-ADMREV-STEP-EDGE-03` | Direct browser page refresh on intermediate review step (Step 3) restores review view cleanly | Browser Refresh Persistence |

---

### 1. Positive Test Cases

#### `TC-ADMREV-STEP-POS-01`
* **Title**: Stepper renders all 5 review steps with Step 1 active upon initial page load
* **Coverage / Requirement Ref**: Stepper Initialization
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Inspect the right-hand stepper container: `page.locator('nz-step')`.
  2. Verify total step count.
  3. Inspect active step classes on Step 1: `page.locator('nz-step').nth(0)`.
* **Expected Result**:
  * Exactly 5 `nz-step` items are present in DOM.
  * Step 1 has class `ant-steps-item-process` or `ant-steps-item-active`.
  * Steps 2, 3, 4, 5 have class `ant-steps-item-wait`.

---

#### `TC-ADMREV-STEP-POS-02`
* **Title**: Forward sequential navigation traverses Step 1 through Step 5 via wizard Next button
* **Coverage / Requirement Ref**: Stepper Forward Flow
* **Preconditions**: Super admin is on `/requests/request-details/14682`, Step 1.
* **Steps**:
  1. Click `page.locator('button.next-btn')` on Step 1.
  2. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Owners Profiles' })`.
  3. Click `page.locator('button.next-btn')` on Step 2.
  4. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'School Information' })`.
  5. Click `page.locator('button.next-btn')` on Step 3.
  6. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Attachments' })`.
  7. Click `page.locator('button.next-btn')` on Step 4.
  8. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Summary' })`.
* **Expected Result**:
  * Each click on `button.next-btn` increments the active stepper index sequentially (Step 1 -> 2 -> 3 -> 4 -> 5).
  * Corresponding step views mount cleanly without JS errors.

---

#### `TC-ADMREV-STEP-POS-03`
* **Title**: Backward sequential navigation traverses Step 5 to Step 1 via wizard Previous button
* **Coverage / Requirement Ref**: Stepper Backward Flow
* **Preconditions**: Super admin has navigated to Step 5 (`Summary`).
* **Steps**:
  1. Click `page.locator('button.prev-btn')` on Step 5.
  2. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Attachments' })`.
  3. Click `page.locator('button.prev-btn')` on Step 4.
  4. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'School Information' })`.
  5. Click `page.locator('button.prev-btn')` on Step 3.
  6. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Owners Profiles' })`.
  7. Click `page.locator('button.prev-btn')` on Step 2.
  8. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Application Information' })`.
* **Expected Result**:
  * `button.prev-btn` decrements the active stepper index sequentially (Step 5 -> 4 -> 3 -> 2 -> 1).
  * Form data in each preceding step remains intact.

---

### 2. Negative Test Cases

#### `TC-ADMREV-STEP-NEG-01`
* **Title**: Clicking inactive upcoming stepper items is non-interactive and prevents non-linear skipping
* **Coverage / Requirement Ref**: Stepper Guardrails
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Attempt to click `page.locator('nz-step').filter({ hasText: 'Summary' })`.
  2. Inspect active stepper element `page.locator('nz-step.ant-steps-item-process')`.
  3. Attempt to click `page.locator('nz-step').filter({ hasText: 'School Information' })`.
  4. Inspect active stepper element again.
* **Expected Result**:
  * Inactive upcoming stepper headers ignore click interactions.
  * Wizard remains on Step 1 (`Application Information`).
  * Stepper progression strictly requires sequential advancement via `button.next-btn`.

---

#### `TC-ADMREV-STEP-NEG-02`
* **Title**: Generic un-scoped selector `button:has-text("Back")` triggers Playwright strict mode collision across dormant modals
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-05]`
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Execute locator resolution for un-scoped selector: `page.locator('button:has-text("Back")')`.
  2. Evaluate element count matching the selector.
* **Expected Result**:
  * Un-scoped search resolves to multiple elements (e.g., 4 elements) because dormant modal templates (`#confirm-action`, `#workflow-popup`, etc.) contain un-rendered `"Back"` buttons in DOM.
  * Direct un-scoped click throws a Playwright strict mode violation.
  * Regression confirmation: Automation scripts must strictly scope navigation to `page.locator('button.new-back-btn')` and modal dismissal to `page.locator('div.modal.show button:has-text("Back")')`.

---

#### `TC-ADMREV-STEP-NEG-03`
* **Title**: Step 1 review view keeps wizard Previous button disabled or hidden
* **Coverage / Requirement Ref**: Wizard Boundary Navigation
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Inspect the bottom wizard navigation toolbar.
  2. Check visibility and state of `page.locator('button.prev-btn')`.
* **Expected Result**:
  * `button.prev-btn` is either not rendered in DOM, styled with `display: none`, or has `disabled="true"`.
  * Reviewer cannot navigate backward beyond Step 1 within the wizard container.

---

### 3. Edge Cases

#### `TC-ADMREV-STEP-EDGE-01`
* **Title**: Review wizard consolidates exactly 5 numbered review steps omitting applicant Download Documents step
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-04]`
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Count all stepper items: `page.locator('nz-step')`.
  2. Extract text labels from each `nz-step` element.
* **Expected Result**:
  * Total count of `nz-step` items is exactly 5 (unlike applicant portal which has 6 numbered steps).
  * Step labels strictly match:
    1. `"1 Application Information"`
    2. `"2 Owners Profiles"`
    3. `"3 School Information"`
    4. `"4 Attachments"`
    5. `"5 Summary"`
  * Step 4 from applicant portal ("Download Documents") is intentionally omitted from the employee review flow.

---

#### `TC-ADMREV-STEP-EDGE-02`
* **Title**: Rapid sequential clicks on wizard Next and Previous buttons maintain synchronized stepper state
* **Coverage / Requirement Ref**: Stepper State Synchronization
* **Preconditions**: Super admin is on `/requests/request-details/14682`, Step 1.
* **Steps**:
  1. Rapidly click `page.locator('button.next-btn')` 3 times in quick succession (< 200ms intervals).
  2. Await animation stabilization.
  3. Verify current active step title and index.
  4. Rapidly click `page.locator('button.prev-btn')` 2 times.
  5. Verify current active step title and index.
* **Expected Result**:
  * Step transitions execute cleanly without skipped views, corrupted step contents, or JS runtime errors.
  * Active stepper correctly reflects settled step (Step 4 after 3 forward clicks, Step 2 after 2 backward clicks).

---

#### `TC-ADMREV-STEP-EDGE-03`
* **Title**: Direct browser page refresh on intermediate review step (Step 3) restores review view cleanly
* **Coverage / Requirement Ref**: Browser Refresh Persistence
* **Preconditions**: Super admin navigates through wizard to Step 3 (`School Information`).
* **Steps**:
  1. Verify active step is `3 School Information`.
  2. Reload page using `page.reload()`.
  3. Inspect current stepper and page state.
* **Expected Result**:
  * Page reloads cleanly with `HTTP 200`.
  * Header displays `"Request Details"` and `"Applicant: Anas Mohamed"`.
  * System renders initial review step (Step 1) or preserves Step 3 with all applicant data intact.

---

# Feature 3: Step 1 - Application Information Review (Applicant & Contact Tabs)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-APPINFO-POS-01` | Tab 1 Applicant Information displays disabled applicant bilingual names and date of birth | Step 1 Applicant Details |
| **Positive** | `TC-ADMREV-APPINFO-POS-02` | Tab 2 Contact Information displays disabled applicant email and address | Step 1 Contact Details |
| **Positive** | `TC-ADMREV-APPINFO-POS-03` | Seamless tab switching between Applicant and Contact Information preserves data integrity | Step 1 Tab Switching |
| **Negative** | `TC-ADMREV-APPINFO-NEG-01` | Direct keyboard typing and clipboard pasting into Step 1 disabled input fields is strictly blocked | Form Immutability Guard |
| **Negative** | `TC-ADMREV-APPINFO-NEG-02` | Context menu cut or modification attempts do not alter pre-filled read-only values | Read-Only Data Protection |
| **Edge** | `TC-ADMREV-APPINFO-EDGE-01` | Arabic name fields preserve right-to-left glyph shaping and Unicode integrity | Bilingual Text Verification |
| **Edge** | `TC-ADMREV-APPINFO-EDGE-02` | Rapid toggling between Tab 1 and Tab 2 does not trigger layout thrashing or input flickering | Tab Performance & Stability |

---

### 1. Positive Test Cases

#### `TC-ADMREV-APPINFO-POS-01`
* **Title**: Tab 1 Applicant Information displays disabled applicant bilingual names and date of birth
* **Coverage / Requirement Ref**: Step 1 Applicant Details
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Inspect Tab 1: `page.getByRole('tab', { name: 'Applicant Information' })`.
  2. Verify values and `disabled` attribute on:
     * First Name EN: `page.getByRole('textbox', { name: 'First Name (in English)' })` -> `'Anas'`
     * First Name AR: `page.getByRole('textbox', { name: 'First Name (in Arabic)' })` -> `'انس'`
     * Last Name EN: `page.getByRole('textbox', { name: 'Last Name (in English)' })` -> `'Mohamed'`
     * Last Name AR: `page.getByRole('textbox', { name: 'Last Name (in Arabic)' })` -> `'محمد'`
     * Date of Birth: `page.getByRole('textbox', { name: 'Date of Birth' })` -> `'1985-01-01'`
* **Expected Result**:
  * All 5 fields contain verified applicant values.
  * Every input element has attribute `disabled="true"` or `disabled=""`.

---

#### `TC-ADMREV-APPINFO-POS-02`
* **Title**: Tab 2 Contact Information displays disabled applicant email and address
* **Coverage / Requirement Ref**: Step 1 Contact Details
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Click Tab 2: `page.getByRole('tab', { name: 'Contact Information' })`.
  2. Verify values and `disabled` attribute on:
     * Email: `page.getByRole('textbox', { name: 'Email' })` -> `'apecouser@hotmail.com'`
     * Address: `page.getByRole('textbox', { name: 'Address' })` -> `'Al Jurf, Ajman'`
* **Expected Result**:
  * Both fields contain verified applicant values.
  * Both inputs are disabled and non-editable.

---

#### `TC-ADMREV-APPINFO-POS-03`
* **Title**: Seamless tab switching between Applicant and Contact Information preserves data integrity
* **Coverage / Requirement Ref**: Step 1 Tab Switching
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Click `page.getByRole('tab', { name: 'Contact Information' })`.
  2. Verify Email is `'apecouser@hotmail.com'`.
  3. Click `page.getByRole('tab', { name: 'Applicant Information' })`.
  4. Verify First Name EN is `'Anas'`.
* **Expected Result**:
  * Tab switching is instantaneous.
  * Pre-populated data remains identical without network refetches or field blanks.

---

### 2. Negative Test Cases

#### `TC-ADMREV-APPINFO-NEG-01`
* **Title**: Direct keyboard typing and clipboard pasting into Step 1 disabled input fields is strictly blocked
* **Coverage / Requirement Ref**: Form Immutability Guard
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Attempt to type into `page.getByRole('textbox', { name: 'First Name (in English)' })`.
  2. Attempt to paste text into `page.getByRole('textbox', { name: 'Address' })`.
* **Expected Result**:
  * Input fields reject user input (`isEditable()` returns `false`).
  * Values remain strictly `'Anas'` and `'Al Jurf, Ajman'`.

---

#### `TC-ADMREV-APPINFO-NEG-02`
* **Title**: Context menu cut or modification attempts do not alter pre-filled read-only values
* **Coverage / Requirement Ref**: Read-Only Data Protection
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Select text in `page.getByRole('textbox', { name: 'Email' })`.
  2. Press keyboard shortcut `Control+X` (Cut).
* **Expected Result**:
  * Cut command is blocked by browser/OS for disabled fields.
  * Email value remains strictly `'apecouser@hotmail.com'`.

---

### 3. Edge Cases

#### `TC-ADMREV-APPINFO-EDGE-01`
* **Title**: Arabic name fields preserve right-to-left glyph shaping and Unicode integrity
* **Coverage / Requirement Ref**: Bilingual Text Verification
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Inspect `page.getByRole('textbox', { name: 'First Name (in Arabic)' })`.
  2. Inspect `page.getByRole('textbox', { name: 'Last Name (in Arabic)' })`.
* **Expected Result**:
  * Arabic text `'انس'` and `'محمد'` render with correct Unicode codepoints and RTL text alignment.
  * No mojibake, question marks, or disconnected glyphs.

---

#### `TC-ADMREV-APPINFO-EDGE-02`
* **Title**: Rapid toggling between Tab 1 and Tab 2 does not trigger layout thrashing or input flickering
* **Coverage / Requirement Ref**: Tab Performance & Stability
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Alternately click Tab 1 and Tab 2 5 times in rapid succession.
  2. Verify settled state on Tab 1.
* **Expected Result**:
  * Tab content switches cleanly without UI flicker or layout thrashing.
  * All input fields retain their accurate values and disabled states.

---

# Feature 4: Step 2 - Owners Profiles Review (15 Horizontal Sub-Tabs)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-OWNERS-POS-01` | Step 2 renders 15 owner sub-sections across horizontal tab strip | Step 2 Horizontal Tabs |
| **Positive** | `TC-ADMREV-OWNERS-POS-02` | Personal Details sub-tab displays owner metadata and disabled photo/conduct files | Step 2 Personal Details |
| **Positive** | `TC-ADMREV-OWNERS-POS-03` | Passport Details sub-tab displays passport number, issue place, and issue/expiry dates | Step 2 Passport Details |
| **Positive** | `TC-ADMREV-OWNERS-POS-04` | Share Percentage sub-tab displays 100% equity allocation | Step 2 Share Allocation |
| **Negative** | `TC-ADMREV-OWNERS-NEG-01` | Owner file cards for Photograph and Criminal Status cannot be replaced or clicked to trigger file chooser | Owner Files Immutability |
| **Negative** | `TC-ADMREV-OWNERS-NEG-02` | Share percentage input is non-editable and rejects manual value changes | Share Immutability |
| **Edge** | `TC-ADMREV-OWNERS-EDGE-01` | Horizontal scrolling across all 15 owner sub-tabs retains active tab state and data integrity | Horizontal Tab Scrolling |
| **Edge** | `TC-ADMREV-OWNERS-EDGE-02` | Navigating between end tabs and returning to Personal Details retains pre-loaded file cards | Sub-Tab Navigation Persistence |

---

### 1. Positive Test Cases

#### `TC-ADMREV-OWNERS-POS-01`
* **Title**: Step 2 renders 15 owner sub-sections across horizontal tab strip
* **Coverage / Requirement Ref**: Step 2 Horizontal Tabs
* **Preconditions**: Super admin advances to Step 2 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper displays `"2 Owners Profiles"`.
  2. Locate owner horizontal tab strip: `page.locator('.ant-tabs-nav-list, .owner-tabs')`.
  3. Count sub-tabs: `page.locator('.ant-tabs-tab')` within the owner profiles container.
* **Expected Result**:
  * Sub-tabs cover the 15 owner sections (*Personal Details*, *Passport Details*, *Residence Details*, *Qualifying*, *Marital Status Data*, *Father/Mother Data*, *Housing Data*, *Share Percentage*, etc.).
  * Tabs are navigable and responsive.

---

#### `TC-ADMREV-OWNERS-POS-02`
* **Title**: Personal Details sub-tab displays owner metadata and disabled photo/conduct files
* **Coverage / Requirement Ref**: Step 2 Personal Details
* **Preconditions**: Super admin is on Step 2, Personal Details sub-tab.
* **Steps**:
  1. Inspect Owner Full Name: `page.getByRole('textbox', { name: 'Full Name' })`.
  2. Inspect Photograph card: `page.locator('.custom-file-upload').filter({ hasText: 'Photograph' })`.
  3. Inspect Good Conduct card: `page.locator('.custom-file-upload').filter({ hasText: 'Criminal Status' })`.
* **Expected Result**:
  * Full Name displays `'Anas Mohamed'`.
  * Photograph card displays file `'sample-photo.png'` in disabled state.
  * Criminal Status card displays file `'sample-photo.png'` in disabled state.

---

#### `TC-ADMREV-OWNERS-POS-03`
* **Title**: Passport Details sub-tab displays passport number, issue place, and issue/expiry dates
* **Coverage / Requirement Ref**: Step 2 Passport Details
* **Preconditions**: Super admin is on Step 2 (`Owners Profiles`).
* **Steps**:
  1. Click `page.getByRole('tab', { name: 'Passport Details' })`.
  2. Inspect Passport Number: `page.getByRole('textbox', { name: 'Passport Number' })`.
* **Expected Result**:
  * Passport Number displays `'N1234567'`.
  * Place of Issue displays `'Sydney'`.
  * Issue Date displays `'01/01/2020'` and Expiry Date displays `'01/01/2030'`.
  * All fields are disabled.

---

#### `TC-ADMREV-OWNERS-POS-04`
* **Title**: Share Percentage sub-tab displays 100% equity allocation
* **Coverage / Requirement Ref**: Step 2 Share Allocation
* **Preconditions**: Super admin is on Step 2 (`Owners Profiles`).
* **Steps**:
  1. Click Share Percentage sub-tab (`.ant-tabs-tab:has-text("Share Percentage")`).
  2. Inspect share percentage value in `page.locator('input#sharePercentage, control-selector#sharePercentage input')`.
* **Expected Result**:
  * Value displays `'100'` or `'100%'`.
  * Control is disabled.

---

### 2. Negative Test Cases

#### `TC-ADMREV-OWNERS-NEG-01`
* **Title**: Owner file cards for Photograph and Criminal Status cannot be replaced or clicked to trigger file chooser
* **Coverage / Requirement Ref**: Owner Files Immutability
* **Preconditions**: Super admin is on Step 2, Personal Details sub-tab.
* **Steps**:
  1. Click `page.locator('.custom-file-upload').filter({ hasText: 'Photograph' })`.
  2. Await any file chooser dialog: `page.waitForEvent('filechooser', { timeout: 1000 }).catch(() => null)`.
* **Expected Result**:
  * No file chooser event is emitted.
  * File cards remain disabled with existing `'sample-photo.png'` file name intact.

---

#### `TC-ADMREV-OWNERS-NEG-02`
* **Title**: Share percentage input is non-editable and rejects manual value changes
* **Coverage / Requirement Ref**: Share Immutability
* **Preconditions**: Super admin is on Step 2, Share Percentage sub-tab.
* **Steps**:
  1. Attempt to focus and enter `'50'` into `page.locator('input#sharePercentage, control-selector#sharePercentage input')`.
* **Expected Result**:
  * Input is disabled (`disabled="true"`).
  * Value remains strictly `'100'`.

---

### 3. Edge Cases

#### `TC-ADMREV-OWNERS-EDGE-01`
* **Title**: Horizontal scrolling across all 15 owner sub-tabs retains active tab state and data integrity
* **Coverage / Requirement Ref**: Horizontal Tab Scrolling
* **Preconditions**: Super admin is on Step 2 (`Owners Profiles`).
* **Steps**:
  1. Scroll horizontal tab container to the far right.
  2. Click the last visible sub-tab (e.g., `Housing Data` or `Share Percentage`).
  3. Verify tab becomes active with class `ant-tabs-tab-active`.
  4. Scroll back to far left and click `Personal Details`.
* **Expected Result**:
  * Tab navigation strip scrolls smoothly without clipping controls.
  * Sub-section data renders accurately without layout breakage.

---

#### `TC-ADMREV-OWNERS-EDGE-02`
* **Title**: Navigating between end tabs and returning to Personal Details retains pre-loaded file cards
* **Coverage / Requirement Ref**: Sub-Tab Navigation Persistence
* **Preconditions**: Super admin is on Step 2 (`Owners Profiles`).
* **Steps**:
  1. Note Photograph file name `'sample-photo.png'`.
  2. Navigate through 4 intermediate sub-tabs (*Passport*, *Qualifying*, *Marital Status*, *Housing*).
  3. Click back to `Personal Details`.
* **Expected Result**:
  * Personal Details re-renders with `'sample-photo.png'` still present and disabled.
  * No re-rendering delays or broken image icons.

---

# Feature 5: Step 3 - School Information & Curriculum Review (Nested Accordions)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-SCHOOL-POS-01` | Tab 1 School Details displays infrastructure metrics, consultant, and location block | Step 3 School Specifications |
| **Positive** | `TC-ADMREV-SCHOOL-POS-02` | Tab 2 Curriculum reveals nested British curriculum and FS 1 stage details via sequential chevron clicks | `[Planned Regression - Bug: SURPRISE-02]` |
| **Negative** | `TC-ADMREV-SCHOOL-NEG-01` | Curriculum stage and capacity details remain completely concealed until explicit chevron expansion | Collapsed Accordion State |
| **Negative** | `TC-ADMREV-SCHOOL-NEG-02` | School Details numeric metrics (Land Area, Building Area, Court, Canopy) reject manual edits | Infrastructure Immutability |
| **Edge** | `TC-ADMREV-SCHOOL-EDGE-01` | Repeated expanding and collapsing of nested curriculum accordions preserves data text and DOM hierarchy | Accordion DOM Stability |
| **Edge** | `TC-ADMREV-SCHOOL-EDGE-02` | Bilingual school name and location block inputs preserve native Arabic glyphs and English casing | Bilingual School Text Integrity |

---

### 1. Positive Test Cases

#### `TC-ADMREV-SCHOOL-POS-01`
* **Title**: Tab 1 School Details displays infrastructure metrics, consultant, and location block
* **Coverage / Requirement Ref**: Step 3 School Specifications
* **Preconditions**: Super admin advances to Step 3 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper is `3 School Information`.
  2. Verify English School Name: `page.getByRole('textbox', { name: 'English School Name' })` -> `'Modern Future School 40178'`
  3. Verify Arabic School Name: `page.getByRole('textbox', { name: 'Arabic School Name' })` -> `'مدرسة المستقبل الحديثة 40178'`
  4. Verify Educational Consultant: `page.getByRole('textbox', { name: 'Consultant' })` -> `'Future Edu Consultancy'`
  5. Verify Location Block EN: `'Block 12'` and AR: `'قطعة 12'`
  6. Verify Land Area (`15000` sqm), Building Area (`8500` sqm), Indoor Court (`2000` sqm), Outdoor Canopy (`1500` sqm).
  7. Verify Applicant Relation (`Owner`) and Applicant Phone (`0501234567`).
* **Expected Result**:
  * All school specifications match submitted data.
  * All input fields are disabled and read-only.

---

#### `TC-ADMREV-SCHOOL-POS-02`
* **Title**: Tab 2 Curriculum reveals nested British curriculum and FS 1 stage details via sequential chevron clicks
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-02]`
* **Preconditions**: Super admin is on Step 3 (`School Information`).
* **Steps**:
  1. Click Tab 2: `page.getByRole('tab', { name: 'Curriculum' })`.
  2. Observe nested accordion header `"Curriculum 1"`.
  3. Click first chevron icon: `page.locator('.group-header button.ant-btn-icon-only').first()`.
  4. Verify Curriculum name displays `'British'`.
  5. Click second chevron icon: `page.locator('.group-header button.ant-btn-icon-only').nth(1)`.
  6. Verify Stage (`Pre-Kindergarten`), Grade (`FS 1`), Student Capacity (`100`), and Classrooms (`4`).
* **Expected Result**:
  * First chevron reveals Curriculum 1 details.
  * Second chevron reveals Stages 1 details with capacity and classroom counts.
  * Regression confirmation: Verifies the discovery that curriculum data requires two sequential chevron expansions rather than a flat table.

---

### 2. Negative Test Cases

#### `TC-ADMREV-SCHOOL-NEG-01`
* **Title**: Curriculum stage and capacity details remain completely concealed until explicit chevron expansion
* **Coverage / Requirement Ref**: Collapsed Accordion State
* **Preconditions**: Super admin is on Step 3, Tab 2 (`Curriculum`).
* **Steps**:
  1. Inspect visibility of grade text `'FS 1'` and capacity text `'100'` before clicking any chevron.
* **Expected Result**:
  * Elements containing `'FS 1'` and `'100'` are hidden from view (`toBeHidden()` or collapsed height).
  * Data is not visible until accordion is explicitly triggered.

---

#### `TC-ADMREV-SCHOOL-NEG-02`
* **Title**: School Details numeric metrics (Land Area, Building Area, Court, Canopy) reject manual edits
* **Coverage / Requirement Ref**: Infrastructure Immutability
* **Preconditions**: Super admin is on Step 3, Tab 1 (`School Details`).
* **Steps**:
  1. Attempt to type into Land Area or Building Area inputs.
* **Expected Result**:
  * Fields reject user input.
  * Metric values remain strictly `'15000'` and `'8500'`.

---

### 3. Edge Cases

#### `TC-ADMREV-SCHOOL-EDGE-01`
* **Title**: Repeated expanding and collapsing of nested curriculum accordions preserves data text and DOM hierarchy
* **Coverage / Requirement Ref**: Accordion DOM Stability
* **Preconditions**: Super admin is on Step 3, Tab 2 (`Curriculum`).
* **Steps**:
  1. Expand Curriculum 1 and Stages 1 accordions via chevrons.
  2. Verify visible values `'British'`, `'FS 1'`, `'100'`, `'4'`.
  3. Collapse Stages 1 chevron; verify stage details hide.
  4. Collapse Curriculum 1 chevron; verify curriculum body hides.
  5. Re-expand both accordions sequentially.
* **Expected Result**:
  * Accordions expand and collapse cleanly without DOM duplication, text loss, or console errors.
  * Re-expanded accordions show exact original data.

---

#### `TC-ADMREV-SCHOOL-EDGE-02`
* **Title**: Bilingual school name and location block inputs preserve native Arabic glyphs and English casing
* **Coverage / Requirement Ref**: Bilingual School Text Integrity
* **Preconditions**: Super admin is on Step 3, Tab 1 (`School Details`).
* **Steps**:
  1. Verify Arabic School Name: `page.getByRole('textbox', { name: 'Arabic School Name' })`.
  2. Verify Arabic Location Block: `page.locator('input[placeholder*="Block" i]').nth(1)` or Arabic block field.
* **Expected Result**:
  * Arabic text `'مدرسة المستقبل الحديثة 40178'` and `'قطعة 12'` render with proper RTL glyph shaping.
  * English text `'Modern Future School 40178'` and `'Block 12'` render cleanly with exact casing.

---

# Feature 6: Step 4 - Attachments Review (Signed Document Verification)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-ATTACH-POS-01` | Step 4 displays read-only Introduction Documents card with disabled signed file label | Step 4 Signed Document Review |
| **Positive** | `TC-ADMREV-ATTACH-POS-02` | Advancing from Step 4 via Next button transitions smoothly to Step 5 Summary | Step 4 Next Transition |
| **Negative** | `TC-ADMREV-ATTACH-NEG-01` | Clicking disabled file card does not trigger native file chooser or allow file replacement | File Immutability Guard |
| **Negative** | `TC-ADMREV-ATTACH-NEG-02` | Dragging and dropping replacement document over disabled card is rejected | Drag-and-Drop Guard |
| **Edge** | `TC-ADMREV-ATTACH-EDGE-01` | Navigating backward from Step 5 to Step 4 re-renders disabled signed file card accurately | Attachments Navigation Persistence |
| **Edge** | `TC-ADMREV-ATTACH-EDGE-02` | Long file name on disabled attachment card renders with ellipsis without breaking card layout | Long File Name Truncation |

---

### 1. Positive Test Cases

#### `TC-ADMREV-ATTACH-POS-01`
* **Title**: Step 4 displays read-only Introduction Documents card with disabled signed file label
* **Coverage / Requirement Ref**: Step 4 Signed Document Review
* **Preconditions**: Super admin advances to Step 4 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper is `4 Attachments`.
  2. Locate document label: `page.getByText('Introduction Documents after signature')`.
  3. Inspect attached file card: `page.locator('.file-label.disabled')`.
  4. Verify file name text: `page.locator('.file-name')` displays `'sample-photo.png'`.
* **Expected Result**:
  * Document card is visible with label `"Introduction Documents after signature"`.
  * File card has class `.disabled` and displays `'sample-photo.png'`.
  * Card is read-only.

---

#### `TC-ADMREV-ATTACH-POS-02`
* **Title**: Advancing from Step 4 via Next button transitions smoothly to Step 5 Summary
* **Coverage / Requirement Ref**: Step 4 Next Transition
* **Preconditions**: Super admin is on Step 4 (`Attachments`).
* **Steps**:
  1. Click `page.locator('button.next-btn')`.
  2. Inspect active stepper: `page.locator('nz-step.ant-steps-item-process')`.
* **Expected Result**:
  * Stepper transitions to `5 Summary`.
  * Summary accordions render cleanly.

---

### 2. Negative Test Cases

#### `TC-ADMREV-ATTACH-NEG-01`
* **Title**: Clicking disabled file card does not trigger native file chooser or allow file replacement
* **Coverage / Requirement Ref**: File Immutability Guard
* **Preconditions**: Super admin is on Step 4 (`Attachments`).
* **Steps**:
  1. Click `page.locator('.file-label.disabled')`.
  2. Check for native file chooser event: `page.waitForEvent('filechooser', { timeout: 1000 }).catch(() => null)`.
* **Expected Result**:
  * No file chooser event is emitted.
  * File card remains in `.disabled` state with `'sample-photo.png'` intact.

---

#### `TC-ADMREV-ATTACH-NEG-02`
* **Title**: Dragging and dropping replacement document over disabled card is rejected
* **Coverage / Requirement Ref**: Drag-and-Drop Guard
* **Preconditions**: Super admin is on Step 4 (`Attachments`).
* **Steps**:
  1. Dispatch drag-and-drop drop event with new file on `page.locator('.file-label.disabled')`.
* **Expected Result**:
  * Drop event is ignored.
  * Existing file `'sample-photo.png'` remains unchanged.

---

### 3. Edge Cases

#### `TC-ADMREV-ATTACH-EDGE-01`
* **Title**: Navigating backward from Step 5 to Step 4 re-renders disabled signed file card accurately
* **Coverage / Requirement Ref**: Attachments Navigation Persistence
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click `page.locator('button.prev-btn')`.
  2. Verify active stepper is `4 Attachments`.
  3. Inspect `page.locator('.file-label.disabled')`.
* **Expected Result**:
  * Step 4 mounts cleanly.
  * File card shows `'sample-photo.png'` with `.disabled` class intact.

---

#### `TC-ADMREV-ATTACH-EDGE-02`
* **Title**: Long file name on disabled attachment card renders with ellipsis without breaking card layout
* **Coverage / Requirement Ref**: Long File Name Truncation
* **Preconditions**: Super admin is on Step 4 (`Attachments`).
* **Steps**:
  1. Inspect container dimensions and CSS overflow properties of `page.locator('.file-name')`.
* **Expected Result**:
  * Element applies `text-overflow: ellipsis` or wraps within card boundaries without overlapping adjacent labels.

---

# Feature 7: Step 5 - Collapsible Summary & Data Binding Verification

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-SUMM-POS-01` | Step 5 renders all three collapsible summary sections in collapsed state with Previous button in footer | Step 5 Summary Structure |
| **Positive** | `TC-ADMREV-SUMM-POS-02` | Expanding Owners and School Details accordions accurately reflects submitted application data | Step 5 Data Binding |
| **Positive** | `TC-ADMREV-SUMM-POS-03` | Multiple summary accordions can be expanded concurrently without auto-closing other sections | Accordion Concurrency |
| **Negative** | `TC-ADMREV-SUMM-NEG-01` | Step 5 footer strictly excludes Next and Submit buttons, restricting workflow actions to header | Wizard Terminal Boundary |
| **Negative** | `TC-ADMREV-SUMM-NEG-02` | Step 5 Applicant Information summary accordion renders placeholder dashes for contact address | `[Planned Regression - Bug: SURPRISE-03]` |
| **Edge** | `TC-ADMREV-SUMM-EDGE-01` | Summary section chevron toggle buttons `.colbs-btn` respond reliably to keyboard Enter and Space activation | Accessibility & Keyboard Navigation |
| **Edge** | `TC-ADMREV-SUMM-EDGE-02` | Switching language to Arabic flips summary labels and values to RTL layout with consistent placeholder dashes | Summary RTL Presentation |

---

### 1. Positive Test Cases

#### `TC-ADMREV-SUMM-POS-01`
* **Title**: Step 5 renders all three collapsible summary sections in collapsed state with Previous button in footer
* **Coverage / Requirement Ref**: Step 5 Summary Structure
* **Preconditions**: Super admin advances to Step 5 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper is `5 Summary`.
  2. Locate 3 summary sections: `"Applicant Information"`, `"Owners"`, `"School Details"`.
  3. Verify all 3 sections are initially collapsed.
  4. Inspect bottom wizard footer buttons.
* **Expected Result**:
  * 3 summary headers are rendered.
  * Chevron toggle buttons `.colbs-btn` are present.
  * Wizard footer displays only `button.prev-btn`; no `Next` or `Submit` button exists in the footer.

---

#### `TC-ADMREV-SUMM-POS-02`
* **Title**: Expanding Owners and School Details accordions accurately reflects submitted application data
* **Coverage / Requirement Ref**: Step 5 Data Binding
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click chevron on Owners: `page.locator('.colbs-btn').nth(1)`.
  2. Verify Type (`Individual`), Full Name (`Anas Mohamed`), Passport Number (`N1234567`), Expiry Date (`1/1/2030`).
  3. Click chevron on School Details: `page.locator('.colbs-btn').nth(2)`.
  4. Verify English School Name (`Modern Future School 40178`), Arabic School Name (`مدرسة المستقبل الحديثة 40178`), Location Block (`Block 12`), Curriculum (`British`).
* **Expected Result**:
  * Data fields accurately match values entered during application submission.

---

#### `TC-ADMREV-SUMM-POS-03`
* **Title**: Multiple summary accordions can be expanded concurrently without auto-closing other sections
* **Coverage / Requirement Ref**: Accordion Concurrency
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click chevron on Applicant Information: `page.locator('.colbs-btn').nth(0)`.
  2. Click chevron on Owners: `page.locator('.colbs-btn').nth(1)`.
  3. Click chevron on School Details: `page.locator('.colbs-btn').nth(2)`.
* **Expected Result**:
  * All 3 summary accordions remain concurrently expanded.
  * Opening one accordion does not force-close previously expanded accordions.

---

### 2. Negative Test Cases

#### `TC-ADMREV-SUMM-NEG-01`
* **Title**: Step 5 footer strictly excludes Next and Submit buttons, restricting workflow actions to header
* **Coverage / Requirement Ref**: Wizard Terminal Boundary
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Inspect bottom wizard container: `page.locator('.wizard-footer, .steps-action')`.
  2. Check for existence of Next or Submit buttons: `page.locator('button.next-btn, button:has-text("Submit")')`.
* **Expected Result**:
  * `button.next-btn` is absent from DOM.
  * No Submit button exists in wizard footer.
  * Reviewer must use top workflow card buttons (*Approve*, *Return*, *Reject*) to make decisions.

---

#### `TC-ADMREV-SUMM-NEG-02`
* **Title**: Step 5 Applicant Information summary accordion renders placeholder dashes for contact address
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-03]`
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click chevron on Applicant Information: `page.locator('.colbs-btn').first()`.
  2. Verify Date of Birth displays `'1/1/1985'`.
  3. Inspect Address line text.
* **Expected Result**:
  * Address field displays placeholder dashes (`__`) instead of the submitted contact address (`Al Jurf, Ajman`).
  * Regression confirmation: Verifies the data-binding gap discovered during exploration.

---

### 3. Edge Cases

#### `TC-ADMREV-SUMM-EDGE-01`
* **Title**: Summary section chevron toggle buttons `.colbs-btn` respond reliably to keyboard Enter and Space activation
* **Coverage / Requirement Ref**: Accessibility & Keyboard Navigation
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Focus the first chevron button: `page.locator('.colbs-btn').first().focus()`.
  2. Press keyboard key `'Enter'`.
  3. Verify accordion expansion.
  4. Press keyboard key `'Space'`.
  5. Verify accordion collapse.
* **Expected Result**:
  * Accordion opens on Enter key press.
  * Accordion closes on Space key press.
  * Accessible keyboard navigation functions correctly.

---

#### `TC-ADMREV-SUMM-EDGE-02`
* **Title**: Switching language to Arabic flips summary labels and values to RTL layout with consistent placeholder dashes
* **Coverage / Requirement Ref**: Summary RTL Presentation
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click language toggle to Arabic (`button:has-text("العربية")`).
  2. Expand Applicant Information summary accordion.
  3. Inspect layout direction and text alignment.
* **Expected Result**:
  * Summary cards align to RTL (`dir="rtl"`).
  * Field labels render in Arabic (`الاسم الكامل`, `تاريخ الميلاد`, `البريد الإلكتروني`, `العنوان`).
  * Address field consistently renders placeholder dashes (`__`).

---

# Feature 8: Workflow Status Timeline & Action Controls Overview

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-WFSTAT-POS-01` | Workflow status card accurately displays Step 1 Pending (APECO Employee Review) and Steps 2-3 Upcoming | Workflow Timeline Verification |
| **Positive** | `TC-ADMREV-WFSTAT-POS-02` | Workflow card renders distinct semantic action buttons (Approve, Return, Reject) with correct color coding | Action Button Presentation |
| **Positive** | `TC-ADMREV-WFSTAT-POS-03` | Workflow status card and action buttons remain persistent and visible across all 5 wizard steps | Workflow Sticky Header Visibility |
| **Negative** | `TC-ADMREV-WFSTAT-NEG-01` | Employee reviewer cannot access Step 2 Technical Review or Step 3 Final Acceptance actions prematurely | Stage Authority Guardrails |
| **Negative** | `TC-ADMREV-WFSTAT-NEG-02` | Background workflow action buttons are non-clickable while an action modal dialog is open | Modal Backdrop Isolation |
| **Edge** | `TC-ADMREV-WFSTAT-EDGE-01` | Tablet and mobile viewport resizing keeps workflow card and action buttons accessible | Responsive Viewport Adaptation |
| **Edge** | `TC-ADMREV-WFSTAT-EDGE-02` | Alternating language toggle updates workflow step labels to Arabic while maintaining Pending status | Multilingual Workflow Timeline |

---

### 1. Positive Test Cases

#### `TC-ADMREV-WFSTAT-POS-01`
* **Title**: Workflow status card accurately displays Step 1 Pending (APECO Employee Review) and Steps 2-3 Upcoming
* **Coverage / Requirement Ref**: Workflow Timeline Verification
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Locate workflow container: `page.locator('workflow-action-options')`.
  2. Verify Step 1 label and badge: `'APECO Employee Review'` -> `'Pending'`.
  3. Verify Step 2 label and badge: `'Technical Engineer Review'` -> `'Upcoming'`.
  4. Verify Step 3 label and badge: `'Accepted'` -> `'Upcoming'`.
* **Expected Result**:
  * Timeline displays active stage 1 as `Pending` and future stages 2-3 as `Upcoming`.
  * Current review authority belongs to APECO Employee Reviewer.

---

#### `TC-ADMREV-WFSTAT-POS-02`
* **Title**: Workflow card renders distinct semantic action buttons (Approve, Return, Reject) with correct color coding
* **Coverage / Requirement Ref**: Action Button Presentation
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Inspect Approve button: `page.getByRole('button', { name: 'Approve', exact: true })`.
  2. Inspect Return button: `page.getByRole('button', { name: 'Return', exact: true })`.
  3. Inspect Reject button: `page.getByRole('button', { name: 'Reject', exact: true })`.
* **Expected Result**:
  * Approve has class `btn-primary`.
  * Return has class `btn-warning`.
  * Reject has class `btn-danger`.
  * All 3 buttons are visible and clickable.

---

#### `TC-ADMREV-WFSTAT-POS-03`
* **Title**: Workflow status card and action buttons remain persistent and visible across all 5 wizard steps
* **Coverage / Requirement Ref**: Workflow Sticky Header Visibility
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Check visibility of `page.locator('workflow-action-options')` on Step 1.
  2. Advance sequentially to Step 2, Step 3, Step 4, and Step 5.
  3. Verify visibility of workflow options on each step.
* **Expected Result**:
  * Workflow action card remains visible throughout the entire 5-step review process.
  * Reviewer can execute decisions from any step of the wizard.

---

### 2. Negative Test Cases

#### `TC-ADMREV-WFSTAT-NEG-01`
* **Title**: Employee reviewer cannot access Step 2 Technical Review or Step 3 Final Acceptance actions prematurely
* **Coverage / Requirement Ref**: Stage Authority Guardrails
* **Preconditions**: Super admin is on `/requests/request-details/14682` with Step 1 `Pending`.
* **Steps**:
  1. Inspect available action buttons in `page.locator('workflow-action-options')`.
  2. Check for any controls belonging to Technical Engineer Review or Final Acceptance.
* **Expected Result**:
  * Only Step 1 actions (*Approve*, *Return*, *Reject*) are rendered.
  * Reviewer cannot bypass or trigger future workflow steps.

---

#### `TC-ADMREV-WFSTAT-NEG-02`
* **Title**: Background workflow action buttons are non-clickable while an action modal dialog is open
* **Coverage / Requirement Ref**: Modal Backdrop Isolation
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Verify modal is visible: `page.locator('div.modal.show')`.
  2. Attempt to click background `Return` button: `page.getByRole('button', { name: 'Return', exact: true })`.
* **Expected Result**:
  * Modal backdrop (`div.modal-backdrop`) intercepts pointer events.
  * Background button click is blocked until current modal is dismissed or submitted.

---

### 3. Edge Cases

#### `TC-ADMREV-WFSTAT-EDGE-01`
* **Title**: Tablet and mobile viewport resizing keeps workflow card and action buttons accessible
* **Coverage / Requirement Ref**: Responsive Viewport Adaptation
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Set viewport to tablet dimensions: `page.setViewportSize({ width: 768, height: 1024 })`.
  2. Inspect visibility of `workflow-action-options` and action buttons.
  3. Reset viewport to standard desktop: `page.setViewportSize({ width: 1280, height: 720 })`.
* **Expected Result**:
  * Action buttons wrap gracefully or remain accessible in tablet layout.
  * No visual clipping or overlapping of review controls.

---

#### `TC-ADMREV-WFSTAT-EDGE-02`
* **Title**: Alternating language toggle updates workflow step labels to Arabic while maintaining Pending status
* **Coverage / Requirement Ref**: Multilingual Workflow Timeline
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Click `page.locator('button:has-text("العربية")')`.
  2. Inspect workflow stage labels in `page.locator('workflow-action-options')`.
* **Expected Result**:
  * Stage 1 displays Arabic label (e.g., `'مراجعة موظف الهيئة'`).
  * Pending badge displays `'قيد الانتظار'`.
  * Action buttons display `'اعتماد'`, `'إرجاع'`, `'رفض'`.

---

# Feature 9: Workflow Action — Approve by APECO Employee

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-APPROVE-POS-01` | Clicking Approve opens modal with mandatory Comments, mandatory File Upload, and disabled Save button | Approve Modal Initialization |
| **Positive** | `TC-ADMREV-APPROVE-POS-02` | Populating valid comments and uploading valid document enables Save button and submits approval workflow | Approve Happy Path |
| **Positive** | `TC-ADMREV-APPROVE-POS-03` | Clicking modal Back button dismisses approval modal and preserves pending review state | Approve Modal Dismissal |
| **Negative** | `TC-ADMREV-APPROVE-NEG-01` | Approve modal Save button remains strictly disabled when comments are populated but file upload is omitted | `[Planned Regression - Bug: SURPRISE-01]` |
| **Negative** | `TC-ADMREV-APPROVE-NEG-02` | Approve modal Save button remains strictly disabled when file is uploaded but comments field is empty | Comments Required Validation |
| **Negative** | `TC-ADMREV-APPROVE-NEG-03` | Uploading file exceeding 10MB size limit displays client-side validation error and keeps Save disabled | File Size Constraint (Max 10MB) |
| **Negative** | `TC-ADMREV-APPROVE-NEG-04` | Uploading unsupported executable file extension is rejected with format validation error | File Extension Constraint |
| **Edge** | `TC-ADMREV-APPROVE-EDGE-01` | Uploading valid document at exact 10.0 MB boundary enables Save button while 10.01 MB is rejected | Boundary File Size Check |
| **Edge** | `TC-ADMREV-APPROVE-EDGE-02` | Comments textarea with leading and trailing whitespace only keeps Save button disabled | Comments Whitespace Handling |
| **Edge** | `TC-ADMREV-APPROVE-EDGE-03` | Comments textarea accepts bilingual Arabic and English text with special characters up to maximum character limit | Multilingual Rich Text Input |

---

### 1. Positive Test Cases

#### `TC-ADMREV-APPROVE-POS-01`
* **Title**: Clicking Approve opens modal with mandatory Comments, mandatory File Upload, and disabled Save button
* **Coverage / Requirement Ref**: Approve Modal Initialization
* **Preconditions**: Super admin is on `/requests/request-details/14682`, workflow card displays `Step 1: Pending — APECO Employee Review`.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Approve', exact: true })`.
  2. Verify modal opens: `page.locator('div.modal.show')`.
  3. Verify modal title displays `"Approve by APECO Employee"`.
  4. Inspect Comments field: `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  5. Inspect File Upload field: `page.locator('div.modal.show input[type="file"]')`.
  6. Inspect Save button: `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Modal container `div.modal.show` is visible.
  * Title displays `"Approve by APECO Employee"`.
  * Both `Comments *` and `Upload Files *` display mandatory asterisks (`*`).
  * `button:has-text("Save")` has attribute `disabled="true"`.

---

#### `TC-ADMREV-APPROVE-POS-02`
* **Title**: Populating valid comments and uploading valid document enables Save button and submits approval workflow
* **Coverage / Requirement Ref**: Approve Happy Path
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Enter `'Application documents, school specifications, and owner profile verified. Approved for technical review.'` into `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  2. Attach valid sample document (`sample-photo.png` or `sample-document.pdf`, < 10MB) to `page.locator('div.modal.show input[type="file"]')`.
  3. Verify `page.locator('div.modal.show button:has-text("Save")')` state.
  4. Click `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Save button transitions from disabled to enabled upon satisfying both inputs.
  * Network dispatches approval workflow request returning `HTTP 200 OK`.
  * Success toast/notification is displayed.
  * Workflow Step 1 transitions from `Pending` to completed, advancing request to Step 2 (`Technical Engineer Review`).

---

#### `TC-ADMREV-APPROVE-POS-03`
* **Title**: Clicking modal Back button dismisses approval modal and preserves pending review state
* **Coverage / Requirement Ref**: Approve Modal Dismissal
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Enter `'Draft approval note'` into `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  2. Click `page.locator('div.modal.show button:has-text("Back")')`.
  3. Inspect modal visibility and workflow card status.
* **Expected Result**:
  * Modal container `div.modal.show` closes and is no longer visible.
  * Workflow status remains strictly `Step 1: Pending — APECO Employee Review`.
  * No workflow transition request is dispatched to the backend.

---

### 2. Negative Test Cases

#### `TC-ADMREV-APPROVE-NEG-01`
* **Title**: Approve modal Save button remains strictly disabled when comments are populated but file upload is omitted
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-01]`
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Type valid comments `'All initial application criteria met'` into `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  2. Leave file upload input empty.
  3. Inspect `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * `button:has-text("Save")` remains strictly disabled (`disabled="true"`).
  * Clicking the button does not trigger any submission.
  * Regression confirmation: Verifies the discovery that employee review approval strictly mandates file attachment alongside comments.

---

#### `TC-ADMREV-APPROVE-NEG-02`
* **Title**: Approve modal Save button remains strictly disabled when file is uploaded but comments field is empty
* **Coverage / Requirement Ref**: Comments Required Validation
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Ensure Comments textarea is completely empty (`''`).
  2. Attach valid sample file `sample-photo.png` to `page.locator('div.modal.show input[type="file"]')`.
  3. Inspect `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * `button:has-text("Save")` remains strictly disabled (`disabled="true"`).
  * System requires non-empty comments before enabling submission.

---

#### `TC-ADMREV-APPROVE-NEG-03`
* **Title**: Uploading file exceeding 10MB size limit displays client-side validation error and keeps Save disabled
* **Coverage / Requirement Ref**: File Size Constraint (Max 10MB)
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Enter valid comments into `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  2. Attach an oversized file (11.0 MB) to `page.locator('div.modal.show input[type="file"]')`.
  3. Inspect modal validation feedback and Save button state.
* **Expected Result**:
  * Validation error message displays indicating file exceeds maximum allowed limit of 10MB.
  * `button:has-text("Save")` remains disabled.

---

#### `TC-ADMREV-APPROVE-NEG-04`
* **Title**: Uploading unsupported executable file extension is rejected with format validation error
* **Coverage / Requirement Ref**: File Extension Constraint
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Enter valid comments into `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  2. Attempt to attach an unsupported file (`malicious-script.exe` or `payload.bat`) to `page.locator('div.modal.show input[type="file"]')`.
* **Expected Result**:
  * System rejects file attachment with invalid format notification.
  * Only supported document formats (image, PDF, Word, Excel) are accepted.
  * Save button remains disabled.

---

### 3. Edge Cases

#### `TC-ADMREV-APPROVE-EDGE-01`
* **Title**: Uploading valid document at exact 10.0 MB boundary enables Save button while 10.01 MB is rejected
* **Coverage / Requirement Ref**: Boundary File Size Check
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682` with valid comments filled.
* **Steps**:
  1. Attach file of exactly `10,485,760` bytes (10.0 MB) to `page.locator('div.modal.show input[type="file"]')`.
  2. Verify Save button state.
  3. Remove file and attach file of `10,496,245` bytes (10.01 MB).
  4. Verify Save button state.
* **Expected Result**:
  * At 10.0 MB boundary: File is accepted, file card renders, and Save button enables.
  * At 10.01 MB: File is rejected with size error, and Save button disables.

---

#### `TC-ADMREV-APPROVE-EDGE-02`
* **Title**: Comments textarea with leading and trailing whitespace only keeps Save button disabled
* **Coverage / Requirement Ref**: Comments Whitespace Handling
* **Preconditions**: Super admin has opened Approve modal with valid file attached.
* **Steps**:
  1. Fill Comments field with spaces and line breaks only: `'     \n\t   '`.
  2. Inspect `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Trimmed evaluation detects empty text.
  * Save button remains disabled until meaningful alphanumeric characters are entered.

---

#### `TC-ADMREV-APPROVE-EDGE-03`
* **Title**: Comments textarea accepts bilingual Arabic and English text with special characters up to maximum character limit
* **Coverage / Requirement Ref**: Multilingual Rich Text Input
* **Preconditions**: Super admin has opened Approve modal with valid file attached.
* **Steps**:
  1. Fill Comments with bilingual text containing punctuation and numbers:
     `'تمت المراجعة والاعتماد المبدئي للمدرسة Modern Future School #40178 بنجاح — 100% compliant.'`.
  2. Verify textarea value.
  3. Inspect Save button state.
* **Expected Result**:
  * Textarea accepts and preserves mixed Arabic, English, and special characters.
  * Save button is enabled.

---

# Feature 10: Workflow Action — Return for Correction by APECO Employee

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-RETURN-POS-01` | Clicking Return opens modal with mandatory Return reasons dropdown and disabled Save button | Return Modal Initialization |
| **Positive** | `TC-ADMREV-RETURN-POS-02` | Selecting a return reason enables Save button and submits return workflow without optional comments or files | Return Happy Path (Minimal) |
| **Positive** | `TC-ADMREV-RETURN-POS-03` | Submitting return workflow with return reason, optional comments, and supplementary guidance document | Return Comprehensive Workflow |
| **Positive** | `TC-ADMREV-RETURN-POS-04` | Clicking Back button in Return modal dismisses dialog without persisting changes | Return Modal Dismissal |
| **Negative** | `TC-ADMREV-RETURN-NEG-01` | Return modal Save button remains disabled when comments and files are provided but Return reason is unselected | Return Reason Mandatory Validation |
| **Negative** | `TC-ADMREV-RETURN-NEG-02` | Uploading file exceeding 10MB limit in Return modal triggers validation rejection | Return File Size Limit |
| **Edge** | `TC-ADMREV-RETURN-EDGE-01` | Clearing a previously selected return reason from dropdown dynamically disables the Save button again | Dropdown State Toggle |
| **Edge** | `TC-ADMREV-RETURN-EDGE-02` | Return reason dropdown supports keyboard navigation, arrow selection, and search filtering | Dropdown Keyboard Navigation |

---

### 1. Positive Test Cases

#### `TC-ADMREV-RETURN-POS-01`
* **Title**: Clicking Return opens modal with mandatory Return reasons dropdown and disabled Save button
* **Coverage / Requirement Ref**: Return Modal Initialization
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Return', exact: true })`.
  2. Verify modal container opens: `page.locator('div.modal.show')`.
  3. Verify modal title displays `"Return for Correction by APECO Employee"`.
  4. Inspect Return reasons field: `page.locator('div.modal.show nz-select, div.modal.show select').first()`.
  5. Inspect Comments and Upload Files fields.
  6. Inspect Save button: `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Modal opens displaying `"Return for Correction by APECO Employee"`.
  * `Return reasons *` has mandatory asterisk (`*`).
  * `Comments` and `Upload Files` do not have mandatory asterisks (optional fields).
  * Save button is disabled (`disabled="true"`).

---

#### `TC-ADMREV-RETURN-POS-02`
* **Title**: Selecting a return reason enables Save button and submits return workflow without optional comments or files
* **Coverage / Requirement Ref**: Return Happy Path (Minimal)
* **Preconditions**: Super admin has opened Return modal on `/requests/request-details/14682`.
* **Steps**:
  1. Click `page.locator('div.modal.show nz-select, div.modal.show select').first()`.
  2. Select first available reason option (e.g., `'Missing Document'` or `'Incomplete Information'`).
  3. Verify `page.locator('div.modal.show button:has-text("Save")')` state.
  4. Click `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Selecting a reason enables Save button immediately without requiring comments or files.
  * Clicking Save dispatches `POST` request returning `HTTP 200 OK`.
  * Request transitions to `Returned for Correction` status, notifying the applicant.

---

#### `TC-ADMREV-RETURN-POS-03`
* **Title**: Submitting return workflow with return reason, optional comments, and supplementary guidance document
* **Coverage / Requirement Ref**: Return Comprehensive Workflow
* **Preconditions**: Super admin has opened Return modal on `/requests/request-details/14682`.
* **Steps**:
  1. Select a return reason from dropdown.
  2. Enter detailed instructions into Comments: `'Please re-upload a clearer copy of the passport and good conduct certificate.'`.
  3. Attach guidance document `sample-document.pdf` (< 10MB) to `page.locator('div.modal.show input[type="file"]')`.
  4. Click `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * All input fields accept data smoothly.
  * System submits workflow payload containing reason code, employee comments, and file attachment ID.
  * Success toast confirms return submission.

---

#### `TC-ADMREV-RETURN-POS-04`
* **Title**: Clicking Back button in Return modal dismisses dialog without persisting changes
* **Coverage / Requirement Ref**: Return Modal Dismissal
* **Preconditions**: Super admin has opened Return modal on `/requests/request-details/14682`.
* **Steps**:
  1. Select a return reason.
  2. Click `page.locator('div.modal.show button:has-text("Back")')`.
  3. Inspect modal visibility and request status.
* **Expected Result**:
  * Modal closes cleanly.
  * Request remains in `Pending` employee review stage.

---

### 2. Negative Test Cases

#### `TC-ADMREV-RETURN-NEG-01`
* **Title**: Return modal Save button remains disabled when comments and files are provided but Return reason is unselected
* **Coverage / Requirement Ref**: Return Reason Mandatory Validation
* **Preconditions**: Super admin has opened Return modal on `/requests/request-details/14682`.
* **Steps**:
  1. Leave Return reasons dropdown unselected.
  2. Enter comments: `'Please fix the address details.'`.
  3. Attach valid file `sample-photo.png`.
  4. Inspect Save button state.
* **Expected Result**:
  * Save button remains strictly disabled.
  * Selecting a return reason is an absolute prerequisite for enabling submission.

---

#### `TC-ADMREV-RETURN-NEG-02`
* **Title**: Uploading file exceeding 10MB limit in Return modal triggers validation rejection
* **Coverage / Requirement Ref**: Return File Size Limit
* **Preconditions**: Super admin has opened Return modal with reason selected.
* **Steps**:
  1. Attach an oversized file (12.0 MB) to file upload input.
  2. Inspect UI response.
* **Expected Result**:
  * File size error notification is displayed.
  * Save button is disabled until invalid file is cleared.

---

### 3. Edge Cases

#### `TC-ADMREV-RETURN-EDGE-01`
* **Title**: Clearing a previously selected return reason from dropdown dynamically disables the Save button again
* **Coverage / Requirement Ref**: Dropdown State Toggle
* **Preconditions**: Super admin has opened Return modal and selected a reason.
* **Steps**:
  1. Verify Save button is enabled.
  2. Click the clear icon (`.ant-select-clear, .close-icon`) on the select component.
  3. Inspect Save button state.
* **Expected Result**:
  * Return reason reverts to placeholder.
  * Save button dynamically reverts to disabled (`disabled="true"`).

---

#### `TC-ADMREV-RETURN-EDGE-02`
* **Title**: Return reason dropdown supports keyboard navigation, arrow selection, and search filtering
* **Coverage / Requirement Ref**: Dropdown Keyboard Navigation
* **Preconditions**: Super admin has opened Return modal.
* **Steps**:
  1. Focus select control: `page.locator('div.modal.show nz-select').focus()`.
  2. Type `'Doc'` to filter options.
  3. Press ArrowDown and press Enter.
* **Expected Result**:
  * Dropdown filters to matching options (e.g., `'Missing Documents'`).
  * Option is selected and Save button is enabled.

---

# Feature 11: Workflow Action — Reject by APECO Employee

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-REJECT-POS-01` | Clicking Reject opens modal with mandatory Rejection reasons dropdown and disabled Save button | Reject Modal Initialization |
| **Positive** | `TC-ADMREV-REJECT-POS-02` | Selecting a rejection reason enables Save button and successfully submits rejection workflow | Reject Happy Path (Minimal) |
| **Positive** | `TC-ADMREV-REJECT-POS-03` | Submitting rejection workflow with rejection reason, detailed justification comments, and evidence attachment | Reject Comprehensive Workflow |
| **Positive** | `TC-ADMREV-REJECT-POS-04` | Clicking Back button in Reject modal dismisses dialog without persisting changes | Reject Modal Dismissal |
| **Negative** | `TC-ADMREV-REJECT-NEG-01` | Reject modal Save button remains disabled when comments are populated but Rejection reason dropdown is unselected | Rejection Reason Mandatory Validation |
| **Negative** | `TC-ADMREV-REJECT-NEG-02` | Uploading invalid file format in Reject modal blocks submission | Reject File Type Validation |
| **Edge** | `TC-ADMREV-REJECT-EDGE-01` | Selecting and deselecting rejection reason alternates Save button between enabled and disabled states | Rejection State Toggle |
| **Edge** | `TC-ADMREV-REJECT-EDGE-02` | Pressing Escape key while Reject modal is active closes the modal cleanly without dispatching workflow transition | Modal Keyboard Dismissal |

---

### 1. Positive Test Cases

#### `TC-ADMREV-REJECT-POS-01`
* **Title**: Clicking Reject opens modal with mandatory Rejection reasons dropdown and disabled Save button
* **Coverage / Requirement Ref**: Reject Modal Initialization
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Reject', exact: true })`.
  2. Verify modal container opens: `page.locator('div.modal.show')`.
  3. Verify modal title displays `"Reject by APECO Employee"`.
  4. Inspect Rejection reasons field: `page.locator('div.modal.show nz-select, div.modal.show select').first()`.
  5. Inspect Save button: `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Modal opens displaying `"Reject by APECO Employee"`.
  * `Rejection reasons *` has mandatory asterisk (`*`).
  * `Comments` and `Upload Files` are optional.
  * Save button is disabled (`disabled="true"`).

---

#### `TC-ADMREV-REJECT-POS-02`
* **Title**: Selecting a rejection reason enables Save button and successfully submits rejection workflow
* **Coverage / Requirement Ref**: Reject Happy Path (Minimal)
* **Preconditions**: Super admin has opened Reject modal on `/requests/request-details/14682`.
* **Steps**:
  1. Click `page.locator('div.modal.show nz-select, div.modal.show select').first()`.
  2. Select first available rejection option (e.g., `'Ineligible Entity'` or `'Policy Non-Compliance'`).
  3. Verify `page.locator('div.modal.show button:has-text("Save")')` enables.
  4. Click `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Selecting a reason enables Save button.
  * Dispatches rejection workflow request returning `HTTP 200 OK`.
  * Request transitions to `Rejected` status, terminating the permit application workflow.

---

#### `TC-ADMREV-REJECT-POS-03`
* **Title**: Submitting rejection workflow with rejection reason, detailed justification comments, and evidence attachment
* **Coverage / Requirement Ref**: Reject Comprehensive Workflow
* **Preconditions**: Super admin has opened Reject modal on `/requests/request-details/14682`.
* **Steps**:
  1. Select a rejection reason from dropdown.
  2. Enter comprehensive justification in Comments: `'Application rejected due to zoning restrictions on proposed plot Block 12.'`.
  3. Attach official zoning report `sample-document.pdf` to file upload.
  4. Click `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Payload containing reason code, justification, and attachment ID is posted cleanly.
  * Success confirmation is displayed and user is returned to the queue or updated review view.

---

#### `TC-ADMREV-REJECT-POS-04`
* **Title**: Clicking Back button in Reject modal dismisses dialog without persisting changes
* **Coverage / Requirement Ref**: Reject Modal Dismissal
* **Preconditions**: Super admin has opened Reject modal on `/requests/request-details/14682`.
* **Steps**:
  1. Select a rejection reason.
  2. Click `page.locator('div.modal.show button:has-text("Back")')`.
  3. Inspect modal visibility and request status.
* **Expected Result**:
  * Modal closes cleanly.
  * Request remains in `Pending` review state.

---

### 2. Negative Test Cases

#### `TC-ADMREV-REJECT-NEG-01`
* **Title**: Reject modal Save button remains disabled when comments are populated but Rejection reason dropdown is unselected
* **Coverage / Requirement Ref**: Rejection Reason Mandatory Validation
* **Preconditions**: Super admin has opened Reject modal on `/requests/request-details/14682`.
* **Steps**:
  1. Leave Rejection reasons dropdown unselected.
  2. Enter rejection comments: `'Zoning criteria failed.'`.
  3. Inspect `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Save button remains disabled.
  * User cannot reject without choosing a formal rejection reason.

---

#### `TC-ADMREV-REJECT-NEG-02`
* **Title**: Uploading invalid file format in Reject modal blocks submission
* **Coverage / Requirement Ref**: Reject File Type Validation
* **Preconditions**: Super admin has opened Reject modal with reason selected.
* **Steps**:
  1. Attach unsupported file type (`script.sh` or `archive.zip`) to file input.
  2. Inspect system reaction.
* **Expected Result**:
  * System alerts that file type is not supported.
  * Save button is disabled until invalid file is removed.

---

### 3. Edge Cases

#### `TC-ADMREV-REJECT-EDGE-01`
* **Title**: Selecting and deselecting rejection reason alternates Save button between enabled and disabled states
* **Coverage / Requirement Ref**: Rejection State Toggle
* **Preconditions**: Super admin has opened Reject modal.
* **Steps**:
  1. Select rejection reason -> verify Save button is enabled.
  2. Clear selection -> verify Save button is disabled.
  3. Select another reason -> verify Save button is enabled again.
* **Expected Result**:
  * Save button responsiveness accurately follows select field validity in real time.

---

#### `TC-ADMREV-REJECT-EDGE-02`
* **Title**: Pressing Escape key while Reject modal is active closes the modal cleanly without dispatching workflow transition
* **Coverage / Requirement Ref**: Modal Keyboard Dismissal
* **Preconditions**: Super admin has opened Reject modal on `/requests/request-details/14682`.
* **Steps**:
  1. Verify modal is active: `page.locator('div.modal.show')`.
  2. Press keyboard key `'Escape'`.
  3. Inspect modal visibility.
* **Expected Result**:
  * Modal dialog dismisses (`div.modal.show` disappears).
  * Focus returns safely to parent review page without JS errors.

---

# Verification & Traceability Summary

## Defect & Surprise Traceability Matrix

| Discovery / Surprise | Description | Planned Regression Test Case |
| :--- | :--- | :--- |
| **SURPRISE-01** | Mandatory File Upload on Approve Action | `TC-ADMREV-APPROVE-NEG-01` |
| **SURPRISE-02** | Nested Multi-Level Accordions for Curriculum Review | `TC-ADMREV-SCHOOL-POS-02` |
| **SURPRISE-03** | Placeholder Dashes for Contact Address in Step 5 Summary | `TC-ADMREV-SUMM-NEG-02` |
| **SURPRISE-04** | Different Wizard Step Progression (5 Steps vs 6 Steps) | `TC-ADMREV-STEP-EDGE-01` |
| **SURPRISE-05** | Strict Mode Locator Collisions on Common Buttons | `TC-ADMREV-STEP-NEG-02` |

## Test Count Breakdown by Feature

| Feature | Positive | Negative | Edge | Total Cases |
| :--- | :---: | :---: | :---: | :---: |
| **Feature 1: Authentication, Queue & Header** | 4 | 3 | 3 | **10** |
| **Feature 2: Review Wizard Stepper & Sequential Flow** | 3 | 3 | 3 | **9** |
| **Feature 3: Step 1 - Application Information** | 3 | 2 | 2 | **7** |
| **Feature 4: Step 2 - Owners Profiles** | 4 | 2 | 2 | **8** |
| **Feature 5: Step 3 - School Information & Curriculum** | 2 | 2 | 2 | **6** |
| **Feature 6: Step 4 - Attachments Review** | 2 | 2 | 2 | **6** |
| **Feature 7: Step 5 - Collapsible Summary** | 3 | 2 | 2 | **7** |
| **Feature 8: Workflow Status Timeline** | 3 | 2 | 2 | **7** |
| **Feature 9: Workflow Action — Approve** | 3 | 4 | 3 | **10** |
| **Feature 10: Workflow Action — Return for Correction** | 4 | 2 | 2 | **8** |
| **Feature 11: Workflow Action — Reject** | 4 | 2 | 2 | **8** |
| **Total** | **35** | **25** | **26** | **86** |
