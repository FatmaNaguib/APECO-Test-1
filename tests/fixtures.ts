import { test as baseTest, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { Initialapplicationapproval } from '../pages/Initialapplicationapproval';
import { Logger } from '../utils/logger';
import { FailureCollector } from '../utils/failureCollector';

// ---------------------------------------------------------------------------
// 1. Environment & Credential Loading (No Hardcoding)
// Reads credentials dynamically from env vars, .env, utils/env.example, or .env.example
// ---------------------------------------------------------------------------
export function loadCredentials(): { email: string; password: string } {
  const envFiles = [
    path.resolve(__dirname, '../utils/env.example'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../.env.example'),
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
    }
  }

  let email = process.env.TEST_EMAIL || '';
  let password = process.env.TEST_PASSWORD || '';

  // Defensive fallback: If password contains '#' and dotenv stripped it as a comment when unquoted
  if (!password || password === 'P0rtal') {
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf-8');
        const emailMatch = content.match(/^TEST_EMAIL=(?:["']?)(.*?)(?:["']?)$/m);
        const passMatch = content.match(/^TEST_PASSWORD=(?:["']?)(.*?)(?:["']?)$/m);
        if (!email && emailMatch) email = emailMatch[1].trim();
        if (passMatch) {
          const rawPass = passMatch[1].trim();
          if (rawPass.length > password.length) {
            password = rawPass;
            break;
          }
        }
      }
    }
  }

  if (!email || !password) {
    throw new Error(
      '[Auth Error] TEST_EMAIL and TEST_PASSWORD must be configured in utils/env.example or .env'
    );
  }

  // Ensure process.env has the complete un-truncated password
  process.env.TEST_EMAIL = email;
  process.env.TEST_PASSWORD = password;

  return { email, password };
}

export function loadAdminCredentials(): { email: string; password: string } {
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

  let email = process.env.ADMIN_EMAIL || '';
  let password = process.env.ADMIN_PASSWORD || '';

  // Defensive fallback: If password contains '#' and dotenv stripped it as a comment when unquoted
  if (!password || password.includes('#') === false) {
    for (const envFile of envFiles) {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf-8');
        const emailMatch = content.match(/^ADMIN_EMAIL=(?:["']?)(.*?)(?:["']?)$/m);
        const passMatch = content.match(/^ADMIN_PASSWORD=(?:["']?)(.*?)(?:["']?)$/m);
        if (!email && emailMatch) email = emailMatch[1].trim();
        if (passMatch) {
          const rawPass = passMatch[1].trim();
          if (rawPass.length > password.length) {
            password = rawPass;
            break;
          }
        }
      }
    }
  }

  if (!email || !password) {
    throw new Error(
      '[Auth Error] ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables, .env, or .env.example'
    );
  }

  // Ensure process.env has the complete un-truncated password
  process.env.ADMIN_EMAIL = email;
  process.env.ADMIN_PASSWORD = password;

  return { email, password };
}

const { email: TEST_EMAIL, password: TEST_PASSWORD } = loadCredentials();

// ---------------------------------------------------------------------------
// 2. Fixture Types
// ---------------------------------------------------------------------------
type TestOptions = {
  /**
   * Whether the default `page` fixture should be authenticated.
   * Defaults to `true`. Set `test.use({ auth: false })` in unauthenticated suites like login.spec.ts.
   */
  auth: boolean;
};

type TestFixtures = TestOptions & {
  /**
   * Page fixture. Pre-authenticated by default, or clean when `auth: false`.
   */
  page: Page;

  /**
   * Explicit alias for `page` with pre-authenticated state.
   */
  authenticatedPage: Page;

  /**
   * Login fixture: Isolated, pre-authenticated page instance.
   */
  login: Page;

  /**
   * Clean, unauthenticated page fixture for testing public/login views.
   */
  unauthenticatedPage: Page;

  /**
   * LoginPage instance for page-specific actions.
   */
  loginPage: LoginPage;

  /**
   * Initialapplicationapproval Page Object instance for Permit service tests.
   */
  initialApplicationApproval: Initialapplicationapproval;

  /**
   * Admin login fixture: Provides an isolated, pre-authenticated page logged into the Admin Portal.
   * Logs in once per worker process and provides an authenticated page to any test that needs it.
   */
  adminLogin: Page;

  /**
   * Explicit alias for adminLogin.
   */
  adminPage: Page;

  /**
   * Authenticated admin page fixture.
   */
  adminAuthenticatedPage: Page;

  /**
   * AdminLoginPage Page Object instance for Admin Portal authentication actions.
   */
  adminLoginPage: AdminLoginPage;
};

type WorkerFixtures = {
  /**
   * Worker-scoped storage state file path for Applicant Portal.
   * Logs in once per worker process and persists session tokens to disk.
   */
  workerStorageState: string;

  /**
   * Worker-scoped storage state file path for Admin Portal.
   * Logs into Admin Portal once per worker process and persists session tokens to disk.
   */
  adminWorkerStorageState: string;
};

// ---------------------------------------------------------------------------
// 3. Extended Test Instance
// ---------------------------------------------------------------------------
export const test = baseTest.extend<TestFixtures, WorkerFixtures>({
  auth: [true, { option: true }],

  // Worker-scoped fixture: Logs in once per worker and saves applicant storage state
  workerStorageState: [
    async ({ browser }, use) => {
      const authDir = path.resolve(__dirname, '../.auth');
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      }

      // Unique storage state file per worker process
      const authFile = path.join(authDir, `worker-auth-${process.pid}.json`);

      if (!fs.existsSync(authFile) || fs.statSync(authFile).size === 0) {
        Logger.info(`[One-Time Login] Authenticating worker ${process.pid} with user: ${TEST_EMAIL}`);

        const context = await browser.newContext();
        const page = await context.newPage();
        const loginPage = new LoginPage(page);

        // Perform single login flow
        await loginPage.goto();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

        // Wait for successful navigation to workspace
        await page.waitForURL(/.*workspace/, { timeout: 25000 });

        // Save session storage, cookies, and local tokens to storageState
        await context.storageState({ path: authFile });
        await context.close();

        Logger.info(`[One-Time Login] Saved authenticated storage state to: ${authFile}`);
      }

      await use(authFile);
    },
    { scope: 'worker', timeout: 60000 },
  ],

  // Worker-scoped fixture: Logs into Admin Portal once per worker and saves admin storage state
  adminWorkerStorageState: [
    async ({ browser }, use) => {
      const authDir = path.resolve(__dirname, '../.auth');
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      }

      // Unique admin storage state file per worker process
      const adminAuthFile = path.join(authDir, `worker-admin-auth-${process.pid}.json`);

      if (!fs.existsSync(adminAuthFile) || fs.statSync(adminAuthFile).size === 0) {
        const { email: adminEmail, password: adminPassword } = loadAdminCredentials();
        const adminBaseUrl =
          process.env.ADMIN_BASE_URL ||
          process.env.QA_ADMIN_BASE_URL ||
          'https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io';

        Logger.info(`[Admin One-Time Login] Authenticating worker ${process.pid} with admin user: ${adminEmail}`);

        const context = await browser.newContext({
          baseURL: adminBaseUrl,
          viewport: { width: 1280, height: 720 },
          ignoreHTTPSErrors: true,
        });
        const page = await context.newPage();
        const adminLoginPage = new AdminLoginPage(page);

        try {
          // Navigate to Admin Login
          await adminLoginPage.goto('/login');

          // Enter credentials and submit
          await adminLoginPage.login(adminEmail, adminPassword);

          // Wait for successful navigation to agent queue or dashboard
          await page.waitForURL(/.*(agent-queue|requests|dashboard)/, { timeout: 35000 });

          // Save session cookies and storage to admin storage state
          await context.storageState({ path: adminAuthFile });
          Logger.info(`[Admin One-Time Login] Saved authenticated admin storage state to: ${adminAuthFile}`);
        } catch (error) {
          Logger.error(`[Admin One-Time Login] Failed to authenticate admin user: ${(error as Error).message}`);
          throw error;
        } finally {
          await context.close();
        }
      }

      await use(adminAuthFile);
    },
    { scope: 'worker', timeout: 90000 },
  ],

  // Clean, isolated page fixture by default
  page: async ({ browser }, use, testInfo) => {
    Logger.debug('Creating new isolated clean browser context');
    const context = await browser.newContext();
    const page = await context.newPage();
    const failureCollector = new FailureCollector(page);

    await use(page);

    await failureCollector.collectOnFailure(testInfo);
    await context.close();
  },

  // Authenticated page fixture: logs in once per worker and provides authenticated applicant page
  authenticatedPage: async ({ browser, workerStorageState }, use, testInfo) => {
    Logger.debug('Creating new isolated browser context with authenticated storageState');
    const context = await browser.newContext({
      storageState: workerStorageState,
    });
    const page = await context.newPage();
    const failureCollector = new FailureCollector(page);

    await use(page);

    await failureCollector.collectOnFailure(testInfo);
    await context.close().catch(e => Logger.warn(`Context close warning: ${e.message}`));
  },

  // Login fixture providing an isolated, pre-authenticated page for applicant tests
  login: async ({ authenticatedPage }, use) => {
    await use(authenticatedPage);
  },

  // Clean unauthenticated page alias
  unauthenticatedPage: async ({ page }, use) => {
    await use(page);
  },

  // Page Object helper using the clean test page
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Initialapplicationapproval Page Object fixture
  initialApplicationApproval: async ({ authenticatedPage }, use) => {
    const approval = new Initialapplicationapproval(authenticatedPage);
    await use(approval);
  },

  // Authenticated Admin page fixture: logs in once per worker and provides authenticated admin page
  adminAuthenticatedPage: async ({ browser, adminWorkerStorageState }, use, testInfo) => {
    const adminBaseUrl =
      process.env.ADMIN_BASE_URL ||
      process.env.QA_ADMIN_BASE_URL ||
      'https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io';

    Logger.debug('Creating new isolated browser context with admin authenticated storageState');
    const context = await browser.newContext({
      storageState: adminWorkerStorageState,
      baseURL: adminBaseUrl,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    const failureCollector = new FailureCollector(page);

    await use(page);

    await failureCollector.collectOnFailure(testInfo);
    await context.close().catch(e => Logger.warn(`Admin context close warning: ${e.message}`));
  },

  // Admin login fixture: logs in once and provides an authenticated page to any test that requests { adminLogin }
  adminLogin: async ({ adminAuthenticatedPage }, use) => {
    await use(adminAuthenticatedPage);
  },

  // Explicit semantic alias: { adminPage }
  adminPage: async ({ adminAuthenticatedPage }, use) => {
    await use(adminAuthenticatedPage);
  },

  // AdminLoginPage Page Object helper
  adminLoginPage: async ({ page }, use) => {
    const adminLoginPage = new AdminLoginPage(page);
    await use(adminLoginPage);
  },
});

export { expect } from '@playwright/test';
