import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * HeaderComponent
 * Represents the top navigation header reusable across portal pages.
 */
export class HeaderComponent {
  private readonly page: Page;
  private readonly logoLink: Locator;
  private readonly languageSwitcher: Locator;
  private readonly userProfileButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoLink = page.getByRole('link', { name: 'PEAO Logo' });
    this.languageSwitcher = page.locator('app-language-switcher nz-select');
    this.userProfileButton = page.locator('.ant-avatar');
    this.logoutButton = page.locator('#logout-btn');
  }

  async clickLogo(): Promise<void> {
    Logger.info('Clicking Header Logo');
    await this.logoLink.click();
  }

  async selectLanguage(lang: 'English' | 'العربية'): Promise<void> {
    Logger.info(`Switching language to: ${lang}`);
    await this.languageSwitcher.click();
    await this.page.locator(`.ant-select-item-option[title="${lang}"]`).click();
  }

  get logo(): Locator {
    return this.logoLink;
  }

  get profileIcon(): Locator {
    return this.userProfileButton;
  }
}
