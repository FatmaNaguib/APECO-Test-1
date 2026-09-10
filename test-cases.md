# APECO Portal Test Matrix: Login & Login Links

This test matrix is designed in strict accordance with the [Test Case Design Standard](file:///d:/AI/APECO-Test-1/skills/test-case-design.md), using [exploration-notes.md](file:///d:/AI/APECO-Test-1/Notes/exploration-notes.md) as the factual source of truth for all application behaviors, DOM selectors, routes, and known regressions.

---

# Feature 1: Login

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Requirement Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-LOGIN-POS-01` | Successful authentication with valid credentials navigates to workspace dashboard | `REQ-LOGIN-01`, `REQ-LOGIN-06` |
| **Positive** | `TC-LOGIN-POS-02` | Deep linking preserves and routes to `redirect-url` destination upon authentication | `REQ-LOGIN-12` |
| **Positive** | `TC-LOGIN-POS-03` | Password visibility toggle alternates between masked and plain text input | `REQ-LOGIN-02`, `REQ-LOGIN-03` |
| **Positive** | `TC-LOGIN-POS-04` | UAE PASS button initiates redirection to official identity provider staging portal | `REQ-LOGIN-10` |
| **Positive** | `TC-LOGIN-POS-05` | Language switcher alternates login page interface and direction between English and Arabic | `REQ-LOGIN-11` |
| **Negative** | `TC-LOGIN-NEG-01` | Submission with empty username displays inline required validation | `REQ-LOGIN-04` |
| **Negative** | `TC-LOGIN-NEG-02` | Submission with empty password displays inline required validation | `REQ-LOGIN-05` |
| **Negative** | `TC-LOGIN-NEG-03` | Submission with both username and password empty displays simultaneous inline errors | `REQ-LOGIN-04`, `REQ-LOGIN-05` |
| **Negative** | `TC-LOGIN-NEG-04` | Authentication with invalid password returns HTTP 406 and displays toast notification | `REQ-LOGIN-07` |
| **Negative** | `TC-LOGIN-NEG-05` | Submission with plain non-email username is rejected client-side | `REQ-LOGIN-09` |
| **Negative** | `TC-LOGIN-NEG-06` | Submission with password lacking complexity requirements is rejected client-side | `REQ-LOGIN-08` |
| **Negative** | `TC-LOGIN-NEG-07` | Malformed email without domain or `@` is rejected client-side | `REQ-LOGIN-09` |
| **Edge** | `TC-LOGIN-EDGE-01` | Password at exact minimum length boundary (6 characters with complexity) is accepted | `REQ-LOGIN-08` |
| **Edge** | `TC-LOGIN-EDGE-02` | Password at exact maximum length boundary (12 characters with complexity) is accepted | `REQ-LOGIN-08` |
| **Edge** | `TC-LOGIN-EDGE-03` | Password just below minimum length (5 characters) triggers client-side validation error | `REQ-LOGIN-08` |
| **Edge** | `TC-LOGIN-EDGE-04` | Password just above maximum length (13 characters) triggers client-side validation error | `REQ-LOGIN-08` |
| **Edge** | `TC-LOGIN-EDGE-05` | Valid email with leading or trailing whitespace is rejected without auto-trimming | `REQ-LOGIN-09` |

---

## 1. Positive Test Cases

### `TC-LOGIN-POS-01`
* **Title**: Successful authentication with valid credentials navigates to workspace dashboard
* **Requirement**: `REQ-LOGIN-01`, `REQ-LOGIN-06`
* **Preconditions**: Browser navigated to `https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/auth/login`, unauthenticated.
* **Steps**:
  1. Locate `page.getByPlaceholder('Enter your username')` and enter `'apecouser@hotmail.com'`.
  2. Locate `page.getByPlaceholder('Enter your password')` and enter `'P0rtal#Cqnyp'`.
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Network dispatches `POST /Identity/api/Identity/Login` returning `HTTP 200 OK` with auth bearer tokens.
  * Browser redirects to `/workspace`.
  * Dashboard header, navigation cards (*To Do*, *Draft*, *Documents*), and *My Schools* table are visible.

---

### `TC-LOGIN-POS-02`
* **Title**: Deep linking preserves and routes to `redirect-url` destination upon authentication
* **Requirement**: `REQ-LOGIN-12`
* **Preconditions**: Browser navigated to `/auth/login?redirect-url=%2Fschools`, unauthenticated.
* **Steps**:
  1. Verify current URL contains `?redirect-url=%2Fschools`.
  2. Enter `'apecouser@hotmail.com'` into `page.getByPlaceholder('Enter your username')`.
  3. Enter `'P0rtal#Cqnyp'` into `page.getByPlaceholder('Enter your password')`.
  4. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Upon successful authentication, browser redirects directly to `/schools` rather than the default `/workspace`.
  * The *My Schools* page content is rendered.

---

### `TC-LOGIN-POS-03`
* **Title**: Password visibility toggle alternates between masked and plain text input
* **Requirement**: `REQ-LOGIN-02`, `REQ-LOGIN-03`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Enter `'P0rtal#Cqnyp'` into `page.getByPlaceholder('Enter your password')`.
  2. Verify attribute `type="password"` on `page.locator('#password')`.
  3. Click `page.getByRole('button', { name: 'Toggle password visibility' })`.
  4. Verify attribute `type="text"` on `page.locator('#password')`.
  5. Click `page.getByRole('button', { name: 'Toggle password visibility' })` again.
* **Expected Result**:
  * Step 2: Password text is concealed (`type="password"`).
  * Step 4: Password text is visible in plain text (`type="text"`), icon shows `bi-eye`.
  * Step 5: Password text returns to concealed (`type="password"`), icon reverts to `bi-eye-slash`.

---

### `TC-LOGIN-POS-04`
* **Title**: UAE PASS button initiates redirection to official identity provider staging portal
* **Requirement**: `REQ-LOGIN-10`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Sign in with UAE PASS' })`.
  2. Await navigation event.
* **Expected Result**:
  * Browser redirects to `https://stg-ids.uaepass.ae/authenticationendpoint/login.do`.
  * Target URL contains valid OAuth parameters: `response_type=code`, `client_id`, `scope`, and `redirect_uri`.

---

### `TC-LOGIN-POS-05`
* **Title**: Language switcher alternates login page interface and direction between English and Arabic
* **Requirement**: `REQ-LOGIN-11`
* **Preconditions**: User is on `/auth/login` in English (LTR) mode.
* **Steps**:
  1. Click `page.locator('app-language-switcher nz-select')`.
  2. Click `page.locator('.ant-select-item-option[title="العربية"]')`.
  3. Verify `document.documentElement` has `dir="rtl"`.
  4. Verify heading displays localized Arabic text: `'تسجيل الدخول'`.
  5. Click `page.locator('app-language-switcher nz-select')`.
  6. Click `page.locator('.ant-select-item-option[title="English"]')`.
* **Expected Result**:
  * Steps 3–4: Document switches to Right-to-Left (`dir="rtl"`), and all card labels, placeholders, and buttons render in Arabic.
  * Step 6: Document reverts to Left-to-Right (`dir="ltr"`), and all copy returns to English.

---

## 2. Negative Test Cases

### `TC-LOGIN-NEG-01`
* **Title**: Submission with empty username displays inline required validation
* **Requirement**: `REQ-LOGIN-04`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Leave username input empty.
  2. Fill `page.getByPlaceholder('Enter your password')` with `'P0rtal#Cqnyp'`.
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * No network request is dispatched to `/Identity/Login`.
  * The username input container gains CSS class `.input-error` (red border).
  * Inline validation message `page.getByText('please enter user name')` is displayed.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-04]`  
  *Known defect: Validation message is displayed in all-lowercase text (`"please enter user name"`) rather than proper sentence case.*

---

### `TC-LOGIN-NEG-02`
* **Title**: Submission with empty password displays inline required validation
* **Requirement**: `REQ-LOGIN-05`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your username')` with `'apecouser@hotmail.com'`.
  2. Leave password input empty.
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * No network request is dispatched to `/Identity/Login`.
  * The password input container gains CSS class `.input-error` (red border).
  * Inline validation message `page.getByText('please enter the password')` is displayed.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-05]`  
  *Known defect: Validation message is displayed in all-lowercase text (`"please enter the password"`) rather than proper sentence case.*

---

### `TC-LOGIN-NEG-03`
* **Title**: Submission with both username and password empty displays simultaneous inline errors
* **Requirement**: `REQ-LOGIN-04`, `REQ-LOGIN-05`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Leave both username and password fields empty.
  2. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Form submission is blocked; 0 network requests are sent.
  * Both fields display red borders (`.input-error`).
  * Both inline messages (`'please enter user name'` and `'please enter the password'`) appear simultaneously.

---

### `TC-LOGIN-NEG-04`
* **Title**: Authentication with invalid password returns HTTP 406 and displays toast notification
* **Requirement**: `REQ-LOGIN-07`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your username')` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByPlaceholder('Enter your password')` with `'Wrong#123'` (valid 9-char format, invalid password).
  3. Click `page.getByRole('button', { name: 'Login' })`.
  4. Await response and notification.
* **Expected Result**:
  * Network request `POST /Identity/api/Identity/Login` returns `HTTP 406 Not Acceptable`.
  * Response body contains `{"Message":"Username or password is incorrect!"}`.
  * An `ngx-toastr` toast alert (`role="alert"`) renders at bottom center displaying:  
    `"Username or password is incorrect!"`.

---

### `TC-LOGIN-NEG-05`
* **Title**: Submission with plain non-email username is rejected client-side
* **Requirement**: `REQ-LOGIN-09`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your username')` with `'apecouser'`.
  2. Blur the field by clicking the password input.
* **Expected Result**:
  * Username input gains class `ng-invalid` and container gains `.input-error`.
  * Inline validation text `page.getByText('Please enter a valid email')` becomes visible.
  * Clicking `Login` sends 0 network requests.

---

### `TC-LOGIN-NEG-06`
* **Title**: Submission with password lacking complexity requirements is rejected client-side
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your username')` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByPlaceholder('Enter your password')` with `'simplepass'` (lacks uppercase, number, special character).
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Submission is blocked client-side.
  * Password input gains class `ng-invalid` and container gains `.input-error`.
  * Inline error displays:  
    `"Please enter a password between 6 to 12 characters long that includes at least one uppercase letter, one lowercase letter, one number, and one special character"`.

---

### `TC-LOGIN-NEG-07`
* **Title**: Malformed email without domain or `@` is rejected client-side
* **Requirement**: `REQ-LOGIN-09`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Enter `'apecouser@'` into `page.getByPlaceholder('Enter your username')`.
  2. Blur the field.
  3. Repeat with `'apecouserhotmail.com'`.
* **Expected Result**:
  * Field is marked `ng-invalid` with red error border.
  * Inline message `page.getByText('Please enter a valid email')` is visible for both invalid formats.

---

## 3. Edge Test Cases

### `TC-LOGIN-EDGE-01`
* **Title**: Password at exact minimum length boundary (6 characters with complexity) is accepted
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your username')` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByPlaceholder('Enter your password')` with `'Aa1#bb'` (exactly 6 characters, uppercase + lowercase + number + special).
  3. Blur the field.
* **Expected Result**:
  * Field is marked `ng-valid` with clean border (no `.input-error`).
  * No complexity or length validation messages appear.
  * Clicking `Login` allows the form to submit to `/Identity/Login`.

---

### `TC-LOGIN-EDGE-02`
* **Title**: Password at exact maximum length boundary (12 characters with complexity) is accepted
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your username')` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByPlaceholder('Enter your password')` with `'Aa1#bbCc2$dd'` (exactly 12 characters with full complexity).
  3. Blur the field.
* **Expected Result**:
  * Field is marked `ng-valid` with clean border (no `.input-error`).
  * No complexity or length validation messages appear.
  * Clicking `Login` allows the form to submit to `/Identity/Login`.

---

### `TC-LOGIN-EDGE-03`
* **Title**: Password just below minimum length (5 characters) triggers client-side validation error
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your password')` with `'Aa1#b'` (5 characters: min - 1).
  2. Blur the field.
* **Expected Result**:
  * Field is flagged `ng-invalid` with `.input-error`.
  * Inline validation text displays:  
    `"Please enter a password between 6 to 12 characters long that includes at least one uppercase letter, one lowercase letter, one number, and one special character"`.
  * Form submission is blocked.

---

### `TC-LOGIN-EDGE-04`
* **Title**: Password just above maximum length (13 characters) triggers client-side validation error
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Fill `page.getByPlaceholder('Enter your password')` with `'Aa1#bbCc2$ddE'` (13 characters: max + 1).
  2. Blur the field.
* **Expected Result**:
  * Field is flagged `ng-invalid` with `.input-error`.
  * Inline validation text displays:  
    `"Please enter a password between 6 to 12 characters long that includes at least one uppercase letter, one lowercase letter, one number, and one special character"`.
  * Form submission is blocked.

---

### `TC-LOGIN-EDGE-05`
* **Title**: Valid email with leading or trailing whitespace is rejected without auto-trimming
* **Requirement**: `REQ-LOGIN-09`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Enter `'  apecouser@hotmail.com  '` (email with leading and trailing whitespace) into `page.getByPlaceholder('Enter your username')`.
  2. Enter `'P0rtal#Cqnyp'` into `page.getByPlaceholder('Enter your password')`.
  3. Click `page.getByRole('button', { name: 'Login' })`.
* **Expected Result**:
  * Form validator fails to auto-trim whitespace.
  * Input is marked `ng-invalid` with red border (`.input-error`).
  * Inline error displays: `"Please enter a valid email"`.
  * Submission is blocked client-side; 0 HTTP requests are dispatched.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-09]`  
  *Known defect: Application lacks `.trim()` sanitization on email input, rejecting autofilled or pasted emails containing whitespace.*

---
---

# Feature 2: Login Links

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Requirement Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-LINKS-POS-01` | "Forgot password?" link navigates to OTP recovery view | `REQ-LOGIN-13` |
| **Positive** | `TC-LINKS-POS-02` | "Create new account" link navigates to user registration view | `REQ-LOGIN-14` |
| **Positive** | `TC-LINKS-POS-03` | Subpage circular back button returns to login view within active browser history | `REQ-LOGIN-13`, `REQ-LOGIN-14` |
| **Positive** | `TC-LINKS-POS-04` | Language switcher on auth subpages toggles layout between LTR and RTL | `REQ-LOGIN-20` |
| **Negative** | `TC-LINKS-NEG-01` | Direct subpage access without prior session history causes back button to exit application | Gap / Architecture |
| **Negative** | `TC-LINKS-NEG-02` | Unauthenticated click on PEAO header logo loops back to login view | Architecture |
| **Negative** | `TC-LINKS-NEG-03` | Clicking protected dashboard footer links on auth subpages triggers auth redirect | Architecture |
| **Negative** | `TC-LINKS-NEG-04` | Social media and policy footer links on auth subpages are non-functional anchor tags | `REQ-LOGIN-19` |
| **Edge** | `TC-LINKS-EDGE-01` | Instagram footer icon opens raw SVG vector graphic rather than external social profile | `REQ-LOGIN-19` |
| **Edge** | `TC-LINKS-EDGE-02` | Rapid sequential link navigation across auth views preserves form rendering integrity | Architecture |
| **Edge** | `TC-LINKS-EDGE-03` | Language switching on subpages preserves form input states and orientation | `REQ-LOGIN-20` |

---

## 1. Positive Test Cases

### `TC-LINKS-POS-01`
* **Title**: "Forgot password?" link navigates to OTP recovery view
* **Requirement**: `REQ-LOGIN-13`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Click `page.getByRole('link', { name: 'Forgot password?' })`.
  2. Await navigation.
* **Expected Result**:
  * Browser URL changes to `https://.../auth/forget-password`.
  * Page renders phone/identity input field, `#back-btn`, and `'Send OTP'` button.

---

### `TC-LINKS-POS-02`
* **Title**: "Create new account" link navigates to user registration view
* **Requirement**: `REQ-LOGIN-14`
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Click `page.getByRole('link', { name: 'Create new account' })`.
  2. Await navigation.
* **Expected Result**:
  * Browser URL changes to `https://.../auth/new-account`.
  * Registration form renders fields (*First Name English*, *Last Name English*, *First Name Arabic*, *Last Name Arabic*, *Email*, *Password*, *Confirm Password*) and `'Register'` button.

---

### `TC-LINKS-POS-03`
* **Title**: Subpage circular back button returns to login view within active browser history
* **Requirement**: `REQ-LOGIN-13`, `REQ-LOGIN-14`
* **Preconditions**: User navigated to `/auth/login` and clicked *"Forgot password?"* to land on `/auth/forget-password`.
* **Steps**:
  1. Click the circular back button: `page.locator('#back-btn')`.
  2. Await navigation.
* **Expected Result**:
  * Browser history steps back to `/auth/login`.
  * The login card (*Sign in*, *Username*, *Password*, *Login*) is fully re-rendered and interactive.

---

### `TC-LINKS-POS-04`
* **Title**: Language switcher on auth subpages toggles layout between LTR and RTL
* **Requirement**: `REQ-LOGIN-20`
* **Preconditions**: User is on `/auth/forget-password` in default English mode.
* **Steps**:
  1. Click `page.locator('app-language-switcher nz-select')`.
  2. Click `page.locator('.ant-select-item-option[title="العربية"]')`.
  3. Verify `html` element attribute `dir="rtl"`.
  4. Click `page.locator('app-language-switcher nz-select')`.
  5. Click `page.locator('.ant-select-item-option[title="English"]')`.
* **Expected Result**:
  * Step 3: Page switches to RTL orientation (`dir="rtl"`), and subpage labels translate to Arabic.
  * Step 5: Page reverts cleanly to LTR orientation (`dir="ltr"`), and labels return to English.

---

## 2. Negative Test Cases

### `TC-LINKS-NEG-01`
* **Title**: Direct subpage access without prior session history causes back button to exit application
* **Requirement**: Navigation Defect
* **Preconditions**: Fresh browser tab / clean session navigated directly to `https://.../auth/forget-password` (no prior history stack).
* **Steps**:
  1. Click `page.locator('#back-btn')`.
* **Expected Result**:
  * Because `#back-btn` relies on `window.history.back()` rather than explicit routing, browser navigates to `about:blank` or closes tab instead of routing to `/auth/login`.
* **Regression Flag**: `[Planned Regression - Bug: Subpage Navigation]`  
  *Known defect: Auth subpages lack dedicated "Back to Login" links and rely strictly on browser history.*

---

### `TC-LINKS-NEG-02`
* **Title**: Unauthenticated click on PEAO header logo loops back to login view
* **Requirement**: Public Portal Routing
* **Preconditions**: User is on `/auth/login`, unauthenticated.
* **Steps**:
  1. Click the PEAO header logo: `page.getByRole('link', { name: 'PEAO Logo' })`.
  2. Await navigation event.
* **Expected Result**:
  * Link points to `/` (`routerlink="/"`); the unauthenticated auth guard intercepts navigation and redirects back to `/auth/login?redirect-url=%2Fworkspace`.
  * User cannot access a public home or landing view via the header logo.

---

### `TC-LINKS-NEG-03`
* **Title**: Clicking protected dashboard footer links on auth subpages triggers auth redirect
* **Requirement**: Pre-Login Isolation
* **Preconditions**: User is on `/auth/forget-password` or `/auth/new-account`, unauthenticated.
* **Steps**:
  1. Scroll to the rendered `app-footer`.
  2. Click `page.locator('app-footer').getByRole('link', { name: 'Workspace' })`.
* **Expected Result**:
  * Browser attempts navigation to `/workspace`, which is rejected by the auth guard.
  * User is redirected to `/auth/login?redirect-url=%2Fworkspace`. Any unsaved recovery/registration form inputs are lost.

---

### `TC-LINKS-NEG-04`
* **Title**: Social media and policy footer links on auth subpages are non-functional anchor tags
* **Requirement**: `REQ-LOGIN-19`
* **Preconditions**: User is on `/auth/forget-password`.
* **Steps**:
  1. Inspect `app-footer` anchor elements for Facebook, Telegram, Copyright, Terms & Conditions, Disclaimer, and Privacy Policy.
  2. Click each link.
* **Expected Result**:
  * Anchors lack `href` attributes (`<a _ngcontent-...>`).
  * Clicking them produces zero navigation and triggers no modal or page event.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-19]`  
  *Known defect: Social media icons and policy links in footer are dead anchor tags with missing href attributes.*

---

## 3. Edge Test Cases

### `TC-LINKS-EDGE-01`
* **Title**: Instagram footer icon opens raw SVG vector graphic rather than external social profile
* **Requirement**: `REQ-LOGIN-19`
* **Preconditions**: User is on `/auth/forget-password` or `/auth/new-account`.
* **Steps**:
  1. Locate the Instagram icon in `app-footer`: `page.locator('app-footer a[href*="instagram.svg"]')`.
  2. Click the link.
* **Expected Result**:
  * Browser navigates directly to `https://.../assets/icons/instagram.svg`.
  * The browser displays the raw standalone SVG image document rather than redirecting to the organization's official Instagram profile.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-19]`  
  *Known defect: Anchor href points to the local vector image file path instead of an external social media profile URL.*

---

### `TC-LINKS-EDGE-02`
* **Title**: Rapid sequential link navigation across auth views preserves form rendering integrity
* **Requirement**: UI Lifecycle
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Click `page.getByRole('link', { name: 'Forgot password?' })`.
  2. Click `page.locator('#back-btn')`.
  3. Click `page.getByRole('link', { name: 'Create new account' })`.
  4. Click `page.locator('#back-btn')`.
* **Expected Result**:
  * Browser returns to `/auth/login`.
  * Username and Password fields remain interactive, properly bound to Angular form controls, and no JavaScript runtime errors are logged in the console.

---

### `TC-LINKS-EDGE-03`
* **Title**: Language switching on subpages preserves form input states and orientation
* **Requirement**: `REQ-LOGIN-20`
* **Preconditions**: User is on `/auth/new-account`.
* **Steps**:
  1. Enter `'John'` in *First Name (English)*.
  2. Switch language to **العربية** via `app-language-switcher nz-select`.
  3. Verify input field values are retained.
  4. Switch language back to **English**.
* **Expected Result**:
  * Form input data is preserved across RTL/LTR transitions without truncation or clearing.
  * RTL and LTR stylesheet layouts align properly with text flow.
