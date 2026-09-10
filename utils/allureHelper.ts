import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ContentType } from 'allure-js-commons';

export type AllureSeverity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

/**
 * AllureHelper
 * Enterprise utility providing high-level, strongly-typed abstractions for:
 * - Allure behavioral hierarchy (Epic, Feature, Story)
 * - Metadata enrichment (Severity, Owner, Tags, Test ID, Jira links)
 * - Granular step reporting
 * - Artifact attachments (Screenshots, JSON payloads, Console/Network logs, Text)
 */
export class AllureHelper {
  // Re-export core allure instance for direct advanced access
  static readonly raw = allure;

  // ---------------------------------------------------------------------------
  // 1. Behavioral & Structural Hierarchy
  // ---------------------------------------------------------------------------

  /**
   * Defines the top-level Epic for the test (e.g., 'Authentication', 'Portal Core').
   */
  static async epic(name: string): Promise<void> {
    await allure.epic(name);
  }

  /**
   * Defines the Feature under test (e.g., 'Login Flow', 'Localization').
   */
  static async feature(name: string): Promise<void> {
    await allure.feature(name);
  }

  /**
   * Defines the specific User Story (e.g., 'Valid Credentials Authentication').
   */
  static async story(name: string): Promise<void> {
    await allure.story(name);
  }

  /**
   * Defines parent, suite, and sub-suite hierarchy.
   */
  static async suite(suiteName: string, subSuiteName?: string): Promise<void> {
    await allure.suite(suiteName);
    if (subSuiteName) {
      await allure.subSuite(subSuiteName);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Metadata, Ownership & Issue Tracking
  // ---------------------------------------------------------------------------

  /**
   * Assigns execution severity level to the test.
   */
  static async severity(level: AllureSeverity): Promise<void> {
    await allure.severity(level);
  }

  /**
   * Designates the engineer or team responsible for this test.
   */
  static async owner(ownerName: string): Promise<void> {
    await allure.owner(ownerName);
  }

  /**
   * Attaches one or more functional or execution tags (e.g., 'smoke', 'regression', 'p0').
   */
  static async tags(...tags: string[]): Promise<void> {
    for (const tag of tags) {
      await allure.tag(tag);
    }
  }

  /**
   * Links the test to a Test Case ID in TMS (e.g., TestRail, Zephyr).
   */
  static async testId(id: string): Promise<void> {
    await allure.tms(id, id);
  }

  /**
   * Links the test to a Jira issue or defect.
   */
  static async jira(issueKey: string, customBaseUrl?: string): Promise<void> {
    const base = customBaseUrl || process.env.JIRA_BASE_URL || 'https://apeco.atlassian.net/browse';
    const url = `${base.replace(/\/+$/, '')}/${issueKey}`;
    await allure.issue(url, `Jira [${issueKey}]`);
  }

  /**
   * Attaches an arbitrary web or documentation link.
   */
  static async link(url: string, name?: string, type?: string): Promise<void> {
    await allure.link(url, name || url, type);
  }

  /**
   * Adds rich Markdown description to the test report.
   */
  static async description(markdown: string): Promise<void> {
    await allure.description(markdown);
  }

  // ---------------------------------------------------------------------------
  // 3. Step Reporting
  // ---------------------------------------------------------------------------

  /**
   * Wraps an asynchronous action inside an Allure test step.
   */
  static async step(name: string, body: () => Promise<void>): Promise<void> {
    await allure.step(name, body);
  }

  // ---------------------------------------------------------------------------
  // 4. Artifact Attachments
  // ---------------------------------------------------------------------------

  /**
   * Captures and attaches a screenshot to the current Allure test.
   */
  static async attachScreenshot(page: Page, name: string = 'Screenshot'): Promise<void> {
    try {
      const screenshot = await page.screenshot({ fullPage: true });
      await allure.attachment(name, screenshot, ContentType.PNG);
    } catch (error) {
      // Fallback: non-fullpage screenshot if page layout calculation throws
      try {
        const fallback = await page.screenshot();
        await allure.attachment(name, fallback, ContentType.PNG);
      } catch (err) {
        console.warn(`[AllureHelper] Failed to capture screenshot "${name}":`, err);
      }
    }
  }

  /**
   * Attaches serialized JSON data to the Allure report.
   */
  static async attachJson(name: string, data: unknown): Promise<void> {
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    await allure.attachment(name, content, ContentType.JSON);
  }

  /**
   * Attaches plain text or Markdown to the Allure report.
   */
  static async attachText(name: string, content: string): Promise<void> {
    await allure.attachment(name, content, ContentType.TEXT);
  }

  /**
   * Attaches API request/response payloads with formatted HTTP metadata.
   */
  static async attachApiPayload(
    name: string,
    payload: {
      url: string;
      method: string;
      headers?: Record<string, string>;
      body?: unknown;
      status?: number;
      response?: unknown;
    }
  ): Promise<void> {
    await allure.attachment(name, JSON.stringify(payload, null, 2), ContentType.JSON);
  }

  /**
   * Attaches structured browser console logs.
   */
  static async attachConsoleLogs(
    logs: Array<{ type: string; text: string; location?: string; timestamp?: string }>,
    name: string = 'Browser Console Logs'
  ): Promise<void> {
    if (!logs || logs.length === 0) return;
    const formatted = logs
      .map(
        (l) =>
          `[${l.timestamp || new Date().toISOString()}] [${l.type.toUpperCase()}] ${l.text}${
            l.location ? ` (${l.location})` : ''
          }`
      )
      .join('\n');
    await allure.attachment(name, formatted, ContentType.TEXT);
  }

  /**
   * Attaches structured network requests/failures.
   */
  static async attachNetworkLogs(
    logs: Array<{ method: string; url: string; status: number; statusText?: string }>,
    name: string = 'Network Logs'
  ): Promise<void> {
    if (!logs || logs.length === 0) return;
    const formatted = logs
      .map((l) => `[${l.method}] ${l.status} ${l.statusText || ''} -> ${l.url}`)
      .join('\n');
    await allure.attachment(name, formatted, ContentType.TEXT);
  }
}
