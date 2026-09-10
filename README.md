# Enterprise Playwright Test Automation Framework

A scalable, maintainable, and enterprise-grade UI test automation framework built from scratch using **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

---

## 🏛 Framework Architecture & Directory Structure

```
├── .env.example              # Template for environment-specific variables
├── package.json              # NPM dependencies and predefined test scripts
├── playwright.config.ts      # Multi-environment, multi-browser Playwright configuration
├── tsconfig.json             # TypeScript compiler settings
│
├── config/                   # Environment orchestration
│   └── environment.ts        # Centralized typed environment variables (dev, qa, staging)
│
├── pages/                    # Page Object Model layer
│   ├── BasePage.ts           # Abstract base page encapsulating Playwright actions & logging
│   └── LoginPage.ts          # Business actions and locators for Login page
│
├── components/               # Modular, reusable UI fragments
│   └── Header.ts             # Header navigation and global controls component
│
├── fixtures/                 # Custom Playwright test fixtures
│   └── test.fixture.ts       # Test fixture providing pre-instantiated page objects
│
├── test-data/                # Static test data & test data factories
│   └── users.json            # User credentials, personas, and boundary inputs
│
├── utils/                    # Shared helper utilities
│   └── logger.ts             # Structured timestamped execution logger
│
├── tests/                    # Test suites organized by execution tier
│   ├── smoke/                # Fast, critical happy-path validations
│   │   └── login.spec.ts     # Smoke tests for authentication
│   ├── regression/           # Deep functional, negative, and edge testing
│   │   └── login.spec.ts     # Validation rules and boundary tests
│   └── e2e/                  # End-to-end user journeys
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18+ or v20+ LTS
* **npm**: v9+ (or yarn/pnpm)

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

Install Playwright browsers (Chromium, Firefox, WebKit):
```bash
npx playwright install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Customize the target environment and test credentials:
```ini
TEST_ENV=qa
QA_BASE_URL=https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io
TEST_EMAIL=apecouser@hotmail.com
TEST_PASSWORD=P0rtal#Cqnyp
```

---

## 💻 Running Tests

| Command | Description |
| :--- | :--- |
| `npm run test` | Run all test suites across configured browsers |
| `npm run test:chrome` | Run tests exclusively on Chromium / Google Chrome |
| `npm run test:firefox` | Run tests on Firefox |
| `npm run test:webkit` | Run tests on WebKit (Safari engine) |
| `npm run test:smoke` | Run only smoke suite tests (`tests/smoke`) |
| `npm run test:regression` | Run only regression suite tests (`tests/regression`) |
| `npm run test:ui` | Open the interactive Playwright UI Test Runner |
| `npm run test:debug` | Run tests in Playwright Inspector debug mode |
| `npm run test:headed` | Execute tests with the browser window visible |
| `npm run report` | Open the generated HTML test execution report |

---

## 📐 Implementation Standards & Design Patterns

### 1. BasePage Abstraction
All Page Objects inherit from `BasePage`, which standardizes:
* Logging of interactions (clicks, fills, navigations) via `Logger`.
* Explicit auto-waiting on element state (`visible`, `attached`).
* Standardized error handling and screenshot capture.

### 2. Page Object Model (POM) Rules
* **Private Locators**: All `Locator` declarations must be `private` or `protected`.
* **Business-Level Methods**: Expose user-centric workflows (e.g. `loginPage.login(email, password)`), not low-level clicks.
* **No Assertions in Pages**: Assertions belong exclusively in test spec files. Expose locator getters (e.g. `loginPage.toastAlert`) for assertions in tests.

### 3. Arrange-Act-Assert (AAA) Pattern
Tests must follow the AAA pattern for clean readability:
```typescript
test('User logs in successfully', async ({ loginPage, page }) => {
  // 1. Arrange: Prepare data and navigate
  const { email, password } = usersData.validUser;

  // 2. Act: Execute the workflow
  await loginPage.login(email, password);

  // 3. Assert: Verify the outcome
  await expect(page).toHaveURL(/.*workspace/);
});
```

### 4. Dependency Injection via Custom Fixtures
Eliminate boilerplate page instantiation by leveraging `fixtures/test.fixture.ts`:
```typescript
import { test, expect } from '../fixtures/test.fixture';

test('My test', async ({ loginPage, header }) => {
  // loginPage and header are automatically instantiated with the current page context
  await loginPage.goto();
});
```

---

## ✍️ How to Add a New Page and Test

### Step 1: Create the Page Object in `/pages`
Create `pages/RequestsPage.ts`:
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RequestsPage extends BasePage {
  private readonly newRequestButton: Locator;

  constructor(page: Page) {
    super(page);
    this.newRequestButton = page.getByRole('button', { name: 'New Request' });
  }

  async clickNewRequest(): Promise<void> {
    await this.click(this.newRequestButton, 'New Request button');
  }

  get newRequestBtn(): Locator {
    return this.newRequestButton;
  }
}
```

### Step 2: Register in `fixtures/test.fixture.ts`
```typescript
import { RequestsPage } from '../pages/RequestsPage';

type CustomFixtures = {
  // ...
  requestsPage: RequestsPage;
};

export const test = baseTest.extend<CustomFixtures>({
  // ...
  requestsPage: async ({ page }, use) => {
    await use(new RequestsPage(page));
  },
});
```

### Step 3: Write the Test in `/tests`
Create `tests/smoke/requests.spec.ts`:
```typescript
import { test, expect } from '../../fixtures/test.fixture';

test.describe('Smoke Suite - Requests', () => {
  test('User can initiate a new request', async ({ requestsPage, page }) => {
    await requestsPage.navigate('/requests');
    await requestsPage.clickNewRequest();
    await expect(page).toHaveURL(/.*create-request/);
  });
});
```

---

## 📊 Reporting & CI Integration
* **HTML Report**: Automatically generated on every run (`playwright-report/index.html`).
* **Traces & Videos**: Configured to capture full traces, screenshots, and videos on failure for instant root-cause analysis (`trace: 'retain-on-failure'`).
* **CI Execution**: Configured in `playwright.config.ts` with 2 retries on CI workers and headless execution by default.
