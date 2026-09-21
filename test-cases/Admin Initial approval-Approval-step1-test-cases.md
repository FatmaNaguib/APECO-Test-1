# APECO Admin Test Matrix: Initial Application Approval

This test matrix is designed in strict accordance with the [Test Case Design Standard](file:///d:/AI/APECO-Test-1/skills/test-case-design.md), using [admin-Initial-approval-exploration-notes.md](file:///d:/AI/APECO-Test-1/admin-Initial-approval-exploration-notes.md) as the factual source of truth for all observed DOM selectors, multi-step review wizard behaviors, modal state transitions, and verified regressions on the APECO Admin Portal.

---

# Feature 1: Navigation, Header & Stepper Architecture

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-NAV-POS-01` | Direct URL navigation to request details renders applicant metadata and active Step 1 review view | Admin Portal Routing & Header |
| **Positive** | `TC-ADMREV-NAV-POS-02` | Header back button `button.new-back-btn` navigates cleanly back to Agent Queue dashboard | Dashboard Navigation |
| **Positive** | `TC-ADMREV-NAV-POS-03` | Forward and backward stepper navigation smoothly traverses all 5 review steps via wizard buttons | Stepper Sequential Flow |
| **Positive** | `TC-ADMREV-NAV-POS-04` | Language toggle alternates Admin Portal review interface between English (LTR) and Arabic (RTL) | Admin Localization |
| **Negative** | `TC-ADMREV-NAV-NEG-01` | Stepper item headers do not permit non-linear skipping to unreviewed subsequent steps | Stepper Guardrail |
| **Negative** | `TC-ADMREV-NAV-NEG-02` | Generic back button selector triggers strict mode violation across hidden modal templates | `[Planned Regression - Bug: SURPRISE-05]` |
| **Negative** | `TC-ADMREV-NAV-NEG-03` | Step 1 review view keeps wizard Previous button disabled or hidden | Wizard Boundary Navigation |
| **Edge** | `TC-ADMREV-NAV-EDGE-01` | Review wizard consolidates exactly 5 numbered review steps omitting applicant Download Documents step | `[Planned Regression - Bug: SURPRISE-04]` |
| **Edge** | `TC-ADMREV-NAV-EDGE-02` | Rapid sequential clicks on wizard Next and Previous buttons maintain synchronized stepper state | Stepper State Synchronization |
| **Edge** | `TC-ADMREV-NAV-EDGE-03` | Direct browser page refresh on intermediate review step (Step 3) restores active step context | Browser Refresh Persistence |

---

### 1. Positive Test Cases

#### `TC-ADMREV-NAV-POS-01`
* **Title**: Direct URL navigation to request details renders applicant metadata and active Step 1 review view
* **Coverage / Requirement Ref**: Admin Portal Routing & Header
* **Preconditions**: Super admin authenticated as `admin.qc@hotmail.com` / `Adm1n#tro3eh` on `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/agent-queue`.
* **Steps**:
  1. Navigate to `/requests/request-details/14682`.
  2. Verify page header module title using `page.locator('.module-title')`.
  3. Verify applicant heading using `page.getByRole('heading', { level: 1 })`.
  4. Verify active step in stepper using `page.locator('nz-step.ant-steps-item-process, nz-step.ant-steps-item-active')`.
* **Expected Result**:
  * Browser URL is `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/requests/request-details/14682`.
  * `.module-title` displays `"Request Details"`.
  * `page.getByRole('heading', { level: 1 })` displays `"Applicant: Anas Mohamed"`.
  * Active stepper item has class `ant-steps-item-process` and displays `"1 Application Information"`.

---

#### `TC-ADMREV-NAV-POS-02`
* **Title**: Header back button `button.new-back-btn` navigates cleanly back to Agent Queue dashboard
* **Coverage / Requirement Ref**: Dashboard Navigation
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Locate the top navigation back button: `page.locator('button.new-back-btn')`.
  2. Click `page.locator('button.new-back-btn')`.
  3. Await route change.
* **Expected Result**:
  * Browser navigates to `/agent-queue`.
  * Agent Queue header title displays `"Agent Queue (2998)"` (or active queue count).
  * KPI summary cards (*All Requests*, *Assigned to Me*, *Open*, *Closed*) and requests table are visible.

---

#### `TC-ADMREV-NAV-POS-03`
* **Title**: Forward and backward stepper navigation smoothly traverses all 5 review steps via wizard buttons
* **Coverage / Requirement Ref**: Stepper Sequential Flow
* **Preconditions**: Super admin is on `/requests/request-details/14682`, currently on Step 1.
* **Steps**:
  1. Click `page.locator('button.next-btn')` on Step 1.
  2. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Owners Profiles' })`.
  3. Click `page.locator('button.next-btn')` on Step 2.
  4. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'School Information' })`.
  5. Click `page.locator('button.next-btn')` on Step 3.
  6. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Attachments' })`.
  7. Click `page.locator('button.next-btn')` on Step 4.
  8. Verify active stepper is `page.locator('nz-step').filter({ hasText: 'Summary' })`.
  9. Click `page.locator('button.prev-btn')` on Step 5.
  10. Verify active stepper returns to `page.locator('nz-step').filter({ hasText: 'Attachments' })`.
* **Expected Result**:
  * Each click on `button.next-btn` increments the active stepper index sequentially (Step 1 -> 2 -> 3 -> 4 -> 5).
  * On Step 5, `button.prev-btn` is visible and decrements the active stepper index back to Step 4.
  * Form views for each respective step mount and dismount without UI freezes or console exceptions.

---

#### `TC-ADMREV-NAV-POS-04`
* **Title**: Language toggle alternates Admin Portal review interface between English (LTR) and Arabic (RTL)
* **Coverage / Requirement Ref**: Admin Localization
* **Preconditions**: Super admin is on `/requests/request-details/14682` in English (LTR) mode.
* **Steps**:
  1. Click `page.locator('button:has-text("العربية"), button.lang-btn').first()`.
  2. Inspect document root attribute `dir` on `page.locator('html')`.
  3. Verify header title and action button labels.
  4. Click `page.locator('button:has-text("English")')`.
* **Expected Result**:
  * Document root flips to `dir="rtl"`.
  * Review headers, tab titles, and action buttons (`اعتماد`, `إرجاع`, `رفض`) render in Arabic with RTL text alignment.
  * Clicking `"English"` restores `dir="ltr"` and re-translates UI back to English (`Approve`, `Return`, `Reject`).

---

### 2. Negative Test Cases

#### `TC-ADMREV-NAV-NEG-01`
* **Title**: Stepper item headers do not permit non-linear skipping to unreviewed subsequent steps
* **Coverage / Requirement Ref**: Stepper Guardrail
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Attempt to click `page.locator('nz-step').filter({ hasText: 'Summary' })`.
  2. Inspect active stepper element `page.locator('nz-step.ant-steps-item-process')`.
  3. Attempt to click `page.locator('nz-step').filter({ hasText: 'School Information' })`.
  4. Inspect active stepper element again.
* **Expected Result**:
  * Direct clicking on inactive upcoming stepper items is non-interactive (`pointer-events: none` or no click handler).
  * The wizard remains strictly on Step 1 (`Application Information`).
  * Stepper progression requires sequential advancement via `button.next-btn`.

---

#### `TC-ADMREV-NAV-NEG-02`
* **Title**: Generic back button selector triggers strict mode violation across hidden modal templates
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-05]`
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Execute locator resolution for un-scoped selector: `page.locator('button:has-text("Back")')`.
  2. Evaluate element count matching the selector.
* **Expected Result**:
  * Scoped search resolves to multiple elements (e.g., 4 elements) because dormant action modal templates (`#confirm-action`, `#workflow-popup`, action modal dialogs) contain un-rendered `"Back"` buttons in DOM.
  * Direct click without scoping causes Playwright strict mode violation error.
  * Regression confirmation: Automation scripts must strictly scope navigation to `page.locator('button.new-back-btn')` and modal dismissal to `page.locator('div.modal.show button:has-text("Back")')`.

---

#### `TC-ADMREV-NAV-NEG-03`
* **Title**: Step 1 review view keeps wizard Previous button disabled or hidden
* **Coverage / Requirement Ref**: Wizard Boundary Navigation
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Inspect the bottom wizard navigation toolbar.
  2. Locate `page.locator('button.prev-btn')`.
* **Expected Result**:
  * `button.prev-btn` is either not rendered in the DOM, hidden with `display: none`, or has `disabled="true"`.
  * The reviewer cannot navigate backward beyond Step 1 within the wizard container.

---

### 3. Edge Cases

#### `TC-ADMREV-NAV-EDGE-01`
* **Title**: Review wizard consolidates exactly 5 numbered review steps omitting applicant Download Documents step
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-04]`
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Count all stepper items in the wizard stepper: `page.locator('nz-step')`.
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

#### `TC-ADMREV-NAV-EDGE-02`
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
  * Active stepper class correctly reflects the settled step (e.g., Step 4 after 3 forward clicks, Step 2 after 2 backward clicks).

---

#### `TC-ADMREV-NAV-EDGE-03`
* **Title**: Direct browser page refresh on intermediate review step (Step 3) restores active step context
* **Coverage / Requirement Ref**: Browser Refresh Persistence
* **Preconditions**: Super admin navigates through wizard to Step 3 (`School Information`).
* **Steps**:
  1. Verify active step is `3 School Information`.
  2. Reload the page using `page.reload()`.
  3. Inspect current stepper and page state.
* **Expected Result**:
  * Page reloads cleanly with `HTTP 200`.
  * Header displays `"Request Details"` and `"Applicant: Anas Mohamed"`.
  * System renders the default initial review step (Step 1) or preserves Step 3 if URL fragment/state is maintained, with all applicant data intact.

---

# Feature 2: Multi-Step Read-Only Application Data Verification

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-DATA-POS-01` | Step 1 displays disabled applicant personal and contact information across both tabs | Step 1 Applicant & Contact Info |
| **Positive** | `TC-ADMREV-DATA-POS-02` | Step 2 displays 15 owner sub-tabs, personal details, disabled photo/conduct files, and 100% share | Step 2 Owners Profiles |
| **Positive** | `TC-ADMREV-DATA-POS-03` | Step 3 School Details tab displays infrastructure metrics, consultancy, and location block | Step 3 School Details |
| **Positive** | `TC-ADMREV-DATA-POS-04` | Step 3 Curriculum tab reveals nested British curriculum and FS 1 stage capacity via sequential accordion expansion | `[Planned Regression - Bug: SURPRISE-02]` |
| **Positive** | `TC-ADMREV-DATA-POS-05` | Step 4 Attachments displays read-only signed introduction document card with disabled file label | Step 4 Attachments Review |
| **Negative** | `TC-ADMREV-DATA-NEG-01` | Keyboard input or clipboard paste into Step 1 disabled input fields is strictly blocked | Form Immutability Guard |
| **Negative** | `TC-ADMREV-DATA-NEG-02` | Step 2 uploaded document cards for Photograph and Criminal Status cannot be modified or re-uploaded | Owner Files Immutability |
| **Negative** | `TC-ADMREV-DATA-NEG-03` | Step 4 disabled file card prevents triggering native file chooser or replacing applicant signed document | Attachments Immutability |
| **Negative** | `TC-ADMREV-DATA-NEG-04` | Step 3 curriculum accordions keep stage details concealed until explicit chevron expansion | Collapsed Accordion State |
| **Edge** | `TC-ADMREV-DATA-EDGE-01` | Repeated expanding and collapsing of nested curriculum accordions preserves data text and DOM structure | Accordion DOM Stability |
| **Edge** | `TC-ADMREV-DATA-EDGE-02` | Step 2 horizontal scrolling across all 15 owner sub-tabs retains active tab state and verified data integrity | Horizontal Tab Scrolling |
| **Edge** | `TC-ADMREV-DATA-EDGE-03` | Bilingual text fields in Step 1 and Step 3 preserve native Arabic glyphs and English casing | Bilingual Text Integrity |

---

### 1. Positive Test Cases

#### `TC-ADMREV-DATA-POS-01`
* **Title**: Step 1 displays disabled applicant personal and contact information across both tabs
* **Coverage / Requirement Ref**: Step 1 Applicant & Contact Info
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Inspect Tab 1 (`page.getByRole('tab', { name: 'Applicant Information' })`).
  2. Verify values and `disabled` attribute on:
     * First Name EN: `page.getByRole('textbox', { name: 'First Name (in English)' })` -> `'Anas'`.
     * First Name AR: `page.getByRole('textbox', { name: 'First Name (in Arabic)' })` -> `'انس'`.
     * Last Name EN: `page.getByRole('textbox', { name: 'Last Name (in English)' })` -> `'Mohamed'`.
     * Last Name AR: `page.getByRole('textbox', { name: 'Last Name (in Arabic)' })` -> `'محمد'`.
     * Date of Birth: `page.getByRole('textbox', { name: 'Date of Birth' })` -> `'1985-01-01'`.
  3. Click Tab 2: `page.getByRole('tab', { name: 'Contact Information' })`.
  4. Verify values and `disabled` attribute on:
     * Email: `page.getByRole('textbox', { name: 'Email' })` -> `'apecouser@hotmail.com'`.
     * Address: `page.getByRole('textbox', { name: 'Address' })` -> `'Al Jurf, Ajman'`.
* **Expected Result**:
  * All 5 fields on Tab 1 and both fields on Tab 2 contain the verified applicant values.
  * Every input element has attribute `disabled="true"` or `disabled=""`.

---

#### `TC-ADMREV-DATA-POS-02`
* **Title**: Step 2 displays 15 owner sub-tabs, personal details, disabled photo/conduct files, and 100% share
* **Coverage / Requirement Ref**: Step 2 Owners Profiles
* **Preconditions**: Super admin advances to Step 2 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper displays `"2 Owners Profiles"`.
  2. Count horizontal owner sub-tabs (`.ant-tabs-tab` within owner container).
  3. On **Personal Details** tab:
     * Verify Full Name (`page.getByRole('textbox', { name: 'Full Name' })`) has value `'Anas Mohamed'`.
     * Verify Photograph card `page.locator('.custom-file-upload').filter({ hasText: 'Photograph' })` shows `'sample-photo.png'`.
     * Verify Good Conduct card `page.locator('.custom-file-upload').filter({ hasText: 'Criminal Status' })` shows `'sample-photo.png'`.
  4. Click **Passport Details** tab:
     * Verify Passport Number (`page.getByRole('textbox', { name: 'Passport Number' })`) has value `'N1234567'`.
  5. Inspect Share Percentage tab/input:
     * Verify `page.locator('input#sharePercentage, input[placeholder*="share" i]')` displays `'100%'` (or `'100'`).
* **Expected Result**:
  * 15 owner sub-sections are accessible.
  * Personal Details, Passport Number, and Share Percentage accurately reflect submitted data.
  * Uploaded owner photo and conduct certificate cards are rendered in disabled read-only state.

---

#### `TC-ADMREV-DATA-POS-03`
* **Title**: Step 3 School Details tab displays infrastructure metrics, consultancy, and location block
* **Coverage / Requirement Ref**: Step 3 School Details
* **Preconditions**: Super admin advances to Step 3 (`/requests/request-details/14682`).
* **Steps**:
  1. Inspect Tab 1: `page.getByRole('tab', { name: 'School Details' })`.
  2. Verify English School Name input (`page.getByRole('textbox', { name: 'English School Name' })`) has value `'Modern Future School 40178'`.
  3. Verify Arabic School Name input (`page.getByRole('textbox', { name: 'Arabic School Name' })`) has value `'مدرسة المستقبل الحديثة 40178'`.
  4. Verify Educational Consultant (`page.getByRole('textbox', { name: 'Consultant' })`) has value `'Future Edu Consultancy'`.
  5. Verify Location Block inputs EN (`'Block 12'`) and AR (`'قطعة 12'`).
  6. Verify Land Area (`'15000'`), Building Area (`'8500'`), Indoor Court (`'2000'`), and Outdoor Canopy (`'1500'`).
  7. Verify Applicant Relation (`'Owner'`) and Applicant Phone (`'0501234567'`).
* **Expected Result**:
  * All school infrastructure parameters and applicant relationship fields are populated with exact submitted specifications.
  * Inputs are in disabled/read-only mode.

---

#### `TC-ADMREV-DATA-POS-04`
* **Title**: Step 3 Curriculum tab reveals nested British curriculum and FS 1 stage capacity via sequential accordion expansion
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-02]`
* **Preconditions**: Super admin is on Step 3 (`/requests/request-details/14682`).
* **Steps**:
  1. Click Tab 2: `page.getByRole('tab', { name: 'Curriculum' })`.
  2. Locate the first accordion header: `"Curriculum 1"`.
  3. Click the first chevron toggle: `page.locator('.group-header button.ant-btn-icon-only').first()`.
  4. Verify curriculum text is visible and contains `'British'`.
  5. Locate the nested accordion header: `"Stages 1"`.
  6. Click the second chevron toggle: `page.locator('.group-header button.ant-btn-icon-only').nth(1)`.
  7. Inspect stage configuration fields.
* **Expected Result**:
  * Expanding Curriculum 1 reveals the Curriculum dropdown/field displaying `"British"`.
  * Expanding Stages 1 reveals:
    * Stage: `"Pre-Kindergarten"` (or `"Kindergarten"`).
    * Grade: `"FS 1"`.
    * Student Capacity: `"100"`.
    * Classrooms: `"4"`.
  * Regression confirmation: Data is verified via two sequential chevron clicks (`nth(0)` then `nth(1)`), confirming resolution of nested accordion data hiding.

---

#### `TC-ADMREV-DATA-POS-05`
* **Title**: Step 4 Attachments displays read-only signed introduction document card with disabled file label
* **Coverage / Requirement Ref**: Step 4 Attachments Review
* **Preconditions**: Super admin advances to Step 4 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper displays `"4 Attachments"`.
  2. Locate document card titled `"Introduction Documents after signature"`: `page.getByText('Introduction Documents after signature')`.
  3. Inspect the file card container: `page.locator('.file-label.disabled')`.
  4. Verify file name text: `page.locator('.file-name')`.
* **Expected Result**:
  * Document card is visible with label `"Introduction Documents after signature"`.
  * File card contains class `.file-label.disabled`.
  * File name displays `'sample-photo.png'` (or attached filename).
  * No file delete icon, trash button, or browse action is interactive.

---

### 2. Negative Test Cases

#### `TC-ADMREV-DATA-NEG-01`
* **Title**: Keyboard input or clipboard paste into Step 1 disabled input fields is strictly blocked
* **Coverage / Requirement Ref**: Form Immutability Guard
* **Preconditions**: Super admin is on Step 1 (`/requests/request-details/14682`).
* **Steps**:
  1. Attempt to click and type `'Tampered'` into `page.getByRole('textbox', { name: 'First Name (in English)' })`.
  2. Attempt to evaluate direct DOM value modification:
     `await page.getByRole('textbox', { name: 'First Name (in English)' }).fill('Tampered')`.
* **Expected Result**:
  * Playwright throws an element not editable / disabled error if force option is not passed.
  * Field value remains strictly `'Anas'`.
  * Reviewer cannot alter submitted applicant information.

---

#### `TC-ADMREV-DATA-NEG-02`
* **Title**: Step 2 uploaded document cards for Photograph and Criminal Status cannot be modified or re-uploaded
* **Coverage / Requirement Ref**: Owner Files Immutability
* **Preconditions**: Super admin is on Step 2 (`/requests/request-details/14682`).
* **Steps**:
  1. Locate Photograph card: `page.locator('.custom-file-upload').filter({ hasText: 'Photograph' })`.
  2. Verify presence of `<input type="file">`.
  3. Attempt to click or trigger file upload on the card.
* **Expected Result**:
  * Native `<input type="file">` is absent, disabled, or non-interactable.
  * Clicking the card does not invoke a file chooser dialog.
  * Existing file `'sample-photo.png'` remains displayed and uncorrupted.

---

#### `TC-ADMREV-DATA-NEG-03`
* **Title**: Step 4 disabled file card prevents triggering native file chooser or replacing applicant signed document
* **Coverage / Requirement Ref**: Attachments Immutability
* **Preconditions**: Super admin is on Step 4 (`/requests/request-details/14682`).
* **Steps**:
  1. Click `page.locator('.file-label.disabled')`.
  2. Check for native file chooser dialog invocation using `page.waitForEvent('filechooser', { timeout: 1500 }).catch(() => null)`.
* **Expected Result**:
  * No file chooser event is emitted.
  * The file card remains in `.disabled` state with `'sample-photo.png'` intact.

---

#### `TC-ADMREV-DATA-NEG-04`
* **Title**: Step 3 curriculum accordions keep stage details concealed until explicit chevron expansion
* **Coverage / Requirement Ref**: Collapsed Accordion State
* **Preconditions**: Super admin is on Step 3, Tab 2 (`Curriculum`).
* **Steps**:
  1. Inspect visibility of grade text `'FS 1'` and capacity text `'100'` before clicking any chevron.
* **Expected Result**:
  * Elements containing `'FS 1'` and `'100'` are hidden from view (`toBeHidden()` or detached from rendered viewport).
  * Accordion bodies have collapsed height/display until explicitly triggered.

---

### 3. Edge Cases

#### `TC-ADMREV-DATA-EDGE-01`
* **Title**: Repeated expanding and collapsing of nested curriculum accordions preserves data text and DOM structure
* **Coverage / Requirement Ref**: Accordion DOM Stability
* **Preconditions**: Super admin is on Step 3, Tab 2 (`Curriculum`).
* **Steps**:
  1. Click first chevron `page.locator('.group-header button.ant-btn-icon-only').first()`.
  2. Click second chevron `page.locator('.group-header button.ant-btn-icon-only').nth(1)`.
  3. Verify values `'British'`, `'FS 1'`, `'100'`, `'4'` are visible.
  4. Click second chevron again to collapse Stages 1.
  5. Click first chevron again to collapse Curriculum 1.
  6. Click both chevrons sequentially again to re-expand.
* **Expected Result**:
  * Data values are preserved without loss, duplication, or DOM corruption.
  * Re-expanding cleanly restores visible values `'British'`, `'FS 1'`, `'100'`, `'4'`.

---

#### `TC-ADMREV-DATA-EDGE-02`
* **Title**: Step 2 horizontal scrolling across all 15 owner sub-tabs retains active tab state and verified data integrity
* **Coverage / Requirement Ref**: Horizontal Tab Scrolling
* **Preconditions**: Super admin is on Step 2 (`Owners Profiles`).
* **Steps**:
  1. Scroll owner horizontal tab container to the far right.
  2. Click the last visible sub-tab (e.g., `Housing Data` or `Share Percentage`).
  3. Verify tab becomes active with `.ant-tabs-tab-active`.
  4. Scroll back to far left and click `Personal Details`.
* **Expected Result**:
  * Horizontal tab strip scrolls smoothly without clipping controls.
  * Clicking end tabs mounts corresponding sub-section data cleanly.
  * Navigating back to `Personal Details` restores `'Anas Mohamed'` and disabled file cards.

---

#### `TC-ADMREV-DATA-EDGE-03`
* **Title**: Bilingual text fields in Step 1 and Step 3 preserve native Arabic glyphs and English casing
* **Coverage / Requirement Ref**: Bilingual Text Integrity
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Verify Arabic First Name on Step 1: `page.getByRole('textbox', { name: 'First Name (in Arabic)' })`.
  2. Advance to Step 3 and verify Arabic School Name: `page.getByRole('textbox', { name: 'Arabic School Name' })`.
  3. Verify Arabic Location Block: `page.locator('input[placeholder*="Block" i]').nth(1)` or Arabic block field.
* **Expected Result**:
  * Arabic text `'انس'`, `'مدرسة المستقبل الحديثة 40178'`, and `'قطعة 12'` render correctly with proper Unicode glyph shaping and no encoding corruption (`???` or UTF-8 mojibake).

---

# Feature 3: Step 5 Collapsible Summary & Data Binding Verification

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-SUMM-POS-01` | Step 5 renders all three collapsible summary sections in collapsed state with only Previous button in footer | Step 5 Summary Structure |
| **Positive** | `TC-ADMREV-SUMM-POS-02` | Expanding Owners and School Details accordions accurately reflects submitted application data | Step 5 Data Binding |
| **Positive** | `TC-ADMREV-SUMM-POS-03` | Multiple summary accordions can be expanded concurrently without auto-closing previously expanded sections | Accordion Concurrency |
| **Negative** | `TC-ADMREV-SUMM-NEG-01` | Step 5 footer strictly excludes Next and Submit buttons, restricting workflow actions to the header card | Wizard Terminal Boundary |
| **Negative** | `TC-ADMREV-SUMM-NEG-02` | Step 5 Applicant Information summary accordion renders placeholder dashes for contact address | `[Planned Regression - Bug: SURPRISE-03]` |
| **Edge** | `TC-ADMREV-SUMM-EDGE-01` | Summary section chevron toggle buttons `.colbs-btn` respond reliably to keyboard Enter and Space activation | Accessibility & Keyboard Navigation |
| **Edge** | `TC-ADMREV-SUMM-EDGE-02` | Switching language to Arabic flips summary labels and values to RTL layout with consistent placeholder dash rendering | Summary RTL Presentation |

---

### 1. Positive Test Cases

#### `TC-ADMREV-SUMM-POS-01`
* **Title**: Step 5 renders all three collapsible summary sections in collapsed state with only Previous button in footer
* **Coverage / Requirement Ref**: Step 5 Summary Structure
* **Preconditions**: Super admin advances to Step 5 (`/requests/request-details/14682`).
* **Steps**:
  1. Verify active stepper is `5 Summary`.
  2. Locate 3 summary sections:
     * `"Applicant Information"`
     * `"Owners"`
     * `"School Details"`
  3. Inspect footer navigation buttons.
* **Expected Result**:
  * All 3 summary cards are present in the DOM.
  * Footer toolbar displays only `button.prev-btn` (`Previous`).
  * No `button.next-btn` or submit button exists in the wizard footer; final decisions are exclusively located in the top workflow action card.

---

#### `TC-ADMREV-SUMM-POS-02`
* **Title**: Expanding Owners and School Details accordions accurately reflects submitted application data
* **Coverage / Requirement Ref**: Step 5 Data Binding
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click chevron for Owners: `page.locator('.colbs-btn').nth(1)`.
  2. Verify:
     * Type of Owner: displays `'Individual'`.
     * Full Name: displays `'Anas Mohamed'`.
     * Passport Number: displays `'N1234567'`.
     * Passport Expiry: displays `'1/1/2030'`.
  3. Click chevron for School Details: `page.locator('.colbs-btn').nth(2)`.
  4. Verify:
     * School Name EN: displays `'Modern Future School 40178'`.
     * School Name AR: displays `'مدرسة المستقبل الحديثة 40178'`.
     * Location Block: displays `'Block 12'` / `'قطعة 12'`.
     * Curriculum: displays `'British'`.
* **Expected Result**:
  * Owners and School Details summary accordions expand smoothly.
  * All displayed field labels and values match the application record.

---

#### `TC-ADMREV-SUMM-POS-03`
* **Title**: Multiple summary accordions can be expanded concurrently without auto-closing previously expanded sections
* **Coverage / Requirement Ref**: Accordion Concurrency
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click `page.locator('.colbs-btn').first()`.
  2. Click `page.locator('.colbs-btn').nth(1)`.
  3. Click `page.locator('.colbs-btn').nth(2)`.
  4. Inspect visibility of content in all 3 sections simultaneously.
* **Expected Result**:
  * All 3 accordions remain expanded concurrently.
  * Opening section 3 does not collapse section 1 or section 2.

---

### 2. Negative Test Cases

#### `TC-ADMREV-SUMM-NEG-01`
* **Title**: Step 5 footer strictly excludes Next and Submit buttons, restricting workflow actions to the header card
* **Coverage / Requirement Ref**: Wizard Terminal Boundary
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Query `page.locator('button.next-btn')` within wizard container.
  2. Query `page.locator('button:has-text("Submit")')` within wizard container.
* **Expected Result**:
  * Neither button is rendered or visible in the wizard footer container.
  * Only `button.prev-btn` is rendered in the bottom navigation.

---

#### `TC-ADMREV-SUMM-NEG-02`
* **Title**: Step 5 Applicant Information summary accordion renders placeholder dashes for contact address
* **Coverage / Requirement Ref**: `[Planned Regression - Bug: SURPRISE-03]`
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Click chevron for Applicant Information: `page.locator('.colbs-btn').first()`.
  2. Verify Full Name EN displays `'Anas Mohamed'` and AR displays `'انس محمد'`.
  3. Verify Date of Birth displays `'1/1/1985'`.
  4. Verify Email displays `'apecouser@hotmail.com'`.
  5. Inspect the Address summary row value.
* **Expected Result**:
  * Full Name, DOB, and Email display their respective values correctly.
  * Address row displays placeholder dashes (`__`) instead of the submitted address (`'Al Jurf, Ajman'`).
  * Regression confirmation: The known data-binding omission from the applicant portal summary persists identically in the admin employee review summary.

---

### 3. Edge Cases

#### `TC-ADMREV-SUMM-EDGE-01`
* **Title**: Summary section chevron toggle buttons `.colbs-btn` respond reliably to keyboard Enter and Space activation
* **Coverage / Requirement Ref**: Accessibility & Keyboard Navigation
* **Preconditions**: Super admin is on Step 5 (`Summary`).
* **Steps**:
  1. Focus the first chevron button: `await page.locator('.colbs-btn').first().focus()`.
  2. Send keyboard press `'Enter'`.
  3. Verify Applicant Information accordion expands.
  3. Send keyboard press `'Space'`.
  4. Verify Applicant Information accordion collapses.
* **Expected Result**:
  * Accordion toggles state seamlessly via keyboard without requiring pointer interaction.

---

#### `TC-ADMREV-SUMM-EDGE-02`
* **Title**: Switching language to Arabic flips summary labels and values to RTL layout with consistent placeholder dash rendering
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

# Feature 4: Workflow Approval Action (Approve by APECO Employee)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-APP-POS-01` | Clicking Approve opens modal with mandatory Comments, mandatory File Upload, and disabled Save button | Approve Modal Initialization |
| **Positive** | `TC-ADMREV-APP-POS-02` | Populating valid comments and uploading valid document enables Save button and submits approval workflow | Approve Happy Path |
| **Positive** | `TC-ADMREV-APP-POS-03` | Clicking modal Back button dismisses approval modal and preserves pending review state without modifying request | Approve Modal Dismissal |
| **Negative** | `TC-ADMREV-APP-NEG-01` | Approve modal Save button remains strictly disabled when comments are populated but file upload is omitted | `[Planned Regression - Bug: SURPRISE-01]` |
| **Negative** | `TC-ADMREV-APP-NEG-02` | Approve modal Save button remains strictly disabled when file is uploaded but comments field is empty | Comments Required Validation |
| **Negative** | `TC-ADMREV-APP-NEG-03` | Uploading file exceeding 10MB size limit displays client-side validation error and keeps Save disabled | File Size Constraint (Max 10MB) |
| **Negative** | `TC-ADMREV-APP-NEG-04` | Uploading unsupported executable file extension is rejected with format validation error | File Extension Constraint |
| **Edge** | `TC-ADMREV-APP-EDGE-01` | Uploading valid document at exact 10.0 MB boundary enables Save button while 10.01 MB is rejected | Boundary File Size Check |
| **Edge** | `TC-ADMREV-APP-EDGE-02` | Comments textarea with leading and trailing whitespace only keeps Save button disabled | Comments Whitespace Handling |
| **Edge** | `TC-ADMREV-APP-EDGE-03` | Comments textarea accepts bilingual Arabic and English text with special characters up to maximum character limit | Multilingual Rich Text Input |

---

### 1. Positive Test Cases

#### `TC-ADMREV-APP-POS-01`
* **Title**: Clicking Approve opens modal with mandatory Comments, mandatory File Upload, and disabled Save button
* **Coverage / Requirement Ref**: Approve Modal Initialization
* **Preconditions**: Super admin is on `/requests/request-details/14682`, workflow card displays `Step 1: Pending — APECO Employee Review`.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Approve', exact: true })`.
  2. Verify modal opens: `page.locator('div.modal.show')`.
  3. Verify modal title contains `"Approve by APECO Employee"`.
  4. Inspect Comments field: `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  5. Inspect File Upload field: `page.locator('div.modal.show input[type="file"]')`.
  6. Inspect Save button: `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Modal container `div.modal.show` is visible.
  * Title displays `"Approve by APECO Employee"`.
  * Both `Comments *` and `Upload Files *` display mandatory asterisks (`*`).
  * `button:has-text("Save")` has attribute `disabled="true"`.

---

#### `TC-ADMREV-APP-POS-02`
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

#### `TC-ADMREV-APP-POS-03`
* **Title**: Clicking modal Back button dismisses approval modal and preserves pending review state without modifying request
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

#### `TC-ADMREV-APP-NEG-01`
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

#### `TC-ADMREV-APP-NEG-02`
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

#### `TC-ADMREV-APP-NEG-03`
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

#### `TC-ADMREV-APP-NEG-04`
* **Title**: Uploading unsupported executable file extension is rejected with format validation error
* **Coverage / Requirement Ref**: File Extension Constraint
* **Preconditions**: Super admin has opened Approve modal on `/requests/request-details/14682`.
* **Steps**:
  1. Enter valid comments into `page.locator('div.modal.show').getByPlaceholder('Type description')`.
  2. Attempt to attach an unsupported file (`malicious-script.exe` or `payload.bat`) to `page.locator('div.modal.show input[type="file"]')`.
* **Expected Result**:
  * System rejects the file attachment with an invalid file format notification.
  * Only supported document formats (image, PDF, Word, Excel) are accepted.
  * Save button remains disabled.

---

### 3. Edge Cases

#### `TC-ADMREV-APP-EDGE-01`
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
  * At 10.01 MB (min + 1 above limit): File is rejected with size error, and Save button disables.

---

#### `TC-ADMREV-APP-EDGE-02`
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

#### `TC-ADMREV-APP-EDGE-03`
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

# Feature 5: Workflow Return for Correction Action (Return by APECO Employee)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-RET-POS-01` | Clicking Return opens modal with mandatory Return reasons dropdown and disabled Save button | Return Modal Initialization |
| **Positive** | `TC-ADMREV-RET-POS-02` | Selecting a return reason enables Save button and successfully submits return workflow without optional comments or files | Return Happy Path (Minimal) |
| **Positive** | `TC-ADMREV-RET-POS-03` | Submitting return workflow with return reason, optional comments, and supplementary guidance document | Return Comprehensive Workflow |
| **Positive** | `TC-ADMREV-RET-POS-04` | Clicking Back button in Return modal dismisses dialog without persisting changes or modifying status | Return Modal Dismissal |
| **Negative** | `TC-ADMREV-RET-NEG-01` | Return modal Save button remains disabled when comments and files are provided but Return reason is unselected | Return Reason Mandatory Validation |
| **Negative** | `TC-ADMREV-RET-NEG-02` | Uploading file exceeding 10MB limit in Return modal triggers validation rejection | Return File Size Limit |
| **Edge** | `TC-ADMREV-RET-EDGE-01` | Clearing a previously selected return reason from dropdown dynamically disables the Save button again | Dropdown State Toggle |
| **Edge** | `TC-ADMREV-RET-EDGE-02` | Return reason dropdown supports keyboard navigation, arrow selection, and search filtering | Dropdown Keyboard Navigation |

---

### 1. Positive Test Cases

#### `TC-ADMREV-RET-POS-01`
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

#### `TC-ADMREV-RET-POS-02`
* **Title**: Selecting a return reason enables Save button and successfully submits return workflow without optional comments or files
* **Coverage / Requirement Ref**: Return Happy Path (Minimal)
* **Preconditions**: Super admin has opened Return modal on `/requests/request-details/14682`.
* **Steps**:
  1. Click `page.locator('div.modal.show nz-select, div.modal.show select').first()`.
  2. Select first available reason option (e.g., `'Missing Document'` or `'Incomplete Information'`).
  3. Verify `page.locator('div.modal.show button:has-text("Save")')` state.
  4. Click `page.locator('div.modal.show button:has-text("Save")')`.
* **Expected Result**:
  * Selecting a reason enables the Save button immediately without requiring comments or files.
  * Clicking Save dispatches `POST` request returning `HTTP 200 OK`.
  * Request transitions to `Returned for Correction` status, notifying the applicant.

---

#### `TC-ADMREV-RET-POS-03`
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

#### `TC-ADMREV-RET-POS-04`
* **Title**: Clicking Back button in Return modal dismisses dialog without persisting changes or modifying status
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

#### `TC-ADMREV-RET-NEG-01`
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

#### `TC-ADMREV-RET-NEG-02`
* **Title**: Uploading file exceeding 10MB limit in Return modal triggers validation rejection
* **Coverage / Requirement Ref**: Return File Size Limit
* **Preconditions**: Super admin has opened Return modal with reason selected.
* **Steps**:
  1. Attach an oversized file (12.0 MB) to file upload input.
  2. Inspect UI response.
* **Expected Result**:
  * File size error notification is displayed.
  * Save button is disabled until the invalid file is cleared.

---

### 3. Edge Cases

#### `TC-ADMREV-RET-EDGE-01`
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

#### `TC-ADMREV-RET-EDGE-02`
* **Title**: Return reason dropdown supports keyboard navigation, arrow selection, and search filtering
* **Coverage / Requirement Ref**: Dropdown Keyboard Navigation
* **Preconditions**: Super admin has opened Return modal.
* **Steps**:
  1. Focus the select control: `page.locator('div.modal.show nz-select').focus()`.
  2. Type `'Doc'` to filter options.
  3. Press ArrowDown and press Enter.
* **Expected Result**:
  * Dropdown filters to matching options (e.g., `'Missing Documents'`).
  * Option is selected and Save button is enabled.

---

# Feature 6: Workflow Rejection Action (Reject by APECO Employee)

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-REJ-POS-01` | Clicking Reject opens modal with mandatory Rejection reasons dropdown and disabled Save button | Reject Modal Initialization |
| **Positive** | `TC-ADMREV-REJ-POS-02` | Selecting a rejection reason enables Save button and successfully submits rejection workflow | Reject Happy Path (Minimal) |
| **Positive** | `TC-ADMREV-REJ-POS-03` | Submitting rejection workflow with rejection reason, detailed justification comments, and evidence attachment | Reject Comprehensive Workflow |
| **Positive** | `TC-ADMREV-REJ-POS-04` | Clicking Back button in Reject modal dismisses dialog without persisting changes or modifying status | Reject Modal Dismissal |
| **Negative** | `TC-ADMREV-REJ-NEG-01` | Reject modal Save button remains disabled when comments are populated but Rejection reason dropdown is unselected | Rejection Reason Mandatory Validation |
| **Negative** | `TC-ADMREV-REJ-NEG-02` | Uploading invalid file format in Reject modal blocks submission | Reject File Type Validation |
| **Edge** | `TC-ADMREV-REJ-EDGE-01` | Selecting and deselecting rejection reason alternates Save button between enabled and disabled states | Rejection State Toggle |
| **Edge** | `TC-ADMREV-REJ-EDGE-02` | Pressing Escape key while Reject modal is active closes the modal cleanly without dispatching workflow transition | Modal Keyboard Dismissal |

---

### 1. Positive Test Cases

#### `TC-ADMREV-REJ-POS-01`
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

#### `TC-ADMREV-REJ-POS-02`
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

#### `TC-ADMREV-REJ-POS-03`
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

#### `TC-ADMREV-REJ-POS-04`
* **Title**: Clicking Back button in Reject modal dismisses dialog without persisting changes or modifying status
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

#### `TC-ADMREV-REJ-NEG-01`
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

#### `TC-ADMREV-REJ-NEG-02`
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

#### `TC-ADMREV-REJ-EDGE-01`
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

#### `TC-ADMREV-REJ-EDGE-02`
* **Title**: Pressing Escape key while Reject modal is active closes the modal cleanly without dispatching workflow transition
* **Coverage / Requirement Ref**: Modal Keyboard Dismissal
* **Preconditions**: Super admin has opened Reject modal on `/requests/request-details/14682`.
* **Steps**:
  1. Verify modal is active: `page.locator('div.modal.show')`.
  2. Press keyboard key `'Escape'`.
  3. Inspect modal visibility.
* **Expected Result**:
  * Modal dialog dismisses (`div.modal.show` disappears).
  * Focus returns safely to the parent review page without JS errors.

---

# Feature 7: Workflow Status Timeline & Access Control Security

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-ADMREV-SEC-POS-01` | Workflow status card accurately displays Step 1 Pending (APECO Employee Review) and Steps 2-3 Upcoming | Workflow Timeline Verification |
| **Positive** | `TC-ADMREV-SEC-POS-02` | Authenticated admin session with deep link `/requests/request-details/14682` directly loads request details | Deep Link Direct Navigation |
| **Negative** | `TC-ADMREV-SEC-NEG-01` | Unauthenticated direct navigation to request details URL redirects to admin login page | Unauthenticated Access Control |
| **Negative** | `TC-ADMREV-SEC-NEG-02` | Navigating to non-existent or invalid Request ID URL displays 404 or request not found notification | Invalid Request Handling |
| **Edge** | `TC-ADMREV-SEC-EDGE-01` | Session expiration during active review displays session timeout modal or redirects cleanly to login upon action click | Session Expiry Graceful Handling |
| **Edge** | `TC-ADMREV-SEC-EDGE-02` | Direct URL with trailing slash `/requests/request-details/14682/` normalizes and renders request details correctly | URL Normalization |

---

### 1. Positive Test Cases

#### `TC-ADMREV-SEC-POS-01`
* **Title**: Workflow status card accurately displays Step 1 Pending (APECO Employee Review) and Steps 2-3 Upcoming
* **Coverage / Requirement Ref**: Workflow Timeline Verification
* **Preconditions**: Super admin is on `/requests/request-details/14682`.
* **Steps**:
  1. Locate workflow container: `page.locator('workflow-action-options')`.
  2. Verify Step 1 label and status:
     * Label: `'APECO Employee Review'`.
     * State badge: `'Pending'`.
  3. Verify Step 2 label and status:
     * Label: `'Technical Engineer Review'`.
     * State badge: `'Upcoming'`.
  4. Verify Step 3 label and status:
     * Label: `'Accepted'`.
     * State badge: `'Upcoming'`.
* **Expected Result**:
  * Workflow progress timeline accurately reflects active stage 1 (Pending) and future stages 2-3 (Upcoming).
  * Action buttons (*Approve*, *Return*, *Reject*) correspond to Step 1 employee authority.

---

#### `TC-ADMREV-SEC-POS-02`
* **Title**: Authenticated admin session with deep link `/requests/request-details/14682` directly loads request details
* **Coverage / Requirement Ref**: Deep Link Direct Navigation
* **Preconditions**: Super admin has active session storage/cookies in browser context.
* **Steps**:
  1. Open a new browser tab or navigate directly to `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/requests/request-details/14682`.
  2. Await network idle.
* **Expected Result**:
  * Application loads request details directly without intermediate redirects to `/agent-queue` or `/login`.
  * Header displays `"Request Details"` and `"Applicant: Anas Mohamed"`.

---

### 2. Negative Test Cases

#### `TC-ADMREV-SEC-NEG-01`
* **Title**: Unauthenticated direct navigation to request details URL redirects to admin login page
* **Coverage / Requirement Ref**: Unauthenticated Access Control
* **Preconditions**: Clean, unauthenticated browser context (no cookies or tokens in storage).
* **Steps**:
  1. Navigate directly to `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/requests/request-details/14682`.
  2. Await navigation events.
* **Expected Result**:
  * Route guard intercepts request and redirects browser to `/login`.
  * Admin login form (*Email*, *Password*, *Login*) is displayed.
  * No confidential application data or applicant details are leaked in network responses or DOM.

---

#### `TC-ADMREV-SEC-NEG-02`
* **Title**: Navigating to non-existent or invalid Request ID URL displays 404 or request not found notification
* **Coverage / Requirement Ref**: Invalid Request Handling
* **Preconditions**: Super admin authenticated on Admin Portal.
* **Steps**:
  1. Navigate to `/requests/request-details/999999999`.
  2. Observe network response and UI rendering.
* **Expected Result**:
  * Backend returns `HTTP 404 Not Found` or error response.
  * UI displays user-friendly error message or empty state notification.
  * System does not crash with unhandled exception or white screen.

---

### 3. Edge Cases

#### `TC-ADMREV-SEC-EDGE-01`
* **Title**: Session expiration during active review displays session timeout modal or redirects cleanly to login upon action click
* **Coverage / Requirement Ref**: Session Expiry Graceful Handling
* **Preconditions**: Super admin is reviewing Step 3 on `/requests/request-details/14682`, session auth token is cleared or expired.
* **Steps**:
  1. Clear authentication token from `localStorage` / cookies.
  2. Click `page.getByRole('button', { name: 'Approve', exact: true })` or attempt workflow action.
* **Expected Result**:
  * API call returns `HTTP 401 Unauthorized`.
  * System displays session expired notification and cleanly redirects to `/login`.

---

#### `TC-ADMREV-SEC-EDGE-02`
* **Title**: Direct URL with trailing slash `/requests/request-details/14682/` normalizes and renders request details correctly
* **Coverage / Requirement Ref**: URL Normalization
* **Preconditions**: Super admin authenticated on Admin Portal.
* **Steps**:
  1. Navigate to `/requests/request-details/14682/`.
  2. Inspect URL and rendered page contents.
* **Expected Result**:
  * Router normalizes the trailing slash or handles route matching correctly.
  * Request details page renders cleanly without 404 or broken assets.
