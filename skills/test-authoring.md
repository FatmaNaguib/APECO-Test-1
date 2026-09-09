# Playwright Test Authoring Standard

This skill defines the mandatory standard for converting test cases into automated Playwright tests. Follow these instructions whenever you write, refactor, or review test code.

---

## 1. Locators Strategy
* **Priority Order**: Always prioritize user-facing, accessible locators:
  1. `page.getByRole()` (buttons, links, headings, alerts)
  2. `page.getByLabel()` (form inputs with linked labels)
  3. `page.getByPlaceholder()` (form inputs where label-binding is ambiguous)
  4. `page.getByText()` (static text content, inline validation messages)
* **Never Use Brittle Chains**: Do not use structural, auto-generated, or deep CSS/XPath selectors (e.g., `div > div.col-md-6:nth-child(2) > input`).
* **Missing Locators**: If no resilient accessible locator exists, recommend adding a dedicated `data-testid` or standard accessibility attribute (`aria-label`, `for`/`id`) to the application source.

---

## 2. Assertions & Verification
* **Assert Real Outcomes**: Every test must verify concrete functional outcomes:
  * **State & Visibility**: `await expect(locator).toBeVisible()`, `toBeHidden()`, `toBeDisabled()`
  * **Values & Content**: `await expect(input).toHaveValue(...)`, `toHaveText(...)`, `toContainText(...)`
  * **Routing & Network**: `await expect(page).toHaveURL(...)`
* **Forbidden**: Never write tests that only check that "the page did not crash" or assert tautologies (e.g., `expect(true).toBe(true)`).

---

## 3. Architecture & Structure
* **File Organization**:
  * Organize tests by feature area: one spec file per area (e.g., `tests/login.spec.ts`, `tests/requests.spec.ts`).
  * Group related scenarios using `test.describe('Feature - Subfeature', () => { ... })`.
* **Lightweight Page Objects (POM)**:
  * Create a concise Page Object class for each feature area under `pages/` (e.g., `pages/LoginPage.ts`).
  * Page Objects hold locators as properties or getters and encapsulate reusable interaction methods (e.g., `login(username, password)`).
  * Keep Page Objects focused and lean—avoid bloated utility dumps.

---

## 4. Fixtures & Shared Setup
* **Zero Copy-Paste Setup**: Shared prerequisites (such as authenticated sessions, base navigation, or seeded state) must be implemented via Playwright custom fixtures (`test.extend<{ ... }>()`), never copy-pasted across `beforeEach` hooks or individual tests.
* **Storage State**: For authenticated suites, save and reuse storage state via Playwright project dependencies or fixtures where applicable.

---

## 5. Test Isolation & Independence
* **Zero Interdependence**: Every test must run completely independently and pass in any execution order.
* **Clean State**: Tests must establish their own preconditions, clean up after themselves, and never depend on side effects or data left behind by prior tests.

---

## 6. Secrets & Environment Configuration
* **No Hardcoded Credentials**: Passwords, API keys, and sensitive test accounts must strictly be loaded from environment variables:
  * `process.env.TEST_EMAIL`
  * `process.env.TEST_PASSWORD`
* **Safe Fallbacks**: If environment variables are unset, fail fast with a clear descriptive configuration error rather than falling back to committed plain-text credentials.

---

## 7. Forbidden Anti-Patterns (Strict Rules)
1. **NO Manual Sleeps**: Never use `page.waitForTimeout(ms)` or artificial delays. Rely entirely on Playwright's built-in auto-waiting and web-first assertions (`expect(locator).toBeVisible()`).
2. **NO Hardcoded Secrets**: Never commit passwords, tokens, or private emails directly into test files.
3. **NO Static Value Assertions**: Do not assert on constant values that never change or can never fail.
4. **NO Flaky Pre-conditions**: Do not assume prior tests logged in or created data.
