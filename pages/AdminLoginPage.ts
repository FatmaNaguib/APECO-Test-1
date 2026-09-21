import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

/**
 * AdminLoginPage
 * Page Object representing the APECO Admin Portal Authentication page.
 * Encapsulates language switching, credential entry, and agent-queue redirection.
 * Conforms strictly to skills/test-authoring.md and admin-Initial-approval-exploration-notes.md.
 */
export class AdminLoginPage extends BasePage {
  private readonly pagePath: string = '/login';

  // Resilient, accessible locators verified from exploration notes
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly englishLanguageButton: Locator;

  constructor(page: Page) {
    super(page);

    this.englishLanguageButton = page
      .locator('text="English"')
      .or(page.getByRole('button', { name: 'English' }))
      .or(page.locator('button:has-text("English"), a:has-text("English")'));
    this.emailInput = page
      .getByPlaceholder('Type email address')
      .or(page.locator('input[placeholder*="email" i]'))
      .or(page.locator('input[type="email"]'));
    this.passwordInput = page
      .getByPlaceholder('Type password')
      .or(page.locator('input[type="password"]'));
    this.loginButton = page
      .getByRole('button', { name: /Login|تسجيل الدخول/i })
      .or(page.locator('button:has-text("Login"), button:has-text("تسجيل الدخول"), button[type="submit"]'))
      .first();
  }

  /**
   * Navigates to the Admin login endpoint.
   */
  async goto(customUrl?: string): Promise<void> {
    const targetUrl = customUrl || this.pagePath;
    Logger.info(`Navigating to Admin Login: ${targetUrl}`);
    await this.navigate(targetUrl);
  }

  /**
   * Toggles portal language to English if currently in Arabic RTL.
   */
  async switchToEnglish(): Promise<void> {
    try {
      const isVisible = await this.englishLanguageButton.first().isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        Logger.info('Switching Admin Portal language to English');
        await this.englishLanguageButton.first().click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    } catch {
      Logger.debug('English language toggle not required or already active');
    }
  }

  /**
   * Executes full admin authentication flow.
   */
  async login(email: string, password: string): Promise<void> {
    Logger.info(`Executing admin login flow for: ${email}`);
    await this.switchToEnglish();

    await this.fill(this.emailInput, email, 'Admin email input');
    await this.fill(this.passwordInput, password, 'Admin password input');
    await this.click(this.loginButton, 'Admin Login button');
  }
}
