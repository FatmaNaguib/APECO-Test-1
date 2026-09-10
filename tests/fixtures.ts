import { test as baseTest, expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { Logger } from '../utils/logger';

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
type TestFixtures = {
  /**
   * Pre-authenticated page fixture.
   * Tests requesting `page` start with active authentication tokens and cookies.
   */
  page: Page;

  /**
   * Explicit alias for `page` with pre-authenticated state.
   */
  authenticatedPage: Page;

  /**
   * Clean, unauthenticated page fixture for testing public/login views.
   */
  unauthenticatedPage: Page;

  /**
   * LoginPage instance for page-specific actions.
   */
  loginPage: LoginPage;
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
    { scope: 'worker' },
  ],

  // Overridden `page` fixture: Pre-authenticated and isolated per test
  page: async ({ browser, workerStorageState }, use) => {
    Logger.debug('Creating new isolated browser context with authenticated storageState');
    const context = await browser.newContext({
      storageState: workerStorageState,
    });
    const page = await context.newPage();

    await use(page);

    await context.close();
  },

  // Explicit authenticatedPage alias
  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },

  // Clean unauthenticated page for public/auth test cases
  unauthenticatedPage: async ({ browser }, use) => {
    Logger.debug('Creating new isolated unauthenticated browser context');
    const context = await browser.newContext();
    const page = await context.newPage();

    await use(page);

    await context.close();
  },

  // Page Object helper
  loginPage: async ({ unauthenticatedPage }, use) => {
    const loginPage = new LoginPage(unauthenticatedPage);
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
