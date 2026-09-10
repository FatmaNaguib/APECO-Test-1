import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HeaderComponent } from '../components/Header';
import { Logger } from '../utils/logger';

/**
 * Custom Fixture Type Definition
 */
type CustomFixtures = {
  loginPage: LoginPage;
  header: HeaderComponent;
};

/**
 * Extended Playwright test instance providing pre-initialized Page Objects.
 */
export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    Logger.debug('Initializing LoginPage fixture');
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  header: async ({ page }, use) => {
    Logger.debug('Initializing HeaderComponent fixture');
    const header = new HeaderComponent(page);
    await use(header);
  },
});

export { expect };
