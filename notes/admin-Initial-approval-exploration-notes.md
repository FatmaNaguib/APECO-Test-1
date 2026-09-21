# Admin Exploration Notes: Initial Application Approval

## Admin Initial application - Submission for a Private School Permit- APECO Employee Review-1

### Flows

1. **Super Admin Authentication & Request Access**:
   1. Navigate to the Admin Portal login endpoint: `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/login`.
   2. By default, the interface loads in Arabic RTL. Click the language toggle button **"English"** (`button:has-text("English")`) in the top bar.
   3. In the **Email** field, type the super admin email: `admin.qc@hotmail.com`.
   4. In the **Password** field, type the admin password: `Adm1n#tro3eh`.
   5. Click **"Login"** (`button:has-text("Login")`).
   6. Upon successful authentication, the system lands on `/agent-queue`.
   7. Navigate directly to the target request review URL: `/requests/request-details/14682` (or locate Request ID `IDINAPSUFOPRSCPE14682` from the Agent Queue grid and click its link).

2. **Step 1: Application Information Review Flow**:
   1. On `/requests/request-details/14682`, verify the header displays **"Request Details"** and **"Applicant: Anas Mohamed"**.
   2. Inspect Tab 1 (**Applicant Information**):
      * Verify disabled fields: First Name EN (`Anas`), First Name AR (`انس`), Last Name EN (`Mohamed`), Last Name AR (`محمد`), and Date of Birth (`1985-01-01`).
   3. Click Tab 2 (**Contact Information**) (`[role="tab"]:has-text("Contact Information")`).
      * Verify disabled fields: Email (`apecouser@hotmail.com`) and Address (`Al Jurf, Ajman`).
   4. Click the primary **"Next"** button (`button.next-btn`) to advance to Step 2.

3. **Step 2: Owners Profiles Review Flow**:
   1. Verify the active stepper updates to **"2 Owners Profiles"**.
   2. Review the 15 owner sub-sections across the horizontal tab list (`Personal Details`, `Passport Details`, `Residence Details`, `Qualifying`, `Marital Status Data`, `Father/Mother Data`, `Housing Data`, etc.).
   3. On **Personal Details**:
      * Verify Type of Owner (`Individual`), Full Name (`Anas Mohamed`), Family Name (`Mohamed`), Nationality (`Australia`), Religion (`Muslim`).
      * Verify disabled file cards for Photograph (`sample-photo.png`) and Good Conduct Certificate (`sample-photo.png`).
   4. On **Passport Details**:
      * Verify Passport Number (`N1234567`), Place of Issue (`Sydney`), Issue Date (`01/01/2020`), Expiry Date (`01/01/2030`).
   5. Verify Share Percentage tab displays `100%`.
   6. Click **"Next"** (`button.next-btn`) to advance to Step 3.

4. **Step 3: School Information & Curriculum Review Flow**:
   1. Verify the active stepper updates to **"3 School Information"**.
   2. On Tab 1 (**School Details**):
      * Verify English School Name (`Modern Future School 40178`) and Arabic School Name (`مدرسة المستقبل الحديثة 40178`).
      * Verify Educational Consultant (`Future Edu Consultancy`).
      * Verify Location Block EN (`Block 12`) and AR (`قطعة 12`).
      * Verify Land Area (`15000` sqm), Building Area (`8500` sqm), Indoor Court (`2000` sqm), and Outdoor Canopy (`1500` sqm).
      * Verify Applicant Relation (`Owner`) and Applicant Phone (`0501234567`).
   3. Click Tab 2 (**Curriculum**) (`.ant-tabs-tab:has-text("Curriculum")`).
      * Observe the nested accordion structure titled **"Curriculum 1"**.
      * Click the first chevron icon (`.group-header button.ant-btn-icon-only >> nth=0`) to expand `Curriculum 1`.
      * Verify Curriculum name is `British`.
      * Click the second chevron icon (`.group-header button.ant-btn-icon-only >> nth=1`) to expand `Stages 1`.
      * Verify Stage (`Pre-Kindergarten`), Grade (`FS 1`), Student Capacity (`100`), and Classrooms (`4`).
   4. Click **"Next"** (`button.next-btn`) to advance to Step 4.

5. **Step 4: Attachments Review Flow**:
   1. Verify the active stepper updates to **"4 Attachments"**.
   2. Locate the document card titled **"Introduction Documents after signature"**.
   3. Verify the attached signed file card is displayed in read-only state (`sample-photo.png` with `.file-label.disabled`).
   4. Click **"Next"** (`button.next-btn`) to advance to Step 5.

6. **Step 5: Summary Review Flow**:
   1. Verify the active stepper updates to **"5 Summary"**.
   2. Observe the 3 collapsible summary accordion sections:
      * **Applicant Information**
      * **Owners**
      * **School Details**
   3. Click the chevron button (`.colbs-btn >> nth=0`) on **Applicant Information**:
      * Verify Full Name EN (`Anas Mohamed`), AR (`انس محمد`), Date of Birth (`1/1/1985`), and Email (`apecouser@hotmail.com`).
   4. Click the chevron button (`.colbs-btn >> nth=1`) on **Owners**:
      * Verify Type of Owner (`Individual`), Full Name (`Anas Mohamed`), Passport Number (`N1234567`), and Passport Expiry (`1/1/2030`).
   5. Click the chevron button (`.colbs-btn >> nth=2`) on **School Details**:
      * Verify School Names (EN/AR), Location Block (EN/AR), and Curriculum (`British`).
   6. Observe that the bottom navigation only displays the **"Previous"** button (`button.prev-btn`); the final review decisions are located at the top of the page.

7. **Workflow Actions Review Flow (Approve, Return, Reject)**:
   1. Review the current status in the workflow card:
      * **Step 1: Pending** — `APECO Employee Review`.
      * **Step 2: Upcoming** — `Technical Engineer Review`.
      * **Step 3: Upcoming** — `Accepted`.
   2. **Approve Action**:
      * Click **"Approve"** (`button:has-text("Approve")`).
      * Verify modal dialog titled **"Approve by APECO Employee"** opens (`div.modal.show`).
      * Observe required field: `Comments *` (textarea with placeholder *"Type description"*).
      * Observe required field: `Upload Files *` (**mandatory upload**, max 10MB).
      * Verify the **"Save"** button is disabled until both valid comments and an uploaded file are provided.
      * Click **"Back"** (`div.modal.show button:has-text("Back")`) to dismiss.
   3. **Return Action**:
      * Click **"Return"** (`button:has-text("Return")`).
      * Verify modal dialog titled **"Return for Correction by APECO Employee"** opens.
      * Observe required field: `Return reasons *` (dropdown select).
      * Observe optional fields: `Comments` and `Upload Files`.
      * Verify the **"Save"** button is disabled until a return reason is selected.
      * Click **"Back"** to dismiss.
   4. **Reject Action**:
      * Click **"Reject"** (`button:has-text("Reject")`).
      * Verify modal dialog titled **"Reject by APECO Employee"** opens.
      * Observe required field: `Rejection reasons *` (dropdown select).
      * Observe optional fields: `Comments` and `Upload Files`.
      * Verify the **"Save"** button is disabled until a rejection reason is selected.
      * Click **"Back"** to dismiss.
   5. Click the top **"Back"** button (`button.new-back-btn`) to return cleanly to the Agent Queue.

---

### Selectors

#### 1. Authentication & Page Header
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Language Switch (English)** | `page.getByRole('button', { name: 'English' })` | `page.locator('button:has-text("English")')` |
| **Email Field** | `page.getByPlaceholder('Type email address')` | `page.locator('input[placeholder*="email" i]')` |
| **Password Field** | `page.getByPlaceholder('Type password')` | `page.locator('input[type="password"]')` |
| **Login Button** | `page.getByRole('button', { name: 'Login' })` | `page.locator('button:has-text("Login")')` |
| **Page Back Button** | `page.locator('button.new-back-btn')` | `page.getByRole('button', { name: ' Back' })` |
| **Page Header Title** | `page.locator('.module-title')` | `page.locator('text=Request Details')` |
| **Applicant Title** | `page.getByRole('heading', { level: 1 })` | `page.locator('h1.subtitle')` |

#### 2. Workflow Status & Action Buttons
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Workflow Card Container** | `page.locator('workflow-action-options')` | `page.locator('.status')` |
| **Workflow Step 1 (Pending)** | `page.locator('workflow-action-options').getByText('Step 1').locator('..')` | `page.locator('.status:has-text("APECO Employee Review")')` |
| **Approve Action Button** | `page.getByRole('button', { name: 'Approve', exact: true })` | `page.locator('button.btn-primary:has-text("Approve")')` |
| **Return Action Button** | `page.getByRole('button', { name: 'Return', exact: true })` | `page.locator('button.btn-warning:has-text("Return")')` |
| **Reject Action Button** | `page.getByRole('button', { name: 'Reject', exact: true })` | `page.locator('button.btn-danger:has-text("Reject")')` |

#### 3. Review Wizard Stepper & Navigation
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Active Stepper Item** | `page.locator('nz-step.ant-steps-item-process, nz-step.ant-steps-item-active')` | `page.locator('.ant-steps-item-active')` |
| **Step 1: Application Info** | `page.locator('nz-step').filter({ hasText: 'Application Information' })` | `page.locator('nz-step').nth(0)` |
| **Step 2: Owners Profiles** | `page.locator('nz-step').filter({ hasText: 'Owners Profiles' })` | `page.locator('nz-step').nth(1)` |
| **Step 3: School Info** | `page.locator('nz-step').filter({ hasText: 'School Information' })` | `page.locator('nz-step').nth(2)` |
| **Step 4: Attachments** | `page.locator('nz-step').filter({ hasText: 'Attachments' })` | `page.locator('nz-step').nth(3)` |
| **Step 5: Summary** | `page.locator('nz-step').filter({ hasText: 'Summary' })` | `page.locator('nz-step').nth(4)` |
| **Wizard Next Button** | `page.locator('button.next-btn')` | `page.getByRole('button', { name: 'Next' })` |
| **Wizard Previous Button** | `page.locator('button.prev-btn')` | `page.getByRole('button', { name: 'Previous' })` |

#### 4. Step 1: Application Information
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Tab: Applicant Information** | `page.getByRole('tab', { name: 'Applicant Information' })` | `page.locator('.ant-tabs-tab:has-text("Applicant Information")')` |
| **Tab: Contact Information** | `page.getByRole('tab', { name: 'Contact Information' })` | `page.locator('.ant-tabs-tab:has-text("Contact Information")')` |
| **First Name EN (Disabled)** | `page.getByRole('textbox', { name: 'First Name (in English)' })` | `page.locator('input[placeholder*="First Name (in English)"]')` |
| **First Name AR (Disabled)** | `page.getByRole('textbox', { name: 'First Name (in Arabic)' })` | `page.locator('input[placeholder*="First Name (in Arabic)"]')` |
| **Last Name EN (Disabled)** | `page.getByRole('textbox', { name: 'Last Name (in English)' })` | `page.locator('input[placeholder*="Last Name (in English)"]')` |
| **Last Name AR (Disabled)** | `page.getByRole('textbox', { name: 'Last Name (in Arabic)' })` | `page.locator('input[placeholder*="Last Name (in Arabic)"]')` |
| **Date of Birth (Disabled)** | `page.getByRole('textbox', { name: 'Date of Birth' })` | `page.locator('input[placeholder*="Date of Birth"]')` |
| **Contact Email (Disabled)** | `page.getByRole('textbox', { name: 'Email' })` | `page.locator('input[placeholder*="Email"]')` |
| **Contact Address (Disabled)** | `page.getByRole('textbox', { name: 'Address' })` | `page.locator('input[placeholder*="Address"]')` |

#### 5. Step 2: Owners Profiles
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Sub-Tab: Personal Details** | `page.getByRole('tab', { name: 'Personal Details' })` | `page.locator('.ant-tabs-tab:has-text("Personal Details")')` |
| **Sub-Tab: Passport Details** | `page.getByRole('tab', { name: 'Passport Details' })` | `page.locator('.ant-tabs-tab:has-text("Passport Details")')` |
| **Owner Full Name Input** | `page.getByRole('textbox', { name: 'Full Name' })` | `page.locator('input[placeholder="Full Name"]')` |
| **Owner Photo Card (Disabled)** | `page.locator('.custom-file-upload').filter({ hasText: 'Photograph' })` | `page.locator('input[placeholder="Photograph"]')` |
| **Good Conduct Card (Disabled)**| `page.locator('.custom-file-upload').filter({ hasText: 'Criminal Status' })` | `page.locator('input[placeholder*="Criminal Status"]')` |
| **Passport Number Input** | `page.getByRole('textbox', { name: 'Passport Number' })` | `page.locator('input[placeholder="Passport Number"]')` |
| **Share Percentage Input** | `page.locator('input#sharePercentage, input[placeholder*="share" i]')` | `page.locator('control-selector#sharePercentage input')` |

#### 6. Step 3: School Information & Curriculum
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Tab: School Details** | `page.getByRole('tab', { name: 'School Details' })` | `page.locator('.ant-tabs-tab:has-text("School Details")')` |
| **Tab: Curriculum** | `page.getByRole('tab', { name: 'Curriculum' })` | `page.locator('.ant-tabs-tab:has-text("Curriculum")')` |
| **School Name EN Input** | `page.getByRole('textbox', { name: 'English School Name' })` | `page.locator('input[placeholder="English School Name"]')` |
| **School Name AR Input** | `page.getByRole('textbox', { name: 'Arabic School Name' })` | `page.locator('input[placeholder="Arabic School Name"]')` |
| **Educational Consultant Input** | `page.getByRole('textbox', { name: 'Consultant' })` | `page.locator('input[placeholder="Consultant"]')` |
| **Curriculum 1 Accordion Toggle**| `page.locator('.group-header button.ant-btn-icon-only').first()` | `page.locator('#curricula .group-header button')` |
| **Stages 1 Accordion Toggle** | `page.locator('.group-header button.ant-btn-icon-only').nth(1)` | `page.locator('#stages .group-header button')` |

#### 7. Step 4: Attachments
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Document Label** | `page.getByText('Introduction Documents after signature')` | `page.locator('.attachments-form label')` |
| **Uploaded File Card (Disabled)** | `page.locator('.file-label.disabled')` | `page.locator('.custom-file-upload .file-name')` |
| **Uploaded File Name Text** | `page.locator('.file-name')` | `page.locator('.file-label .file-name')` |

#### 8. Step 5: Summary Accordions
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Applicant Info Chevron Toggle**| `page.locator('.colbs-btn').first()` | `page.locator('div:has(> .title:has-text("Applicant Information")) .colbs-btn')` |
| **Owners Chevron Toggle** | `page.locator('.colbs-btn').nth(1)` | `page.locator('div:has(> .title:has-text("Owners")) .colbs-btn')` |
| **School Details Chevron Toggle**| `page.locator('.colbs-btn').nth(2)` | `page.locator('div:has(> .title:has-text("School Details")) .colbs-btn')` |

#### 9. Action Modal Controls (Approve, Return, Reject)
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Active Modal Container** | `page.locator('div.modal.show')` | `page.locator('[id*="workflow-action-model"].show')` |
| **Modal Title** | `page.locator('div.modal.show .modal-title, div.modal.show h5, div.modal.show .title')` | `page.locator('div.modal.show').getByRole('heading')` |
| **Approve: Comments Field** | `page.locator('div.modal.show').getByPlaceholder('Type description')` | `page.locator('div.modal.show textarea')` |
| **Approve: Upload Files Input** | `page.locator('div.modal.show input[type="file"]')` | `page.locator('div.modal.show .custom-file-upload input')` |
| **Return: Reasons Dropdown** | `page.locator('div.modal.show nz-select, div.modal.show select').first()` | `page.locator('div.modal.show [placeholder*="reason" i]')` |
| **Reject: Reasons Dropdown** | `page.locator('div.modal.show nz-select, div.modal.show select').first()` | `page.locator('div.modal.show [placeholder*="reason" i]')` |
| **Modal Save Button** | `page.locator('div.modal.show button:has-text("Save")')` | `page.locator('div.modal.show button.btn-main')` |
| **Modal Back Button** | `page.locator('div.modal.show button:has-text("Back")')` | `page.locator('div.modal.show button.btn-dark')` |

---

### Surprises

1. **Mandatory File Upload on Approve Action**:
   * **What I Did**: Clicked the primary `Approve` button to inspect the employee review submission modal.
   * **What I Expected**: The employee approval action would only require an approval comment (or confirmation click).
   * **What Actually Happened**: The `Approve by APECO Employee` modal requires **BOTH** mandatory `Comments *` AND a mandatory file attachment (`Upload Files *`). The `Save` button remains strictly disabled (`disabled="true"`) until a valid document (image/pdf/word/excel, max 10MB) is attached.

2. **Nested Multi-Level Accordions for Curriculum Review**:
   * **What I Did**: Switched to the `Curriculum` tab on Step 3 to review the school's approved educational stages.
   * **What I Expected**: The curriculum, stage, capacity, and classroom specifications to be presented in a clean, flat table (matching the applicant submission interface).
   * **What Actually Happened**: The data was hidden inside multiple nested, collapsed accordions (`Curriculum 1` > `Stages 1`). Automated tests must click two separate chevron icons (`.group-header button.ant-btn-icon-only`) sequentially to reveal and assert the Stage and Grade values.

3. **Placeholder Dashes for Contact Address in Step 5 Summary**:
   * **What I Did**: Expanded the `Applicant Information` summary accordion on Step 5.
   * **What I Expected**: The `Address` line to display the contact address entered during Step 1 (`Al Jurf, Ajman`).
   * **What Actually Happened**: The `Address` line rendered placeholder dashes (`__`), while `Date of Birth` rendered as `1/1/1985`. This matches the data-binding bug previously observed in the applicant portal summary.

4. **Different Wizard Step Progression (5 Steps vs 6 Steps)**:
   * **What I Did**: Inspected the overall stepper on the right side of the request details review page.
   * **What I Expected**: The stepper to contain the 6 numbered steps corresponding to the applicant submission wizard.
   * **What Actually Happened**: The Admin Review stepper consolidates the wizard into 5 review steps (`1 Application Information`, `2 Owners Profiles`, `3 School Information`, `4 Attachments`, `5 Summary`). Step 4 from the applicant wizard ("Download Documents") is intentionally omitted from the employee review flow.

5. **Strict Mode Locator Collisions on Common Buttons**:
   * **What I Did**: Clicked `page.locator('button:has-text("Back")')` to return to the Agent Queue.
   * **What I Expected**: Playwright to click the top-left navigation back button.
   * **What Actually Happened**: Playwright threw a strict mode violation resolving to 4 elements because hidden modal templates (`#confirm-action`, `#workflow-popup`, etc.) are pre-rendered in the DOM with identical button text. Automated scripts must strictly scope locators to `button.new-back-btn` or modal containers (`div.modal.show button`).
