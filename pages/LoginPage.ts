import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';
import { ENV } from '../config/environment';

/**
 * LoginPage
 * Page Object representing the Apeco Portal Authentication page.
 * Keeps locators private and exposes strictly business-level actions and assertion locators.
 */
export class LoginPage extends BasePage {
  // Path relative to baseURL
  private readonly pagePath: string = '/auth/login';

  // Locators strictly private
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly passwordVisibilityToggle: Locator;
  private readonly uaePassButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly createAccountLink: Locator;
  private readonly toastErrorAlert: Locator;
  private readonly usernameValidationMessage: Locator;
  private readonly passwordValidationMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initializing accessible, resilient locators
    this.usernameInput = page.getByPlaceholder('Enter your username');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.passwordVisibilityToggle = page.getByRole('button', { name: 'Toggle password visibility' });
    this.uaePassButton = page.getByRole('button', { name: 'Sign in with UAE PASS' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.createAccountLink = page.getByRole('link', { name: 'Create new account' });
    this.toastErrorAlert = page.getByRole('alert');
    this.usernameValidationMessage = page.getByText(/please enter (user name|a valid email)/i);
    this.passwordValidationMessage = page.getByText(/please enter (the password|a password between)/i);
  }

  // ==========================================
  // Business-Level Action Methods
  // ==========================================

  /**
   * Navigates to the Login page.
   */
  async goto(redirectUrl?: string): Promise<void> {
    const url = redirectUrl ? `${this.pagePath}?redirect-url=${encodeURIComponent(redirectUrl)}` : this.pagePath;
    await this.navigate(url);
  }

  /**
   * Performs standard login with specified credentials.
   */
  async login(username?: string, password?: string): Promise<void> {
    Logger.info('Executing login flow');
    if (username !== undefined) {
      await this.fill(this.usernameInput, username, 'Username field');
    }
    if (password !== undefined) {
      await this.fill(this.passwordInput, password, 'Password field');
    }
    await this.click(this.loginButton, 'Login button');
  }

  /**
   * Performs login using the default test credentials from environment configuration.
   */
  async loginWithDefaultUser(): Promise<void> {
    const { email, password } = ENV.credentials.defaultUser;
    await this.login(email, password);
  }

  /**
   * Performs login with administrative user credentials.
   */
  async loginAsAdmin(): Promise<void> {
    const { email, password } = ENV.credentials.adminUser;
    await this.login(email, password);
  }

  /**
   * Submits the form without filling any fields.
   */
  async submitEmptyForm(): Promise<void> {
    Logger.info('Submitting empty login form');
    await this.click(this.loginButton, 'Login button');
  }

  /**
   * Toggles the visibility of the password input field.
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.click(this.passwordVisibilityToggle, 'Password visibility toggle');
  }

  /**
   * Navigates to the Forgot Password recovery flow.
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink, 'Forgot password link');
  }

  /**
   * Navigates to the Create Account registration flow.
   */
  async clickCreateAccount(): Promise<void> {
    await this.click(this.createAccountLink, 'Create new account link');
  }

  /**
   * Initiates UAE PASS authentication.
   */
  async clickUaePass(): Promise<void> {
    await this.click(this.uaePassButton, 'UAE PASS button');
  }

  // ==========================================
  // Public Locators / Getters for Test Assertions
  // ==========================================

  get toastAlert(): Locator {
    return this.toastErrorAlert;
  }

  get usernameError(): Locator {
    return this.usernameValidationMessage;
  }

  get passwordError(): Locator {
    return this.passwordValidationMessage;
  }

  get passwordField(): Locator {
    return this.passwordInput;
  }

  get usernameField(): Locator {
    return this.usernameInput;
  }

  get submitButton(): Locator {
    return this.loginButton;
  }

  get visibilityToggle(): Locator {
    return this.passwordVisibilityToggle;
  }

  get uaePassBtn(): Locator {
    return this.uaePassButton;
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get usernameRequiredError(): Locator {
    return this.page.getByText('please enter user name');
  }

  get passwordRequiredError(): Locator {
    return this.page.getByText('please enter the password');
  }

  get emailFormatError(): Locator {
    return this.page.getByText('Please enter a valid email');
  }

  get passwordComplexityError(): Locator {
    return this.page.getByText(/Please enter a password between 6 to 12 characters long/i);
  }

  get languageDropdown(): Locator {
    return this.page.locator('app-language-switcher nz-select');
  }

  get arabicOption(): Locator {
    return this.page.locator('.cdk-overlay-container [title="العربية"]:visible, nz-option-item[title="العربية"]:visible').first();
  }

  get englishOption(): Locator {
    return this.page.locator('.cdk-overlay-container [title="English"]:visible, nz-option-item[title="English"]:visible').first();
  }

  get peaoLogo(): Locator {
    return this.page.getByRole('img', { name: 'PEAO Logo' });
  }

  get arabicUsernameField(): Locator {
    return this.page.getByRole('textbox', { name: 'اسم المستخدم' });
  }

  get arabicPasswordField(): Locator {
    return this.page.getByRole('textbox', { name: 'كلمة المرور' });
  }

  get arabicSubmitButton(): Locator {
    return this.page.getByRole('button', { name: 'تسجيل الدخول', exact: true });
  }

  get arabicUaePassButton(): Locator {
    return this.page.getByRole('button', { name: 'UAE PASS تسجيل الدخول باستخدام UAE PASS' });
  }

  get arabicForgotPasswordLink(): Locator {
    return this.page.getByRole('link', { name: 'هل نسيت كلمة المرور؟' });
  }

  get arabicCreateAccountLink(): Locator {
    return this.page.getByRole('link', { name: 'إنشاء حساب جديد' });
  }

  get arabicUsernameRequiredError(): Locator {
    return this.page.getByText('الرجاء إدخال اسم المستخدم');
  }

  get arabicPasswordRequiredError(): Locator {
    return this.page.getByText('الرجاء إدخال كلمة المرور');
  }

  get arabicEmailFormatError(): Locator {
    return this.page.getByText('الرجاء إدخال بريد إلكتروني صحيح');
  }

  get arabicPasswordComplexityError(): Locator {
    return this.page.getByText('الرجاء إدخال كلمة مرور من 6 إلى 12 خانة وتحتوي على أحرف، أرقام، رموز، وحروف كبيرة وصغيرة');
  }

  get arabicSubtitle(): Locator {
    return this.page.getByText('سجّل الدخول إلى حسابك للمتابعة');
  }

  async fillArabicUsername(username: string): Promise<void> {
    await this.fill(this.arabicUsernameField, username, 'Arabic Username field');
  }

  async fillArabicPassword(password: string): Promise<void> {
    await this.fill(this.arabicPasswordField, password, 'Arabic Password field');
  }

  async loginInArabic(username?: string, password?: string): Promise<void> {
    Logger.info('Executing Arabic login flow');
    if (username !== undefined) {
      await this.fillArabicUsername(username);
    }
    if (password !== undefined) {
      await this.fillArabicPassword(password);
    }
    await this.click(this.arabicSubmitButton, 'Arabic Login button');
  }

  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'Username field');
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password, 'Password field');
  }

  async switchLanguage(language: 'Arabic' | 'English'): Promise<void> {
    Logger.info(`Switching language to ${language}`);
    const targetDir = language === 'Arabic' ? 'rtl' : 'ltr';

    await this.click(this.languageDropdown, 'Language dropdown');
    const option = language === 'Arabic' ? this.arabicOption : this.englishOption;
    await this.click(option, `${language} option`);

    // Ensure document direction flips and stabilizes to target orientation
    await this.page.locator(`html[dir="${targetDir}"]`).waitFor({ state: 'attached' });

    // Wait for the dropdown overlay backdrop to detach so subsequent clicks are not intercepted
    await this.page.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached' }).catch(() => {});
  }
}
