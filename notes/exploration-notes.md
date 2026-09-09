# Exploration Notes

## Login

### Flows
1. **Normal Login Flow**:
   1. Navigate to base URL (`/`), which redirects to `/auth/login?redirect-url=%2Fworkspace`.
   2. Locate the **Username** field and enter email address (`apecouser@hotmail.com`).
   3. Locate the **Password** field and enter password (`P0rtal#Cqnyp`).
   4. Click the **Login** button.
   5. Verify redirection to `/workspace` and dashboard visibility.
2. **Deep-Link Redirect Flow (`redirect-url`)**:
   1. Navigate to `/auth/login?redirect-url=%2Fschools` while unauthenticated.
   2. Enter valid credentials (`apecouser@hotmail.com` / `P0rtal#Cqnyp`).
   3. Click the **Login** button.
   4. Verify redirection directly to target route `/schools` rather than default `/workspace`.
3. **Empty Fields Validation Flow**:
   1. Navigate to `/auth/login` with empty fields.
   2. Click **Login**.
   3. Verify red error borders (`input-error`) and inline validation messages (`please enter user name`, `please enter the password`).
4. **Password Field Inspection & Toggle Flow**:
   1. Enter password; verify masking (`type="password"`).
   2. Click the password visibility toggle button (`.password-toggle`).
   3. Verify input type changes to `text` and icon switches from `bi-eye-slash` to `bi-eye`.
   4. Click again; verify input reverts to `password`.
5. **UAE PASS Social Authentication Flow**:
   1. On `/auth/login`, click the **"Sign in with UAE PASS"** button.
   2. Verify browser navigates to the official UAE PASS staging authentication endpoint (`https://stg-ids.uaepass.ae/authenticationendpoint/login.do?...`) with valid OAuth2 parameters.
6. **Multilingual (English / Arabic RTL) Toggle Flow**:
   1. On `/auth/login`, click the language switcher dropdown in the header.
   2. Select **العربية** (`Arabic`).
   3. Verify layout direction flips to `rtl` (`dir="rtl"`) and all form elements/labels/placeholders render in Arabic.
   4. Switch back to **English**; verify layout direction reverts to `ltr`.

### Selectors
* **Username / Email field**:
  * Recommended: `page.getByLabel('Username')`
  * Fallback: `page.getByPlaceholder('Enter your username')` or `page.getByRole('textbox', { name: 'Username' })`
* **Password field**:
  * Recommended: `page.getByPlaceholder('Enter your password')` or `page.getByRole('textbox', { name: 'Password' })`
  * Fallback: `page.locator('#password')`
* **Password Visibility Toggle**:
  * Recommended: `page.getByRole('button', { name: 'Toggle password visibility' })`
  * Fallback: `page.getByLabel('Toggle password visibility')`
* **Server error notification (Failed Login)**:
  * Recommended: `page.getByRole('alert')` or `page.getByText('Username or password is incorrect!')`
  * Fallback: `page.locator('#toast-container')` or `page.locator('.ngx-toastr.toast-error')`
* **Sign-in / Login button**:
  * Recommended: `page.getByRole('button', { name: 'Login' })`
* **UAE PASS button**:
  * Recommended: `page.getByRole('button', { name: 'Sign in with UAE PASS' })`
  * Fallback: `page.locator('button.uae-pass-button')`
* **Language Switcher**:
  * Switcher dropdown: `page.locator('app-language-switcher nz-select')`
  * Arabic option: `page.locator('.ant-select-item-option[title="العربية"]')`
  * English option: `page.locator('.ant-select-item-option[title="English"]')`
* **Client-side validation error messages**:
  * Missing username: `page.getByText('please enter user name')`
  * Missing password: `page.getByText('please enter the password')`
  * Invalid email / whitespace: `page.getByText('Please enter a valid email')`
  * Password format/length constraint: `page.getByText(/Please enter a password between 6 to 12 characters/i)`

### Surprises
| # | What I did | Expected | Actual | Breaks Requirement |
|---|---|---|---|---|
| 1 | Entered valid email with leading/trailing spaces (`  apecouser@hotmail.com  `) | Form auto-trims whitespace and submits | Form blocked client-side with error *"Please enter a valid email"*; no whitespace trimming | **REQ-LOGIN-09**: *"User input should trim whitespace and field labeling must be consistent with validation rules"* |
| 2 | Clicked **Login** with empty fields | Proper capitalized error messages (e.g. *"Please enter username"*) | Uncapitalized lowercase strings: `please enter user name` and `please enter the password` | **REQ-LOGIN-04 / REQ-LOGIN-05**: *"Required field error messages must be clearly and consistently formatted"* |

---

## Login Links

### Flows
1. Navigate to base URL (`/`), which redirects to `/auth/login?redirect-url=%2Fworkspace`.
2. Click the **PEAO Logo** link in the header.
3. Click the **Forgot password?** link to open the password recovery view (`/auth/forget-password`).
4. Click browser back or the page logo to return to the login view.
5. Click the **Create new account** link to open the registration view (`/auth/new-account`).
6. Click browser back to return to the login view.
7. **Direct URL Subpage Access & Back Button History Navigation**:
   1. Navigate directly to `/auth/forget-password` in a new tab / without browser history.
   2. Click the circular back button (`#back-btn`).
   3. Observe navigation to `about:blank` / browser exit rather than returning to `/auth/login`.
   4. Repeat directly on `/auth/new-account`; observe identical behavior.
8. **Pre-Login Footer Links Inspection**:
   1. On `/auth/forget-password` or `/auth/new-account`, scroll to the rendered `app-footer`.
   2. Click internal navigation links (**Workspace**, **Requests**, **Services**, **My Schools**); observe bounce to `/auth/login?redirect-url=...`.
   3. Click social links (Instagram routes to `assets/icons/instagram.svg`; Facebook/Telegram are dead anchor tags without `href`).
   4. Click policy links (Copyright, Terms, Disclaimer, Privacy Policy; all are dead anchor tags without `href`).
9. **Pre-Login Subpage Multilingual Toggle**:
   1. On `/auth/forget-password` and `/auth/new-account`, locate the top right language switcher dropdown.
   2. Select **العربية** (`Arabic`); verify direction flips to `rtl`.
   3. Switch back to **English**; verify direction reverts to `ltr`.

### Selectors
* **PEAO Logo**:
  * Recommended: `page.getByRole('link', { name: 'PEAO Logo' })`
  * Fallback: `page.locator('a[routerlink="/"]')`
* **Forgot Password link**:
  * Recommended: `page.getByRole('link', { name: 'Forgot password?' })`
  * Fallback: `page.locator('a[routerlink="/auth/forget-password"]')`
* **Create New Account link**:
  * Recommended: `page.getByRole('link', { name: 'Create new account' })`
  * Fallback: `page.locator('a[routerlink="/auth/new-account"]')`
* **Subpage Circular Back Button**:
  * Recommended: `page.locator('#back-btn')`
  * Fallback: `page.locator('button.ant-btn-circle:has(img[src*="back-button-arrow"])')`
* **Pre-Login Language Switcher**:
  * Recommended: `page.locator('app-language-switcher nz-select')`
* **Pre-Login Footer Links**:
  * Protected links: `page.locator('app-footer').getByRole('link', { name: 'Workspace' })`
  * Instagram asset link: `page.locator('app-footer a[href*="instagram.svg"]')`

### Surprises
| # | What I did | Expected | Actual | Breaks Requirement |
|---|---|---|---|---|
| 1 | Clicked footer links on `/auth/forget-password` and `/auth/new-account` | Functional links pointing to public pages/policies | Instagram routes to raw SVG image; Facebook, Telegram, Copyright, Terms, Disclaimer, and Privacy Policy are dead empty anchor tags | **REQ-LOGIN-19**: *"All external and informational footer links rendered on pre-login pages must point to valid destinations and functioning web resources"* |

---

## Workspace Links

### Flows
1. Log in with valid credentials (`apecouser@hotmail.com` / `P0rtal#Cqnyp`) to land on `/workspace`.
2. **Header Navigation Links**:
   * Click the **Home** icon in the header to return/remain on `/workspace`.
   * Click **Services** in the top navigation bar.
   * Click **Contact Us** in the top navigation bar.
3. **Workspace Action Cards & Table Links**:
   * Click the **"To Do"** or **"Draft"** stat card to navigate to `/requests`.
   * Click the **"Documents"** stat card to navigate to `/documents`.
   * Click any school card (e.g., *Australian International Private School*) to navigate to `/school-details/865`.
   * Click the **Add School (`+`)** button in the *My Schools* section.
   * Click the **"All Requests"** button to navigate to `/requests`.
   * Click the **"Details"** action button on any table row to navigate to `/request-details/{id}`.
4. **Drawer / Sidebar Navigation Links (Hamburger Menu)**:
   * Click the header hamburger menu button (`.anticon-menu`) to expand the drawer.
   * Click **Profile** (*"Anas Mohamed"*) to navigate to `/profile`.
   * Click **Penalties** to navigate to `/penalties`.
   * Click **Invoices** to navigate to `/invoices`.
   * Click external public links (*About Us*, *Educational Institutions*, *Services*, *Media*, *Laws and Decrees*, *Contact Us*).
   * Click **Logout** (`#logout-btn`), then click **"Yes"** in the confirmation modal to log out and return to `/auth/login`.
5. **Footer Links**:
   * Click internal footer links (**Workspace**, **Requests**, **Services**, **My Schools**).
   * Click social media icons (**Facebook**, **Telegram**, **Instagram**).
   * Click footer legal links (**Copyright**, **Terms & Conditions**, **Disclaimer**, **Privacy Policy**).

### Selectors
* **Header Links**:
  * Home link: `page.locator('app-header li.icon-li[routerlink="/"]:visible')`
  * Services (header): `page.locator('app-header a#services:visible')`
  * Contact Us (header): `page.locator('app-header a#contactus:visible')`
  * Hamburger Menu toggle: `page.locator('app-header .anticon-menu')`
* **Workspace Cards & Tables**:
  * "To Do" card: `page.locator('app-card-with-image').filter({ hasText: 'To Do' })`
  * "Draft" card: `page.locator('app-card-with-image').filter({ hasText: 'Draft' })`
  * "Documents" card: `page.locator('app-card-with-image').filter({ hasText: 'Documents' })`
  * School card: `page.locator('div.school').filter({ hasText: 'Australian International Private School' })`
  * Add School (`+`) button: `page.locator('button[ng-reflect-router-link*="initial-approval"]')`
  * All Requests button: `page.getByRole('button', { name: 'All Requests' })`
  * Request Details button: `page.getByRole('row', { name: 'IDPRCH14641' }).getByRole('button', { name: 'Details' })`
* **Drawer / Sidebar Links**:
  * Profile link: `page.locator('.ant-drawer-open [routerlink="/profile"]')`
  * Penalties: `page.locator('.ant-drawer-open .nav-button').filter({ hasText: 'Penalties' })`
  * Invoices: `page.locator('.ant-drawer-open .nav-button').filter({ hasText: 'Invoices' })`
  * Logout button: `page.locator('.ant-drawer-open #logout-btn')`
  * Logout confirmation "Yes": `page.locator('.logout-modal').getByRole('button', { name: 'Yes' })`
* **Footer Links**:
  * Workspace: `page.locator('app-footer').getByRole('link', { name: 'Workspace' })`
  * Requests: `page.locator('app-footer').getByRole('link', { name: 'Requests' })`
  * Services: `page.locator('app-footer').getByRole('link', { name: 'Services' })`
  * My Schools: `page.locator('app-footer').getByRole('link', { name: 'My Schools' })`
  * Instagram icon: `page.locator('app-footer a:has(img[src*="instagram"])')`
  * Facebook icon: `page.locator('app-footer a:has(img[src*="facebook"])')`
  * Telegram icon: `page.locator('app-footer a:has(img[src*="telgram"])')`

### Surprises
1. **Broken Contact Us Link (`DNS_PROBE_FINISHED_NXDOMAIN`)**:
   * **Action**: Clicked "Contact Us" in the header navigation.
   * **Expected**: Open the official contact page in a new tab.
   * **Actual**: Browser opened `https://apea.ae/en/contact-us` which failed to resolve with `DNS_PROBE_FINISHED_NXDOMAIN` ("This site can't be reached").
2. **Broken 404 Route on Add School (`+`) Button**:
   * **Action**: Clicked the `+` button in the *My Schools* section.
   * **Expected**: Open the initial permit or school registration form.
   * **Actual**: Routed to truncated path `/services/initial-approval-sch` which redirected directly to `/page-not-found` ("404 Page Not Found").
3. **Instagram Footer Icon Links to Raw SVG Image**:
   * **Action**: Clicked the Instagram icon in the footer.
   * **Expected**: Navigate to the official Instagram profile.
   * **Actual**: Browser directly navigated to `https://.../assets/icons/instagram.svg`, displaying the raw SVG vector file instead of a web page.
4. **Dead Footer Links with No `href`**:
   * **Action**: Clicked Facebook, Telegram, Copyright, Terms & Conditions, Disclaimer, and Privacy Policy in the footer.
   * **Expected**: Navigate to corresponding social profiles and policy documents.
   * **Actual**: All are empty `<a>` tags with no `href` attributes and no click listeners; clicking them performs no action.
5. **Insecure SSL Warning on All Sidebar Public Links (`ERR_CERT_COMMON_NAME_INVALID`)**:
   * **Action**: Clicked external informational links in the navigation drawer (*About Us*, *Institutions*, *Services*, *Media*, *Laws*, *Contact Us*).
   * **Expected**: Open informational portal pages securely in a new tab.
   * **Actual**: All 6 links point to `https://test.optimalpass.org/*`, which has an invalid/mismatched SSL certificate, triggering Chrome's full-page red security warning screen (*"Your connection is not private"*).
6. **Inconsistent Link Target Behaviors & Duplicate IDs**:
   * **Action**: Clicked "Services" in header vs. "Services" in footer.
   * **Expected**: Consistent single-page application navigation.
   * **Actual**: Header link has `target="_blank"` creating a duplicate browser tab, while footer link routes in-place. In addition, `id="services"` is duplicated in the header HTML.
7. **Misleading "Most Used Services" Action Cards**:
   * **Action**: Clicked the "Add Student Degrees" card in *Most Used Services*.
   * **Expected**: Direct navigation to the student degrees service form.
   * **Actual**: The card displays `cursor: pointer` without a link URL; clicking it intercepted the flow and opened a draft selection modal (`<app-choose-draft-requests>`).

---

## Coverage Summary: Login & Login Links

| Requirement ID | Requirement Description | Status | Details |
| :--- | :--- | :---: | :--- |
| **REQ-LOGIN-01** | UI Rendering of sign-in card and inputs | **PASS** | Heading, Username, Password, UAE PASS, Login button, Forgot Password, and Create Account links present. |
| **REQ-LOGIN-02** | Password input masking | **PASS** | Defaults to `type="password"`. |
| **REQ-LOGIN-03** | Password visibility toggle | **PASS** | Switches between `password` and `text`; icon toggles cleanly. |
| **REQ-LOGIN-04** | Empty Username validation | **PASS** | Blocks submission; displays inline required warning. |
| **REQ-LOGIN-05** | Empty Password validation | **PASS** | Blocks submission; displays inline required warning. |
| **REQ-LOGIN-06** | Successful authentication | **PASS** | Authenticates with valid credentials and redirects to `/workspace`. |
| **REQ-LOGIN-07** | Failed login error notification | **PASS** | Server returns `406 Not Acceptable`; UI displays a red toast alert banner (`role="alert"`) with *"Username or password is incorrect!"*. |
| **REQ-LOGIN-08** | Password length and format validation (6–12 chars with complexity) | **PASS** | Validates and enforces user requirement (6–12 characters with uppercase, lowercase, number, special character) displaying *"Please enter a password between 6 to 12 characters long that includes at least one uppercase letter, one lowercase letter, one number, and one special character"*. |
| **REQ-LOGIN-09** | Username email validation & whitespace trimming | **FAIL** | Strictly expects email without whitespace trimming; spaces trigger *"Please enter a valid email"*. |
| **REQ-LOGIN-10** | UAE PASS authentication integration | **PASS** | Redirects to `https://stg-ids.uaepass.ae/...` with valid client parameters. |
| **REQ-LOGIN-11** | Multilingual & RTL support | **PASS** | Switches smoothly between English (LTR) and Arabic (RTL) with localized copy. |
| **REQ-LOGIN-12** | Deep linking (`redirect-url`) | **PASS** | Respects query param (e.g. `?redirect-url=%2Fschools`) and redirects upon login. |
| **REQ-LOGIN-13** | Forgot password navigation | **PASS** | Navigates to `/auth/forget-password` with OTP input form. |
| **REQ-LOGIN-14** | Create new account navigation | **PASS** | Navigates to `/auth/new-account` with registration form. |
| **REQ-LOGIN-17** | End-to-end UAE PASS callback completion | **Untestable** | Requires active UAE PASS physical mobile app authentication credentials in QA environment. |
| **REQ-LOGIN-19** | Pre-login footer external & policy links validity | **FAIL** | Instagram opens raw SVG file (`assets/icons/instagram.svg`); Facebook, Telegram, and legal policy links are empty anchor tags without `href`. |
| **REQ-LOGIN-20** | Multilingual language switcher on auth subpages | **PASS** | Language switcher renders and functions on `/auth/forget-password` and `/auth/new-account`, toggling RTL/LTR layouts properly. |
