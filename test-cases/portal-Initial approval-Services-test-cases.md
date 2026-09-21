# APECO Portal Test Matrix: Applicant Services

This test matrix is designed in strict accordance with the [Test Case Design Standard](file:///d:/AI/APECO-Test-1/skills/test-case-design.md), using [applicant-services-exploration-notes.md](file:///d:/AI/APECO-Test-1/applicant-services-exploration-notes.md) as the factual source of truth for all application behaviors, DOM selectors, multi-step wizard state transitions, and verified regressions.

---

# Feature: Initial application - Submission for a Private School Permit

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Coverage / Defect Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-PERMIT-POS-01` | End-to-end submission with valid data generates Request ID and navigates to checkout | Happy Path / E2E Submission |
| **Positive** | `TC-PERMIT-POS-02` | In-progress draft modal allows resuming an existing draft with preserved application state | Draft Interception Flow |
| **Positive** | `TC-PERMIT-POS-03` | In-progress draft modal allows starting a pristine new request without stale data | Draft Interception Flow |
| **Positive** | `TC-PERMIT-POS-04` | Step 1 multi-tab progression enables Next button only when both Applicant and Contact tabs are valid | Step 1 Application Info |
| **Positive** | `TC-PERMIT-POS-05` | Step 2 marks all 6 owner sub-sections completed and clears share warning upon 100% allocation | Step 2 Owners Profiles |
| **Positive** | `TC-PERMIT-POS-06` | Step 3 accepts school specifications, sequential uploads, and curriculum configuration | Step 3 School Information |
| **Positive** | `TC-PERMIT-POS-07` | Step 4 presents signature preparation notice dialog and renders downloadable introduction PDF | Step 4 Download Documents |
| **Positive** | `TC-PERMIT-POS-08` | Step 5 uploading signed introduction document reaches 100% completion rate and enables summary | Step 5 Attachments |
| **Positive** | `TC-PERMIT-POS-09` | Step 6 checking correctness acknowledgment enables Pay button and dispatches validation API | Step 6 Summary & Pay |
| **Positive** | `TC-PERMIT-POS-10` | Checkout screen displays 700.00 AED invoice and Pay Later routes to unpaid invoice list | Checkout & Invoices |
| **Positive** | `TC-PERMIT-POS-11` | Complete end-to-end payment from Checkout step with valid card details updates invoice to Paid | Payment Gateway & Invoices |
| **Negative** | `TC-PERMIT-NEG-01` | Step 1 blocks advancement and keeps Next disabled when mandatory Date of Birth is omitted | Step 1 Validation |
| **Negative** | `TC-PERMIT-NEG-02` | Step 1 blocks advancement when Contact Information Address is omitted | Step 1 Validation |
| **Negative** | `TC-PERMIT-NEG-03` | Step 2 blocks advancement when owner share percentage is less than 100% | Step 2 Share Validation |
| **Negative** | `TC-PERMIT-NEG-04` | Step 2 blocks advancement when owner share percentage exceeds 100% | Step 2 Share Validation |
| **Negative** | `TC-PERMIT-NEG-05` | Step 2 blocks progression when mandatory Personal Details or required photo/conduct files are missing | Step 2 Owner Documents |
| **Negative** | `TC-PERMIT-NEG-06` | Step 2 passport details rejects expiry date preceding issue date | Step 2 Passport Dates |
| **Negative** | `TC-PERMIT-NEG-07` | Step 3 blocks progression when mandatory School Details fields or required files are missing | Step 3 School Documents |
| **Negative** | `TC-PERMIT-NEG-08` | Step 3 blocks curriculum submission with zero capacity or zero classrooms | Step 3 Curriculum Validation |
| **Negative** | `TC-PERMIT-NEG-09` | Step 5 rejects unsupported file extensions or files exceeding the 3MB limit | Step 5 File Constraints |
| **Negative** | `TC-PERMIT-NEG-10` | Step 6 Pay button remains strictly disabled when acknowledgment checkbox is unchecked | Step 6 Acknowledgment |
| **Negative** | `TC-PERMIT-NEG-11` | Premature share percentage error banner displays on Step 2 before user input | `[Planned Regression - Bug: SURPRISE-01]` |
| **Negative** | `TC-PERMIT-NEG-12` | Step 5 file picker fails to trigger when clicking `<label for="file-input">` text | `[Planned Regression - Bug: SURPRISE-03]` |
| **Negative** | `TC-PERMIT-NEG-13` | Step 6 summary accordions fail to expand when clicking header titles or card rows | `[Planned Regression - Bug: SURPRISE-04]` |
| **Negative** | `TC-PERMIT-NEG-14` | Step 6 summary displays placeholder dashes (`__`) for Date of Birth and Address | `[Planned Regression - Bug: SURPRISE-05]` |
| **Negative** | `TC-PERMIT-NEG-15` | Gateway FileService drops socket connection during concurrent file uploads | `[Planned Regression - Bug: SURPRISE-07]` |
| **Negative** | `TC-PERMIT-NEG-16` | Unpaid invoice dollar action icon resets application wizard back to Step 1 instead of checkout | `[Planned Regression - Bug: SURPRISE-11]` |
| **Edge** | `TC-PERMIT-EDGE-01` | Owner share percentage at boundary values 99% and 101% are rejected | Boundary Share Allocation |
| **Edge** | `TC-PERMIT-EDGE-02` | Owner share percentage divided across multiple owners totals exactly 100% | Multi-Owner Distribution |
| **Edge** | `TC-PERMIT-EDGE-03` | Uploading attachment at exact boundary limit of 3.0 MB is accepted while 3.01 MB is rejected | Boundary File Size |
| **Edge** | `TC-PERMIT-EDGE-04` | Bilingual school name inputs accept special characters, numbers, and boundary lengths | Bilingual Input Encoding |
| **Edge** | `TC-PERMIT-EDGE-05` | "Save as Draft" persists partially completed wizard state across browser restart | Draft Persistence |
| **Edge** | `TC-PERMIT-EDGE-06` | Step navigation via "Previous" button preserves all populated form controls without data loss | Wizard Backward Navigation |

---

## 1. Positive Test Cases

### `TC-PERMIT-POS-01`
* **Title**: End-to-end submission with valid data generates Request ID and navigates to checkout
* **Feature Scope**: Initial application - Submission for a Private School Permit (End-to-End)
* **Preconditions**: User logged in as `apecouser@hotmail.com` / `P0rtal#Cqnyp` on `/services`, no blocking modal dialogs.
* **Steps**:
  1. Click `page.locator('.service-card').filter({ hasText: 'Initial application - Submission for a Private School Permit' })`.
  2. If draft dialog opens, click `page.locator('app-choose-draft-requests').getByRole('button', { name: 'New Request' })`.
  3. On Step 1, enter `'01/01/1985'` into `page.getByPlaceholder('Date of Birth')`.
  4. Click `page.getByRole('tab', { name: 'Contact Information' })`, then enter `'Al Jurf, Ajman'` into `page.getByPlaceholder('Address')`.
  5. Click `page.getByRole('button', { name: 'Next' })`.
  6. On Step 2, populate all 6 sub-sections for Owner 1 (*Personal*, *Passport*, *Qualifying*, *Marital Status*, *Father/Mother*, *Housing*), upload personal photo and good conduct certificate, and enter `'100'` into `page.locator('control-selector#sharePercentage input, input#sharePercentage')`.
  7. Click `page.getByRole('button', { name: 'Next' })`.
  8. On Step 3, populate School Details, sequentially upload *Location Map*, *Proof of Land Ownership*, and *Feasibility Study*, add a British curriculum FS 2 entry, and click `page.getByRole('button', { name: 'Next' })`.
  9. On Step 4, click `page.locator('.ant-modal-footer').getByRole('button', { name: 'Okay' })`, verify generated document card, and click `page.getByRole('button', { name: 'Next' })`.
  10. On Step 5, set valid signed file on `page.locator('input#attachment[type="file"]')`, wait for 100% completion rate, and click `page.getByRole('button', { name: 'Next' })`.
  11. On Step 6, check `page.getByLabel('Acknowledge the correctness of all provided data')`.
  12. Click `page.getByRole('button', { name: 'Pay' })`.
* **Expected Result**:
  * Network dispatches `POST /ServiceDesk/api/Requests/ValidateRequest/` returning `HTTP 200 OK` (`{"succeeded":true,"error":null}`).
  * Browser navigates to `/checkout/{requestId}`.
  * System displays invoice `INV-*-{requestId}` for `700.00 AED`.
  * The request is tracked in `/requests` and unpaid invoice is listed in `/invoices`.

---

### `TC-PERMIT-POS-02`
* **Title**: In-progress draft modal allows resuming an existing draft with preserved application state
* **Feature Scope**: Draft Request Interception Flow
* **Preconditions**: User logged in as `apecouser@hotmail.com` on `/services` with at least one existing saved draft for the permit service.
* **Steps**:
  1. Click `page.locator('.service-card').filter({ hasText: 'Initial application - Submission for a Private School Permit' })`.
  2. Verify draft interception dialog `<app-choose-draft-requests>` is visible.
  3. Open `page.locator('app-choose-draft-requests nz-select')` and select an existing draft request.
  4. Click `page.locator('app-choose-draft-requests').getByRole('button', { name: 'Resume' })`.
* **Expected Result**:
  * Browser navigates to `/services/initial-approval-school/{draftRequestId}`.
  * Stepper and completion rate reflect previously saved progress.
  * Previously entered fields in completed steps remain pre-populated.

---

### `TC-PERMIT-POS-03`
* **Title**: In-progress draft modal allows starting a pristine new request without stale data
* **Feature Scope**: Draft Request Interception Flow
* **Preconditions**: User logged in on `/services` with existing drafts.
* **Steps**:
  1. Click `page.locator('.service-card').filter({ hasText: 'Initial application - Submission for a Private School Permit' })`.
  2. In the modal, click `page.locator('app-choose-draft-requests').getByRole('button', { name: 'New Request' })`.
* **Expected Result**:
  * Browser navigates to `/services/initial-approval-school` without request ID route parameter.
  * Step 1 renders with clean editable fields (Date of Birth is empty, Address is empty).
  * Stepper completion rate starts at `0%`.

---

### `TC-PERMIT-POS-04`
* **Title**: Step 1 multi-tab progression enables Next button only when both Applicant and Contact tabs are valid
* **Feature Scope**: Step 1 Application Information
* **Preconditions**: User is on Step 1 (`/services/initial-approval-school`).
* **Steps**:
  1. Verify `page.getByRole('button', { name: 'Next' })` is disabled.
  2. Enter `'01/01/1985'` into `page.getByPlaceholder('Date of Birth')`.
  3. Verify `page.getByRole('button', { name: 'Next' })` remains disabled.
  4. Click `page.getByRole('tab', { name: 'Contact Information' })`.
  5. Enter `'Al Jurf, Ajman'` into `page.getByPlaceholder('Address')`.
* **Expected Result**:
  * Upon providing valid Address while Date of Birth is populated, `page.getByRole('button', { name: 'Next' })` immediately becomes enabled.
  * Clicking `Next` cleanly advances to Step 2 (*Owners Profiles*).

---

### `TC-PERMIT-POS-05`
* **Title**: Step 2 marks all 6 owner sub-sections completed and clears share warning upon 100% allocation
* **Feature Scope**: Step 2 Owners Profiles
* **Preconditions**: User has navigated to Step 2.
* **Steps**:
  1. Select Owner Type `Individual`, Religion `Muslim`, Nationality `Australia`, enter Mother Name `'Fatima'`.
  2. Upload valid image files to `control-selector#personalPhoto input[type="file"]` and `control-selector#certificateGoodConduct input[type="file"]`.
  3. Switch to *Passport Details*, enter passport number, issue date, expiry date, and upload passport copy.
  4. Switch to *Qualifying*, enter Bachelor's degree, university, and graduation year.
  5. Switch to *Marital Status Data*, select `Single`.
  6. Switch to *Father/Mother Data*, enter parents' names.
  7. Switch to *Housing Data*, enter region, street, and contact numbers.
  8. Switch to *Share Percnetage*, enter `'100'` into `page.locator('control-selector#sharePercentage input, input#sharePercentage')`.
* **Expected Result**:
  * Each completed tab displays a green checkmark icon.
  * The red alert banner *"Invalid share percentage for owners. The value should be 100%."* completely disappears.
  * Completion rate updates to `53%`.
  * `page.getByRole('button', { name: 'Next' })` becomes enabled.

---

### `TC-PERMIT-POS-06`
* **Title**: Step 3 accepts school specifications, sequential uploads, and curriculum configuration
* **Feature Scope**: Step 3 School Information
* **Preconditions**: User has navigated to Step 3.
* **Steps**:
  1. In *School Details*, select Request Type `New School Permit`, enter School Name EN `'Modern Future Private School'`, School Name AR `'مدرسة المستقبل الحديثة الخاصة'`.
  2. Enter Consultant `'Future Edu'`, Address `'Al Jurf 2'`, Gender `Co-educational`, Location Block EN `'Block 12'`, AR `'قطعة 12'`.
  3. Set Land Ownership `Private Property`, Area `'15000'`, Building Ownership `Private Property`, Area `'8500'`.
  4. Upload sequentially: *Location Map*, *Proof of Land Ownership*, and *Feasibility Study*.
  5. Switch to *Curriculum*, select `British`, Stage `Kindergarten`, Grade `FS 2`, Capacity `'100'`, Classrooms `'4'`.
  6. Click `page.locator('app-curriculum').getByRole('button', { name: 'Add' })`.
* **Expected Result**:
  * Curriculum entry is added to the table with curriculum name, stage, grade, capacity, and action icons.
  * Completion rate updates to `98%`.
  * `page.getByRole('button', { name: 'Next' })` becomes enabled.

---

### `TC-PERMIT-POS-07`
* **Title**: Step 4 presents signature preparation notice dialog and renders downloadable introduction PDF
* **Feature Scope**: Step 4 Download Documents
* **Preconditions**: User clicks `Next` from valid Step 3.
* **Steps**:
  1. Observe appearance of confirmation modal dialog.
  2. Verify modal text: *"Alright! Your documents will be prepared for download. Please wait a few minutes. Download the files to proceed with your signature. After signing, kindly upload the signed documents in the Attachments step."*
  3. Click `page.locator('.ant-modal-footer').getByRole('button', { name: 'Okay' })`.
  4. Verify document card titled *"Introduction Documents after signature"* is displayed.
  5. Click download link `page.locator('.document-card a[download], .document-card .anticon-download')`.
* **Expected Result**:
  * The browser triggers download of the generated PDF document.
  * `page.getByRole('button', { name: 'Next' })` is enabled, allowing progression to Step 5.

---

### `TC-PERMIT-POS-08`
* **Title**: Step 5 uploading signed introduction document reaches 100% completion rate and enables summary
* **Feature Scope**: Step 5 Attachments
* **Preconditions**: User is on Step 5 (`/services/initial-approval-school`).
* **Steps**:
  1. Locate `page.locator('input#attachment[type="file"]')`.
  2. Set file using `setInputFiles('sample-signed-doc.pdf')`.
  3. Await upload response from `POST /FileService/api/Attachment/Upload`.
* **Expected Result**:
  * Uploaded file card renders with filename, size, download icon, and remove icon (`X`).
  * Stepper Completion Rate indicator updates to `100%`.
  * `page.getByRole('button', { name: 'Next' })` changes to primary active state.

---

### `TC-PERMIT-POS-09`
* **Title**: Step 6 checking correctness acknowledgment enables Pay button and dispatches validation API
* **Feature Scope**: Step 6 Summary & Pay
* **Preconditions**: User is on Step 6 (*Summary*) with 100% completion rate.
* **Steps**:
  1. Verify `page.getByRole('button', { name: 'Pay' })` is disabled (`disabled="true"`).
  2. Click `page.getByLabel('Acknowledge the correctness of all provided data')`.
  3. Verify `page.getByRole('button', { name: 'Pay' })` becomes enabled.
  4. Click `page.getByRole('button', { name: 'Pay' })`.
* **Expected Result**:
  * Checkbox reflects checked state (`aria-checked="true"`).
  * Pay button becomes clickable.
  * Application issues `POST /ServiceDesk/api/Requests/ValidateRequest/` and `GET /ServiceDesk/api/Payments/GetServiceQuotation`.
  * Browser transitions to checkout page.

---

### `TC-PERMIT-POS-10`
* **Title**: Checkout screen displays 700.00 AED invoice and Pay Later routes to unpaid invoice list
* **Feature Scope**: Checkout & Invoices Confirmation
* **Preconditions**: User completed Step 6 submission and was routed to `/checkout/{id}`.
* **Steps**:
  1. Verify page title is `Payment` (`page.getByRole('heading', { name: 'Payment' })`).
  2. Verify invoice line item: *"Initial application - Submission for a Private School Permit"*, Amount Payable: `700.00 AED`, VAT Rate: `0%`.
  3. Click `page.getByRole('button', { name: 'Pay Later' })`.
* **Expected Result**:
  * Browser redirects to `/invoices`.
  * The invoice `INV-*-{requestId}` appears in the top row with status `Unpaid`, amount `700.00 AED`, and action icons (view details and pay dollar icon).

---

### `TC-PERMIT-POS-11`
* **Title**: Complete end-to-end payment from Checkout step with valid card details updates invoice to Paid
* **Feature Scope**: Checkout & Magnati Payment Gateway
* **Preconditions**: User completed Step 6 submission and was routed to `/checkout/{id}`.
* **Steps**:
  1. Verify page URL contains `/checkout`.
  2. Verify invoice amount `700.00 AED` is displayed.
  3. Click `Pay Now` button.
  4. On Magnati Payment Gateway (`uatpayment.magnati.com`), enter Cardholder Name (`Ali`), Card Number (`5204740000001002`), Expiry date, and CVV (`888`).
  5. Click `PAY` button.
  6. Await gateway redirection to `/payment-result/{paymentId}`.
  7. Verify success message: *"Your request has been submitted successfully"*.
  8. Navigate to `/invoices` and verify the invoice status updates to `Paid`.
* **Expected Result**:
  * Magnati payment succeeds.
  * User is redirected to `/payment-result/{id}` confirming payment of `700.00 AED`.
  * In `/invoices`, the corresponding permit invoice is listed with status `Paid`.

---

## 2. Negative Test Cases

### `TC-PERMIT-NEG-01`
* **Title**: Step 1 blocks advancement and keeps Next disabled when mandatory Date of Birth is omitted
* **Feature Scope**: Step 1 Application Info
* **Preconditions**: User is on Step 1 with empty Date of Birth.
* **Steps**:
  1. Ensure `page.getByPlaceholder('Date of Birth')` is empty.
  2. Switch to `Contact Information` tab and enter `'Al Jurf, Ajman'` into `page.getByPlaceholder('Address')`.
  3. Inspect `page.getByRole('button', { name: 'Next' })`.
* **Expected Result**:
  * `page.getByRole('button', { name: 'Next' })` remains strictly disabled.
  * Clicking or attempting to advance to Step 2 is blocked.

---

### `TC-PERMIT-NEG-02`
* **Title**: Step 1 blocks advancement when Contact Information Address is omitted
* **Feature Scope**: Step 1 Application Info
* **Preconditions**: User is on Step 1.
* **Steps**:
  1. Enter `'01/01/1985'` into `page.getByPlaceholder('Date of Birth')`.
  2. Click `page.getByRole('tab', { name: 'Contact Information' })` and leave `Address` empty.
  3. Inspect `page.getByRole('button', { name: 'Next' })`.
* **Expected Result**:
  * Form group `contactInformation` remains invalid.
  * `page.getByRole('button', { name: 'Next' })` remains disabled.

---

### `TC-PERMIT-NEG-03`
* **Title**: Step 2 blocks advancement when owner share percentage is less than 100%
* **Feature Scope**: Step 2 Owners Profiles
* **Preconditions**: User is on Step 2 with all owner personal sub-tabs completed.
* **Steps**:
  1. Navigate to the Share Percentage tab.
  2. Enter `'75'` into `page.locator('control-selector#sharePercentage input, input#sharePercentage')`.
  3. Inspect the page banner and the `Next` button.
* **Expected Result**:
  * Red warning message persists: *"Invalid share percentage for owners. The value should be 100%."*
  * `page.getByRole('button', { name: 'Next' })` remains disabled.

---

### `TC-PERMIT-NEG-04`
* **Title**: Step 2 blocks advancement when owner share percentage exceeds 100%
* **Feature Scope**: Step 2 Owners Profiles
* **Preconditions**: User is on Step 2 with all owner personal sub-tabs completed.
* **Steps**:
  1. Navigate to the Share Percentage tab.
  2. Enter `'120'` into `page.locator('control-selector#sharePercentage input, input#sharePercentage')`.
  3. Inspect the validation state.
* **Expected Result**:
  * Form marks share percentage as invalid.
  * `page.getByRole('button', { name: 'Next' })` remains disabled.

---

### `TC-PERMIT-NEG-05`
* **Title**: Step 2 blocks progression when mandatory Personal Details or required photo/conduct files are missing
* **Feature Scope**: Step 2 Owners Profiles
* **Preconditions**: User is on Step 2, Personal Details tab.
* **Steps**:
  1. Fill required text fields (Name, Religion, Nationality, Mother Name), but omit uploading `personalPhoto` or `certificateGoodConduct`.
  2. Enter `'100'` in share percentage.
  3. Inspect the Personal Details tab header and the `Next` button.
* **Expected Result**:
  * Personal Details sub-tab icon does not transition to green checkmark.
  * Form group `ownersForm` remains invalid.
  * `page.getByRole('button', { name: 'Next' })` remains disabled.

---

### `TC-PERMIT-NEG-06`
* **Title**: Step 2 passport details rejects expiry date preceding issue date
* **Feature Scope**: Step 2 Passport Details
* **Preconditions**: User is on Step 2, Passport Details tab.
* **Steps**:
  1. Enter Passport Number `'N1234567'` and Place of Issue `'Sydney'`.
  2. Enter Issue Date `'01/01/2025'`.
  3. Enter Expiry Date `'01/01/2020'` (expiry date prior to issue date).
* **Expected Result**:
  * Date picker displays invalid date error or prevents selection of expiry date prior to issue date.
  * Passport Details sub-tab remains incomplete.

---

### `TC-PERMIT-NEG-07`
* **Title**: Step 3 blocks progression when mandatory School Details fields or required files are missing
* **Feature Scope**: Step 3 School Details
* **Preconditions**: User is on Step 3, School Details tab.
* **Steps**:
  1. Enter School Names in English and Arabic, but leave `Location Map` unattached.
  2. Attempt to click `page.getByRole('button', { name: 'Next' })`.
* **Expected Result**:
  * Required file control `control-selector#proposedLocationMap` highlights red (`border-danger`).
  * `page.getByRole('button', { name: 'Next' })` remains disabled.

---

### `TC-PERMIT-NEG-08`
* **Title**: Step 3 blocks curriculum submission with zero capacity or zero classrooms
* **Feature Scope**: Step 3 Curriculum Validation
* **Preconditions**: User is on Step 3, Curriculum tab.
* **Steps**:
  1. Select Curriculum `British`, Stage `Kindergarten`, Grade `FS 2`.
  2. Enter Capacity `'0'` and Classrooms `'0'`.
  3. Click `page.locator('app-curriculum').getByRole('button', { name: 'Add' })`.
* **Expected Result**:
  * Input controls display validation error or block adding invalid row to the curriculum table.
  * Curriculum table remains empty; `Next` button remains disabled.

---

### `TC-PERMIT-NEG-09`
* **Title**: Step 5 rejects unsupported file extensions or files exceeding the 3MB limit
* **Feature Scope**: Step 5 Attachments
* **Preconditions**: User is on Step 5 (`/services/initial-approval-school`).
* **Steps**:
  1. Attempt to upload an executable or unsupported file (e.g., `sample.exe` or `data.zip`) to `input#attachment[type="file"]`.
  2. Attempt to upload a file exceeding 3MB (e.g., `oversized-doc-4mb.pdf`).
* **Expected Result**:
  * File upload is rejected client-side with validation message indicating allowed formats (`.jpg, .jpeg, .png, .pdf`) and maximum file size (3MB).
  * Completion rate does not increment; `Next` button remains disabled.

---

### `TC-PERMIT-NEG-10`
* **Title**: Step 6 Pay button remains strictly disabled when acknowledgment checkbox is unchecked
* **Feature Scope**: Step 6 Acknowledgment
* **Preconditions**: User is on Step 6 (*Summary*) with 100% completion rate.
* **Steps**:
  1. Verify `page.getByLabel('Acknowledge the correctness of all provided data')` is unchecked.
  2. Inspect the `Pay` button.
* **Expected Result**:
  * `page.getByRole('button', { name: 'Pay' })` has `disabled="true"` attribute and CSS disabled styles.
  * Clicking the button does not trigger any network request.

---

### `TC-PERMIT-NEG-11`
* **Title**: Premature share percentage error banner displays on Step 2 before user input
* **Feature Scope**: Step 2 Owners Profiles
* **Preconditions**: User completes Step 1 and clicks `Next` to land on Step 2 for the first time.
* **Steps**:
  1. Complete valid Step 1 data and click `page.getByRole('button', { name: 'Next' })`.
  2. Observe the top of the newly loaded Step 2 view prior to any user keystrokes.
* **Expected Result**:
  * [Planned Regression - Bug: SURPRISE-01]
  * **Expected Standard**: Step 2 should render cleanly without validation banners until the user interacts with the form or attempts submission.
  * **Current Defect Behavior**: An aggressive red banner *"Invalid share percentage for owners. The value should be 100%."* is displayed immediately upon page load.

---

### `TC-PERMIT-NEG-12`
* **Title**: Step 5 file picker fails to trigger when clicking `<label for="file-input">` text
* **Feature Scope**: Step 5 Attachments
* **Preconditions**: User is on Step 5 (*Attachments*).
* **Steps**:
  1. Click directly on the label text: `page.locator('.file-label').getByText('Choose File')`.
  2. Observe whether the native browser/OS file chooser dialog is triggered.
* **Expected Result**:
  * [Planned Regression - Bug: SURPRISE-03]
  * **Expected Standard**: Clicking `<label>` activates its associated input control via matching `for` attribute.
  * **Current Defect Behavior**: `<label for="file-input">` points to an ID that does not exist (`input` has `id="attachment"`). Clicking the label text does nothing.

---

### `TC-PERMIT-NEG-13`
* **Title**: Step 6 summary accordions fail to expand when clicking header titles or card rows
* **Feature Scope**: Step 6 Summary
* **Preconditions**: User is on Step 6 (*Summary*).
* **Steps**:
  1. Click directly on the text label: `page.getByText('Applicant Information')`.
  2. Click directly on the text label: `page.getByText('Owners')`.
  3. Click directly on the text label: `page.getByText('School Details')`.
* **Expected Result**:
  * [Planned Regression - Bug: SURPRISE-04]
  * **Expected Standard**: Clicking anywhere on the accordion header row or title expands/collapses the section.
  * **Current Defect Behavior**: Click listeners are attached exclusively to the SVG chevron icon (`.colbs-btn`). Clicking the title text or header container fails to expand the accordion.

---

### `TC-PERMIT-NEG-14`
* **Title**: Step 6 summary displays placeholder dashes (`__`) for Date of Birth and Address
* **Feature Scope**: Step 6 Summary
* **Preconditions**: User entered valid Date of Birth (`01/01/1985`) and Address (`Al Jurf, Ajman`) in Step 1, completed Steps 2–5, and landed on Step 6.
* **Steps**:
  1. Expand the Applicant Information accordion by clicking `.colbs-btn`.
  2. Inspect displayed values for `Date of Birth`, `Address`, `Emirates ID`, and `Phone`.
* **Expected Result**:
  * [Planned Regression - Bug: SURPRISE-05]
  * **Expected Standard**: Summary shows the exact values entered in Step 1 (`01/01/1985` and `Al Jurf, Ajman`).
  * **Current Defect Behavior**: Summary displays placeholder dashes (`__`) for Date of Birth and Address despite valid entry in Step 1.

---

### `TC-PERMIT-NEG-15`
* **Title**: Gateway FileService drops socket connection during concurrent file uploads
* **Feature Scope**: Step 3 School Details File Uploads
* **Preconditions**: User is on Step 3, School Details tab.
* **Steps**:
  1. Dispatch 3 simultaneous file uploads across `proposedLocationMap`, `proofOfLandOwnership`, and `feasibilityStudyOperationalPlan` without await delays.
  2. Monitor browser network activity and console logs.
* **Expected Result**:
  * [Planned Regression - Bug: SURPRISE-07]
  * **Expected Standard**: Gateway handles concurrent multi-part form file uploads gracefully.
  * **Current Defect Behavior**: The gateway drops connections with `net::ERR_NETWORK_CHANGED` or socket closures unless uploads are performed sequentially.

---

### `TC-PERMIT-NEG-16`
* **Title**: Unpaid invoice dollar action icon resets application wizard back to Step 1 instead of checkout
* **Feature Scope**: Invoices & Checkout Integration
* **Preconditions**: User submitted application, received invoice `INV-*-{id}`, and navigated to `/invoices`.
* **Steps**:
  1. Locate the unpaid permit invoice in `/invoices`.
  2. Click the dollar action icon: `page.locator('tbody tr:first-child .anticon-dollar')`.
  3. Observe target route and stepper state.
* **Expected Result**:
  * [Planned Regression - Bug: SURPRISE-11]
  * **Expected Standard**: Clicking Pay on an invoice should route directly to the payment checkout screen (`/checkout/{id}`).
  * **Current Defect Behavior**: Application reopens the entire wizard at `/services/initial-approval-school/{id}`, resetting the user back to Step 1 (at 96% completion rate) with blank Date of Birth.

---

## 3. Edge Test Cases

### `TC-PERMIT-EDGE-01`
* **Title**: Owner share percentage at boundary values 99% and 101% are rejected
* **Feature Scope**: Step 2 Share Percentage Boundaries
* **Preconditions**: User is on Step 2 with all other sub-tabs valid.
* **Steps**:
  1. In the Share Percentage sub-tab, enter `'99'` into `page.locator('control-selector#sharePercentage input, input#sharePercentage')`.
  2. Verify error banner persists and `Next` button remains disabled.
  3. Enter `'101'` into the share percentage input.
  4. Verify error persists and `Next` button remains disabled.
  5. Enter `'100'`.
* **Expected Result**:
  * Boundary values `99%` (100 - 1) and `101%` (100 + 1) are rejected.
  * Exact value `100%` is accepted, clearing the warning and enabling `Next`.

---

### `TC-PERMIT-EDGE-02`
* **Title**: Owner share percentage divided across multiple owners totals exactly 100%
* **Feature Scope**: Multi-Owner Share Allocation
* **Preconditions**: User is on Step 2, Owners Profiles.
* **Steps**:
  1. Add a second owner record by clicking the Add Owner button.
  2. For Owner 1, enter `'50'` in share percentage.
  3. For Owner 2, complete required personal details and enter `'50'` in share percentage.
  4. Inspect the collective share percentage validation state.
* **Expected Result**:
  * Total combined share percentage equals 100%.
  * The red share percentage error banner clears and `Next` becomes enabled.

---

### `TC-PERMIT-EDGE-03`
* **Title**: Uploading attachment at exact boundary limit of 3.0 MB is accepted while 3.01 MB is rejected
* **Feature Scope**: Step 5 File Size Boundaries
* **Preconditions**: User is on Step 5 (*Attachments*).
* **Steps**:
  1. Create test file `doc-3.00mb.pdf` (exactly 3,145,728 bytes) and upload to `input#attachment[type="file"]`.
  2. Verify upload succeeds and file is listed.
  3. Remove file and attempt uploading `doc-3.01mb.pdf` (3,156,213 bytes).
* **Expected Result**:
  * File at 3.00 MB boundary uploads successfully.
  * File exceeding 3.00 MB triggers client-side file size constraint error: *"Max file size is 3MB"*.

---

### `TC-PERMIT-EDGE-04`
* **Title**: Bilingual school name inputs accept special characters, numbers, and boundary lengths
* **Feature Scope**: Step 3 School Details Bilingual Data
* **Preconditions**: User is on Step 3, School Details tab.
* **Steps**:
  1. Enter English name with hyphens, numbers, and apostrophes: `"St. Mary's 21st-Century Academy - Ajman Branch"`.
  2. Enter Arabic name with proper Arabic diacritics and quotes: `"مدرسة القديسة مريم - فرع عجمان ٢٠٢٦"`.
  3. Switch tabs and return to verify string encoding.
* **Expected Result**:
  * Both English and Arabic strings are accepted without truncation, encoding corruption, or validation errors.

---

### `TC-PERMIT-EDGE-05`
* **Title**: "Save as Draft" persists partially completed wizard state across browser restart
* **Feature Scope**: Wizard Draft State Persistence
* **Preconditions**: User has filled Step 1 and partially completed Step 2.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Save as Draft' })`.
  2. Verify success toast or confirmation notification.
  3. Close browser context and reopen a new session authenticated as `apecouser@hotmail.com`.
  4. Navigate to `/services` and click the permit card.
  5. Select the saved draft in the modal and click `Resume`.
* **Expected Result**:
  * Wizard loads with previously entered Step 1 Date of Birth and Step 2 Owner details intact.

---

### `TC-PERMIT-EDGE-06`
* **Title**: Step navigation via "Previous" button preserves all populated form controls without data loss
* **Feature Scope**: Backward Wizard Navigation
* **Preconditions**: User has progressed to Step 3 (*School Information*).
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Previous' })` to return to Step 2.
  2. Verify all Step 2 owner details, passport numbers, and 100% share percentage remain populated.
  3. Click `page.getByRole('button', { name: 'Previous' })` to return to Step 1.
  4. Verify Step 1 Date of Birth and Address remain populated.
  5. Click `page.getByRole('button', { name: 'Next' })` twice to advance back to Step 3.
* **Expected Result**:
  * Navigating backward and forward through the stepper does not reset or erase previously validated form control values.
