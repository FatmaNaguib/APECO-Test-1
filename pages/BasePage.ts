import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * BasePage
 * Abstract parent class encapsulating common Playwright actions, explicit waits,
 * logging, and standardized error handling.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a specific path relative to the baseURL or an absolute URL.
   */
  async navigate(path: string = ''): Promise<void> {
    try {
      Logger.info(`Navigating to: "${path}"`);
      await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (error) {
      Logger.warn(`Initial navigation to "${path}" failed or timed out, retrying once...`);
      await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
  }

  /**
   * Clicks an element with auto-waiting and logging.
   */
  protected async click(locator: Locator, description: string = 'element'): Promise<void> {
    try {
      Logger.info(`Clicking on ${description}`);
      await locator.waitFor({ state: 'visible' });
      await locator.click();
    } catch (error) {
      Logger.error(`Failed to click on ${description}`, error);
      throw error;
    }
  }

  /**
   * Fills an editable field with text.
   */
  protected async fill(locator: Locator, text: string, description: string = 'input field'): Promise<void> {
    try {
      Logger.info(`Filling ${description} with value: "${description.toLowerCase().includes('password') ? '********' : text}"`);
      await locator.waitFor({ state: 'visible' });
      await locator.fill(text);
    } catch (error) {
      Logger.error(`Failed to fill ${description}`, error);
      throw error;
    }
  }

  /**
   * Retrieves trimmed inner text from an element.
   */
  protected async getText(locator: Locator, description: string = 'element'): Promise<string> {
    try {
      Logger.info(`Getting text from ${description}`);
      await locator.waitFor({ state: 'visible' });
      const text = await locator.innerText();
      return text.trim();
    } catch (error) {
      Logger.error(`Failed to get text from ${description}`, error);
      throw error;
    }
  }

  /**
   * Explicitly waits for an element to reach a target state.
   */
  protected async waitForElement(
    locator: Locator,
    state: 'visible' | 'attached' | 'detached' | 'hidden' = 'visible',
    timeout: number = 10000
  ): Promise<void> {
    try {
      Logger.info(`Waiting for element to be ${state}`);
      await locator.waitFor({ state, timeout });
    } catch (error) {
      Logger.error(`Element failed to reach state: "${state}" within ${timeout}ms`, error);
      throw error;
    }
  }

  /**
   * Checks if an element is currently visible in the DOM without throwing.
   */
  protected async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch (error) {
      Logger.debug(`Element visibility check returned false: ${error}`);
      return false;
    }
  }

  /**
   * Retrieves an element's HTML attribute value.
   */
  protected async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    try {
      await locator.waitFor({ state: 'attached' });
      return await locator.getAttribute(attributeName);
    } catch (error) {
      Logger.error(`Failed to get attribute "${attributeName}"`, error);
      throw error;
    }
  }

  /**
   * Returns the current page title.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Returns the current page URL.
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Waits for the page to navigate to an expected URL pattern.
   */
  async waitForUrl(urlPattern: string | RegExp, timeout: number = 15000): Promise<void> {
    try {
      Logger.info(`Waiting for URL to match: ${urlPattern}`);
      await this.page.waitForURL(urlPattern, { timeout, waitUntil: 'domcontentloaded' });
    } catch (error) {
      Logger.error(`Failed to reach expected URL: ${urlPattern}`, error);
      throw error;
    }
  }

  /**
   * Takes a full-page screenshot and saves it to artifacts.
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    const screenshotPath = `test-results/screenshots/${name}-${Date.now()}.png`;
    Logger.info(`Capturing screenshot: ${screenshotPath}`);
    return await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }
}
