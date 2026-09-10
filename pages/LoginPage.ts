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
}
