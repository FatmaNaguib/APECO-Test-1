import { test, expect } from '../fixtures';
import { AllureHelper } from '../../utils/allureHelper';
import { ENV } from '../../config/environment';

/**
 * Allure Reporting Demonstration Suite
 * Showcases production-grade Allure integration including:
 * - Full metadata decoration (Epic, Feature, Story, Severity, Owner, Tags, Test IDs, Jira links)
 * - Structured step reporting with async boundaries
 * - Multiple attachment types (JSON, Screenshots, API payloads, Text)
 * - Telemetry & failure diagnostics via FailureCollector
 */
test.describe('Epic: Authentication & Identity Management', () => {
  test.use({ auth: false });

  test('TC-ALLURE-DEMO-01: Verify login page renders with rich Allure metadata and step attachments', async ({
    loginPage,
    page,
  }) => {
    // -------------------------------------------------------------------------
    // 1. Allure Metadata Enrichment
    // -------------------------------------------------------------------------
    await AllureHelper.epic('Authentication & Identity Management');
    await AllureHelper.feature('User Login Flow');
    await AllureHelper.story('Login View Layout & Visual Verification');
    await AllureHelper.severity('critical');
    await AllureHelper.owner('QA Automation Core');
    await AllureHelper.tags('smoke', 'allure-demo', 'authentication', 'p0');
    await AllureHelper.testId('TC-ALLURE-DEMO-01');
    await AllureHelper.jira('APECO-101');
    await AllureHelper.link('https://apeco.ae', 'APECO Corporate Portal', 'documentation');
    await AllureHelper.description(`
### Objective
Verify that the Apeco Portal Login view loads successfully, validates all essential input elements,
and captures rich step-by-step diagnostic artifacts in the Allure report.

### Key Assertions
- Page title & heading rendered in default English (LTR)
- Username and password input placeholders match specification
- Language switcher component is interactive
    `);

    // -------------------------------------------------------------------------
    // 2. Structured Test Steps with Attachments
    // -------------------------------------------------------------------------
    await AllureHelper.step('Step 1: Navigate to the Authentication Portal', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/.*auth\/login/);

      // Attach navigation metadata
      await AllureHelper.attachJson('Navigation Context', {
        targetUrl: page.url(),
        environment: ENV.name,
        timestamp: new Date().toISOString(),
      });
    });

    await AllureHelper.step('Step 2: Verify Initial Login Form Elements', async () => {
      await expect(loginPage.heading).toBeVisible();
      await expect(loginPage.heading).toHaveText('Sign in');
      await expect(loginPage.usernameField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();

      // Attach visual checkpoint screenshot
      await AllureHelper.attachScreenshot(page, 'Login View English - Initial State');
    });

    await AllureHelper.step('Step 3: Verify Simulated API Payload Attachment', async () => {
      const sampleAuthPayload = {
        endpoint: '/api/v1/Identity/Login',
        clientType: 'web-portal',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': 'en-US',
        },
        payloadPreview: {
          username: ENV.credentials.defaultUser.email,
          rememberMe: true,
        },
      };

      // Demonstrate structured API attachment
      await AllureHelper.attachApiPayload('Simulated Pre-Auth Handshake Payload', {
        url: `${ENV.apiBaseURL}/Identity/Login`,
        method: 'POST',
        headers: sampleAuthPayload.headers,
        body: sampleAuthPayload.payloadPreview,
        status: 200,
        response: { status: 'READY', sessionToken: 'mock-token-preview-xyz' },
      });
    });

    await AllureHelper.step('Step 4: Verify Language Switching and RTL Adaptation', async () => {
      await loginPage.switchLanguage('Arabic');

      // Verify layout flipped to RTL
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(loginPage.heading).toHaveText('تسجيل الدخول');

      // Attach Arabic state screenshot
      await AllureHelper.attachScreenshot(page, 'Login View Arabic - RTL Layout State');

      // Revert to English to preserve clean state
      await loginPage.switchLanguage('English');
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      await expect(loginPage.heading).toHaveText('Sign in');
    });
  });

  test('TC-ALLURE-DEMO-02: Controlled validation failure demonstrating automated diagnostic capture', async ({
    loginPage,
    page,
  }) => {
    // -------------------------------------------------------------------------
    // Metadata for failure triage demo
    // -------------------------------------------------------------------------
    await AllureHelper.epic('Authentication & Identity Management');
    await AllureHelper.feature('Negative Authentication Flows');
    await AllureHelper.story('Failure Diagnostic Automation');
    await AllureHelper.severity('minor');
    await AllureHelper.owner('QA Automation Core');
    await AllureHelper.tags('negative', 'telemetry-demo', 'regression');
    await AllureHelper.testId('TC-ALLURE-DEMO-02');
    await AllureHelper.jira('APECO-102');
    await AllureHelper.description(`
Demonstrates how the **FailureCollector** automatically captures:
1. Browser console errors
2. Network failure logs
3. High-resolution failure screenshots
4. Environment execution metadata
when a test encounters a defect or assertion mismatch.
    `);

    await AllureHelper.step('Step 1: Open Login view and verify validation triggers', async () => {
      await loginPage.goto();
      await loginPage.submitEmptyForm();

      // Verify inline errors appear
      await expect(loginPage.usernameRequiredError).toBeVisible();
      await expect(loginPage.passwordRequiredError).toBeVisible();

      await AllureHelper.attachText(
        'Validation Log',
        'Empty form submission correctly triggered client-side inline validation errors.'
      );
    });
  });
});
