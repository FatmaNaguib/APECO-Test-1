import { test, expect } from './fixtures';
import { ENV } from '../config/environment';

/**
 * Login Feature Test Suite
 * Covers Positive, Negative, Edge, and Regression cases defined in test-cases.md
 * Adheres strictly to skills/test-authoring.md standard.
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

      // Verify redirection to workspace and dashboard rendering
      await expect(page).toHaveURL(/.*workspace/, { timeout: 15000 });
      await expect(page.locator('app-header')).toBeVisible();
    });

    test('TC-LOGIN-POS-02: Deep linking preserves and routes to redirect-url destination upon authentication', async ({ loginPage, page }) => {
      await loginPage.goto('/schools');
      await expect(page).toHaveURL(/.*redirect-url=%2Fschools/);

      await loginPage.login(validUser, validPass);

      // Verify redirect goes directly to /schools instead of default /workspace
      await expect(page).toHaveURL(/.*schools/, { timeout: 15000 });
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

      // Initial English LTR
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      await expect(loginPage.heading).toHaveText('Sign in');

      // Switch to Arabic RTL
      await loginPage.switchLanguage('Arabic');
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(loginPage.heading).toHaveText('تسجيل الدخول');

      // Switch back to English LTR
      await loginPage.switchLanguage('English');
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      await expect(loginPage.heading).toHaveText('Sign in');
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

      // Form is blocked; inline validation displayed; remains on login view
      await expect(loginPage.usernameRequiredError).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-02: Submission with empty password displays inline required validation', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.submitButton.click();

      // Form is blocked; inline validation displayed; remains on login view
      await expect(loginPage.passwordRequiredError).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-03: Submission with both username and password empty displays simultaneous inline errors', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.submitEmptyForm();

      await expect(loginPage.usernameRequiredError).toBeVisible();
      await expect(loginPage.passwordRequiredError).toBeVisible();
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

      // Toast error alert is rendered
      await expect(loginPage.toastAlert).toBeVisible();
      await expect(loginPage.toastAlert).toContainText('Username or password is incorrect!');
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOGIN-NEG-05: Submission with plain non-email username is rejected client-side', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername('apecouser');
      await loginPage.passwordField.focus();

      await expect(loginPage.emailFormatError).toBeVisible();
    });

    test('TC-LOGIN-NEG-06: Submission with password lacking complexity requirements is rejected client-side', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('simplepass');
      await loginPage.usernameField.focus();

      await expect(loginPage.passwordComplexityError).toBeVisible();
    });

    test('TC-LOGIN-NEG-07: Malformed email without domain or @ is rejected client-side', async ({ loginPage }) => {
      await loginPage.goto();

      await loginPage.fillUsername('apecouser@');
      await loginPage.passwordField.focus();
      await expect(loginPage.emailFormatError).toBeVisible();

      await loginPage.fillUsername('apecouserhotmail.com');
      await loginPage.passwordField.focus();
      await expect(loginPage.emailFormatError).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Edge Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Edge Boundary Flows', () => {
    test('TC-LOGIN-EDGE-01: Password at exact minimum length boundary (6 characters with complexity) is accepted', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#bb'); // 6 chars, uppercase, lowercase, number, special
      await loginPage.usernameField.focus();

      await expect(loginPage.passwordComplexityError).toBeHidden();
    });

    test('TC-LOGIN-EDGE-02: Password at exact maximum length boundary (12 characters with complexity) is accepted', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#bbCc2$dd'); // 12 chars
      await loginPage.usernameField.focus();

      await expect(loginPage.passwordComplexityError).toBeHidden();
    });

    test('TC-LOGIN-EDGE-03: Password just below minimum length (5 characters) triggers client-side validation error', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#b'); // 5 chars: min - 1
      await loginPage.usernameField.focus();

      await expect(loginPage.passwordComplexityError).toBeVisible();
    });

    test('TC-LOGIN-EDGE-04: Password just above maximum length (13 characters) triggers client-side validation error', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword('Aa1#bbCc2$ddE'); // 13 chars: max + 1
      await loginPage.usernameField.focus();

      await expect(loginPage.passwordComplexityError).toBeVisible();
    });

    test('TC-LOGIN-EDGE-05: Valid email with leading or trailing whitespace is rejected without auto-trimming', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername('  apecouser@hotmail.com  ');
      await loginPage.passwordField.focus();

      // App currently does not trim whitespace and rejects with email format error
      await expect(loginPage.emailFormatError).toBeVisible();
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
      await expect(loginPage.usernameRequiredError).toBeVisible();
    });

    test('TC-LOGIN-REG-03: Wrong credentials do NOT redirect to workspace and show error notification', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.login(validUser, 'Wrong#123');

      // Regression check: Wrong credentials must NOT redirect to workspace
      await expect(page).not.toHaveURL(/.*workspace/);
      await expect(page).toHaveURL(/.*auth\/login/);
      await expect(loginPage.toastAlert).toBeVisible();
    });

    test('TC-LOGIN-REG-04: [Known Defect REQ-LOGIN-09] Email input should auto-trim whitespace', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.fillUsername('  apecouser@hotmail.com  ');
      await loginPage.passwordField.focus();

      // SPECIFICATION EXPECTATION: Trimmed email should be valid and NOT display an error.
      // NOTE: This test is designed to FAIL on the current build, demonstrating known defect REQ-LOGIN-09!
      await expect(loginPage.emailFormatError).toBeHidden();
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
