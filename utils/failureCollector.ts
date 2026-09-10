import { Page, TestInfo } from '@playwright/test';
import { AllureHelper } from './allureHelper';
import { Logger } from './logger';

export interface ConsoleLogEntry {
  type: string;
  text: string;
  location?: string;
  timestamp: string;
}

export interface NetworkErrorEntry {
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  failureText?: string;
  timestamp: string;
}

/**
 * FailureCollector
 * Telemetry and failure diagnostic collector.
 * Continuously listens to browser page events (console errors, unhandled exceptions, network failures)
 * and automatically formats and attaches them to the Allure report when a test fails.
 */
export class FailureCollector {
  private readonly page: Page;
  private readonly consoleLogs: ConsoleLogEntry[] = [];
  private readonly pageErrors: Array<{ message: string; stack?: string; timestamp: string }> = [];
  private readonly networkErrors: NetworkErrorEntry[] = [];

  constructor(page: Page) {
    this.page = page;
    this.attachListeners();
  }

  /**
   * Initializes real-time telemetry listeners on the active page.
   */
  private attachListeners(): void {
    // 1. Capture Browser Console Output
    this.page.on('console', (msg) => {
      const type = msg.type();
      // Record errors, warnings, and unhandled issues
      if (['error', 'warning', 'assert'].includes(type)) {
        const location = msg.location();
        this.consoleLogs.push({
          type,
          text: msg.text(),
          location: location ? `${location.url}:${location.lineNumber}` : undefined,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // 2. Capture Unhandled JavaScript Exceptions in the browser runtime
    this.page.on('pageerror', (error) => {
      this.pageErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      Logger.warn(`[Browser PageError] ${error.message}`);
    });

    // 3. Capture Network-level Request Failures (e.g., DNS resolution, connection refused)
    this.page.on('requestfailed', (request) => {
      const failure = request.failure();
      this.networkErrors.push({
        url: request.url(),
        method: request.method(),
        failureText: failure ? failure.errorText : 'Unknown Network Failure',
        timestamp: new Date().toISOString(),
      });
    });

    // 4. Capture HTTP Server & API Error Responses (Status >= 400)
    this.page.on('response', (response) => {
      const status = response.status();
      if (status >= 400) {
        this.networkErrors.push({
          url: response.url(),
          method: response.request().method(),
          status,
          statusText: response.statusText(),
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  /**
   * Evaluates test status and publishes rich diagnostics into Allure if the test failed.
   */
  async collectOnFailure(testInfo: TestInfo): Promise<void> {
    const isFailed = testInfo.status !== testInfo.expectedStatus;

    if (!isFailed) {
      return;
    }

    Logger.warn(`[FailureCollector] Collecting diagnostics for failed test: "${testInfo.title}"`);

    try {
      // Step A: Capture DOM & URL State
      const currentUrl = this.page.url();
      const pageTitle = await this.page.title().catch(() => 'Unavailable');

      await AllureHelper.attachJson('Failure State Diagnostics', {
        testTitle: testInfo.title,
        status: testInfo.status,
        durationMs: testInfo.duration,
        urlAtFailure: currentUrl,
        pageTitleAtFailure: pageTitle,
        retryAttempt: testInfo.retry,
        error: testInfo.error ? {
          message: testInfo.error.message,
          stack: testInfo.error.stack,
        } : null,
      });

      // Step B: Attach Immediate Failure Screenshot
      await AllureHelper.attachScreenshot(this.page, 'Failure Screenshot (Auto-Captured)');

      // Step C: Attach Browser Console Errors
      if (this.consoleLogs.length > 0) {
        await AllureHelper.attachConsoleLogs(this.consoleLogs, 'Browser Console Errors');
      }

      // Step D: Attach Unhandled Page Exceptions
      if (this.pageErrors.length > 0) {
        await AllureHelper.attachJson('Unhandled Page Errors', this.pageErrors);
      }

      // Step E: Attach HTTP & Network Failures
      if (this.networkErrors.length > 0) {
        await AllureHelper.attachJson('Network Request & HTTP Failures', this.networkErrors);
      }
    } catch (err) {
      Logger.error('[FailureCollector] Error while collecting failure artifacts:', err);
    }
  }

  /**
   * Returns recorded console logs for manual assertions or custom reporting.
   */
  getConsoleLogs(): ReadonlyArray<ConsoleLogEntry> {
    return this.consoleLogs;
  }

  /**
   * Returns recorded network errors for manual assertions.
   */
  getNetworkErrors(): ReadonlyArray<NetworkErrorEntry> {
    return this.networkErrors;
  }
}
