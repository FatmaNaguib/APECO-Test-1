import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

/**
 * AdminInitialApprovalApproval
 * Page Object representing the APECO Admin Portal - Initial Application Review & Approval page.
 * Handles the 5-step review wizard, read-only field inspections, summary verification,
 * and workflow action modal interactions (Approve, Return, Reject).
 *
 * Conforms strictly to skills/test-authoring.md and admin-Initial-approval-exploration-notes.md.
 */
export class AdminInitialApprovalApproval extends BasePage {
  // ---------------------------------------------------------------------------
  // 1. Header & Navigation Controls
  // ---------------------------------------------------------------------------
  readonly moduleTitle: Locator;
  readonly applicantHeading: Locator;
  readonly backButton: Locator;
  readonly languageToggleButton: Locator;

  // ---------------------------------------------------------------------------
  // 2. Stepper & Review Wizard Controls
  // ---------------------------------------------------------------------------
  readonly stepperItems: Locator;
  readonly activeStepperItem: Locator;
  readonly step1Item: Locator;
  readonly step2Item: Locator;
  readonly step3Item: Locator;
  readonly step4Item: Locator;
  readonly step5Item: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;

  // ---------------------------------------------------------------------------
  // 3. Workflow Card & Action Buttons
  // ---------------------------------------------------------------------------
  readonly workflowCard: Locator;
  readonly workflowStep1Pending: Locator;
  readonly approveButton: Locator;
  readonly returnButton: Locator;
  readonly rejectButton: Locator;

  // ---------------------------------------------------------------------------
  // 4. Step 1: Application Information
  // ---------------------------------------------------------------------------
  readonly applicantInfoTab: Locator;
  readonly contactInfoTab: Locator;
  readonly firstNameEnInput: Locator;
  readonly firstNameArInput: Locator;
  readonly lastNameEnInput: Locator;
  readonly lastNameArInput: Locator;
  readonly dobInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;

  // ---------------------------------------------------------------------------
  // 5. Step 2: Owners Profiles
  // ---------------------------------------------------------------------------
  readonly personalDetailsTab: Locator;
  readonly passportDetailsTab: Locator;
  readonly ownerFullNameInput: Locator;
  readonly ownerPhotoCard: Locator;
  readonly goodConductCard: Locator;
  readonly passportNumberInput: Locator;
  readonly sharePercentageInput: Locator;
  readonly ownerTabs: Locator;

  // ---------------------------------------------------------------------------
  // 6. Step 3: School Information & Curriculum
  // ---------------------------------------------------------------------------
  readonly schoolDetailsTab: Locator;
  readonly curriculumTab: Locator;
  readonly schoolNameEnInput: Locator;
  readonly schoolNameArInput: Locator;
  readonly consultantInput: Locator;
  readonly locationBlockEnInput: Locator;
  readonly landAreaInput: Locator;
  readonly buildingAreaInput: Locator;
  readonly indoorCourtInput: Locator;
  readonly outdoorCanopyInput: Locator;
  readonly applicantRelationInput: Locator;
  readonly phoneInput: Locator;
  readonly curriculum1Chevron: Locator;
  readonly stages1Chevron: Locator;

  // ---------------------------------------------------------------------------
  // 7. Step 4: Attachments
  // ---------------------------------------------------------------------------
  readonly signedDocumentLabel: Locator;
  readonly disabledFileCard: Locator;
  readonly uploadedFileName: Locator;

  // ---------------------------------------------------------------------------
  // 8. Step 5: Summary Accordions
  // ---------------------------------------------------------------------------
  readonly summaryChevrons: Locator;
  readonly applicantSummaryChevron: Locator;
  readonly ownersSummaryChevron: Locator;
  readonly schoolSummaryChevron: Locator;

  // ---------------------------------------------------------------------------
  // 9. Action Modal Controls (Approve, Return, Reject)
  // ---------------------------------------------------------------------------
  readonly activeModal: Locator;
  readonly modalTitle: Locator;
  readonly modalCommentsTextarea: Locator;
  readonly modalFileInput: Locator;
  readonly modalReasonsDropdown: Locator;
  readonly modalSaveButton: Locator;
  readonly modalBackButton: Locator;

  constructor(page: Page) {
    super(page);

    // Header & Navigation
    this.moduleTitle = page.locator('.module-title').or(page.locator('text=Request Details')).first();
    this.applicantHeading = page.getByRole('heading', { level: 1 }).or(page.locator('h1.subtitle')).first();
    this.backButton = page.locator('button.new-back-btn');
    this.languageToggleButton = page
      .locator('text="English"')
      .or(page.getByRole('button', { name: 'English' }))
      .or(page.locator('button:has-text("العربية"), button.lang-btn'))
      .first();

    // Stepper Items
    this.stepperItems = page.locator('nz-step');
    this.activeStepperItem = page.locator('nz-step.ant-steps-item-process, nz-step.ant-steps-item-active').first();
    this.step1Item = page.locator('nz-step').filter({ hasText: /Application Information|بيانات مقدم طلب/i }).first();
    this.step2Item = page.locator('nz-step').filter({ hasText: /Owners Profiles|بيانات الملاك/i }).first();
    this.step3Item = page.locator('nz-step').filter({ hasText: /School Information|بيانات المدرسة/i }).first();
    this.step4Item = page.locator('nz-step').filter({ hasText: /Attachments|المرفقات/i }).first();
    this.step5Item = page.locator('nz-step').filter({ hasText: /Summary|الملخص/i }).first();
    this.nextButton = page.locator('button.next-btn').or(page.getByRole('button', { name: /Next|التالي/i })).first();
    this.prevButton = page.locator('button.prev-btn').or(page.getByRole('button', { name: /Previous|السابق/i })).first();

    // Workflow Card
    this.workflowCard = page.locator('workflow-action-options, .status').first();
    this.workflowStep1Pending = page.locator('.status').filter({ hasText: /APECO Employee Review|مراجعة موظف|مراجعه موظف/i }).first();
    this.approveButton = page.getByRole('button', { name: /Approve|موافقة|اعتماد/i }).or(page.locator('button:has-text("موافقة"), button:has-text("Approve")')).first();
    this.returnButton = page.getByRole('button', { name: /Return|إرجاع/i }).or(page.locator('button:has-text("إرجاع"), button:has-text("Return")')).first();
    this.rejectButton = page.getByRole('button', { name: /Reject|رفض/i }).or(page.locator('button:has-text("رفض"), button:has-text("Reject")')).first();

    // Step 1: Application Information
    this.applicantInfoTab = page.getByRole('tab', { name: /Applicant Information|معلومات مقدم الطلب/i }).or(page.locator('.ant-tabs-tab:has-text("Applicant Information"), .ant-tabs-tab:has-text("معلومات مقدم الطلب")')).first();
    this.contactInfoTab = page.getByRole('tab', { name: /Contact Information|معلومات التواصل/i }).or(page.locator('.ant-tabs-tab:has-text("Contact Information"), .ant-tabs-tab:has-text("معلومات التواصل")')).first();
    this.firstNameEnInput = page.getByRole('textbox', { name: /First Name.*English|الاسم الاول.*الإنجليزية/i }).first();
    this.firstNameArInput = page.getByRole('textbox', { name: /First Name.*Arabic|الاسم الاول.*عربية/i }).first();
    this.lastNameEnInput = page.getByRole('textbox', { name: /Last Name.*English|الاسم الأخير.*الإنجليزية/i }).first();
    this.lastNameArInput = page.getByRole('textbox', { name: /Last Name.*Arabic|الاسم الأخير.*عربية/i }).first();
    this.dobInput = page.getByRole('textbox', { name: /Date of Birth|تاريخ الميلاد/i }).first();
    this.emailInput = page.getByRole('textbox', { name: /Email|البريد/i }).first();
    this.addressInput = page.getByRole('textbox', { name: /Address|العنوان/i }).first();

    // Step 2: Owners Profiles
    this.personalDetailsTab = page.getByRole('tab', { name: 'Personal Details' }).or(page.locator('.ant-tabs-tab:has-text("Personal Details")')).first();
    this.passportDetailsTab = page.getByRole('tab', { name: 'Passport Details' }).or(page.locator('.ant-tabs-tab:has-text("Passport Details")')).first();
    this.ownerFullNameInput = page.getByRole('textbox', { name: 'Full Name' }).or(page.locator('input[placeholder="Full Name"]')).first();
    this.ownerPhotoCard = page.locator('.custom-file-upload').filter({ hasText: 'Photograph' }).first();
    this.goodConductCard = page.locator('.custom-file-upload').filter({ hasText: 'Criminal Status' }).first();
    this.passportNumberInput = page.getByRole('textbox', { name: 'Passport Number' }).or(page.locator('input[placeholder="Passport Number"]')).first();
    this.sharePercentageInput = page.locator('input#sharePercentage, input[placeholder*="share" i]').first();
    this.ownerTabs = page.locator('.ant-tabs-tab');

    // Step 3: School Information & Curriculum
    this.schoolDetailsTab = page.getByRole('tab', { name: 'School Details' }).or(page.locator('.ant-tabs-tab:has-text("School Details")')).first();
    this.curriculumTab = page.getByRole('tab', { name: 'Curriculum' }).or(page.locator('.ant-tabs-tab:has-text("Curriculum")')).first();
    this.schoolNameEnInput = page.getByRole('textbox', { name: 'English School Name' }).or(page.locator('input[placeholder*="English School Name"]')).first();
    this.schoolNameArInput = page.getByRole('textbox', { name: 'Arabic School Name' }).or(page.locator('input[placeholder*="Arabic School Name"]')).first();
    this.consultantInput = page.getByRole('textbox', { name: 'Consultant' }).or(page.locator('input[placeholder*="Consultant"]')).first();
    this.locationBlockEnInput = page.locator('input[placeholder*="Block" i]').first();
    this.landAreaInput = page.locator('input[placeholder*="Land Area" i], input#totalLandArea').first();
    this.buildingAreaInput = page.locator('input[placeholder*="Building Area" i], input#totalBuildingArea').first();
    this.indoorCourtInput = page.locator('input[placeholder*="Indoor" i], input#indoorCourtArea').first();
    this.outdoorCanopyInput = page.locator('input[placeholder*="Canopy" i], input#outdoorCanopyArea').first();
    this.applicantRelationInput = page.locator('input[placeholder*="Relation" i], input#applicantRelation').first();
    this.phoneInput = page.locator('input[placeholder*="Phone" i], input[type="tel"]').first();
    this.curriculum1Chevron = page.locator('.group-header button.ant-btn-icon-only').first();
    this.stages1Chevron = page.locator('.group-header button.ant-btn-icon-only').nth(1);

    // Step 4: Attachments
    this.signedDocumentLabel = page.getByText('Introduction Documents after signature').first();
    this.disabledFileCard = page.locator('.file-label.disabled').first();
    this.uploadedFileName = page.locator('.file-name').first();

    // Step 5: Summary Accordions
    this.summaryChevrons = page.locator('.colbs-btn');
    this.applicantSummaryChevron = page.locator('.colbs-btn').first();
    this.ownersSummaryChevron = page.locator('.colbs-btn').nth(1);
    this.schoolSummaryChevron = page.locator('.colbs-btn').nth(2);

    // Action Modals
    this.activeModal = page.locator('div.modal.show, [id*="workflow-action-model"].show, .ant-modal, .modal.fade.show').first();
    this.modalTitle = page.locator('div.modal.show .modal-title, div.modal.show h5, div.modal.show .title, .ant-modal-title').first();
    this.modalCommentsTextarea = page.locator('div.modal.show textarea, div.modal.show [placeholder*="description" i], .ant-modal textarea').first();
    this.modalFileInput = page.locator('div.modal.show input[type="file"], .ant-modal input[type="file"]').first();
    this.modalReasonsDropdown = page.locator('div.modal.show nz-select, div.modal.show select, .ant-modal nz-select').first();
    this.modalSaveButton = page.locator('div.modal.show button, .ant-modal button').filter({ hasText: /Save|حفظ/i }).first();
    this.modalBackButton = page.locator('div.modal.show button, .ant-modal button').filter({ hasText: /Back|الرجوع|إلغاء/i }).first();
  }

  // ---------------------------------------------------------------------------
  // Action Methods
  // ---------------------------------------------------------------------------

  /**
   * Switches language to English if currently in Arabic RTL mode.
   */
  async ensureEnglish(): Promise<void> {
    try {
      const englishBtn = this.page.getByRole('button', { name: 'English' }).first();
      const isVisible = await englishBtn.isVisible({ timeout: 2500 }).catch(() => false);
      if (isVisible) {
        Logger.info('Switching Admin Review page language to English');
        await englishBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    } catch {
      Logger.debug('Language switch to English not needed or already English');
    }
  }

  /**
   * Navigates directly to the review page for the given Request ID or numeric ID.
   */
  async gotoRequest(requestIdOrNumericId: string | number): Promise<void> {
    const rawId = String(requestIdOrNumericId).replace(/[^0-9]/g, '') || String(requestIdOrNumericId);
    const targetUrl = `/requests/request-details/${rawId}`;
    Logger.info(`Navigating to Request Review: ${targetUrl}`);
    await this.navigate(targetUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks wizard Next button to advance to the next step.
   */
  async clickNext(): Promise<void> {
    Logger.info('Clicking wizard Next button');
    await this.click(this.nextButton, 'Wizard Next button');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks wizard Previous button to return to the previous step.
   */
  async clickPrevious(): Promise<void> {
    Logger.info('Clicking wizard Previous button');
    await this.click(this.prevButton, 'Wizard Previous button');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the top back button to return to the Agent Queue.
   */
  async clickTopBack(): Promise<void> {
    Logger.info('Clicking top navigation back button');
    await this.click(this.backButton, 'Header Back button');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Switches to a specific tab by accessible name.
   */
  async switchToTab(tabName: string): Promise<void> {
    Logger.info(`Switching to tab: ${tabName}`);
    const tab = this.page.getByRole('tab', { name: tabName }).or(this.page.locator(`.ant-tabs-tab:has-text("${tabName}")`)).first();
    await tab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Opens the Approve workflow modal.
   */
  async openApproveModal(): Promise<void> {
    Logger.info('Opening Approve workflow modal');
    await this.click(this.approveButton, 'Approve action button');
    await this.activeModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Opens the Return workflow modal.
   */
  async openReturnModal(): Promise<void> {
    Logger.info('Opening Return workflow modal');
    await this.click(this.returnButton, 'Return action button');
    await this.activeModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Opens the Reject workflow modal.
   */
  async openRejectModal(): Promise<void> {
    Logger.info('Opening Reject workflow modal');
    await this.click(this.rejectButton, 'Reject action button');
    await this.activeModal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Dismisses the active workflow modal by clicking its Back button.
   */
  async dismissModal(): Promise<void> {
    Logger.info('Dismissing active workflow modal');
    await this.click(this.modalBackButton, 'Modal Back button');
    await this.activeModal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Selects an option from the reasons dropdown inside the active workflow modal.
   */
  async selectModalReason(optionTextOrIndex?: string | number): Promise<void> {
    Logger.info(`Selecting reason from modal dropdown: ${optionTextOrIndex ?? 'first available'}`);
    const trigger = this.modalReasonsDropdown.locator('.ant-select-selector, nz-select-top-control, select, .ant-select').first();
    await trigger.waitFor({ state: 'visible', timeout: 5000 });
    await trigger.click();

    // Check if it is a native select
    const isNativeSelect = await trigger.evaluate(el => el.tagName.toLowerCase() === 'select').catch(() => false);
    if (isNativeSelect) {
      if (typeof optionTextOrIndex === 'string') {
        await trigger.selectOption({ label: optionTextOrIndex }).catch(() => trigger.selectOption(optionTextOrIndex));
      } else {
        await trigger.selectOption({ index: optionTextOrIndex ?? 1 });
      }
      return;
    }

    // Wait for Ng-Zorro dropdown overlay
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    await dropdown.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    const optionItems = dropdown.locator('.ant-select-item-option:not(.ant-select-item-option-disabled)');
    await optionItems.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    if (typeof optionTextOrIndex === 'string') {
      const matched = optionItems.filter({ hasText: optionTextOrIndex }).first();
      if (await matched.isVisible({ timeout: 1500 }).catch(() => false)) {
        await matched.click();
        return;
      }
    }

    // Default: click the first available option in the dropdown
    const firstOption = optionItems.first();
    await firstOption.click();
  }

  /**
   * Submits the active workflow modal by clicking Save and handling any secondary confirmation.
   */
  async submitModal(): Promise<void> {
    Logger.info('Submitting active workflow modal (Save button)');
    await this.click(this.modalSaveButton, 'Modal Save button');

    // Handle secondary confirmation dialog if present (e.g., #confirm-action or .ant-modal-confirm)
    const confirmBtn = this.page
      .locator('#confirm-action button, .ant-modal-confirm button, .modal.show button')
      .filter({ hasText: /Yes|Confirm|نعم|تأكيد|موافق/i })
      .first();
    if (await confirmBtn.isVisible({ timeout: 2500 }).catch(() => false)) {
      Logger.info('Secondary confirmation modal detected, confirming action');
      await confirmBtn.click();
    }

    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Executes the complete Return request workflow.
   */
  async returnRequest(data?: { reason?: string; comments?: string; filePath?: string }): Promise<void> {
    Logger.info('Executing Return request workflow');
    await this.openReturnModal();
    await this.selectModalReason(data?.reason);
    if (data?.comments) {
      await this.modalCommentsTextarea.fill(data.comments);
    }
    if (data?.filePath) {
      await this.modalFileInput.setInputFiles(data.filePath);
    }
    await this.modalSaveButton.waitFor({ state: 'visible' });
    await this.submitModal();
  }

  /**
   * Executes the complete Reject request workflow.
   */
  async rejectRequest(data?: { reason?: string; comments?: string; filePath?: string }): Promise<void> {
    Logger.info('Executing Reject request workflow');
    await this.openRejectModal();
    await this.selectModalReason(data?.reason);
    if (data?.comments) {
      await this.modalCommentsTextarea.fill(data.comments);
    }
    if (data?.filePath) {
      await this.modalFileInput.setInputFiles(data.filePath);
    }
    await this.modalSaveButton.waitFor({ state: 'visible' });
    await this.submitModal();
  }
}

export const AdminInitialApprovalApprovalPage = AdminInitialApprovalApproval;
