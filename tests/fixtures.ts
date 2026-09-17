import { test as baseTest, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { Initialapplicationapproval } from '../pages/Initialapplicationapproval';
import { Logger } from '../utils/logger';
import { FailureCollector } from '../utils/failureCollector';

// ---------------------------------------------------------------------------
// 1. Environment & Credential Loading (No Hardcoding)
// Reads credentials dynamically from APECO-Test-1/utils/env.example (or .env)
// ---------------------------------------------------------------------------
function loadCredentials(): { email: string; password: string } {
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
};

type WorkerFixtures = {
  /**
   * Worker-scoped storage state file path.
   * Logs in once per worker process and persists session tokens to disk.
   */
  workerStorageState: string;
};

// ---------------------------------------------------------------------------
// 3. Extended Test Instance
// ---------------------------------------------------------------------------
export const test = baseTest.extend<TestFixtures, WorkerFixtures>({
  auth: [true, { option: true }],

  // Worker-scoped fixture: Logs in once per worker and saves storage state
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

  // Authenticated page fixture: logs in once per worker and provides authenticated page
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

  // Login fixture providing an isolated, pre-authenticated page
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
});

export { expect } from '@playwright/test';
