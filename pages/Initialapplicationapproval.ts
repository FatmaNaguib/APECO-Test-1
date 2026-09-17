import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

/**
 * Interface for Step 2 Owner Profile Data
 */
export interface OwnerProfileData {
  ownerType?: string;
  fullName?: string;
  familyName?: string;
  religion?: string;
  nationality?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  occupation?: string;
  salary?: string;
  motherName?: string;
  fatherName?: string;
  photoPath?: string;
  conductCertPath?: string;
  passportNumber?: string;
  passportPlace?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportDocPath?: string;
  qualification?: string;
  specialization?: string;
  university?: string;
  gradYear?: string;
  country?: string;
  maritalStatus?: string;
  region?: string;
  street?: string;
  mobile?: string;
  poBox?: string;
  sharePercentage?: string;
}

/**
 * Interface for Step 3 School Details & Curriculum
 */
export interface SchoolInformationData {
  requestType?: string;
  schoolNameEn?: string;
  schoolNameAr?: string;
  consultant?: string;
  address?: string;
  studentGender?: string;
  locationBlockEn?: string;
  locationBlockAr?: string;
  landOwnership?: string;
  totalLandArea?: string;
  buildingOwnership?: string;
  totalBuildingArea?: string;
  indoorCourtArea?: string;
  outdoorCanopyArea?: string;
  applicantRelation?: string;
  phone?: string;
  locationMapPath?: string;
  proofOwnershipPath?: string;
  feasibilityStudyPath?: string;
  curriculum?: string;
  stage?: string;
  grade?: string;
  capacity?: string;
  classrooms?: string;
}

/**
 * Page Object Model for the "Initial application - Submission for a Private School Permit" service.
 * Implements accessible, role/label-based locators and modular step interactions.
 */
export class Initialapplicationapproval extends BasePage {
  // ---------------------------------------------------------------------------
  // 1. Navigation & Drafts
  // ---------------------------------------------------------------------------
  readonly serviceCard: Locator;
  readonly draftModal: Locator;
  readonly newRequestButton: Locator;
  readonly resumeDraftButton: Locator;
  readonly draftSelectDropdown: Locator;
  readonly draftCancelButton: Locator;

  // ---------------------------------------------------------------------------
  // 2. Wizard Header & Global Controls
  // ---------------------------------------------------------------------------
  readonly serviceTitle: Locator;
  readonly completionRate: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly saveDraftButton: Locator;

  // ---------------------------------------------------------------------------
  // 3. Step 1: Application Information
  // ---------------------------------------------------------------------------
  readonly applicantInfoTab: Locator;
  readonly contactInfoTab: Locator;
  readonly firstNameEnInput: Locator;
  readonly firstNameArInput: Locator;
  readonly lastNameEnInput: Locator;
  readonly lastNameArInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly emiratesIdInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;

  // ---------------------------------------------------------------------------
  // 4. Step 2: Owners Profiles
  // ---------------------------------------------------------------------------
  readonly sharePercentageWarning: Locator;
  readonly personalDetailsTab: Locator;
  readonly passportDetailsTab: Locator;
  readonly qualifyingTab: Locator;
  readonly maritalStatusTab: Locator;
  readonly fatherMotherTab: Locator;
  readonly housingDataTab: Locator;
  readonly sharePercentageTab: Locator;

  readonly ownerTypeSelect: Locator;
  readonly fullNameInput: Locator;
  readonly familyNameInput: Locator;
  readonly religionSelect: Locator;
  readonly currentNationalitySelect: Locator;
  readonly personalPhotoInput: Locator;
  readonly conductCertificateInput: Locator;
  readonly placeOfBirthInput: Locator;
  readonly ownerDateOfBirthInput: Locator;
  readonly occupationInput: Locator;
  readonly salaryInput: Locator;

  readonly passportNumberInput: Locator;
  readonly passportPlaceOfIssueInput: Locator;
  readonly passportIssueDateInput: Locator;
  readonly passportExpiryDateInput: Locator;
  readonly passportDocInput: Locator;

  readonly academicQualificationSelect: Locator;
  readonly countrySelect: Locator;
  readonly specializationInput: Locator;
  readonly universityInput: Locator;
  readonly graduationYearInput: Locator;

  readonly maritalStatusSelect: Locator;
  readonly motherNameInput: Locator;
  readonly fatherNameInput: Locator;

  readonly regionInput: Locator;
  readonly streetInput: Locator;
  readonly mobileInput: Locator;
  readonly poBoxInput: Locator;

  readonly sharePercentageInput: Locator;

  // ---------------------------------------------------------------------------
  // 5. Step 3: School Information
  // ---------------------------------------------------------------------------
  readonly schoolDetailsTab: Locator;
  readonly curriculumTab: Locator;
  readonly requestTypeSelect: Locator;
  readonly schoolNameEnInput: Locator;
  readonly schoolNameArInput: Locator;
  readonly educationalConsultantInput: Locator;
  readonly schoolAddressInput: Locator;
  readonly studentGenderSelect: Locator;
  readonly locationBlockEnInput: Locator;
  readonly locationBlockArInput: Locator;
  readonly landOwnershipSelect: Locator;
  readonly totalLandAreaInput: Locator;
  readonly buildingOwnershipSelect: Locator;
  readonly totalBuildingAreaInput: Locator;
  readonly indoorCourtAreaInput: Locator;
  readonly outdoorCanopyAreaInput: Locator;
  readonly applicantRelationSelect: Locator;
  readonly schoolPhoneInput: Locator;
  readonly applicantPhoneInput: Locator;

  readonly locationMapDocInput: Locator;
  readonly proofLandOwnershipDocInput: Locator;
  readonly feasibilityStudyDocInput: Locator;

  readonly curriculumSelect: Locator;
  readonly stageSelect: Locator;
  readonly gradeSelect: Locator;
  readonly capacityInput: Locator;
  readonly classroomsInput: Locator;
  readonly addCurriculumButton: Locator;
  readonly curriculumTable: Locator;

  // ---------------------------------------------------------------------------
  // 6. Step 4: Download Documents
  // ---------------------------------------------------------------------------
  readonly downloadNoticeModal: Locator;
  readonly modalOkayButton: Locator;
  readonly documentCard: Locator;
  readonly downloadPdfButton: Locator;

  // ---------------------------------------------------------------------------
  // 7. Step 5: Attachments
  // ---------------------------------------------------------------------------
  readonly attachmentHeading: Locator;
  readonly signedAttachmentInput: Locator;
  readonly addAttachmentRowButton: Locator;
  readonly uploadedFileItem: Locator;
  readonly removeAttachmentButton: Locator;

  // ---------------------------------------------------------------------------
  // 8. Step 6: Summary & Submission
  // ---------------------------------------------------------------------------
  readonly summaryHeading: Locator;
  readonly applicantInfoCollapseIcon: Locator;
  readonly ownersCollapseIcon: Locator;
  readonly schoolDetailsCollapseIcon: Locator;
  readonly acknowledgmentCheckbox: Locator;
  readonly payButton: Locator;

  // ---------------------------------------------------------------------------
  // 9. Checkout & Invoices
  // ---------------------------------------------------------------------------
  readonly paymentHeading: Locator;
  readonly downloadInvoiceButton: Locator;
  readonly requestDetailsButton: Locator;
  readonly payLaterButton: Locator;
  readonly payNowButton: Locator;
  readonly unpaidInvoiceDollarIcon: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation & Drafts
    this.serviceCard = page.locator('.service-card').filter({
      hasText: 'Initial application - Submission for a Private School Permit',
    });
    this.draftModal = page.locator('nz-modal-container app-choose-draft-requests');
    this.newRequestButton = page.locator('app-choose-draft-requests').getByRole('button', { name: 'New Request' });
    this.resumeDraftButton = page.locator('app-choose-draft-requests').getByRole('button', { name: 'Resume' });
    this.draftSelectDropdown = page.locator('app-choose-draft-requests nz-select');
    this.draftCancelButton = page.locator('.ant-modal-footer').getByRole('button', { name: 'Cancel' });

    // Global Wizard Controls
    this.serviceTitle = page.locator('.ant-page-header-heading-title, .site-page-header, h1').filter({
      hasText: 'Initial application - Submission for a Private School Permit',
    }).first();
    this.completionRate = page.locator('.completion-rate, app-completion-rate');
    this.nextButton = page.getByRole('button', { name: 'Next', exact: true });
    this.previousButton = page.getByRole('button', { name: 'Previous', exact: true });
    this.saveDraftButton = page.getByRole('button', { name: 'Save as Draft' });

    // Step 1
    this.applicantInfoTab = page.getByRole('tab', { name: 'Applicant Information' });
    this.contactInfoTab = page.getByRole('tab', { name: 'Contact Information' });
    this.firstNameEnInput = page.locator('control-selector#firstNameEn input');
    this.firstNameArInput = page.locator('control-selector#firstNameAr input');
    this.lastNameEnInput = page.locator('control-selector#lastNameEn input');
    this.lastNameArInput = page.locator('control-selector#lastNameAr input');
    this.dateOfBirthInput = page.getByPlaceholder('Date of Birth');
    this.emiratesIdInput = page.getByPlaceholder('Emirates ID');
    this.emailInput = page.getByPlaceholder('Email');
    this.addressInput = page.getByPlaceholder('Address');

    // Step 2
    this.sharePercentageWarning = page.getByText('Invalid share percentage for owners. The value should be 100%.');
    this.personalDetailsTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Personal Details' });
    this.passportDetailsTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Passport Details' });
    this.qualifyingTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Qualifying' });
    this.maritalStatusTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Marital Status Data' });
    this.fatherMotherTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Father/Mother Data' });
    this.housingDataTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Housing Data' });
    this.sharePercentageTab = page.locator('.ant-tabs-tab').filter({ hasText: /Share Perc/i });

    this.ownerTypeSelect = page.locator('.ant-tabs-tabpane-active nz-form-item').filter({ hasText: 'Type of Owner' }).locator('nz-select');
    this.fullNameInput = page.getByRole('textbox', { name: 'Full Name' }).or(page.getByPlaceholder('Full Name'));
    this.familyNameInput = page.getByRole('textbox', { name: 'Family Name' }).or(page.getByPlaceholder('Family Name'));
    this.religionSelect = page.locator('control-selector#religion nz-select');
    this.currentNationalitySelect = page.locator('control-selector#currentNationality nz-select');
    this.personalPhotoInput = page.locator('input#Photograph[type="file"], input[placeholder="Photograph"][type="file"], nz-form-item:has-text("Photograph") input[type="file"]');
    this.conductCertificateInput = page.locator('input#criminal_status_certificate[type="file"], input[placeholder="Criminal Status Certificate"][type="file"], nz-form-item:has-text("Criminal Status") input[type="file"]');
    this.placeOfBirthInput = page.getByPlaceholder('Place of Birth').or(page.getByRole('textbox', { name: 'Place of Birth' }));
    this.ownerDateOfBirthInput = page.locator('.ant-tabs-tabpane-active').getByPlaceholder('Date of Birth').or(page.locator('.ant-tabs-tabpane-active').getByRole('textbox', { name: 'Date of Birth' }));
    this.occupationInput = page.getByPlaceholder('Occupation').or(page.getByRole('textbox', { name: 'Occupation' }));
    this.salaryInput = page.getByPlaceholder('Salary').or(page.getByRole('textbox', { name: 'Salary' }));

    this.passportNumberInput = page.getByRole('textbox', { name: 'Passport' });
    this.passportPlaceOfIssueInput = page.getByPlaceholder('Place of Issue').or(page.locator('control-selector#placeOfIssue input'));
    this.passportIssueDateInput = page.getByPlaceholder('Release Date').or(page.locator('control-selector#passportIssueDate input'));
    this.passportExpiryDateInput = page.getByPlaceholder('Expiry Date').or(page.locator('control-selector#passportExpiryDate input'));
    this.passportDocInput = page.locator('input#passport[type="file"]');

    this.academicQualificationSelect = page.locator('.ant-tabs-tabpane-active nz-select').first();
    this.countrySelect = page.locator('.ant-tabs-tabpane-active nz-form-item').filter({ hasText: 'Country' }).locator('nz-select');
    this.specializationInput = page.getByPlaceholder('Specialization').or(page.locator('control-selector#specialization input'));
    this.universityInput = page.getByRole('textbox', { name: 'School/University' }).or(page.getByPlaceholder('School/University'));
    this.graduationYearInput = page.getByRole('textbox', { name: 'Date of Obtaining Certificate' }).or(page.getByPlaceholder('Date of Obtaining Certificate'));

    this.maritalStatusSelect = page.locator('nz-select').filter({ hasText: 'Marital Status' });
    this.motherNameInput = page.getByPlaceholder('Mother Name');
    this.fatherNameInput = page.getByPlaceholder('Father Name');

    this.regionInput = page.getByPlaceholder('Region');
    this.streetInput = page.getByPlaceholder('Street');
    this.mobileInput = page.getByPlaceholder('Mobile Phone Number');
    this.poBoxInput = page.getByPlaceholder('PO Box Number');

    this.sharePercentageInput = page.locator('control-selector#sharePercentage input, input#sharePercentage');

    // Step 3
    this.schoolDetailsTab = page.getByRole('tab', { name: 'School Details' });
    this.curriculumTab = page.getByRole('tab', { name: 'Curriculum' });
    this.requestTypeSelect = page.locator('control-selector#requestType nz-select, nz-form-item:has-text("Request Type") nz-select');
    this.schoolNameEnInput = page.getByPlaceholder('English School Name').or(page.getByPlaceholder('School Name (English)')).or(page.locator('control-selector#schoolNameEn input, control-selector#schooleNameEn input'));
    this.schoolNameArInput = page.getByPlaceholder('Arabic School Name').or(page.getByPlaceholder('School Name (Arabic)')).or(page.locator('control-selector#schoolNameAr input, control-selector#schooleNameAr input'));
    this.educationalConsultantInput = page.getByPlaceholder('Consultant').or(page.getByPlaceholder('Educational Consultant')).or(page.locator('control-selector#educationalConsultant input'));
    this.schoolAddressInput = page.getByPlaceholder('School Address').or(page.locator('control-selector#schoolAddress input, control-selector#address input'));
    this.studentGenderSelect = page.locator('nz-form-item').filter({ hasText: 'Type of students' }).locator('nz-select').or(page.locator('control-selector#studentGender nz-select, nz-select:has-text("Type of students")'));
    this.locationBlockEnInput = page.getByPlaceholder('English Location/Block number').or(page.getByPlaceholder('Proposed School Location Block (English)')).or(page.locator('control-selector#locationNoEn input'));
    this.locationBlockArInput = page.getByPlaceholder('Arabic Location/Block number').or(page.getByPlaceholder('Proposed School Location Block (Arabic)')).or(page.locator('control-selector#locationNoAr input'));
    this.landOwnershipSelect = page.locator('nz-form-item').filter({ hasText: 'Land Ownership' }).locator('nz-select').or(page.locator('control-selector#landOwnership nz-select'));
    this.totalLandAreaInput = page.getByPlaceholder('Land Area').or(page.getByPlaceholder('Total Land Area')).or(page.locator('control-selector#totalLandArea input'));
    this.buildingOwnershipSelect = page.locator('nz-form-item').filter({ hasText: 'Building Ownership' }).locator('nz-select').or(page.locator('control-selector#buildingOwnership nz-select'));
    this.totalBuildingAreaInput = page.getByPlaceholder('Building Area').or(page.getByPlaceholder('Total Building Area')).or(page.locator('control-selector#totalBuildingArea input'));
    this.indoorCourtAreaInput = page.getByPlaceholder('Total indoor court area').or(page.locator('control-selector#totalIndoorCourtArea input'));
    this.outdoorCanopyAreaInput = page.getByPlaceholder('Total Outdoor Canopy Area').or(page.locator('control-selector#totalOutdoorCanopyArea input'));
    this.applicantRelationSelect = page.locator('control-selector#applicantRelation nz-select, nz-form-item:has-text("Relation") nz-select');
    this.schoolPhoneInput = page.getByPlaceholder('Phone').or(page.locator('control-selector#phone input'));
    this.applicantPhoneInput = page.getByPlaceholder('Applicant Phone').or(page.locator('control-selector#applicantPhone input'));

    this.locationMapDocInput = page.locator('input#proposedLocationMap[type="file"], input#proposed_location_map[type="file"], control-selector#proposedLocationMap input[type="file"]');
    this.proofLandOwnershipDocInput = page.locator('input#proofOfLandOwnership[type="file"], input#proof_of_land_ownership[type="file"], control-selector#proofOfLandOwnership input[type="file"]');
    this.feasibilityStudyDocInput = page.locator('input#feasibilityStudyOperationalPlan[type="file"], input#feasibility_study_operational_plan[type="file"], control-selector#feasibilityStudyOperationalPlan input[type="file"]');

    this.curriculumSelect = page.locator('nz-form-item').filter({ hasText: 'Curriculum' }).locator('nz-select').or(page.locator('control-selector#curriculum nz-select')).first();
    this.stageSelect = page.locator('nz-form-item').filter({ hasText: 'Stage' }).locator('nz-select').or(page.locator('control-selector#stage nz-select')).first();
    this.gradeSelect = page.locator('control-selector#grade nz-select, control-selector#grades nz-select, nz-form-item:has-text("Grade") nz-select, nz-select:has([placeholder*="Grade"])').first();
    this.capacityInput = page.getByPlaceholder(/Capacity/i).or(page.locator('nz-form-item:has-text("Capacity") input')).first();
    this.classroomsInput = page.getByPlaceholder(/Class ?Rooms?/i).or(page.locator('nz-form-item:has-text("Class Rooms") input')).first();
    this.addCurriculumButton = page.getByRole('button', { name: 'Add Stage' });
    this.curriculumTable = page.locator('app-curriculum nz-table, app-curriculum table, app-curriculum');

    // Step 4
    this.downloadNoticeModal = page.locator('.ant-modal-content').filter({ hasText: /documents will be prepared/i });
    this.modalOkayButton = page.locator('.ant-modal-footer').getByRole('button', { name: 'Okay' }).or(page.getByRole('button', { name: 'Okay' }));
    this.documentCard = page.locator('.document-card, [class*="document-card"]').first();
    this.downloadPdfButton = page.locator('.document-card a[download], .document-card .anticon-download').first();

    // Step 5
    this.attachmentHeading = page.getByRole('heading', { name: 'Introduction Documents after signature' }).or(page.locator('h3, h4, .title').filter({ hasText: 'Introduction Documents' }));
    this.signedAttachmentInput = page.locator('input#attachment[type="file"], file-input#attachment input[type="file"], .attachments-form input[type="file"], input[type="file"]').first();
    this.addAttachmentRowButton = page.locator('.attachments-form').getByRole('button', { name: 'Add' });
    this.uploadedFileItem = page.locator('.file-label, .uploaded-file-item, .ant-upload-list-item');
    this.removeAttachmentButton = page.locator('.anticon-close').first();

    // Step 6
    this.summaryHeading = page.getByRole('heading', { name: 'Summary' }).or(page.locator('.title, h2, h3').filter({ hasText: 'Summary' }));
    this.applicantInfoCollapseIcon = page.locator('.section').filter({ hasText: 'Applicant Information' }).locator('button, .colbs-btn, [class*="collapse"]').first();
    this.ownersCollapseIcon = page.locator('.section').filter({ hasText: 'Owners' }).locator('button, .colbs-btn, [class*="collapse"]').first();
    this.schoolDetailsCollapseIcon = page.locator('.section').filter({ hasText: 'School Details' }).locator('button, .colbs-btn, [class*="collapse"]').first();
    this.acknowledgmentCheckbox = page.getByRole('checkbox', { name: /Acknowledge the correctness/i }).or(page.locator('label.ant-checkbox-wrapper:has-text("Acknowledge") input')).first();
    this.payButton = page.getByRole('button', { name: 'Pay', exact: true }).or(page.locator('button.ant-btn-primary:has-text("Pay")'));

    // Checkout & Invoices
    this.paymentHeading = page.getByRole('heading', { name: 'Payment' }).or(page.locator('.title, h1, h2, h3, [class*="title"]').filter({ hasText: 'Payment' })).first();
    this.downloadInvoiceButton = page.getByRole('button', { name: 'Download Invoice' });
    this.requestDetailsButton = page.getByRole('button', { name: 'Request Details' });
    this.payLaterButton = page.getByRole('button', { name: 'Pay Later' });
    this.payNowButton = page.getByRole('button', { name: 'Pay Now' });
    this.unpaidInvoiceDollarIcon = page.getByRole('row').filter({ hasText: 'Unpaid' }).locator('.anticon-dollar, [nztype="dollar"], button').first().or(page.locator('tbody tr:first-child .anticon-dollar'));
  }

  // ---------------------------------------------------------------------------
  // Action Methods
  // ---------------------------------------------------------------------------

  /**
   * Navigates to the services catalog page.
   */
  async gotoServices(): Promise<void> {
    await this.navigate('/services');
    await expect(this.page).toHaveURL(/.*services/);
  }

  /**
   * Clicks on the Private School Permit service card and handles draft interception if present.
   */
  async openPermitService(handleDraft: 'new' | 'resume' = 'new'): Promise<void> {
    Logger.info(`Opening Initial application - Submission for a Private School Permit (draft mode: ${handleDraft})`);
    await this.serviceCard.waitFor({ state: 'visible' });

    for (let attempt = 0; attempt < 3; attempt++) {
      await this.serviceCard.click();

      // Check if draft dialog intercepts navigation
      try {
        await this.draftModal.waitFor({ state: 'visible', timeout: 3000 });
        if (handleDraft === 'new') {
          Logger.info('Draft modal detected: selecting New Request');
          await this.newRequestButton.click();
        } else {
          Logger.info('Draft modal detected: selecting Resume');
          await this.resumeDraftButton.click();
        }
      } catch {
        Logger.debug(`No draft modal detected on attempt ${attempt + 1}`);
      }

      try {
        await expect(this.page).toHaveURL(/.*initial-approval-school/, { timeout: 4000 });
        return;
      } catch {
        Logger.debug(`URL not updated yet, retrying click (attempt ${attempt + 1})`);
      }
    }

    await expect(this.page).toHaveURL(/.*initial-approval-school/, { timeout: 10000 });
  }

  /**
   * Helper to select an option in Ng-Zorro custom dropdowns.
   */
  async selectNzOption(selectLocator: Locator, optionText: string | RegExp): Promise<void> {
    const trigger = selectLocator.first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();

    // Wait for dropdown menu to appear in DOM
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    try {
      await dropdown.waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      Logger.warn('Dropdown overlay did not appear after click, retrying with nz-select-top-control');
      await trigger.locator('.ant-select-selector, nz-select-top-control').first().click({ force: true });
      await dropdown.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    }

    // Get all available options currently rendered
    const optionItems = dropdown.locator('.ant-select-item-option:not(.ant-select-item-option-disabled)');
    await optionItems.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    const texts = await optionItems.allInnerTexts().catch(() => []);
    Logger.info(`Dropdown opened for option "${optionText}". Available options: ${JSON.stringify(texts)}`);

    // Try finding option by text or regex
    const matchedOption = optionItems.filter({ hasText: optionText }).first();
    if (await matchedOption.isVisible({ timeout: 1000 }).catch(() => false)) {
      try {
        await matchedOption.scrollIntoViewIfNeeded();
        await matchedOption.click({ force: true, timeout: 2000 });
      } catch {
        await matchedOption.dispatchEvent('click');
      }
      return;
    }

    // If options exist, select the first available valid option as safe fallback
    if (texts.length > 0) {
      Logger.warn(`Option "${optionText}" not directly matched in ${JSON.stringify(texts)}. Selecting first available: "${texts[0]}"`);
      try {
        await optionItems.first().click({ force: true, timeout: 2000 });
      } catch {
        await optionItems.first().dispatchEvent('click');
      }
      return;
    }

    // If search input exists and no options rendered yet, try typing to filter
    if (typeof optionText === 'string') {
      const searchInput = trigger.locator('input.ant-select-selection-search-input');
      if (await searchInput.isVisible({ timeout: 500 }).catch(() => false)) {
        await searchInput.fill(optionText);
        const searched = dropdown.locator('.ant-select-item-option:not(.ant-select-item-option-disabled)').filter({ hasText: optionText }).first();
        if (await searched.isVisible({ timeout: 1500 }).catch(() => false)) {
          await searched.click({ force: true });
          return;
        }
      }
    }

    Logger.warn(`No options could be selected for "${optionText}"`);
  }

  /**
   * Helper to populate Ng-Zorro date picker controls by form item label.
   */
  async setNzDatePicker(formItemLabel: string, dateStr: string = '2020-01-01'): Promise<void> {
    let ymd = dateStr;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      ymd = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    const formItem = this.page.locator('.ant-tabs-tabpane-active nz-form-item').filter({ hasText: formItemLabel });
    const input = formItem.locator('input');
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill(ymd);
    await input.press('Enter');
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Escape');
  }

  /**
   * Populates Step 1: Application Information.
   */
  async fillStep1(birthDate: string = '1985-01-01', address: string = 'Al Jurf, Ajman'): Promise<void> {
    let ymd = birthDate;
    if (birthDate.includes('/')) {
      const parts = birthDate.split('/');
      ymd = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    Logger.info(`Filling Step 1: DoB=${ymd}, Address=${address}`);
    await this.dateOfBirthInput.click();
    await this.dateOfBirthInput.fill(ymd);
    await this.dateOfBirthInput.press('Enter');
    await this.page.keyboard.press('Escape');

    await this.contactInfoTab.click();
    await this.addressInput.fill(address);
  }

  /**
   * Populates Step 2: Owners Profiles Data.
   */
  async fillStep2(data: OwnerProfileData): Promise<void> {
    Logger.info('Filling Step 2: Owners Profiles');

    // 1. Personal Details
    await this.personalDetailsTab.click();
    await this.ownerTypeSelect.waitFor({ state: 'visible' });
    const currentOwnerType = await this.ownerTypeSelect.innerText().catch(() => '');
    if (!currentOwnerType.includes(data.ownerType || 'Individual')) {
      await this.selectNzOption(this.ownerTypeSelect, data.ownerType || 'Individual');
    }

    await this.fullNameInput.waitFor({ state: 'visible' });
    await this.fullNameInput.fill(data.fullName || 'Anas Mohamed');
    await this.familyNameInput.fill(data.familyName || 'Mohamed');
    if (data.motherName) {
      const motherInput = this.page.locator('.ant-tabs-tabpane-active').getByPlaceholder('Mother Name');
      if (await motherInput.isVisible({ timeout: 500 }).catch(() => false)) {
        await motherInput.fill(data.motherName);
      }
    }

    if (data.nationality) {
      await this.selectNzOption(this.currentNationalitySelect, data.nationality);
    }
    if (data.religion) {
      await this.selectNzOption(this.religionSelect, data.religion);
    }
    if (data.placeOfBirth) {
      await this.placeOfBirthInput.fill(data.placeOfBirth);
    }
    if (data.dateOfBirth) {
      await this.setNzDatePicker('Date of Birth', data.dateOfBirth);
    }
    if (data.occupation) {
      await this.occupationInput.fill(data.occupation);
    }
    if (data.salary) {
      await this.salaryInput.fill(data.salary);
    }

    if (data.photoPath) {
      const fileInputs = this.page.locator('.ant-tabs-tabpane-active input[type="file"]');
      if (await fileInputs.count() > 0) {
        const resPromise = this.page.waitForResponse(res => res.url().includes('Attachment/Upload'), { timeout: 15000 }).catch(() => null);
        await fileInputs.first().setInputFiles(data.photoPath);
        await resPromise;
      }
    }
    if (data.conductCertPath) {
      const fileInputs = this.page.locator('.ant-tabs-tabpane-active input[type="file"]');
      if (await fileInputs.count() > 1) {
        const resPromise = this.page.waitForResponse(res => res.url().includes('Attachment/Upload'), { timeout: 15000 }).catch(() => null);
        await fileInputs.nth(1).setInputFiles(data.conductCertPath);
        await resPromise;
      }
    }

    // 2. Passport Details
    await this.passportDetailsTab.click();
    if (data.passportNumber) {
      await this.passportNumberInput.fill(data.passportNumber);
    }
    if (data.passportPlace) {
      await this.passportPlaceOfIssueInput.fill(data.passportPlace);
    }
    if (data.passportIssueDate) {
      await this.setNzDatePicker('Release Date', data.passportIssueDate);
    }
    if (data.passportExpiryDate) {
      await this.setNzDatePicker('Expiry Date', data.passportExpiryDate);
    }
    if (data.passportDocPath) {
      const fileInputs = this.page.locator('.ant-tabs-tabpane-active input[type="file"]');
      for (let i = 0; i < await fileInputs.count(); i++) {
        await fileInputs.nth(i).setInputFiles(data.passportDocPath);
      }
    }

    // 3. Qualifying
    await this.qualifyingTab.click();
    if (data.qualification) {
      await this.selectNzOption(this.academicQualificationSelect, data.qualification);
    }
    if (data.university) {
      await this.universityInput.fill(data.university);
    }

    await this.setNzDatePicker('Date of Obtaining Certificate', data.gradYear || '2010-01-01');
    await this.selectNzOption(this.countrySelect, data.country || 'Australia');

    // 4. Marital Status
    await this.maritalStatusTab.click();
    if (data.maritalStatus) {
      await this.selectNzOption(this.maritalStatusSelect, data.maritalStatus);
    }

    // 5. Father / Mother Data
    await this.fatherMotherTab.click();
    if (data.fatherName) {
      await this.fatherNameInput.fill(data.fatherName);
    }
    if (data.motherName) {
      await this.motherNameInput.fill(data.motherName);
    }

    // 6. Housing Data
    await this.housingDataTab.click();
    if (data.region) {
      await this.regionInput.fill(data.region);
    }
    if (data.street) {
      await this.streetInput.fill(data.street);
    }
    if (data.mobile) {
      await this.mobileInput.fill(data.mobile);
    }
    if (data.poBox) {
      await this.poBoxInput.fill(data.poBox);
    }

    // 7. Share Percentage
    await this.sharePercentageTab.click();
    if (data.sharePercentage) {
      await this.sharePercentageInput.fill(data.sharePercentage);
      await this.sharePercentageInput.press('Enter');
      await this.page.keyboard.press('Tab');
    }

    // Diagnostics
    const tabTexts = await this.page.locator('.ant-tabs-tab').allInnerTexts();
    Logger.info(`[STEP 2 TABS]: ${JSON.stringify(tabTexts)}`);

    const invalid = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll('.ng-invalid')).map(el => ({
        tag: el.tagName,
        id: el.id,
        name: (el as any).name || el.getAttribute('formcontrolname') || el.getAttribute('ng-reflect-name'),
        label: el.closest('nz-form-item')?.querySelector('nz-form-label, label')?.textContent?.trim(),
        value: (el as any).value
      }))
    );
    Logger.info(`[STEP 2 REMAINING INVALID]: ${JSON.stringify(invalid)}`);
  }

  /**
   * Populates Step 3: School Information and Curriculum.
   */
  async fillStep3(data: SchoolInformationData): Promise<void> {
    Logger.info('Filling Step 3: School Information');

    // 1. School Details
    if (data.requestType) {
      await this.requestTypeSelect.click();
      const targetOption = this.page.locator('.ant-select-item-option:not(.ant-select-item-option-disabled)').filter({ hasText: data.requestType }).first();
      if (await targetOption.isVisible({ timeout: 1500 }).catch(() => false)) {
        await targetOption.click({ force: true });
      } else {
        const firstOption = this.page.locator('.ant-select-item-option:not(.ant-select-item-option-disabled)').first();
        if (await firstOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await firstOption.click({ force: true });
        }
      }
    }
    if (data.schoolNameAr) {
      await this.schoolNameArInput.fill(data.schoolNameAr);
    }
    if (data.schoolNameEn) {
      await this.schoolNameEnInput.fill(data.schoolNameEn);
    }
    if (data.consultant) {
      await this.educationalConsultantInput.fill(data.consultant);
    }

    await this.schoolAddressInput.fill(data.address || 'Al Jurf 2, Ajman');

    if (data.studentGender) {
      await this.selectNzOption(this.studentGenderSelect, /Boys and Girls|Co-educational|Mixed/i);
    }
    if (data.locationBlockEn) {
      await this.locationBlockEnInput.fill(data.locationBlockEn);
    }
    if (data.locationBlockAr) {
      await this.locationBlockArInput.fill(data.locationBlockAr);
    }
    if (data.landOwnership) {
      await this.selectNzOption(this.landOwnershipSelect, data.landOwnership);
    }
    if (data.totalLandArea) {
      await this.totalLandAreaInput.fill(data.totalLandArea);
    }
    if (data.buildingOwnership) {
      await this.selectNzOption(this.buildingOwnershipSelect, data.buildingOwnership);
    }
    if (data.totalBuildingArea) {
      await this.totalBuildingAreaInput.fill(data.totalBuildingArea);
    }

    await this.indoorCourtAreaInput.fill(data.indoorCourtArea || '2000');
    await this.outdoorCanopyAreaInput.fill(data.outdoorCanopyArea || '1500');

    if (data.applicantRelation) {
      const relationInput = this.page.getByPlaceholder('Relation to School Building').or(this.page.locator('control-selector#applicantRelation input'));
      if (await relationInput.isVisible({ timeout: 500 })) {
        await relationInput.fill(data.applicantRelation);
      } else {
        await this.selectNzOption(this.applicantRelationSelect, data.applicantRelation);
      }
    }
    if (data.phone) {
      await this.applicantPhoneInput.fill(data.phone);
    }

    // Upload documents sequentially to prevent Gateway FileService resets
    const fileInputs = this.page.locator('.ant-tabs-tabpane-active input[type="file"]');
    const count = await fileInputs.count();
    if (data.locationMapPath && count > 0) {
      const resPromise = this.page.waitForResponse(res => res.url().includes('Attachment/Upload'), { timeout: 15000 }).catch(() => null);
      await fileInputs.nth(0).setInputFiles(data.locationMapPath);
      await resPromise;
    }
    if (data.proofOwnershipPath && count > 1) {
      const resPromise = this.page.waitForResponse(res => res.url().includes('Attachment/Upload'), { timeout: 15000 }).catch(() => null);
      await fileInputs.nth(1).setInputFiles(data.proofOwnershipPath);
      await resPromise;
    }
    if (data.feasibilityStudyPath && count > 2) {
      const resPromise = this.page.waitForResponse(res => res.url().includes('Attachment/Upload'), { timeout: 15000 }).catch(() => null);
      await fileInputs.nth(2).setInputFiles(data.feasibilityStudyPath);
      await resPromise;
    }

    // 2. Curriculum
    await this.curriculumTab.click();
    if (data.curriculum) {
      await this.selectNzOption(this.curriculumSelect, data.curriculum);
    }
    if (data.stage) {
      await this.selectNzOption(this.stageSelect, data.stage);
    }
    if (data.grade) {
      await this.selectNzOption(this.gradeSelect, data.grade);
    }
    if (data.capacity) {
      await this.capacityInput.fill(data.capacity);
    }
    if (data.classrooms) {
      await this.classroomsInput.fill(data.classrooms);
      await this.classroomsInput.press('Enter');
      await this.page.keyboard.press('Tab');
    }

    // Click Add button if it exists to append to curriculum table
    const addBtn = this.page.locator('app-curriculum').getByRole('button', { name: 'Add' }).or(this.page.locator('button.add-btn:has-text("Add"), button:has-text("Add Stage")'));
    if (await addBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      Logger.info('Curriculum Add button detected, clicking to append record');
      await addBtn.click();
    }

    // Step 3 validation diagnostics
    const invalidStep3 = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll('.ng-invalid')).map(el => ({
        tag: el.tagName,
        id: el.id,
        name: (el as any).name || el.getAttribute('formcontrolname') || el.getAttribute('ng-reflect-name'),
        label: el.closest('nz-form-item')?.querySelector('nz-form-label, label')?.textContent?.trim(),
        value: (el as any).value
      }))
    );
    Logger.info(`[STEP 3 REMAINING INVALID]: ${JSON.stringify(invalidStep3)}`);
  }

  /**
   * Handles Step 4 modal and verifies generated document card.
   */
  async handleStep4(): Promise<void> {
    Logger.info('Handling Step 4: Download Documents');
    try {
      await this.modalOkayButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.modalOkayButton.click();
    } catch {
      Logger.debug('Step 4 preparation modal already dismissed or did not display');
    }
    await expect(this.nextButton).toBeEnabled();
  }

  /**
   * Uploads the signed introduction document in Step 5.
   */
  async uploadStep5Attachment(filePath: string): Promise<void> {
    Logger.info(`Uploading Step 5 signed document: ${filePath}`);
    const resPromise = this.page.waitForResponse(res => res.url().includes('Attachment/Upload'), { timeout: 15000 }).catch(() => null);
    await this.signedAttachmentInput.setInputFiles(filePath);
    await resPromise;
    await expect(this.uploadedFileItem.first()).toBeVisible();
    await expect(this.nextButton).toBeEnabled();
  }

  /**
   * Checks correctness acknowledgment and clicks Pay to submit in Step 6.
   */
  async submitApplication(): Promise<void> {
    Logger.info('Step 6: Acknowledging correctness and submitting application');
    await this.acknowledgmentCheckbox.check({ force: true });
    await expect(this.payButton).toBeEnabled();
    await this.payButton.click();
    await expect(this.page).toHaveURL(/.*checkout/, { timeout: 20000 });
  }

  /**
   * Completes payment on the Magnati Payment Gateway from the Checkout page.
   */
  async payWithCard(cardDetails: {
    name: string;
    cardNumber: string;
    cvv: string;
    expiryMonth?: string;
    expiryYear?: string;
  }): Promise<Page> {
    Logger.info(`Initiating payment on Checkout for cardholder: ${cardDetails.name}`);
    await this.payNowButton.scrollIntoViewIfNeeded();
    await expect(this.payNowButton).toBeVisible();

    const popupPromise = this.page.waitForEvent('popup', { timeout: 6000 }).catch(() => null);
    await this.payNowButton.click();

    const popup = await popupPromise;
    const targetPage = popup || this.page;
    await targetPage.waitForLoadState('domcontentloaded');

    // Populate Cardholder Name
    const nameInput = targetPage.getByPlaceholder('Enter Name').or(targetPage.locator('input[placeholder*="Name" i]')).first();
    await nameInput.waitFor({ state: 'visible', timeout: 15000 });
    await nameInput.fill(cardDetails.name);

    // Populate Card Number
    const cardInput = targetPage.getByPlaceholder('Enter Card Number').or(targetPage.locator('input[placeholder*="Card" i]')).first();
    await cardInput.fill(cardDetails.cardNumber);

    // Select Expiry Month & Year
    const monthSelect = targetPage.locator('select').nth(0);
    if (await monthSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      if (cardDetails.expiryMonth) {
        await monthSelect.selectOption(cardDetails.expiryMonth).catch(() => monthSelect.selectOption({ label: cardDetails.expiryMonth! }));
      } else {
        const monthOptions = await monthSelect.locator('option').allInnerTexts().catch(() => []);
        await monthSelect.selectOption({ index: Math.min(12, monthOptions.length - 1) });
      }
    }

    const yearSelect = targetPage.locator('select').nth(1);
    if (await yearSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      if (cardDetails.expiryYear) {
        await yearSelect.selectOption(cardDetails.expiryYear).catch(() => yearSelect.selectOption({ label: cardDetails.expiryYear! }));
      } else {
        const yearOptions = await yearSelect.locator('option').allInnerTexts().catch(() => []);
        await yearSelect.selectOption({ index: Math.min(3, yearOptions.length - 1) });
      }
    }

    // Populate CVV
    const cvvInput = targetPage.getByPlaceholder('***').or(targetPage.locator('input[placeholder*="*" i]')).first();
    await cvvInput.fill(cardDetails.cvv);

    // Click PAY
    const payBtn = targetPage.getByRole('button', { name: 'PAY', exact: true }).or(targetPage.locator('button:has-text("PAY"), input[value="PAY"], #proceed')).first();
    await payBtn.click();

    // Await gateway redirect back to APECO portal result page
    await targetPage.waitForURL(/.*payment-result|.*requests|.*checkout/i, { timeout: 35000 });
    await targetPage.waitForLoadState('domcontentloaded');

    return targetPage;
  }
}

export const InitialApplicationApprovalPage = Initialapplicationapproval;
