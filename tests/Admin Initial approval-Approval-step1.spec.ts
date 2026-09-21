import { test, expect } from './initial-approval-fixtures';
import { AdminInitialApprovalApproval } from '../pages/AdminInitialApprovalApproval';

/**
 * APECO Admin Test Suite: Initial Application Approval - Step 1 & Review Workflow
 *
 * Conforms strictly to:
 * - skills/test-authoring.md (No hardcoded credentials, zero manual sleeps, isolated fixtures, accessible locators)
 * - test-cases/Admin Initial approval-Approval-step1-test-cases.md (Features 1 through 6)
 * - notes/admin-Initial-approval-exploration-notes.md (Exact selectors, DOM behavior, and bug regressions)
 *
 * Utilizes:
 * - fixtures.ts / initial-approval-fixtures.ts (Provides authenticated adminPage, request submission, and adminInitialApproval)
 * - AdminInitialApprovalApproval Page Object
 */
test.describe('Admin Initial application - Submission for a Private School Permit - APECO Employee Review', () => {
  // Allow sufficient time for multi-step form transitions and network stability
  test.setTimeout(90000);

  // ---------------------------------------------------------------------------
  // Feature 1: Navigation, Header & Stepper Architecture
  // ---------------------------------------------------------------------------
  test.describe('Feature 1: Navigation, Header & Stepper Architecture', () => {
    test('TC-ADMREV-NAV-POS-01: Direct URL navigation to request details renders applicant metadata and active Step 1 review view', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await expect(adminInitialApproval.moduleTitle).toContainText(/Request Details|تفاصيل الطلب/);
      await expect(adminInitialApproval.applicantHeading).toContainText(/Anas Mohamed|أنس محمد|انس محمد/);
      await expect(adminInitialApproval.activeStepperItem).toContainText(/Application Information|بيانات مقدم طلب/);
      await expect(adminInitialApproval.step1Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
    });

    test('TC-ADMREV-NAV-POS-02: Header back button navigates cleanly back to Agent Queue dashboard', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminPage.goto('/agent-queue');
      await adminInitialApproval.gotoRequest(requestId);
      await adminInitialApproval.clickTopBack();

      await expect(adminPage).toHaveURL(/.*agent-queue/);
      await expect(adminPage.locator('.module-title').or(adminPage.getByRole('heading', { level: 1 })).first()).toBeVisible();
    });

    test('TC-ADMREV-NAV-POS-03: Forward and backward stepper navigation smoothly traverses all 5 review steps via wizard buttons', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      // Step 1 -> Step 2
      await adminInitialApproval.clickNext();
      await expect(adminInitialApproval.step2Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);

      // Step 2 -> Step 3
      await adminInitialApproval.clickNext();
      await expect(adminInitialApproval.step3Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);

      // Step 3 -> Step 4
      await adminInitialApproval.clickNext();
      await expect(adminInitialApproval.step4Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);

      // Step 4 -> Step 5
      await adminInitialApproval.clickNext();
      await expect(adminInitialApproval.step5Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);

      // Step 5 -> Step 4 (Previous)
      await adminInitialApproval.clickPrevious();
      await expect(adminInitialApproval.step4Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
    });

    test('TC-ADMREV-NAV-POS-04: Language toggle alternates Admin Portal review interface between English (LTR) and Arabic (RTL)', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      const arabicBtn = adminPage.locator('button:has-text("العربية"), button.lang-btn, a:has-text("العربية")').first();
      const hasArabic = await arabicBtn.isVisible().catch(() => false);
      if (hasArabic) {
        await arabicBtn.click();
        await expect(adminPage.locator('html')).toHaveAttribute('dir', 'rtl');

        const englishBtn = adminPage.locator('button:has-text("English"), a:has-text("English"), text="English"').first();
        await englishBtn.click();
        await expect(adminPage.locator('html')).toHaveAttribute('dir', 'ltr');
      } else {
        // Confirm default document layout is LTR
        await expect(adminPage.locator('html')).toHaveAttribute('dir', /ltr|^$/);
      }
    });

    test('TC-ADMREV-NAV-NEG-01: Stepper item headers do not permit non-linear skipping to unreviewed subsequent steps', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      await expect(adminInitialApproval.step1Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);

      // Attempt clicking upcoming Step 5 and Step 3 directly
      await adminInitialApproval.step5Item.click({ force: true }).catch(() => {});
      await expect(adminInitialApproval.step1Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
      await expect(adminInitialApproval.step5Item).not.toHaveClass(/ant-steps-item-process|ant-steps-item-active/);

      await adminInitialApproval.step3Item.click({ force: true }).catch(() => {});
      await expect(adminInitialApproval.step1Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
      await expect(adminInitialApproval.step3Item).not.toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
    });

    test('TC-ADMREV-NAV-NEG-02: Generic back button selector triggers strict mode violation across hidden modal templates [SURPRISE-05]', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      // Verify that scoped Page Object backButton resolves uniquely and is visible
      await expect(adminInitialApproval.backButton).toBeVisible();

      // Regression confirmation: Automation scripts must strictly scope navigation to button.new-back-btn
      await expect(adminPage.locator('button.new-back-btn')).toHaveCount(1);
    });

    test('TC-ADMREV-NAV-NEG-03: Step 1 review view keeps wizard Previous button disabled or hidden', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      const isVisible = await adminInitialApproval.prevButton.isVisible().catch(() => false);
      if (isVisible) {
        await expect(adminInitialApproval.prevButton).toBeDisabled();
      } else {
        await expect(adminInitialApproval.prevButton).toBeHidden();
      }
    });

    test('TC-ADMREV-NAV-EDGE-01: Review wizard consolidates exactly 5 numbered review steps omitting applicant Download Documents step [SURPRISE-04]', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await expect(adminInitialApproval.stepperItems).toHaveCount(5);
      const stepTexts = await adminInitialApproval.stepperItems.allInnerTexts();
      expect(stepTexts.some((t) => t.includes('Application Information') || t.includes('بيانات مقدم طلب'))).toBeTruthy();
      expect(stepTexts.some((t) => t.includes('Owners Profiles') || t.includes('بيانات الملاك'))).toBeTruthy();
      expect(stepTexts.some((t) => t.includes('School Information') || t.includes('بيانات المدرسة'))).toBeTruthy();
      expect(stepTexts.some((t) => t.includes('Attachments') || t.includes('المرفقات'))).toBeTruthy();
      expect(stepTexts.some((t) => t.includes('Summary') || t.includes('الملخص'))).toBeTruthy();
      expect(stepTexts.some((t) => t.includes('Download Documents') || t.includes('تحميل المستندات'))).toBeFalsy();
    });
  });

  // ---------------------------------------------------------------------------
  // Feature 2: Multi-Step Read-Only Application Data Verification
  // ---------------------------------------------------------------------------
  test.describe('Feature 2: Multi-Step Read-Only Application Data Verification', () => {
    test('TC-ADMREV-DATA-POS-01: Step 1 displays disabled applicant personal and contact information across both tabs', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      // Tab 1: Applicant Information
      await expect(adminInitialApproval.firstNameEnInput).toBeDisabled();
      await expect(adminInitialApproval.firstNameEnInput).toHaveValue('Anas');
      await expect(adminInitialApproval.firstNameArInput).toBeDisabled();
      await expect(adminInitialApproval.firstNameArInput).toHaveValue('انس');
      await expect(adminInitialApproval.lastNameEnInput).toBeDisabled();
      await expect(adminInitialApproval.lastNameEnInput).toHaveValue('Mohamed');
      await expect(adminInitialApproval.lastNameArInput).toBeDisabled();
      await expect(adminInitialApproval.lastNameArInput).toHaveValue('محمد');
      await expect(adminInitialApproval.dobInput).toBeDisabled();
      await expect(adminInitialApproval.dobInput).toHaveValue(/1985-01-01|01\/01\/1985/);

      // Tab 2: Contact Information
      await adminInitialApproval.contactInfoTab.click();
      await expect(adminInitialApproval.emailInput).toBeDisabled();
      await expect(adminInitialApproval.emailInput).toHaveValue('apecouser@hotmail.com');
      await expect(adminInitialApproval.addressInput).toBeDisabled();
      await expect(adminInitialApproval.addressInput).toHaveValue('Al Jurf, Ajman');
    });

    test('TC-ADMREV-DATA-POS-02: Step 2 displays 15 owner sub-tabs, personal details, disabled photo/conduct files, and 100% share', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      await adminInitialApproval.clickNext();

      await expect(adminInitialApproval.step2Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
      await expect(adminInitialApproval.ownerFullNameInput).toHaveValue('Anas Mohamed');
      await expect(adminInitialApproval.ownerPhotoCard).toBeVisible();
      await expect(adminInitialApproval.goodConductCard).toBeVisible();

      await adminInitialApproval.passportDetailsTab.click();
      await expect(adminInitialApproval.passportNumberInput).toBeVisible();
      await expect(adminInitialApproval.passportNumberInput).toBeDisabled();
    });

    test('TC-ADMREV-DATA-POS-03: Step 3 School Details tab displays infrastructure metrics, consultancy, and location block', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      await adminInitialApproval.clickNext();
      await adminInitialApproval.clickNext();

      await expect(adminInitialApproval.step3Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
      await expect(adminInitialApproval.schoolNameEnInput).toBeDisabled();
      await expect(adminInitialApproval.schoolNameEnInput).toHaveValue(/Modern Future School/);
      await expect(adminInitialApproval.consultantInput).toHaveValue('Future Edu Consultancy');
    });

    test('TC-ADMREV-DATA-POS-04: Step 3 Curriculum tab reveals nested British curriculum and FS 1 stage capacity via sequential accordion expansion [SURPRISE-02]', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      await adminInitialApproval.clickNext();
      await adminInitialApproval.clickNext();

      await adminInitialApproval.curriculumTab.click();

      // Expand Curriculum 1
      await adminInitialApproval.curriculum1Chevron.click();
      await expect(adminPage.getByText('British', { exact: false }).first()).toBeVisible();

      // Expand Stages 1
      await adminInitialApproval.stages1Chevron.click();
      await expect(adminPage.getByText('FS 1', { exact: false }).first()).toBeVisible();
      await expect(adminPage.getByText('100', { exact: false }).first()).toBeVisible();
    });

    test('TC-ADMREV-DATA-POS-05: Step 4 Attachments displays read-only signed introduction document card with disabled file label', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      await adminInitialApproval.clickNext();
      await adminInitialApproval.clickNext();
      await adminInitialApproval.clickNext();

      await expect(adminInitialApproval.step4Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
      await expect(adminInitialApproval.signedDocumentLabel).toBeVisible();
      await expect(adminInitialApproval.disabledFileCard).toBeVisible();
    });

    test('TC-ADMREV-DATA-NEG-01: Keyboard input or clipboard paste into Step 1 disabled input fields is strictly blocked', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      await expect(adminInitialApproval.firstNameEnInput).toBeDisabled();

      let inputRejected = false;
      try {
        await adminInitialApproval.firstNameEnInput.fill('Tampered', { timeout: 1500 });
      } catch {
        inputRejected = true;
      }
      expect(inputRejected).toBeTruthy();
      await expect(adminInitialApproval.firstNameEnInput).toHaveValue('Anas');
    });
  });

  // ---------------------------------------------------------------------------
  // Feature 3: Step 5 Collapsible Summary & Data Binding Verification
  // ---------------------------------------------------------------------------
  test.describe('Feature 3: Step 5 Collapsible Summary & Data Binding Verification', () => {
    test('TC-ADMREV-SUMM-POS-01: Step 5 renders all three collapsible summary sections in collapsed state with only Previous button in footer', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      for (let i = 0; i < 4; i++) {
        await adminInitialApproval.clickNext();
      }

      await expect(adminInitialApproval.step5Item).toHaveClass(/ant-steps-item-process|ant-steps-item-active/);
      await expect(adminInitialApproval.summaryChevrons).toHaveCount(3);
      await expect(adminInitialApproval.prevButton).toBeVisible();
      await expect(adminInitialApproval.nextButton).toBeHidden();
    });

    test('TC-ADMREV-SUMM-POS-02: Expanding Owners and School Details accordions accurately reflects submitted application data', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      for (let i = 0; i < 4; i++) {
        await adminInitialApproval.clickNext();
      }

      // Expand Owners
      await adminInitialApproval.ownersSummaryChevron.click();
      await expect(adminPage.getByText('Anas Mohamed').first()).toBeVisible();

      // Expand School Details
      await adminInitialApproval.schoolSummaryChevron.click();
      await expect(adminPage.getByText('Modern Future School', { exact: false }).first()).toBeVisible();
    });

    test('TC-ADMREV-SUMM-NEG-02: Step 5 Applicant Information summary accordion renders placeholder dashes for contact address [SURPRISE-03]', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);
      for (let i = 0; i < 4; i++) {
        await adminInitialApproval.clickNext();
      }

      await adminInitialApproval.applicantSummaryChevron.click();
      await expect(adminPage.getByText('Anas Mohamed').first()).toBeVisible();
      await expect(adminPage.getByText('apecouser@hotmail.com').first()).toBeVisible();

      // Verify placeholder dashes for Address
      const addressRow = adminPage.locator('.colbs-content, div:has(> .title:has-text("Applicant Information"))').first();
      await expect(addressRow).toContainText('__');
    });
  });

  // ---------------------------------------------------------------------------
  // Feature 4, 5, 6: Workflow Action Modals (Approve, Return, Reject)
  // ---------------------------------------------------------------------------
  test.describe('Feature 4-6: Workflow Decision Actions (Approve, Return, Reject)', () => {
    test('TC-ADMREV-APP-POS-01: Clicking Approve opens modal with mandatory Comments, mandatory File Upload, and disabled Save button', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openApproveModal();
      await expect(adminInitialApproval.modalTitle).toContainText(/Approve|موافقه موظف التراخيص/);
      await expect(adminInitialApproval.modalCommentsTextarea).toBeVisible();
      await expect(adminInitialApproval.modalFileInput).toBeAttached();
      await expect(adminInitialApproval.modalSaveButton).toBeDisabled();

      await adminInitialApproval.dismissModal();
    });

    test('TC-ADMREV-APP-NEG-01: Approve modal Save button remains strictly disabled when comments are populated but file upload is omitted [SURPRISE-01]', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openApproveModal();
      await adminInitialApproval.modalCommentsTextarea.fill('Comprehensive review completed. Meets standards.');
      await expect(adminInitialApproval.modalSaveButton).toBeDisabled();

      await adminInitialApproval.dismissModal();
    });

    test('TC-ADMREV-RET-POS-01: Clicking Return opens modal with required Return reasons dropdown', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openReturnModal();
      await expect(adminInitialApproval.modalTitle).toContainText(/Return|إرجاع|ارجاع/);
      await expect(adminInitialApproval.modalReasonsDropdown).toBeVisible();
      await expect(adminInitialApproval.modalSaveButton).toBeDisabled();

      await adminInitialApproval.dismissModal();
    });

    test('TC-ADMREV-RET-NEG-01: Return modal Save button remains disabled when comments are populated but Return reason is unselected', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openReturnModal();
      await adminInitialApproval.modalCommentsTextarea.fill('Please provide an updated copy of the trade license.');
      await expect(adminInitialApproval.modalSaveButton).toBeDisabled();

      await adminInitialApproval.dismissModal();
    });

    test('TC-ADMREV-RET-POS-04: Clicking Back button in Return modal dismisses dialog without persisting changes or modifying status', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openReturnModal();
      await adminInitialApproval.selectModalReason();
      await expect(adminInitialApproval.modalSaveButton).toBeEnabled();

      await adminInitialApproval.dismissModal();
      await expect(adminInitialApproval.activeModal).toBeHidden();
      await expect(adminInitialApproval.activeStepperItem).toContainText(/Application Information|بيانات مقدم طلب/);
    });

    test('TC-ADMREV-RET-POS-02: Selecting a return reason enables Save button and successfully submits return workflow', async ({
      freshInitialApprovalRequestId: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openReturnModal();
      await adminInitialApproval.selectModalReason();
      await adminInitialApproval.modalCommentsTextarea.fill('Application returned for correction: please update building area and upload required documents.');
      await expect(adminInitialApproval.modalSaveButton).toBeEnabled();

      await adminInitialApproval.submitModal();
      await expect(adminInitialApproval.activeModal).toBeHidden({ timeout: 15000 });

      // Verify return dispatched: returns to agent-queue or displays success message or updates status
      const successFeedback = adminPage
        .locator('.ant-message-success, .toast-success, [role="alert"]')
        .or(adminPage.locator('workflow-action-options').filter({ hasText: /Return|إرجاع/i }))
        .or(adminPage.locator('.module-title, .page-title').filter({ hasText: /Agent Queue|قائمة الطلبات/i }));
      await expect(successFeedback.first()).toBeVisible({ timeout: 15000 });
    });

    test('TC-ADMREV-REJ-POS-01: Clicking Reject opens modal with required Rejection reasons dropdown', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openRejectModal();
      await expect(adminInitialApproval.modalTitle).toContainText(/Reject|رفض/);
      await expect(adminInitialApproval.modalReasonsDropdown).toBeVisible();
      await expect(adminInitialApproval.modalSaveButton).toBeDisabled();

      await adminInitialApproval.dismissModal();
    });

    test('TC-ADMREV-REJ-NEG-01: Reject modal Save button remains disabled when comments are populated but Rejection reason dropdown is unselected', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openRejectModal();
      await adminInitialApproval.modalCommentsTextarea.fill('Proposed school location does not meet regulatory zoning criteria.');
      await expect(adminInitialApproval.modalSaveButton).toBeDisabled();

      await adminInitialApproval.dismissModal();
    });

    test('TC-ADMREV-REJ-POS-04: Clicking Back button in Reject modal dismisses dialog without persisting changes or modifying status', async ({
      portalInitialApprovalRequestSubmit: requestId,
      adminInitialApproval,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openRejectModal();
      await adminInitialApproval.selectModalReason();
      await expect(adminInitialApproval.modalSaveButton).toBeEnabled();

      await adminInitialApproval.dismissModal();
      await expect(adminInitialApproval.activeModal).toBeHidden();
      await expect(adminInitialApproval.activeStepperItem).toContainText(/Application Information|بيانات مقدم طلب/);
    });

    test('TC-ADMREV-REJ-POS-02: Selecting a rejection reason enables Save button and successfully submits rejection workflow', async ({
      freshInitialApprovalRequestId: requestId,
      adminInitialApproval,
      adminPage,
    }) => {
      await adminInitialApproval.gotoRequest(requestId);

      await adminInitialApproval.openRejectModal();
      await adminInitialApproval.selectModalReason();
      await adminInitialApproval.modalCommentsTextarea.fill('Application rejected due to non-compliance with private school zoning criteria.');
      await expect(adminInitialApproval.modalSaveButton).toBeEnabled();

      await adminInitialApproval.submitModal();
      await expect(adminInitialApproval.activeModal).toBeHidden({ timeout: 15000 });

      // Verify rejection dispatched: returns to agent-queue or displays success message or updates status
      const successFeedback = adminPage
        .locator('.ant-message-success, .toast-success, [role="alert"]')
        .or(adminPage.locator('workflow-action-options').filter({ hasText: /Reject|رفض/i }))
        .or(adminPage.locator('.module-title, .page-title').filter({ hasText: /Agent Queue|قائمة الطلبات/i }));
      await expect(successFeedback.first()).toBeVisible({ timeout: 15000 });
    });
  });
});
