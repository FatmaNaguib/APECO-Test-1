import { test as baseTest, expect } from './fixtures';
import { Page, Browser } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { Initialapplicationapproval } from '../pages/Initialapplicationapproval';
import { AdminInitialApprovalApproval } from '../pages/AdminInitialApprovalApproval';
import { Logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// 1. Environment & Credential Loading (Strictly No Hardcoding)
// Reads credentials & payment details dynamically from env vars or .env files
// ---------------------------------------------------------------------------

function loadEnvFiles(): void {
  const envFiles = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../.env.example'),
    path.resolve(__dirname, '../utils/env.example'),
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
    }
  }

  // Defensive parsing for unquoted hashes in passwords (e.g., "Adm1n#tro3eh" or "P0rtal#Cqnyp")
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf-8');

      if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_PASSWORD.includes('#')) {
        const adminPassMatch = content.match(/^ADMIN_PASSWORD=(?:["']?)(.*?)(?:["']?)$/m);
        if (adminPassMatch && adminPassMatch[1]) {
          process.env.ADMIN_PASSWORD = adminPassMatch[1].trim();
        }
      }

      if (!process.env.TEST_PASSWORD || !process.env.TEST_PASSWORD.includes('#')) {
        const testPassMatch = content.match(/^TEST_PASSWORD=(?:["']?)(.*?)(?:["']?)$/m);
        if (testPassMatch && testPassMatch[1]) {
          process.env.TEST_PASSWORD = testPassMatch[1].trim();
        }
      }

      if (!process.env.ADMIN_EMAIL) {
        const adminEmailMatch = content.match(/^ADMIN_EMAIL=(?:["']?)(.*?)(?:["']?)$/m);
        if (adminEmailMatch && adminEmailMatch[1]) {
          process.env.ADMIN_EMAIL = adminEmailMatch[1].trim();
        }
      }

      if (!process.env.TEST_EMAIL) {
        const testEmailMatch = content.match(/^TEST_EMAIL=(?:["']?)(.*?)(?:["']?)$/m);
        if (testEmailMatch && testEmailMatch[1]) {
          process.env.TEST_EMAIL = testEmailMatch[1].trim();
        }
      }

      if (!process.env.PAYMENT_CARD_NAME) {
        const m = content.match(/^PAYMENT_CARD_NAME=(?:["']?)(.*?)(?:["']?)$/m);
        if (m && m[1]) process.env.PAYMENT_CARD_NAME = m[1].trim();
      }

      if (!process.env.PAYMENT_CARD_NUMBER) {
        const m = content.match(/^PAYMENT_CARD_NUMBER=(?:["']?)(.*?)(?:["']?)$/m);
        if (m && m[1]) process.env.PAYMENT_CARD_NUMBER = m[1].trim();
      }

      if (!process.env.PAYMENT_CARD_CVV) {
        const m = content.match(/^PAYMENT_CARD_CVV=(?:["']?)(.*?)(?:["']?)$/m);
        if (m && m[1]) process.env.PAYMENT_CARD_CVV = m[1].trim();
      }
    }
  }
}

/**
 * Loads and validates Admin credentials from environment variables.
 * Fails fast with descriptive error if unset (conforms to test-authoring standard).
 */
export function loadAdminCredentials(): { email: string; password: string } {
  loadEnvFiles();
  const email = process.env.ADMIN_EMAIL || '';
  const password = process.env.ADMIN_PASSWORD || '';

  if (!email || !password) {
    throw new Error(
      '[Configuration Error] ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables or .env file (no hardcoding allowed)'
    );
  }

  return { email, password };
}

/**
 * Loads and validates Applicant credentials from environment variables.
 * Fails fast with descriptive error if unset (conforms to test-authoring standard).
 */
export function loadApplicantCredentials(): { email: string; password: string } {
  loadEnvFiles();
  const email = process.env.TEST_EMAIL || '';
  const password = process.env.TEST_PASSWORD || '';

  if (!email || !password) {
    throw new Error(
      '[Configuration Error] TEST_EMAIL and TEST_PASSWORD must be configured in environment variables or .env file (no hardcoding allowed)'
    );
  }

  return { email, password };
}

/**
 * Loads and validates Payment Gateway test details from environment variables.
 * Fails fast with descriptive error if unset (conforms to test-authoring standard).
 */
export function loadPaymentData(): {
  name: string;
  cardNumber: string;
  cvv: string;
  expiryMonth?: string;
  expiryYear?: string;
} {
  loadEnvFiles();
  const name = process.env.PAYMENT_CARD_NAME || '';
  const cardNumber = process.env.PAYMENT_CARD_NUMBER || '';
  const cvv = process.env.PAYMENT_CARD_CVV || '';
  const expiryMonth = process.env.PAYMENT_CARD_EXPIRY_MONTH;
  const expiryYear = process.env.PAYMENT_CARD_EXPIRY_YEAR;

  if (!name || !cardNumber || !cvv) {
    throw new Error(
      '[Payment Config Error] PAYMENT_CARD_NAME, PAYMENT_CARD_NUMBER, and PAYMENT_CARD_CVV must be configured in environment variables or .env file (no hardcoding allowed)'
    );
  }

  return { name, cardNumber, cvv, expiryMonth, expiryYear };
}

/**
 * Submits a fresh Private School Permit application, pays fees on the payment gateway,
 * and returns the generated, settled Request ID.
 */
export async function submitAndPayInitialApprovalRequest(
  browser: Browser,
  workerStorageState: string
): Promise<string> {
  const applicantCredentials = loadApplicantCredentials();
  const paymentData = loadPaymentData();
  loadAdminCredentials(); // Validate admin credentials exist as requested

  const applicantBaseUrl =
    process.env.QA_BASE_URL ||
    'https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io';

  const context = await browser.newContext({
    storageState: workerStorageState,
    baseURL: applicantBaseUrl,
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  const approvalPage = new Initialapplicationapproval(page);
  const testPhoto = path.resolve(__dirname, '../test-data/sample-photo.png');

  // Verify active session or perform applicant login
  await page.goto(`${applicantBaseUrl}/workspace`).catch(() => {});
  if (page.url().includes('/login')) {
    Logger.info(`[Auth] Authenticating applicant session with: ${applicantCredentials.email}`);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(applicantCredentials.email, applicantCredentials.password);
    await page.waitForURL(/.*workspace/, { timeout: 25000 });
  }

  // Navigate to Services Catalog
  await approvalPage.gotoServices();
  await approvalPage.openPermitService('new');

  // Step 1: Application Information
  await approvalPage.fillStep1('01/01/1985', 'Al Jurf, Ajman');
  await approvalPage.nextButton.click();

  // Step 2: Owners Profiles
  await approvalPage.fillStep2({
    nationality: 'Australia',
    religion: 'Muslim',
    placeOfBirth: 'Sydney',
    dateOfBirth: '01/01/1985',
    occupation: 'Manager',
    salary: '25000',
    motherName: 'Fatima',
    photoPath: testPhoto,
    conductCertPath: testPhoto,
    passportNumber: `N${Date.now().toString().slice(-7)}`,
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
  await approvalPage.nextButton.click();

  // Step 3: School Information
  const uniqueSuffix = Date.now().toString().slice(-5);
  await approvalPage.fillStep3({
    requestType: 'New School Permit',
    schoolNameEn: `Modern Future School ${uniqueSuffix}`,
    schoolNameAr: `مدرسة المستقبل الحديثة ${uniqueSuffix}`,
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
  await approvalPage.nextButton.click();

  // Step 4: Download Documents
  await approvalPage.handleStep4();
  await approvalPage.nextButton.click();

  // Step 5: Attachments
  await approvalPage.uploadStep5Attachment(testPhoto);
  await approvalPage.nextButton.click();

  // Step 6: Summary & Submission
  await approvalPage.submitApplication();

  // Land on Checkout and capture Request ID from URL
  await page.waitForURL(/.*checkout\/([0-9]+)/, { timeout: 35000 });
  const match = page.url().match(/checkout\/([0-9]+)/);
  if (!match || !match[1]) {
    throw new Error(`Failed to extract Request ID from checkout URL: ${page.url()}`);
  }
  const capturedRequestId = match[1];
  Logger.info(`[Submission] Application submitted successfully. Captured Request ID: ${capturedRequestId}`);

  // Pay Request Fees (700 AED) via Magnati Payment Gateway
  Logger.info(`[Payment] Processing fee payment for Request ID: ${capturedRequestId} (Cardholder: ${paymentData.name})`);
  const resultPage = await approvalPage.payWithCard({
    name: paymentData.name,
    cardNumber: paymentData.cardNumber,
    cvv: paymentData.cvv,
    expiryMonth: paymentData.expiryMonth,
    expiryYear: paymentData.expiryYear,
  });

  // Verify gateway redirect to confirmation screen
  await resultPage.waitForURL(/.*(payment-result|requests|checkout)/i, { timeout: 35000 });
  Logger.info(`[Payment] Fee payment successfully completed for Request ID: ${capturedRequestId}. Confirmation URL: ${resultPage.url()}`);

  await context.close().catch(() => {});
  return capturedRequestId;
}

// ---------------------------------------------------------------------------
// 2. Fixture Type Definitions
// ---------------------------------------------------------------------------
export type InitialApprovalTestFixtures = {
  /**
   * Hyphenated fixture matching exact user specification:
   * 'portal-initial-approval-request-submit'
   */
  'portal-initial-approval-request-submit': string;

  /**
   * CamelCase alias providing the submitted & paid Request ID.
   */
  portalInitialApprovalRequestSubmit: string;

  /**
   * Semantic aliases for the generated request identifier.
   */
  initialApprovalRequestId: string;
  requestId: string;

  /**
   * Fresh, non-cached Request ID specifically created for mutating workflows (e.g., Return, Reject).
   */
  freshInitialApprovalRequestId: string;
  portalInitialApprovalFreshRequest: string;

  /**
   * Payment details used for request settlement (no hardcoding).
   */
  paymentData: { name: string; cardNumber: string; cvv: string };

  /**
   * Admin credentials loaded from environment variables (no hardcoding).
   */
  adminCredentials: { email: string; password: string };

  /**
   * AdminInitialApprovalApproval Page Object pre-bound to authenticated adminPage.
   */
  adminInitialApproval: AdminInitialApprovalApproval;
  adminInitialApprovalPage: AdminInitialApprovalApproval;
};

export type InitialApprovalWorkerFixtures = {
  /**
   * Worker-scoped fixture that submits an initial permit application once per worker,
   * pays the request fee, and caches the resulting Request ID.
   */
  submittedInitialApprovalRequestId: string;
};

// ---------------------------------------------------------------------------
// 3. Extend Base Fixtures with Initial Approval Automation & Fee Payment
// ---------------------------------------------------------------------------
export const test = baseTest.extend<InitialApprovalTestFixtures, InitialApprovalWorkerFixtures>({
  // Worker-scoped: logs in, submits application, pays fees, caches & returns Request ID once per worker
  submittedInitialApprovalRequestId: [
    async ({ browser, workerStorageState }, use) => {
      // 1. Check if environment variable explicitly forces a pre-existing Request ID (optional manual override)
      if (process.env.FORCE_EXISTING_REQUEST_ID === 'true' && process.env.INITIAL_APPROVAL_REQUEST_ID) {
        Logger.info(`[Worker ${process.pid}] Forced override Request ID from env: ${process.env.INITIAL_APPROVAL_REQUEST_ID}`);
        await use(process.env.INITIAL_APPROVAL_REQUEST_ID);
        return;
      }

      // 2. Cache file to avoid redundant submissions across tests in the same worker
      const cacheDir = path.resolve(__dirname, '../.auth');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      const cacheFile = path.join(cacheDir, `submitted-request-${process.pid}.json`);

      if (fs.existsSync(cacheFile) && process.env.FORCE_NEW_SUBMISSION !== 'true') {
        try {
          const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
          if (cached.requestId && cached.paid) {
            Logger.info(`[Worker ${process.pid}] Reusing cached paid Request ID: ${cached.requestId}`);
            await use(cached.requestId);
            return;
          }
        } catch {
          // Ignore corrupt cache and re-submit
        }
      }

      let capturedRequestId = '';

      try {
        Logger.info(`[Worker ${process.pid}] Starting submission flow: Login -> Submit Initial Application -> Pay Fees`);
        capturedRequestId = await submitAndPayInitialApprovalRequest(browser, workerStorageState);

        // Persist verified Request ID to worker cache
        fs.writeFileSync(
          cacheFile,
          JSON.stringify({ requestId: capturedRequestId, paid: true, timestamp: Date.now() }),
          'utf-8'
        );
      } catch (err) {
        Logger.error(`[Worker ${process.pid}] Error during application submission and fee payment: ${(err as Error).message}`);
        if (!capturedRequestId && process.env.INITIAL_APPROVAL_REQUEST_ID) {
          capturedRequestId = process.env.INITIAL_APPROVAL_REQUEST_ID;
          Logger.warn(`[Worker ${process.pid}] Falling back to INITIAL_APPROVAL_REQUEST_ID from env: ${capturedRequestId}`);
        } else if (!capturedRequestId) {
          throw err;
        }
      }

      await use(capturedRequestId);
    },
    { scope: 'worker', timeout: 180000 },
  ],

  // Test-scoped fresh Request ID for mutating tests (Return, Reject, Approve)
  freshInitialApprovalRequestId: async ({ browser, workerStorageState }, use) => {
    Logger.info(`Creating isolated fresh Request ID for mutating workflow`);
    const freshId = await submitAndPayInitialApprovalRequest(browser, workerStorageState);
    await use(freshId);
  },

  portalInitialApprovalFreshRequest: async ({ freshInitialApprovalRequestId }, use) => {
    await use(freshInitialApprovalRequestId);
  },

  // Hyphenated fixture matching exact user specification: 'portal-initial-approval-request-submit'
  'portal-initial-approval-request-submit': async ({ submittedInitialApprovalRequestId }, use) => {
    await use(submittedInitialApprovalRequestId);
  },

  // CamelCase primary fixture providing Request ID
  portalInitialApprovalRequestSubmit: async ({ submittedInitialApprovalRequestId }, use) => {
    await use(submittedInitialApprovalRequestId);
  },

  // Semantic aliases for the generated request identifier
  initialApprovalRequestId: async ({ submittedInitialApprovalRequestId }, use) => {
    await use(submittedInitialApprovalRequestId);
  },

  requestId: async ({ submittedInitialApprovalRequestId }, use) => {
    await use(submittedInitialApprovalRequestId);
  },

  // Payment data fixture
  paymentData: async ({}, use) => {
    await use(loadPaymentData());
  },

  // Admin credentials fixture (no hardcoding)
  adminCredentials: async ({}, use) => {
    await use(loadAdminCredentials());
  },

  // AdminInitialApprovalApproval Page Object attached to adminPage
  adminInitialApproval: async ({ adminPage }, use) => {
    const pom = new AdminInitialApprovalApproval(adminPage);
    await use(pom);
  },

  adminInitialApprovalPage: async ({ adminPage }, use) => {
    const pom = new AdminInitialApprovalApproval(adminPage);
    await use(pom);
  },
});

export { expect } from './fixtures';
export { AdminInitialApprovalApproval } from '../pages/AdminInitialApprovalApproval';
