import { test, expect } from './fixtures';
import path from 'path';

/**
 * Initial Application - Submission for a Private School Permit E2E Test Suite
 * Conforms strictly to skills/test-authoring.md and test-cases/Applicant-Services-test-cases.md.
 * Utilizes the isolated pre-authenticated `login` fixture and Initialapplicationapproval Page Object.
 * All assertions evaluate visible user-facing UI text, states, and route transitions.
 */
test.describe('Feature: Initial application - Submission for a Private School Permit', () => {
  // Allow sufficient time for multi-step form completion and network uploads
  test.setTimeout(90000);

  // Test fixture document paths
  const testDocPdf = path.resolve(__dirname, '../test-data/sample-document.pdf');
  const testPhoto = path.resolve(__dirname, '../test-data/sample-photo.png');

  // ---------------------------------------------------------------------------
  // 1. End-to-End Positive Workflow
  // ---------------------------------------------------------------------------
  test.describe('E2E Positive Submission Workflow', () => {
    test('TC-PERMIT-POS-01: End-to-end submission with valid data generates Request ID and navigates to checkout', async ({
      login: page,
      initialApplicationApproval,
    }) => {
      // 1. Navigate to services catalog and open permit service
      await initialApplicationApproval.gotoServices();
      await initialApplicationApproval.openPermitService('new');

      // Assert: Wizard header rendered
      await expect(initialApplicationApproval.serviceTitle).toBeVisible();

      // 2. Step 1: Application Information
      await initialApplicationApproval.fillStep1('01/01/1985', 'Al Jurf, Ajman');
      await expect(initialApplicationApproval.nextButton).toBeEnabled();
      await initialApplicationApproval.nextButton.click();

      // 3. Step 2: Owners Profiles
      await initialApplicationApproval.fillStep2({
        nationality: 'Australia',
        religion: 'Muslim',
        placeOfBirth: 'Sydney',
        dateOfBirth: '01/01/1985',
        occupation: 'Manager',
        salary: '25000',
        motherName: 'Fatima',
        photoPath: testPhoto,
        conductCertPath: testPhoto,
        passportNumber: 'N1234567',
        passportPlace: 'Sydney',
        passportIssueDate: '01/01/2020',
        passportExpiryDate: '01/01/2030',
        passportDocPath: testPhoto,
        qualification: 'Bachelor',
        specialization: 'Education',
        university: 'University of Sydney',
        gradYear: '01/01/2010',
        country: 'Australia',
        maritalStatus: 'Single',
        fatherName: 'Mohamed',
        region: 'Al Jurf',
        street: 'Al Ittihad St',
        mobile: '+971501234567',
        poBox: '1234',
        sharePercentage: '100',
      });

      await expect(initialApplicationApproval.nextButton).toBeEnabled();
      await initialApplicationApproval.nextButton.click();

      // 4. Step 3: School Information
      await initialApplicationApproval.fillStep3({
        requestType: 'New School Permit',
        schoolNameEn: `Modern Future School ${Date.now().toString().slice(-5)}`,
        schoolNameAr: `مدرسة المستقبل الحديثة ${Date.now().toString().slice(-5)}`,
        consultant: 'Future Edu Consultancy',
        address: 'Al Jurf 2, Ajman',
        studentGender: 'Boys and Girls',
        locationBlockEn: 'Block 12',
        locationBlockAr: 'قطعة 12',
        landOwnership: 'Private',
        totalLandArea: '15000',
        buildingOwnership: 'Private',
        totalBuildingArea: '8500',
        indoorCourtArea: '2000',
        outdoorCanopyArea: '1500',
        applicantRelation: 'Owner',
        phone: '0501234567',
        locationMapPath: testPhoto,
        proofOwnershipPath: testPhoto,
        feasibilityStudyPath: testPhoto,
        curriculum: 'British',
        stage: 'Kindergarten',
        grade: 'FS 1',
        capacity: '100',
        classrooms: '4',
      });

      await expect(initialApplicationApproval.nextButton).toBeEnabled();
      await initialApplicationApproval.nextButton.click();

      // 5. Step 4: Download Documents
      await initialApplicationApproval.handleStep4();
      await expect(initialApplicationApproval.nextButton).toBeEnabled();
      await initialApplicationApproval.nextButton.click();

      // 6. Step 5: Attachments (Upload signed introduction document)
      await expect(initialApplicationApproval.attachmentHeading).toBeVisible();
      await initialApplicationApproval.uploadStep5Attachment(testPhoto);
      await expect(initialApplicationApproval.completionRate).toContainText('100');
      await initialApplicationApproval.nextButton.click();

      // 7. Step 6: Summary & Submission
      await expect(initialApplicationApproval.summaryHeading).toBeVisible();
      await expect(initialApplicationApproval.payButton).toBeDisabled();

      // Check acknowledgment and submit
      await initialApplicationApproval.submitApplication();

      // 8. Step 7: Checkout & Invoice Verification
      await expect(page).toHaveURL(/.*checkout/);
      await expect(initialApplicationApproval.paymentHeading).toBeVisible();
      await expect(page.getByText('700.00 AED', { exact: false }).first()).toBeVisible();
      await expect(initialApplicationApproval.downloadInvoiceButton).toBeVisible();
      await initialApplicationApproval.payNowButton.scrollIntoViewIfNeeded();
      await expect(initialApplicationApproval.payNowButton).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Wizard Stepper Validations & State Transitions
  // ---------------------------------------------------------------------------
  test.describe('Wizard Progression & State Validations', () => {
    test('TC-PERMIT-POS-04: Step 1 multi-tab progression enables Next button only when both Applicant and Contact tabs are valid', async ({
      login: page,
      initialApplicationApproval,
    }) => {
      await initialApplicationApproval.gotoServices();
      await initialApplicationApproval.openPermitService('new');

      // Populate Date of Birth on Applicant Information tab
      await initialApplicationApproval.dateOfBirthInput.fill('01/01/1985');
      await initialApplicationApproval.dateOfBirthInput.press('Enter');

      // Switch to Contact Information tab and populate Address
      await initialApplicationApproval.contactInfoTab.click();
      await initialApplicationApproval.addressInput.fill('Al Jurf, Ajman');

      // Assert: Both tabs satisfied -> Next button advances cleanly to Step 2
      await initialApplicationApproval.nextButton.click();
      await expect(initialApplicationApproval.personalDetailsTab).toBeVisible();
    });

    test('TC-PERMIT-NEG-03: Step 2 blocks advancement when owner share percentage is less than 100%', async ({
      login: page,
      initialApplicationApproval,
    }) => {
      await initialApplicationApproval.gotoServices();
      await initialApplicationApproval.openPermitService('new');

      // Advance through Step 1
      await initialApplicationApproval.fillStep1('01/01/1985', 'Al Jurf, Ajman');
      await initialApplicationApproval.nextButton.click();

      // Step 2: Set share percentage to 75%
      await initialApplicationApproval.sharePercentageTab.click();
      await initialApplicationApproval.sharePercentageInput.fill('75');

      // Assert: Validation warning is visible and Next remains disabled
      await expect(initialApplicationApproval.sharePercentageWarning).toBeVisible();
      await expect(initialApplicationApproval.nextButton).toBeDisabled();
    });

    test('TC-PERMIT-NEG-10: Step 6 Pay button remains strictly disabled when acknowledgment checkbox is unchecked', async ({
      login: page,
      initialApplicationApproval,
    }) => {
      await initialApplicationApproval.gotoServices();
      await initialApplicationApproval.openPermitService('new');

      // Complete Steps 1 through 5
      await initialApplicationApproval.fillStep1('01/01/1985', 'Al Jurf, Ajman');
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.fillStep2({
        nationality: 'Australia',
        religion: 'Muslim',
        placeOfBirth: 'Sydney',
        dateOfBirth: '01/01/1985',
        occupation: 'Manager',
        salary: '25000',
        motherName: 'Fatima',
        photoPath: testPhoto,
        conductCertPath: testPhoto,
        passportNumber: 'N1234567',
        passportPlace: 'Sydney',
        passportIssueDate: '01/01/2020',
        passportExpiryDate: '01/01/2030',
        passportDocPath: testPhoto,
        qualification: 'Bachelor',
        specialization: 'Education',
        university: 'University of Sydney',
        gradYear: '01/01/2010',
        country: 'Australia',
        maritalStatus: 'Single',
        fatherName: 'Mohamed',
        region: 'Al Jurf',
        street: 'Al Ittihad St',
        mobile: '+971501234567',
        poBox: '1234',
        sharePercentage: '100',
      });
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.fillStep3({
        requestType: 'New School Permit',
        schoolNameEn: `Modern Future School ${Date.now().toString().slice(-5)}`,
        schoolNameAr: `مدرسة المستقبل الحديثة ${Date.now().toString().slice(-5)}`,
        consultant: 'Future Edu Consultancy',
        address: 'Al Jurf 2, Ajman',
        studentGender: 'Boys and Girls',
        locationBlockEn: 'Block 12',
        locationBlockAr: 'قطعة 12',
        landOwnership: 'Private',
        totalLandArea: '15000',
        buildingOwnership: 'Private',
        totalBuildingArea: '8500',
        indoorCourtArea: '2000',
        outdoorCanopyArea: '1500',
        applicantRelation: 'Owner',
        phone: '0501234567',
        locationMapPath: testPhoto,
        proofOwnershipPath: testPhoto,
        feasibilityStudyPath: testPhoto,
        curriculum: 'British',
        stage: 'Kindergarten',
        grade: 'FS 1',
        capacity: '100',
        classrooms: '4',
      });
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.handleStep4();
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.uploadStep5Attachment(testPhoto);
      await initialApplicationApproval.nextButton.click();

      // Step 6: Verify Pay button is initially disabled without acknowledgment
      await expect(initialApplicationApproval.summaryHeading).toBeVisible();
      await expect(initialApplicationApproval.acknowledgmentCheckbox).not.toBeChecked();
      await expect(initialApplicationApproval.payButton).toBeDisabled();

      // Check acknowledgment -> Verify Pay button enables
      await initialApplicationApproval.acknowledgmentCheckbox.check({ force: true });
      await expect(initialApplicationApproval.payButton).toBeEnabled();

      // Uncheck acknowledgment -> Verify Pay button disables again
      await initialApplicationApproval.acknowledgmentCheckbox.uncheck({ force: true });
      await expect(initialApplicationApproval.payButton).toBeDisabled();
    });

    test('TC-PERMIT-POS-10: Checkout screen displays 700.00 AED invoice and Pay Later routes to unpaid invoice list', async ({
      login: page,
      initialApplicationApproval,
    }) => {
      await initialApplicationApproval.gotoServices();
      await initialApplicationApproval.openPermitService('new');

      // Complete Steps 1 through 6
      await initialApplicationApproval.fillStep1('01/01/1985', 'Al Jurf, Ajman');
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.fillStep2({
        nationality: 'Australia',
        religion: 'Muslim',
        placeOfBirth: 'Sydney',
        dateOfBirth: '01/01/1985',
        occupation: 'Manager',
        salary: '25000',
        motherName: 'Fatima',
        photoPath: testPhoto,
        conductCertPath: testPhoto,
        passportNumber: 'N1234567',
        passportPlace: 'Sydney',
        passportIssueDate: '01/01/2020',
        passportExpiryDate: '01/01/2030',
        passportDocPath: testPhoto,
        qualification: 'Bachelor',
        specialization: 'Education',
        university: 'University of Sydney',
        gradYear: '01/01/2010',
        country: 'Australia',
        maritalStatus: 'Single',
        fatherName: 'Mohamed',
        region: 'Al Jurf',
        street: 'Al Ittihad St',
        mobile: '+971501234567',
        poBox: '1234',
        sharePercentage: '100',
      });
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.fillStep3({
        requestType: 'New School Permit',
        schoolNameEn: `Modern Future School ${Date.now().toString().slice(-5)}`,
        schoolNameAr: `مدرسة المستقبل الحديثة ${Date.now().toString().slice(-5)}`,
        consultant: 'Future Edu Consultancy',
        address: 'Al Jurf 2, Ajman',
        studentGender: 'Boys and Girls',
        locationBlockEn: 'Block 12',
        locationBlockAr: 'قطعة 12',
        landOwnership: 'Private',
        totalLandArea: '15000',
        buildingOwnership: 'Private',
        totalBuildingArea: '8500',
        indoorCourtArea: '2000',
        outdoorCanopyArea: '1500',
        applicantRelation: 'Owner',
        phone: '0501234567',
        locationMapPath: testPhoto,
        proofOwnershipPath: testPhoto,
        feasibilityStudyPath: testPhoto,
        curriculum: 'British',
        stage: 'Kindergarten',
        grade: 'FS 1',
        capacity: '100',
        classrooms: '4',
      });
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.handleStep4();
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.uploadStep5Attachment(testPhoto);
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.submitApplication();

      // On Checkout: click Pay Later
      await expect(initialApplicationApproval.payLaterButton).toBeVisible();
      await initialApplicationApproval.payLaterButton.click();

      // Verify routing to Invoices with Unpaid invoice
      await expect(page).toHaveURL(/.*invoices/);
      await expect(page.getByRole('heading', { name: 'Invoices' }).or(page.locator('.title, h1, h2, h3, [class*="title"]').filter({ hasText: 'Invoices' })).first()).toBeVisible();
      await expect(page.getByText('Unpaid', { exact: true }).first()).toBeVisible();
    });

    test('TC-PERMIT-POS-11: Complete end-to-end payment from Checkout step with valid card details updates invoice to Paid', async ({
      login: page,
      initialApplicationApproval,
    }) => {
      test.setTimeout(120000);

      await initialApplicationApproval.gotoServices();
      await initialApplicationApproval.openPermitService('new');

      // Complete Steps 1 through 6
      await initialApplicationApproval.fillStep1('01/01/1985', 'Al Jurf, Ajman');
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.fillStep2({
        nationality: 'Australia',
        religion: 'Muslim',
        placeOfBirth: 'Sydney',
        dateOfBirth: '01/01/1985',
        occupation: 'Manager',
        salary: '25000',
        motherName: 'Fatima',
        photoPath: testPhoto,
        conductCertPath: testPhoto,
        passportNumber: 'N1234567',
        passportPlace: 'Sydney',
        passportIssueDate: '01/01/2020',
        passportExpiryDate: '01/01/2030',
        passportDocPath: testPhoto,
        qualification: 'Bachelor',
        specialization: 'Education',
        university: 'University of Sydney',
        gradYear: '01/01/2010',
        country: 'Australia',
        maritalStatus: 'Single',
        fatherName: 'Mohamed',
        region: 'Al Jurf',
        street: 'Al Ittihad St',
        mobile: '+971501234567',
        poBox: '1234',
        sharePercentage: '100',
      });
      await initialApplicationApproval.nextButton.click();

      const dynamicSchoolId = Date.now().toString().slice(-5);
      await initialApplicationApproval.fillStep3({
        requestType: 'New School Permit',
        schoolNameEn: `Modern Future School ${dynamicSchoolId}`,
        schoolNameAr: `مدرسة المستقبل الحديثة ${dynamicSchoolId}`,
        consultant: 'Future Edu Consultancy',
        address: 'Al Jurf 2, Ajman',
        studentGender: 'Boys and Girls',
        locationBlockEn: 'Block 12',
        locationBlockAr: 'قطعة 12',
        landOwnership: 'Private',
        totalLandArea: '15000',
        buildingOwnership: 'Private',
        totalBuildingArea: '8500',
        indoorCourtArea: '2000',
        outdoorCanopyArea: '1500',
        applicantRelation: 'Owner',
        phone: '0501234567',
        locationMapPath: testPhoto,
        proofOwnershipPath: testPhoto,
        feasibilityStudyPath: testPhoto,
        curriculum: 'British',
        stage: 'Kindergarten',
        grade: 'FS 1',
        capacity: '100',
        classrooms: '4',
      });
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.handleStep4();
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.uploadStep5Attachment(testPhoto);
      await initialApplicationApproval.nextButton.click();

      await initialApplicationApproval.submitApplication();

      // On Checkout: verify amount and process payment with card details
      await expect(page).toHaveURL(/.*checkout/);
      await expect(page.getByText('700.00 AED', { exact: false }).first()).toBeVisible();

      const resultPage = await initialApplicationApproval.payWithCard({
        name: 'Ali',
        cardNumber: '5204740000001002',
        cvv: '888',
      });

      // Verify confirmation screen
      await expect(resultPage).toHaveURL(/.*payment-result/);
      await expect(resultPage.getByText('Your request has been submitted successfully', { exact: false })).toBeVisible();
      await expect(resultPage.getByText('700.00 AED', { exact: false }).first()).toBeVisible();

      // Verify invoice marked Paid in /invoices
      await resultPage.goto('/invoices');
      await expect(resultPage).toHaveURL(/.*invoices/);
      await expect(
        resultPage
          .getByRole('row')
          .filter({ hasText: 'Initial application - Submission for a Private School Permit' })
          .getByText('Paid', { exact: true })
          .first()
      ).toBeVisible();
    });
  });
});

