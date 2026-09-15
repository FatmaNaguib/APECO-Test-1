import { test, expect } from './fixtures';
import { ENV } from '../config/environment';

/**
 * Login Feature Test Suite
 * Covers Positive, Negative, Edge, and Regression cases defined in test-cases.md
 * Adheres strictly to skills/test-authoring.md standard.
 * All assertions validate visible user-facing UI text rather than DOM element tags or layout attributes.
 */
test.describe('Feature: Login', () => {
  // Use clean unauthenticated context for all login tests
  test.use({ auth: false });

  const validUser = ENV.credentials.defaultUser.email;
  const validPass = ENV.credentials.defaultUser.password;

  // ---------------------------------------------------------------------------
  // 1. Positive Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Positive Flows', () => {
    test('TC-LOGIN-POS-01: Successful authentication with valid credentials navigates to workspace dashboard', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(validUser, validPass);

      // Verify redirection to workspace and dashboard rendering by visible UI text
      await expect(page).toHaveURL(/.*workspace/, { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'My Schools' })).toBeVisible();
    });

    test('TC-LOGIN-POS-02: Deep linking preserves and routes to redirect-url destination upon authentication', async ({ loginPage, page }) => {
      await loginPage.goto('/schools');
      await expect(page).toHaveURL(/.*redirect-url=%2Fschools/);

      await loginPage.login(validUser, validPass);

      // Verify redirect goes directly to /schools with visible UI text
      await expect(page).toHaveURL(/.*schools/, { timeout: 15000 });
      await expect(page.getByText('Schools', { exact: true })).toBeVisible();
    });

    test('TC-LOGIN-POS-03: Password visibility toggle alternates between masked and plain text input', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillPassword(validPass);

      // Initial state: masked
      await expect(loginPage.passwordField).toHaveAttribute('type', 'password');

      // Click toggle: visible
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordField).toHaveAttribute('type', 'text');

      // Click toggle again: re-masked
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordField).toHaveAttribute('type', 'password');
    });

    test('TC-LOGIN-POS-04: UAE PASS button initiates redirection to official identity provider staging portal', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.clickUaePass();

      // Verify browser initiates navigation to official UAE PASS staging host
      await expect(page).toHaveURL(/stg-ids\.uaepass\.ae/, { timeout: 20000 });
    });

    test('TC-LOGIN-POS-05: Language switcher alternates login page interface and direction between English and Arabic', async ({ loginPage, page }) => {
      await loginPage.goto();

      // Initial English view: Assert on displayed UI text
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();

      // Switch to Arabic view: Assert on displayed UI text
      await loginPage.switchLanguage('Arabic');
      await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();
      await expect(page.getByText('سجّل الدخول إلى حسابك للمتابعة')).toBeVisible();
      await expect(page.getByRole('button', { name: 'تسجيل الدخول', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'هل نسيت كلمة المرور؟' })).toBeVisible();

      // Switch back to English view: Assert on displayed UI text
      await loginPage.switchLanguage('English');
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Negative Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Negative Flows', () => {
    test('TC-LOGIN-NEG-01: Submission with empty username displays inline required validation', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillPassword(validPass);
      await loginPage.submitButton.click();

      // Form is blocked; inline validation displayed on UI text; remains on login view
      await expect(page.getByText('please enter user name')).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-02: Submission with empty password displays inline required validation', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.submitButton.click();

      // Form is blocked; inline validation displayed on UI text; remains on login view
      await expect(page.getByText('please enter the password')).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-03: Submission with both username and password empty displays simultaneous inline errors', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.submitEmptyForm();

      // Assert on displayed UI validation text
      await expect(page.getByText('please enter user name')).toBeVisible();
      await expect(page.getByText('please enter the password')).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-04: Authentication with invalid password returns HTTP 406 and displays toast notification', async ({ loginPage, page }) => {
      await loginPage.goto();

      // Listen for network response
      const loginResponsePromise = page.waitForResponse(
        (response) => response.url().includes('/Identity/Login') && response.request().method() === 'POST'
      );

      await loginPage.login(validUser, 'Wrong#123');

      const loginResponse = await loginResponsePromise;
      expect(loginResponse.status()).toBe(406);

      // Toast error alert is rendered with displayed UI text
      await expect(page.getByText('Username or password is incorrect!')).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-05: Submission with plain non-email username is rejected client-side', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername('apecouser');
      await loginPage.passwordField.focus();

      // Assert on displayed UI error text
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });

    test('TC-LOGIN-NEG-06: Submission with password lacking complexity requirements is rejected client-side', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('simplepass');
      await loginPage.usernameField.focus();

      // Assert on displayed UI error text
      await expect(page.getByText(/Please enter a password between 6 to 12 characters long/i)).toBeVisible();
    });

    test('TC-LOGIN-NEG-07: Malformed email without domain or @ is rejected client-side', async ({ loginPage, page }) => {
      await loginPage.goto();

      await loginPage.fillUsername('apecouser@');
      await loginPage.passwordField.focus();
      await expect(page.getByText('Please enter a valid email')).toBeVisible();

      await loginPage.fillUsername('apecouserhotmail.com');
      await loginPage.passwordField.focus();
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Edge Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Edge Boundary Flows', () => {
    test('TC-LOGIN-EDGE-01: Password at exact minimum length boundary (6 characters with complexity) is accepted', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#bb'); // 6 chars, uppercase, lowercase, number, special
      await loginPage.usernameField.focus();

      // Assert that complexity validation error text is not displayed
      await expect(page.getByText(/Please enter a password between 6 to 12 characters long/i)).toBeHidden();
    });

    test('TC-LOGIN-EDGE-02: Password at exact maximum length boundary (12 characters with complexity) is accepted', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#bbCc2$dd'); // 12 chars
      await loginPage.usernameField.focus();

      // Assert that complexity validation error text is not displayed
      await expect(page.getByText(/Please enter a password between 6 to 12 characters long/i)).toBeHidden();
    });

    test('TC-LOGIN-EDGE-03: Password just below minimum length (5 characters) triggers client-side validation error', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#b'); // 5 chars: min - 1
      await loginPage.usernameField.focus();

      // Assert on displayed UI error text
      await expect(page.getByText(/Please enter a password between 6 to 12 characters long/i)).toBeVisible();
    });

    test('TC-LOGIN-EDGE-04: Password just above maximum length (13 characters) triggers client-side validation error', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#bbCc2$ddE'); // 13 chars: max + 1
      await loginPage.usernameField.focus();

      // Assert on displayed UI error text
      await expect(page.getByText(/Please enter a password between 6 to 12 characters long/i)).toBeVisible();
    });

    test('TC-LOGIN-EDGE-05: Valid email with leading or trailing whitespace is rejected without auto-trimming', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername('  apecouser@hotmail.com  ');
      await loginPage.passwordField.focus();

      // App currently does not trim whitespace and displays email format error text
      await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Regression Test Cases (Verifying Known Bugs vs Expected Behavior)
  // ---------------------------------------------------------------------------
  test.describe('Regression Checks', () => {
    test('TC-LOGIN-REG-01: Password masking prevents plaintext exposure on initial entry', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillPassword('P0rtal#Cqnyp');

      // Regression check: Password must NOT be exposed in plaintext
      await expect(loginPage.passwordField).toHaveAttribute('type', 'password');
    });

    test('TC-LOGIN-REG-02: Empty form submission is rejected and never navigates to workspace', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.submitEmptyForm();

      // Regression check: Empty submission must NOT navigate to workspace
      await expect(page).not.toHaveURL(/.*workspace/);
      await expect(page).toHaveURL(/.*auth\/login/);
      await expect(page.getByText('please enter user name')).toBeVisible();
    });

    test('TC-LOGIN-REG-03: Wrong credentials do NOT redirect to workspace and show error notification', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(validUser, 'Wrong#123');

      // Regression check: Wrong credentials must NOT redirect to workspace
      await expect(page).not.toHaveURL(/.*workspace/);
      await expect(page).toHaveURL(/.*auth\/login/);
      await expect(page.getByText('Username or password is incorrect!')).toBeVisible();
    });

    test('TC-LOGIN-REG-04: [Known Defect REQ-LOGIN-09] Email input should auto-trim whitespace', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername('  apecouser@hotmail.com  ');
      await loginPage.passwordField.focus();

      // SPECIFICATION EXPECTATION: Trimmed email should be valid and NOT display an error text.
      // NOTE: This test is designed to FAIL on the current build, demonstrating known defect REQ-LOGIN-09!
      await expect(page.getByText('Please enter a valid email')).toBeHidden();
    });

    test('TC-LOGIN-REG-05: [Known Defect REQ-LOGIN-04] Required username error should be properly capitalized', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.submitEmptyForm();

      // SPECIFICATION EXPECTATION: Sentence case "Please enter username" or "Please enter your username".
      // NOTE: This test is designed to FAIL on the current build because the app displays lowercase "please enter user name".
      await expect(page.getByText(/^Please enter (your )?user ?name$/)).toBeVisible();
    });
  });
});
