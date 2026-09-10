# Playwright Allure Report Integration Guide

Enterprise-grade guide for generating, enriching, and maintaining **Allure Test Reports** with Playwright and TypeScript in the APECO Portal automation framework.

---

## Table of Contents

1. [Architecture & Overview](#1-architecture--overview)
2. [Prerequisites & Installation](#2-prerequisites--installation)
3. [Configuration Reference](#3-configuration-reference)
4. [NPM Scripts & Execution Commands](#4-npm-scripts--execution-commands)
5. [Authoring Tests with Allure Metadata](#5-authoring-tests-with-allure-metadata)
6. [Steps & Attachments Utility](#6-steps--attachments-utility)
7. [Automated Failure Telemetry (FailureCollector)](#7-automated-failure-telemetry-failurecollector)
8. [Failure Categorization (categories.json)](#8-failure-categorization-categoriesjson)
9. [Environment Metadata (environment.properties)](#9-environment-metadata-environmentproperties)
10. [CI/CD Integration Pipelines](#10-cicd-integration-pipelines)
    - [Azure DevOps](#azure-devops)
    - [GitHub Actions](#github-actions)
    - [Jenkins](#jenkins)
11. [Troubleshooting & FAQ](#11-troubleshooting--faq)

---

## 1. Architecture & Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Playwright Test Suite                          │
│        (tests/login.spec.ts, loginlocalization.spec.ts, etc.)           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    ┌─────────────────────────┐             ┌─────────────────────────┐
    │      AllureHelper       │             │    FailureCollector     │
    │  - Epics, Features      │             │  - Console error logs   │
    │  - Severity & Owners    │             │  - Network 4xx/5xx      │
    │  - Steps & Attachments  │             │  - Failure screenshot   │
    └────────────┬────────────┘             └────────────┬────────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                      ┌─────────────────────────────┐
                      │  allure-playwright Reporter │
                      └──────────────┬──────────────┘
                                     ▼
                      ┌─────────────────────────────┐
                      │       allure-results/       │
                      │  - *-result.json            │
                      │  - *-attachment.png/json/txt│
                      │  - environment.properties   │
                      │  - categories.json          │
                      └──────────────┬──────────────┘
                                     │ (npx allure generate)
                                     ▼
                      ┌─────────────────────────────┐
                      │    allure-report/ (HTML)    │
                      │  - Overview & Behaviors     │
                      │  - Categories & Graphs      │
                      │  - Timelines & Packages     │
                      └─────────────────────────────┘
```

---

## 2. Prerequisites & Installation

### Required Packages

| Package | Role | Installation |
|---|---|---|
| `allure-playwright` | Test reporter capturing test metadata, steps, attachments | `npm install --save-dev allure-playwright` |
| `allure-commandline` | CLI utility compiling raw JSON results into standalone HTML dashboards | `npm install --save-dev allure-commandline` |
| `Java JRE (8+)` | Required locally or on CI runner to compile Allure reports | Pre-installed or via SDKMAN / Brew / Chocolatey |

### Installation Commands

```bash
# Install required dependencies
npm install --save-dev allure-playwright allure-commandline

# Verify Allure CLI availability
npx allure --version
```

---

## 3. Configuration Reference

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  
  reporter: [
    ['line'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
      },
    ],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});
```

### Artifact Rationale

* **`screenshot: 'only-on-failure'`**: Captures viewport state at the exact moment an expectation fails without wasting disk space on passing specs.
* **`video: 'retain-on-failure'`**: Records browser sessions and discards videos for passed tests, retaining full visual playback only when defects occur.
* **`trace: 'retain-on-failure'`**: Playwright's post-mortem execution log (DOM snapshots, network traffic, action timelines), attached directly to failing test reports.

---

## 4. NPM Scripts & Execution Commands

Additions made to `package.json`:

| Script | Command | Purpose |
|---|---|---|
| `npm run test:allure` | `playwright test && npm run allure:env && npm run allure:generate` | Executes suite, injects environment data, and generates report |
| `npm run allure:generate` | `allure generate allure-results --clean -o allure-report` | Compiles raw results into `allure-report/` |
| `npm run allure:open` | `allure open allure-report` | Opens local web server to view the generated report |
| `npm run allure:serve` | `allure serve allure-results` | Generates report in temp directory and serves immediately |
| `npm run allure:clean` | `node scripts/clean-allure.js` | Cross-platform cleanup of results, reports, and screenshots |
| `npm run allure:env` | `node scripts/setup-allure-env.js` | Generates `environment.properties` and injects `categories.json` |
| `npm run report:allure` | `npm run allure:env && npm run allure:generate && npm run allure:open` | One-click compilation and browser preview |

---

## 5. Authoring Tests with Allure Metadata

Import `AllureHelper` from `utils/allureHelper`:

```typescript
import { test, expect } from './fixtures';
import { AllureHelper } from '../utils/allureHelper';

test('TC-LOGIN-POS-01: Valid user authentication', async ({ loginPage, page }) => {
  // Behavioral Hierarchy
  await AllureHelper.epic('Authentication & Access Management');
  await AllureHelper.feature('User Login');
  await AllureHelper.story('Valid Credentials Submission');

  // Governance & Metadata
  await AllureHelper.severity('critical'); // blocker | critical | normal | minor | trivial
  await AllureHelper.owner('QA Automation Core');
  await AllureHelper.tags('smoke', 'auth', 'p0');
  await AllureHelper.testId('TC-LOGIN-POS-01');
  await AllureHelper.jira('APECO-101');
  await AllureHelper.link('https://apeco.ae', 'APECO Portal', 'documentation');

  // Rich Markdown Description
  await AllureHelper.description(`
### Objective
Verify that authenticating with valid credentials successfully redirects to the dashboard
and renders the authenticated header.
  `);

  // Test Actions...
});
```

---

## 6. Steps & Attachments Utility

### Structured Steps

Use `AllureHelper.step()` to partition test logic into readable, collapsible sections in the report:

```typescript
await AllureHelper.step('Step 1: Navigate to Login View', async () => {
  await loginPage.goto();
  await expect(page).toHaveURL(/.*auth\/login/);
});

await AllureHelper.step('Step 2: Submit Credentials', async () => {
  await loginPage.login('user@apeco.ae', 'Valid#Pass1');
});
```

### Artifact Attachments

```typescript
// 1. Full-page or Viewport Screenshot
await AllureHelper.attachScreenshot(page, 'Visual Checkpoint');

// 2. Serialized JSON Objects
await AllureHelper.attachJson('User Session Payload', {
  username: 'user@apeco.ae',
  sessionToken: 'xyz-token',
  issuedAt: new Date().toISOString(),
});

// 3. API Request / Response Telemetry
await AllureHelper.attachApiPayload('Auth POST Request', {
  url: 'https://apeco-api/Identity/Login',
  method: 'POST',
  body: { user: 'user@apeco.ae' },
  status: 200,
  response: { success: true },
});

// 4. Plain Text or Markdown Log
await AllureHelper.attachText('Execution Trace Log', 'Tokens successfully refreshed.');
```

---

## 7. Automated Failure Telemetry (FailureCollector)

The framework includes an automated `FailureCollector` class (`utils/failureCollector.ts`) seamlessly plugged into `tests/fixtures.ts`.

When any test using `page` or `authenticatedPage` fails, `FailureCollector` automatically captures:

1. **Browser Console Output**: Intercepts `console.error`, `console.warn`, and stack traces.
2. **Unhandled Page Errors**: Captures runtime JavaScript exceptions thrown within browser execution.
3. **HTTP & Network Failures**: Records all failed requests (status >= 400 or network aborts).
4. **Failure State Diagnostics**: Formats URL, document title, duration, retry count, and Playwright error stack into a dedicated JSON artifact.
5. **Instant Failure Screenshot**: High-resolution screenshot captured before context teardown.

---

## 8. Failure Categorization (`categories.json`)

Located at `config/categories.json` and automatically injected into `allure-results/categories.json` by `scripts/setup-allure-env.js`:

```json
[
  {
    "name": "Assertion Failures",
    "matchedStatuses": ["failed"],
    "messageRegex": ".*expect\\(.*\\)\\..*|.*AssertionError.*|.*Error: expect.*"
  },
  {
    "name": "Locator Failures",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*strict mode violation.*|.*element\\(s\\) not found.*|.*waiting for locator.*"
  },
  {
    "name": "Timeout Failures",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*Timeout \\d+ms exceeded.*|.*Test timeout of \\d+ms exceeded.*"
  },
  {
    "name": "Network & API Failures",
    "matchedStatuses": ["failed", "broken"],
    "messageRegex": ".*net::ERR_.*|.*status 406.*|.*status 500.*|.*status 502.*"
  },
  {
    "name": "Application Errors",
    "matchedStatuses": ["broken"],
    "messageRegex": ".*TypeError:.*|.*ReferenceError:.*|.*SyntaxError:.*"
  },
  {
    "name": "Infrastructure & Browser Failures",
    "matchedStatuses": ["broken"],
    "messageRegex": ".*Browser closed.*|.*Target page, context or browser has been closed.*"
  }
]
```

---

## 9. Environment Metadata (`environment.properties`)

Generated dynamically by `scripts/setup-allure-env.js` prior to report compilation:

```properties
Environment=QA
Base_URL=https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io
CI_Provider=Azure DevOps Pipelines
Build_Number=1420
Git_Branch=master
Git_Commit=1a2286e
Execution_Date=2026-09-10T21:02:35.531Z
Node_Version=v20.15.0
OS_Platform=win32 (Windows_NT 10.0.26200)
Test_Framework=Playwright Test
```

---

## 10. CI/CD Integration Pipelines

### Azure DevOps (`pipelines/azure-devops.yml`)

1. Sets up Node.js 20 and Java 17 (`JavaToolInstaller@0`).
2. Installs dependencies and Playwright browsers (`npx playwright install --with-deps chromium`).
3. Executes Playwright tests with `continueOnError: true`.
4. Executes `node scripts/setup-allure-env.js` to inject environment data.
5. Runs `npx allure generate allure-results --clean -o allure-report`.
6. Publishes pipeline artifacts:
   - `playwright-report`
   - `allure-results` (raw test data)
   - `allure-report` (standalone HTML dashboard)

### GitHub Actions (`.github/workflows/playwright-allure.yml`)

1. Configures GitHub runner with Node.js 20 and Eclipse Temurin Java 17.
2. Runs `npx playwright test`.
3. Runs `node scripts/setup-allure-env.js`.
4. Executes `npx allure generate allure-results --clean -o allure-report`.
5. Uploads `allure-report/` and `allure-results/` using `actions/upload-artifact@v4`.

### Jenkins (`Jenkinsfile`)

1. Employs `nodejs` and `jdk` tool definitions.
2. Runs tests with `catchError(buildResult: 'UNSTABLE')`.
3. Generates Allure report.
4. Uses the Jenkins Allure Plugin (`allure results: [[path: 'allure-results']]`) to render the report tab natively in the Jenkins UI.

---

## 11. Troubleshooting & FAQ

### Q1: `allure: command not found` or `npx allure` fails with Java error
* **Cause**: Allure CLI requires Java (JRE 8 or higher).
* **Fix**: Ensure Java is installed and `JAVA_HOME` is configured in your PATH:
  ```bash
  java -version
  ```

### Q2: Report shows 0 tests or empty dashboard
* **Cause**: `allure-results` directory was either wiped or the reporter was not invoked.
* **Fix**: Ensure `allure-playwright` is listed in `reporter` in `playwright.config.ts`, and run tests before running `npm run allure:generate`.

### Q3: How to view the report without running an HTTP server?
* **Answer**: Browsers block direct `file:///.../allure-report/index.html` loading due to CORS restrictions on JSON assets. Always use:
  ```bash
  npm run allure:open
  # OR
  npm run allure:serve
  ```
