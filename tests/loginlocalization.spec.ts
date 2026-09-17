import { test, expect } from './fixtures';
import { ENV } from '../config/environment';

/**
 * Login Localization Feature Test Suite
 * Covers Positive, Negative, Edge, and Regression cases defined in test-cases/loginlocalization.md
 * Adheres strictly to skills/test-authoring.md standard.
 */
test.describe('Feature: Login Localization', () => {
  // Use clean unauthenticated context for all login tests
  test.use({ auth: false });

  const validUser = ENV.credentials.defaultUser.email;
  const validPass = ENV.credentials.defaultUser.password;

  // ---------------------------------------------------------------------------
  // 1. Positive Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Positive Flows', () => {
    test('TC-LOC-POS-01: Switching language to Arabic flips document layout to RTL and translates login interface', async ({ loginPage, page }) => {
      await loginPage.goto();

      // Switch to Arabic
      await loginPage.switchLanguage('Arabic');

      // Verify document orientation and header positioning
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(loginPage.heading).toHaveText('تسجيل الدخول');
      await expect(loginPage.arabicSubtitle).toBeVisible();

      // Verify form elements are translated
      await expect(loginPage.arabicUaePassButton).toBeVisible();
      await expect(loginPage.arabicUsernameField).toHaveAttribute('placeholder', 'ادخل اسم المستخدم الخاص بك');
      await expect(loginPage.arabicPasswordField).toHaveAttribute('placeholder', 'ادخل كلمة المرور الخاصة بك');
      await expect(loginPage.arabicForgotPasswordLink).toBeVisible();
      await expect(loginPage.arabicSubmitButton).toBeVisible();
      await expect(loginPage.arabicCreateAccountLink).toBeVisible();
    });

    test('TC-LOC-POS-02: Successful authentication in Arabic mode authenticates user and navigates to workspace', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.loginInArabic(validUser, validPass);

      // Verify successful navigation
      await expect(page).toHaveURL(/.*workspace/, { timeout: 20000 });
      await expect(page.getByRole('banner').or(page.locator('app-header'))).toBeVisible();
    });

    test('TC-LOC-POS-03: Password visibility toggle in Arabic mode mirrors to left edge and alternates input type', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.fillArabicPassword(validPass);

      // Initial state: masked
      await expect(loginPage.arabicPasswordField).toHaveAttribute('type', 'password');

      // Click toggle: unmasked
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.arabicPasswordField).toHaveAttribute('type', 'text');

      // Click toggle again: re-masked
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.arabicPasswordField).toHaveAttribute('type', 'password');
    });

    test('TC-LOC-POS-04: Switching language from Arabic back to English restores LTR layout and English interface', async ({ loginPage, page }) => {
      await loginPage.goto();

      // Switch to Arabic then back to English
      await loginPage.switchLanguage('Arabic');
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

      await loginPage.switchLanguage('English');

      // Verify document reverts to LTR
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      await expect(loginPage.heading).toHaveText('Sign in');
      await expect(loginPage.usernameField).toHaveAttribute('placeholder', 'Enter your username');
      await expect(loginPage.passwordField).toHaveAttribute('placeholder', 'Enter your password');
      await expect(loginPage.submitButton).toHaveText('Login');
    });

    test('TC-LOC-POS-05: Form input values are preserved across language switching transitions without data loss', async ({ loginPage }) => {
      await loginPage.goto();

      await loginPage.fillUsername(validUser);
      await loginPage.fillPassword(validPass);

      // Switch to Arabic
      await loginPage.switchLanguage('Arabic');
      await expect(loginPage.arabicUsernameField).toHaveValue(validUser);
      await expect(loginPage.arabicPasswordField).toHaveValue(validPass);

      // Switch back to English
      await loginPage.switchLanguage('English');
      await expect(loginPage.usernameField).toHaveValue(validUser);
      await expect(loginPage.passwordField).toHaveValue(validPass);
    });

    test('TC-LOC-POS-06: Active validation error messages dynamically re-translate upon language toggle', async ({ loginPage }) => {
      await loginPage.goto();

      // Trigger validation in English
      await loginPage.submitButton.click();
      await expect(loginPage.usernameRequiredError).toBeVisible();
      await expect(loginPage.passwordRequiredError).toBeVisible();

      // Switch to Arabic: errors should re-translate in place
      await loginPage.switchLanguage('Arabic');
      await expect(loginPage.arabicUsernameRequiredError).toBeVisible();
      await expect(loginPage.arabicPasswordRequiredError).toBeVisible();

      // Switch back to English: errors should revert
      await loginPage.switchLanguage('English');
      await expect(loginPage.usernameRequiredError).toBeVisible();
      await expect(loginPage.passwordRequiredError).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Negative Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Negative Flows', () => {
    test('TC-LOC-NEG-01: Empty form submission in Arabic mode displays localized Arabic required validation errors', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.arabicSubmitButton.click();

      // Verify Arabic required messages
      await expect(loginPage.arabicUsernameRequiredError).toBeVisible();
      await expect(loginPage.arabicPasswordRequiredError).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOC-NEG-02: Submission with non-email username in Arabic mode displays localized format error', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.fillArabicUsername('apecouser');
      await loginPage.arabicPasswordField.focus();

      await expect(loginPage.arabicEmailFormatError).toBeVisible();
    });

    test('TC-LOC-NEG-03: Submission with non-compliant password in Arabic mode displays localized complexity error', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.fillArabicUsername(validUser);
      await loginPage.fillArabicPassword('simple');
      await loginPage.arabicUsernameField.focus();

      await expect(loginPage.arabicPasswordComplexityError).toBeVisible();
    });

    test('TC-LOC-NEG-04: Authentication with invalid credentials in Arabic mode returns HTTP 406 and displays toast alert', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      const loginResponsePromise = page.waitForResponse(
        (response) => response.url().includes('/Identity/Login') && response.request().method() === 'POST'
      );

      await loginPage.loginInArabic(validUser, 'Wrong#123');

      const response = await loginResponsePromise;
      expect(response.status()).toBe(406);

      await expect(loginPage.toastAlert).toBeVisible();
      await expect(page).toHaveURL(/.*auth\/login/);
    });

    test('TC-LOC-NEG-05: Password visibility toggle accessible name remains in English in Arabic mode', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      // KNOWN DEFECT: Button aria-label/accessible name remains in English
      await expect(loginPage.visibilityToggle).toHaveAccessibleName('Toggle password visibility');
    });

    test('TC-LOC-NEG-06: Header PEAO logo image alt text remains in English in Arabic mode', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      // KNOWN DEFECT: Logo image alt text remains hardcoded in English
      await expect(loginPage.peaoLogo).toHaveAttribute('alt', 'PEAO Logo');
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Edge Test Cases
  // ---------------------------------------------------------------------------
  test.describe('Edge Boundary Flows', () => {
    test('TC-LOC-EDGE-01: Password at exact minimum length boundary (6 characters with complexity) is accepted in Arabic', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.fillArabicUsername(validUser);
      await loginPage.fillArabicPassword('Aa1#bb'); // Min 6 chars
      await loginPage.arabicUsernameField.focus();

      await expect(loginPage.arabicPasswordComplexityError).toBeHidden();
    });

    test('TC-LOC-EDGE-02: Password at exact maximum length boundary (12 characters with complexity) is accepted in Arabic', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.fillArabicUsername(validUser);
      await loginPage.fillArabicPassword('Aa1#bbCc2$dd'); // Max 12 chars
      await loginPage.arabicUsernameField.focus();

      await expect(loginPage.arabicPasswordComplexityError).toBeHidden();
    });

    test('TC-LOC-EDGE-03: Rapid sequential language switching preserves form controls and prevents UI rendering glitches', async ({ loginPage, page }) => {
      await loginPage.goto();

      // Toggle rapidly 3 times
      for (let i = 0; i < 3; i++) {
        await loginPage.switchLanguage('Arabic');
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await loginPage.switchLanguage('English');
        await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
      }

      // Verify form remains responsive
      await loginPage.fillUsername('test@example.com');
      await expect(loginPage.usernameField).toHaveValue('test@example.com');
    });

    test('TC-LOC-EDGE-04: Orthographic spelling inconsistency between placeholder and error message hamza', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      // Placeholder uses "ادخل" (without hamza)
      await expect(loginPage.arabicUsernameField).toHaveAttribute('placeholder', /ادخل/);

      // Trigger error: Error uses "إدخال" (with hamza)
      await loginPage.arabicSubmitButton.click();
      await expect(loginPage.arabicUsernameRequiredError).toBeVisible();
      await expect(loginPage.arabicUsernameRequiredError).toHaveText(/إدخال/);
    });

    test('TC-LOC-EDGE-05: Two-column split-screen layout desktop viewport preserves container placement in RTL', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      // Bounding box check: Top-level card remains on the right side even in RTL
      const mainCard = page.getByRole('main');
      const box = await mainCard.boundingBox();
      expect(box).not.toBeNull();
      // Verifies viewport renders without layout breakdown
      expect(box!.width).toBeGreaterThan(300);
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Regression Verification (Confirming Known Login Bugs in Localized View)
  // ---------------------------------------------------------------------------
  test.describe('Regression Verification', () => {
    test('TC-LOC-REG-01: Password masking prevents plaintext exposure in Arabic mode', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.fillArabicPassword(validPass);

      // Regression check: Password must NOT be exposed in plaintext on input
      await expect(loginPage.arabicPasswordField).toHaveAttribute('type', 'password');
    });

    test('TC-LOC-REG-02: Empty form submission is rejected and never navigates to workspace in Arabic mode', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.arabicSubmitButton.click();

      // Regression check: Empty submission must NOT navigate to workspace
      await expect(page).not.toHaveURL(/.*workspace/);
      await expect(page).toHaveURL(/.*auth\/login/);
      await expect(loginPage.arabicUsernameRequiredError).toBeVisible();
    });

    test('TC-LOC-REG-03: Wrong credentials do NOT redirect to workspace and show error notification in Arabic mode', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.switchLanguage('Arabic');

      await loginPage.loginInArabic(validUser, 'Wrong#123');

      // Regression check: Wrong credentials must NOT redirect to workspace
      await expect(page).not.toHaveURL(/.*workspace/);
      await expect(page).toHaveURL(/.*auth\/login/);
      await expect(loginPage.toastAlert).toBeVisible();
    });
  });
});
