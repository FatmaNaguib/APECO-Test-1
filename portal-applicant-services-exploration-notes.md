# Applicant Services Exploration Notes

## Initial application - Submission for a Private School Permit

### Flows

1. **Service Selection & Draft Request Interception Flow**:
   1. Log in with valid applicant credentials (`apecouser@hotmail.com` / `P0rtal#Cqnyp`).
   2. Navigate to the Services catalog at `/services`.
   3. Locate and click on the service card titled **"Initial application - Submission for a Private School Permit"** (`الطلب المبدئي - التقديم لتصريح مدرسة خاصة`).
   4. If an in-progress draft exists, an interception modal (`<app-choose-draft-requests>`) displays. Click **"New Request"** to begin a clean application, or select a draft and click **"Resume"**.
   5. Browser navigates to the application wizard at `/services/initial-approval-school`.

2. **Step 1: Application Information Flow**:
   1. On tab 1 (**Applicant Information**), verify pre-filled profile fields (First/Last Names in English and Arabic, Email).
   2. Locate the **Date of Birth** input and select or enter a valid date (e.g., `01/01/1985`).
   3. Switch to tab 2 (**Contact Information**).
   4. Locate the **Address** input and enter a valid address (e.g., `Al Jurf, Ajman`).
   5. Click **"Next"** to advance to Step 2.

3. **Step 2: Owners Profiles Data Flow**:
   1. On the Owners tab, review the default Owner 1 record (*Anas Mohamed*).
   2. Progress through and satisfy all 6 sub-sections:
      * **Personal Details**: Confirm Owner Type (`Individual`), confirm Full Name / Family Name, select Nationality (`Australia`), Religion (`Muslim`), enter Mother's Name (`Fatima`), and upload required files (Personal Photo, Certificate of Good Conduct).
      * **Passport Details**: Enter Passport Number (`N1234567`), Place of Issue (`Sydney`), Issue Date (`01/01/2020`), Expiry Date (`01/01/2030`), and upload Passport copy.
      * **Qualifying**: Select Degree (`Bachelor's Degree`), Specialization (`Education`), University (`University of Sydney`), Country (`Australia`), and enter Graduation Year (`2010`).
      * **Marital Status Data**: Select Marital Status (`Single`).
      * **Father/Mother Data**: Enter Father Name (`Mohamed`) and Mother Name (`Fatima`).
      * **Housing Data**: Enter Region (`Al Jurf`), Street (`Al Ittihad St`), Mobile Number (`+971501234567`), and PO Box (`1234`).
      * **Share Percentage**: Enter `100`% to satisfy the total share ownership rule.
   3. Verify all sub-tabs display green checkmarks (`Completed`) and the red share percentage alert banner disappears.
   4. Click **"Next"** to advance to Step 3 (completion rate updates to ~53%).

4. **Step 3: School Information Flow**:
   1. On sub-tab 1 (**School Details**), enter required school configuration:
      * Request Type (`New School Permit`).
      * School Name in English (`Modern Future Private School`) and Arabic (`مدرسة المستقبل الحديثة الخاصة`).
      * Educational Consultant (`Future Edu Consultancy`).
      * Address (`Al Jurf 2, Ajman`).
      * Student Gender (`Co-educational (Mixed)`).
      * Proposed School Location Block in English (`Block 12`) and Arabic (`قطعة 12`).
      * Land Ownership (`Private Property`) and Total Land Area (`15000` sqm).
      * Building Ownership (`Private Property`) and Total Building Area (`8500` sqm).
      * Applicant Relation (`Owner / Authorized Signatory`) and Phone (`0501234567`).
      * Sequentially upload the 3 required documents: *Proposed Location Map*, *Proof of Ownership / Lease Agreement*, *Feasibility Study / Operational Plan*.
   2. Switch to sub-tab 2 (**Curriculum**):
      * Select Curriculum (`British`).
      * Select Educational Stage (`Kindergarten`) and Grade (`FS 2`).
      * Enter Student Capacity (`100`) and Classrooms (`4`).
      * Click **"Add"** to append the grade entry to the curriculum table.
   3. Click **"Next"** to advance to Step 4 (completion rate updates to ~98%).

5. **Step 4: Download Documents Flow**:
   1. An informational modal appears stating that documents are prepared for download and signature.
   2. Click the modal confirmation button (**"Okay"** / dismiss).
   3. Review the generated document card for applicant *Anas Mohamed* (`Introduction Documents after signature`) with the PDF download link.
   4. Click **"Next"** to advance to Step 5.

6. **Step 5: Attachments Flow**:
   1. Locate the file upload control under **"Introduction Documents after signature \*"**.
   2. Attach the signed introduction document (`.pdf` or image file, max 3MB).
   3. Verify the uploaded file card renders with filename, size, download icon, and remove icon (`X`).
   4. Verify the stepper Completion Rate indicator reaches **100%**.
   5. Click **"Next"** to advance to Step 6.

7. **Step 6: Summary & Submission Flow**:
   1. On the Summary screen, review the 3 collapsible sections: **Applicant Information**, **Owners**, and **School Details**.
   2. Click the chevron toggle icon (`.colbs-btn`) on each accordion to expand and verify submitted information.
   3. Check the declaration checkbox: **"Acknowledge the correctness of all provided data"**.
   4. Verify the primary **"Pay"** button becomes active and enabled.
   5. Click **"Pay"** to validate and submit the application.

8. **Step 7: Checkout & Post-Submission Confirmation Flow**:
   1. The system calls `POST /Requests/ValidateRequest/` and `GET /Payments/GetServiceQuotation?requestId={id}`.
   2. Application generates a unique Request ID (e.g. `IDINAPSUFOPRSCPE14657`) and an official invoice (e.g. `INV-20260916162529-14657` for `700.00 AED`).
   3. Browser automatically routes to `/checkout/{id}`.
   4. Verify invoice summary displays correct details:
      * Amount Payable: `700.00 AED` (VAT `0%`)
      * Options available: **"Download Invoice"**, **"Request Details"**, **"Pay Later"**, **"Pay Now"**.
   5. Navigate to `/requests`; verify the application is listed with its generated Request ID and current status.
   6. Navigate to `/invoices`; verify the unpaid invoice is listed with status `Unpaid`.

---

### Selectors

#### 1. Navigation & Catalog Entry
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Service Card** | `page.locator('.service-card').filter({ hasText: 'Initial application - Submission for a Private School Permit' })` | `page.locator('.service-card[ng-reflect-router-link="initial-approval-school"]')` |
| **Draft Modal Dialog** | `page.locator('nz-modal-container app-choose-draft-requests')` | `page.locator('.draft-request-dialog')` |
| **Draft "New Request" Button** | `page.locator('app-choose-draft-requests').getByRole('button', { name: 'New Request' })` | `page.getByRole('button', { name: 'New Request' })` |
| **Draft "Resume" Button** | `page.locator('app-choose-draft-requests').getByRole('button', { name: 'Resume' })` | `page.getByRole('button', { name: 'Resume' })` |
| **Draft Dropdown Selector** | `page.locator('app-choose-draft-requests nz-select')` | `page.getByPlaceholder('Select Draft')` |
| **Draft Modal Cancel** | `page.locator('.ant-modal-footer').getByRole('button', { name: 'Cancel' })` | `page.locator('.ant-modal-close')` |

#### 2. Stepper & Global Wizard Controls
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Service Header Title** | `page.getByRole('heading', { name: 'Initial application - Submission for a Private School Permit' })` | `page.locator('.site-page-header')` |
| **Completion Rate Display** | `page.locator('.completion-rate, app-completion-rate')` | `page.getByText('Completion Rate').locator('..')` |
| **Next Step Button** | `page.getByRole('button', { name: 'Next' })` | `page.locator('button.next-btn, button:has-text("Next")')` |
| **Previous Step Button** | `page.getByRole('button', { name: 'Previous' })` | `page.locator('button.prev-btn, button:has-text("Previous")')` |
| **Save as Draft Button** | `page.getByRole('button', { name: 'Save as Draft' })` | `page.locator('button:has-text("Save as Draft")')` |
| **Active Stepper Step** | `page.locator('.ant-steps-item-active, .stepper-item.active')` | `page.locator('nz-steps .ant-steps-item-process')` |

#### 3. Step 1: Application Information
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Applicant Info Sub-tab** | `page.getByRole('tab', { name: 'Applicant Information' })` | `page.locator('.ant-tabs-tab:has-text("Applicant Information")')` |
| **Contact Info Sub-tab** | `page.getByRole('tab', { name: 'Contact Information' })` | `page.locator('.ant-tabs-tab:has-text("Contact Information")')` |
| **First Name (EN)** *(disabled)* | `page.getByLabel('First Name (in English)')` | `page.locator('control-selector#firstNameEn input')` |
| **First Name (AR)** *(disabled)* | `page.getByLabel('First Name (in Arabic)')` | `page.locator('control-selector#firstNameAr input')` |
| **Last Name (EN)** *(disabled)* | `page.getByLabel('Last Name (in English)')` | `page.locator('control-selector#lastNameEn input')` |
| **Last Name (AR)** *(disabled)* | `page.getByLabel('Last Name (in Arabic)')` | `page.locator('control-selector#lastNameAr input')` |
| **Date of Birth Input** | `page.getByPlaceholder('Date of Birth')` | `page.locator('control-selector#birthDate input, nz-date-picker input')` |
| **Emirates ID Input** | `page.getByPlaceholder('Emirates ID')` | `page.locator('control-selector#emiratesId input')` |
| **Email Field** *(disabled)* | `page.getByPlaceholder('Email')` | `page.locator('control-selector#email input')` |
| **Address Input** | `page.getByPlaceholder('Address')` | `page.locator('control-selector#address input')` |

#### 4. Step 2: Owners Profiles Data
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Share Percentage Warning** | `page.getByText('Invalid share percentage for owners. The value should be 100%.')` | `page.locator('.ant-alert-error, .border-danger')` |
| **Owner Sub-tab: Personal Details** | `page.locator('.ant-tabs-tab').filter({ hasText: 'Personal Details' })` | `page.getByRole('tab', { name: /Personal Details/i })` |
| **Owner Sub-tab: Passport Details**| `page.locator('.ant-tabs-tab').filter({ hasText: 'Passport Details' })` | `page.getByRole('tab', { name: /Passport Details/i })` |
| **Owner Sub-tab: Qualifying** | `page.locator('.ant-tabs-tab').filter({ hasText: 'Qualifying' })` | `page.getByRole('tab', { name: /Qualifying/i })` |
| **Owner Sub-tab: Marital Status** | `page.locator('.ant-tabs-tab').filter({ hasText: 'Marital Status Data' })` | `page.getByRole('tab', { name: /Marital Status/i })` |
| **Owner Sub-tab: Father/Mother** | `page.locator('.ant-tabs-tab').filter({ hasText: 'Father/Mother Data' })` | `page.getByRole('tab', { name: /Father\/Mother/i })` |
| **Owner Sub-tab: Housing Data** | `page.locator('.ant-tabs-tab').filter({ hasText: 'Housing Data' })` | `page.getByRole('tab', { name: /Housing Data/i })` |
| **Owner Sub-tab: Share Percentage**| `page.locator('.ant-tabs-tab').filter({ hasText: /Share Perc/i })` | `page.locator('.ant-tabs-tab:has-text("Share Percnetage")')` |
| **Owner Type Dropdown** | `page.locator('control-selector#ownerType nz-select')` | `page.getByLabel('Type of Owner')` |
| **Religion Dropdown** | `page.locator('control-selector#religion nz-select')` | `page.getByLabel('Religion')` |
| **Current Nationality** | `page.locator('control-selector#currentNationality nz-select')` | `page.getByLabel('Current Nationality')` |
| **Personal Photo Upload** | `page.locator('control-selector#personalPhoto input[type="file"]')` | `page.locator('file-input#personalPhoto input')` |
| **Good Conduct Certificate Upload**| `page.locator('control-selector#certificateGoodConduct input[type="file"]')` | `page.locator('file-input#certificateGoodConduct input')` |
| **Passport Number Input** | `page.locator('control-selector#passportNumber input')` | `page.getByLabel('Passport Number')` |
| **Passport Place of Issue** | `page.locator('control-selector#placeOfIssue input')` | `page.getByLabel('Passport Place of Issue')` |
| **Passport Document Upload** | `page.locator('control-selector#passport input[type="file"]')` | `page.locator('file-input#passport input')` |
| **Qualification Dropdown** | `page.locator('control-selector#academicQualification nz-select')` | `page.getByLabel('Educational Qualification')` |
| **Specialization Input** | `page.locator('control-selector#specialization input')` | `page.getByLabel('Specialization')` |
| **University Input** | `page.locator('control-selector#university input')` | `page.getByLabel('University')` |
| **Graduation Year Input** | `page.locator('control-selector#graduationYear input')` | `page.getByLabel('Graduation Year')` |
| **Marital Status Dropdown** | `page.locator('control-selector#maritalStatus nz-select')` | `page.getByLabel('Marital Status')` |
| **Mother Name Input** | `page.locator('control-selector#motherName input')` | `page.getByLabel('Mother Name')` |
| **Father Name Input** | `page.locator('control-selector#fatherName input')` | `page.getByLabel('Father Name')` |
| **Mobile Number Input** | `page.locator('control-selector#mobile input')` | `page.getByLabel('Mobile Number')` |
| **PO Box Input** | `page.locator('control-selector#poBox input')` | `page.getByLabel('P.O. Box')` |
| **Share Percentage Input** | `page.locator('control-selector#sharePercentage input, input#sharePercentage')` | `page.getByLabel(/Share/i)` |

#### 5. Step 3: School Information
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **School Details Sub-tab** | `page.getByRole('tab', { name: 'School Details' })` | `page.locator('.ant-tabs-tab:has-text("School Details")')` |
| **Curriculum Sub-tab** | `page.getByRole('tab', { name: 'Curriculum' })` | `page.locator('.ant-tabs-tab:has-text("Curriculum")')` |
| **Request Type Dropdown** | `page.locator('control-selector#requestType nz-select')` | `page.getByLabel('Request Type')` |
| **School Name (EN)** | `page.locator('control-selector#schoolNameEn input, control-selector#schooleNameEn input')` | `page.getByLabel('School Name (English)')` |
| **School Name (AR)** | `page.locator('control-selector#schoolNameAr input, control-selector#schooleNameAr input')` | `page.getByLabel('School Name (Arabic)')` |
| **Educational Consultant** | `page.locator('control-selector#educationalConsultant input')` | `page.getByLabel('Educational Consultant')` |
| **Student Gender Dropdown** | `page.locator('control-selector#studentGender nz-select')` | `page.getByLabel('Student Gender')` |
| **Location Block (EN)** | `page.locator('control-selector#locationNoEn input')` | `page.getByLabel('Proposed School Location Block (English)')` |
| **Location Block (AR)** | `page.locator('control-selector#locationNoAr input')` | `page.getByLabel('Proposed School Location Block (Arabic)')` |
| **Land Ownership Dropdown** | `page.locator('control-selector#landOwnership nz-select')` | `page.getByLabel('Land Ownership')` |
| **Total Land Area Input** | `page.locator('control-selector#totalLandArea input')` | `page.getByLabel('Total Land Area')` |
| **Building Ownership Dropdown**| `page.locator('control-selector#buildingOwnership nz-select')` | `page.getByLabel('Building Ownership')` |
| **Total Building Area Input** | `page.locator('control-selector#totalBuildingArea input')` | `page.getByLabel('Total Building Area')` |
| **Applicant Relation Dropdown**| `page.locator('control-selector#applicantRelation nz-select')` | `page.getByLabel('Applicant Relation')` |
| **Proposed Location Map Upload**| `page.locator('control-selector#proposedLocationMap input[type="file"]')` | `page.locator('file-input#proposedLocationMap input')` |
| **Proof of Ownership Upload** | `page.locator('control-selector#proofOfLandOwnership input[type="file"]')` | `page.locator('file-input#proofOfLandOwnership input')` |
| **Feasibility Study Upload** | `page.locator('control-selector#feasibilityStudyOperationalPlan input[type="file"]')` | `page.locator('file-input#feasibilityStudyOperationalPlan input')` |
| **Curriculum Type Dropdown** | `page.locator('control-selector#curriculum nz-select')` | `page.getByLabel('Curriculum')` |
| **Educational Stage Dropdown** | `page.locator('control-selector#stage nz-select')` | `page.getByLabel('Educational Stage')` |
| **Grade Dropdown** | `page.locator('control-selector#grade nz-select')` | `page.getByLabel('Grade')` |
| **Student Capacity Input** | `page.locator('control-selector#capacity input')` | `page.getByLabel('Student Capacity')` |
| **Classrooms Input** | `page.locator('control-selector#classrooms input')` | `page.getByLabel('Number of Classrooms')` |
| **Add Grade / Curriculum Button**| `page.locator('app-curriculum').getByRole('button', { name: 'Add' })` | `page.locator('button.add-btn:has-text("Add")')` |

#### 6. Step 4 & Step 5: Documents & Attachments
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Download Notice Modal "Okay"**| `page.locator('.ant-modal-footer').getByRole('button', { name: 'Okay' })` | `page.getByRole('button', { name: 'Okay' })` |
| **Generated Document Download Link**| `page.locator('.document-card a[download], .document-card .anticon-download')` | `page.locator('a[href*="data:application/pdf"]')` |
| **Step 5 Attachment Input** | `page.locator('input#attachment[type="file"]')` | `page.locator('file-input#attachment input[type="file"]')` |
| **Add Attachment Row Button** | `page.locator('.attachments-form').getByRole('button', { name: 'Add' })` | `page.locator('button.add-btn:has-text("Add")')` |
| **Uploaded File Item Card** | `page.locator('.file-label, .uploaded-file-item')` | `page.locator('nz-input-group:has(.choose-file-btn)')` |
| **Remove Uploaded Attachment** | `page.locator('.anticon-close, button.remove-file')` | `page.locator('.ant-input-suffix .anticon-close')` |

#### 7. Step 6: Summary & Payment Submission
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Applicant Info Collapse Icon**| `page.locator('inital-approval-summary .section:has-text("Applicant Information") .colbs-btn')` | `page.locator('.colbs-btn').nth(0)` |
| **Owners Collapse Icon** | `page.locator('inital-approval-summary .section:has-text("Owners") .colbs-btn')` | `page.locator('.colbs-btn').nth(1)` |
| **School Details Collapse Icon**| `page.locator('inital-approval-summary .section:has-text("School Details") .colbs-btn')` | `page.locator('.colbs-btn').nth(2)` |
| **Acknowledgment Checkbox** | `page.getByLabel('Acknowledge the correctness of all provided data')` | `page.locator('label.ant-checkbox-wrapper:has-text("Acknowledge")')` |
| **Pay / Submit Button** | `page.getByRole('button', { name: 'Pay' })` | `page.locator('button.ant-btn-primary:has-text("Pay")')` |

#### 8. Checkout / Invoice Confirmation
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Checkout Title** | `page.getByRole('heading', { name: 'Payment' })` | `page.locator('h1:has-text("Payment")')` |
| **Download Invoice Button** | `page.getByRole('button', { name: 'Download Invoice' })` | `page.locator('button:has-text("Download Invoice")')` |
| **Request Details Button** | `page.getByRole('button', { name: 'Request Details' })` | `page.locator('button:has-text("Request Details")')` |
| **Pay Later Button** | `page.getByRole('button', { name: 'Pay Later' })` | `page.locator('button:has-text("Pay Later")')` |
| **Pay Now Button** | `page.getByRole('button', { name: 'Pay Now' })` | `page.locator('button.ant-btn-primary:has-text("Pay Now")')` |
| **Invoices Table Unpaid Row Action**| `page.locator('tbody tr:first-child .anticon-dollar')` | `page.locator('.anticon-dollar')` |

---

### Surprises

| # | What I Did | Expected | Actual |
|---|---|---|---|
| **1** | Navigated from Step 1 to Step 2 (*Owners Profiles*). | Display a clean owner form ready for data input without validation errors. | Immediately displays a prominent red validation banner: *"Invalid share percentage for owners. The value should be 100%."* before any interaction took place. |
| **2** | Inspected the Owners tab navigation on Step 2. | Proper English spelling for all sub-tab labels. | The final sub-tab is misspelled as `"Share Percnetage"` instead of *"Share Percentage"*. |
| **3** | Clicked on the file upload label text (*"Choose File"*) on Step 5 (*Attachments*). | Native operating system file picker opens to select a file. | Clicking the label does nothing because `<label for="file-input">` targets an ID that does not exist (`input` has `id="attachment"`). Only direct clicks on the input/button trigger the file chooser. |
| **4** | Clicked on the header text (*"Applicant Information"*, *"Owners"*, *"School Details"*) on Step 6 (*Summary*). | Accordion expands to reveal the underlying section summary. | Accordion fails to open; click listener is bound strictly to the tiny SVG chevron icon (`.colbs-btn`), not the section title or row header. |
| **5** | Expanded the **Applicant Information** accordion on Step 6 (*Summary*). | Summary displays valid user data entered in Step 1 (*Date of Birth* and *Address*). | Date of Birth, Address, Phone, and Emirates ID display placeholder dashes (`__`), ignoring the valid values entered and accepted in Step 1. |
| **6** | Inspected DOM IDs on Step 2 custom form controls. | Unique HTML `id` attributes across elements. | Multiple custom form controls render duplicated IDs on both the wrapper `<control-selector id="xyz">` and inner `<input id="xyz">` (e.g. `passportNumber`, `placeOfIssue`, `passport`, `salary`), violating HTML ID uniqueness rules and breaking strict CSS/ID selectors in Playwright. |
| **7** | Uploaded multiple required attachments concurrently on Step 3 (*School Details*). | All files upload concurrently without connection resets. | Gateway FileService endpoint drops connections with `net::ERR_NETWORK_CHANGED` and socket closures; uploads must be throttled and posted sequentially. |
| **8** | Inspected Angular DOM elements on Step 6 (*Summary*). | Correct semantic tag names and component property naming. | The summary custom element selector is misspelled `<inital-approval-summary>` instead of `<initial-approval-summary>`, and its internal Angular owner data property is named `oweners` instead of `owners`. |
| **9** | Inspected Step 6 final action button. | A descriptive action button such as *"Submit & Pay"* or *"Review & Pay"*. | The button is labeled simply `"Pay"`, giving no explicit visual indication that clicking it will validate, create, and submit the service application request. |
| **10** | Submitted the form on Step 6 and inspected the `/requests` tracking grid. | Newly submitted application with issued invoice displays a clear status like *"Pending Payment"*. | Status is labeled `"Draft"` in the requests table despite an official invoice (`700.00 AED`) having already been generated. |
| **11** | Clicked the `$` (Pay) action icon on the unpaid invoice in `/invoices`. | Direct routing to the Checkout / Payment gateway screen to complete payment. | The portal redirects back into the service form (`/services/initial-approval-school/{id}`), resetting the user to Step 1 (at 96% completion) with blank Date of Birth rather than opening the checkout invoice. |
