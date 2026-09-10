# APECO Portal Test Matrix: Login Localization

This test matrix is designed in strict accordance with the [Test Case Design Standard](file:///d:/AI/APECO-Test-1/skills/test-case-design.md), using [exploration-notes.md](file:///d:/AI/APECO-Test-1/exploration-notes.md) as the factual source of truth for all observed DOM selectors, layout behaviors, and localization regressions on the APECO Portal.

---

# Feature: Login Localization

## Overview & Requirements Coverage

| Category | Test Case ID | Title | Requirement Ref |
| :--- | :--- | :--- | :--- |
| **Positive** | `TC-LOC-POS-01` | Switching language to Arabic flips document layout to RTL and translates login interface | `REQ-LOGIN-11`, `REQ-LOGIN-20` |
| **Positive** | `TC-LOC-POS-02` | Successful authentication in Arabic mode authenticates user and navigates to workspace | `REQ-LOGIN-06`, `REQ-LOGIN-11` |
| **Positive** | `TC-LOC-POS-03` | Password visibility toggle in Arabic mode mirrors to left edge and alternates input type | `REQ-LOGIN-02`, `REQ-LOGIN-03` |
| **Positive** | `TC-LOC-POS-04` | Switching language from Arabic back to English restores LTR layout and English interface | `REQ-LOGIN-11`, `REQ-LOGIN-20` |
| **Positive** | `TC-LOC-POS-05` | Form input values are preserved across language switching transitions without data loss | `REQ-LOGIN-11`, `REQ-LOGIN-20` |
| **Positive** | `TC-LOC-POS-06` | Active validation error messages dynamically re-translate upon language toggle | `REQ-LOGIN-11`, `REQ-LOGIN-20` |
| **Negative** | `TC-LOC-NEG-01` | Empty form submission in Arabic mode displays localized Arabic required validation errors | `REQ-LOGIN-04`, `REQ-LOGIN-05` |
| **Negative** | `TC-LOC-NEG-02` | Submission with non-email username in Arabic mode displays localized format error | `REQ-LOGIN-09` |
| **Negative** | `TC-LOC-NEG-03` | Submission with non-compliant password in Arabic mode displays localized complexity error | `REQ-LOGIN-08` |
| **Negative** | `TC-LOC-NEG-04` | Authentication with invalid credentials in Arabic mode returns HTTP 406 and displays toast alert | `REQ-LOGIN-07` |
| **Negative** | `TC-LOC-NEG-05` | Password visibility toggle accessible name remains in English in Arabic mode | Accessibility Defect |
| **Negative** | `TC-LOC-NEG-06` | Header PEAO logo image alt text remains in English in Arabic mode | Accessibility Defect |
| **Edge** | `TC-LOC-EDGE-01` | Password at exact minimum length boundary (6 characters with complexity) is accepted in Arabic | `REQ-LOGIN-08` |
| **Edge** | `TC-LOC-EDGE-02` | Password at exact maximum length boundary (12 characters with complexity) is accepted in Arabic | `REQ-LOGIN-08` |
| **Edge** | `TC-LOC-EDGE-03` | Rapid sequential language switching preserves form controls and prevents UI rendering glitches | UI Lifecycle |
| **Edge** | `TC-LOC-EDGE-04` | Orthographic spelling inconsistency between placeholder and error message hamza | Linguistic Defect |
| **Edge** | `TC-LOC-EDGE-05` | Two-column split-screen layout desktop viewport preserves container placement in RTL | Layout Defect |

---

## 1. Positive Test Cases

### `TC-LOC-POS-01`
* **Title**: Switching language to Arabic flips document layout to RTL and translates login interface
* **Requirement**: `REQ-LOGIN-11`, `REQ-LOGIN-20`
* **Preconditions**: Browser navigated to `/auth/login` in default English (LTR) mode, unauthenticated.
* **Steps**:
  1. Locate the language switcher dropdown in the header: `page.locator('app-language-switcher nz-select')`.
  2. Click the dropdown and select `page.getByTitle('العربية')`.
  3. Inspect the document root element: `page.locator('html')`.
  4. Verify header branding and card text elements.
* **Expected Result**:
  * Document root acquires attribute `dir="rtl"`.
  * Header PEAO logo moves to the top right; language switcher dropdown moves to the top left showing `"العربية"`.
  * Heading displays localized Arabic text: `page.getByRole('heading', { name: 'تسجيل الدخول', level: 1 })`.
  * Subtitle displays: `page.getByText('سجّل الدخول إلى حسابك للمتابعة')`.
  * UAE PASS button displays: `page.getByRole('button', { name: 'UAE PASS تسجيل الدخول باستخدام UAE PASS' })`.
  * Form labels display `"اسم المستخدم"` and `"كلمة المرور"`.
  * Placeholders display `"ادخل اسم المستخدم الخاص بك"` and `"ادخل كلمة المرور الخاصة بك"`.
  * Links display `"هل نسيت كلمة المرور؟"` and `"إنشاء حساب جديد"`.
  * Submit button displays `"تسجيل الدخول"`.

---

### `TC-LOC-POS-02`
* **Title**: Successful authentication in Arabic mode authenticates user and navigates to workspace
* **Requirement**: `REQ-LOGIN-06`, `REQ-LOGIN-11`
* **Preconditions**: User is on `/auth/login` in Arabic (`dir="rtl"`) mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'اسم المستخدم' })` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByRole('textbox', { name: 'كلمة المرور' })` with `'P0rtal#Cqnyp'`.
  3. Click `page.getByRole('button', { name: 'تسجيل الدخول', exact: true })`.
* **Expected Result**:
  * Form dispatches `POST /Identity/api/Identity/Login` returning `HTTP 200 OK`.
  * Browser redirects to `/workspace`.
  * Workspace dashboard elements render in Arabic RTL orientation.

---

### `TC-LOC-POS-03`
* **Title**: Password visibility toggle in Arabic mode mirrors to left edge and alternates input type
* **Requirement**: `REQ-LOGIN-02`, `REQ-LOGIN-03`
* **Preconditions**: User is on `/auth/login` in Arabic (`dir="rtl"`) mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'كلمة المرور' })` with `'P0rtal#Cqnyp'`.
  2. Verify initial input attribute: `type="password"`.
  3. Verify the toggle icon is positioned on the left side of the input field container.
  4. Click `page.getByRole('button', { name: 'Toggle password visibility' })`.
  5. Verify input attribute: `type="text"`.
  6. Click `page.getByRole('button', { name: 'Toggle password visibility' })` again.
* **Expected Result**:
  * Step 2: Password characters are concealed (`type="password"`).
  * Step 3: Directional layout mirrors toggle icon to the left edge in accordance with RTL text flow.
  * Step 5: Password is plain text (`type="text"`).
  * Step 6: Password returns to concealed (`type="password"`).

---

### `TC-LOC-POS-04`
* **Title**: Switching language from Arabic back to English restores LTR layout and English interface
* **Requirement**: `REQ-LOGIN-11`, `REQ-LOGIN-20`
* **Preconditions**: User is on `/auth/login` in Arabic (`dir="rtl"`) mode.
* **Steps**:
  1. Click the language switcher dropdown in the header (`page.locator('app-language-switcher nz-select')`).
  2. Click the English option: `page.getByTitle('English')`.
  3. Inspect document root and form card.
* **Expected Result**:
  * Document root reverts to `dir="ltr"`.
  * Header PEAO logo moves back to the top left; language switcher returns to the top right showing `"English"`.
  * Heading reverts to `"Sign in"`.
  * Form labels, placeholders, and action buttons revert cleanly to English strings without remnant Arabic text.

---

### `TC-LOC-POS-05`
* **Title**: Form input values are preserved across language switching transitions without data loss
* **Requirement**: `REQ-LOGIN-11`, `REQ-LOGIN-20`
* **Preconditions**: User is on `/auth/login` in English (LTR) mode.
* **Steps**:
  1. Enter `'apecouser@hotmail.com'` into `page.getByPlaceholder('Enter your username')`.
  2. Enter `'P0rtal#Cqnyp'` into `page.getByPlaceholder('Enter your password')`.
  3. Switch language to **العربية** via `page.getByTitle('العربية')`.
  4. Inspect values of `page.getByRole('textbox', { name: 'اسم المستخدم' })` and `page.getByRole('textbox', { name: 'كلمة المرور' })`.
  5. Switch language back to **English** via `page.getByTitle('English')`.
  6. Inspect values of `page.getByPlaceholder('Enter your username')` and `page.getByPlaceholder('Enter your password')`.
* **Expected Result**:
  * Steps 4 & 6: Entered username (`'apecouser@hotmail.com'`) and password (`'P0rtal#Cqnyp'`) remain completely preserved in the input controls across both transitions without clearing or truncation.

---

### `TC-LOC-POS-06`
* **Title**: Active validation error messages dynamically re-translate upon language toggle
* **Requirement**: `REQ-LOGIN-11`, `REQ-LOGIN-20`
* **Preconditions**: User is on `/auth/login` in English mode.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'Login' })` with empty inputs to trigger required errors.
  2. Verify English errors are displayed (`"please enter user name"` and `"please enter the password"`).
  3. Switch language to **العربية** via `page.getByTitle('العربية')`.
  4. Inspect the validation error messages.
  5. Switch language back to **English**.
* **Expected Result**:
  * Step 4: Validation errors dynamically re-render in Arabic: `"الرجاء إدخال اسم المستخدم"` and `"الرجاء إدخال كلمة المرور"`.
  * Step 5: Validation errors dynamically revert to English: `"please enter user name"` and `"please enter the password"`.

---

## 2. Negative Test Cases

### `TC-LOC-NEG-01`
* **Title**: Empty form submission in Arabic mode displays localized Arabic required validation errors
* **Requirement**: `REQ-LOGIN-04`, `REQ-LOGIN-05`
* **Preconditions**: User is on `/auth/login` in Arabic mode with both input fields empty.
* **Steps**:
  1. Click `page.getByRole('button', { name: 'تسجيل الدخول', exact: true })`.
* **Expected Result**:
  * Form submission is blocked client-side (0 HTTP requests sent to `/Identity/Login`).
  * Both input field containers acquire CSS class `.input-error` (red border).
  * Arabic required username error renders: `page.getByText('الرجاء إدخال اسم المستخدم')`.
  * Arabic required password error renders: `page.getByText('الرجاء إدخال كلمة المرور')`.
  * Browser remains on `/auth/login`.

---

### `TC-LOC-NEG-02`
* **Title**: Submission with non-email username in Arabic mode displays localized format error
* **Requirement**: `REQ-LOGIN-09`
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'اسم المستخدم' })` with `'apecouser'`.
  2. Click the password input to blur the username field.
* **Expected Result**:
  * Username input is flagged `ng-invalid` with red border.
  * Localized Arabic validation message renders: `page.getByText('الرجاء إدخال بريد إلكتروني صحيح')`.
  * Submitting the form is blocked.

---

### `TC-LOC-NEG-03`
* **Title**: Submission with non-compliant password in Arabic mode displays localized complexity error
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'اسم المستخدم' })` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByRole('textbox', { name: 'كلمة المرور' })` with `'simple'` (fails length and complexity rules).
  3. Blur the field.
* **Expected Result**:
  * Password field is flagged `ng-invalid` with red border.
  * Localized Arabic complexity error renders:  
    `page.getByText('الرجاء إدخال كلمة مرور من 6 إلى 12 خانة وتحتوي على أحرف، أرقام، رموز، وحروف كبيرة وصغيرة')`.
  * Submitting the form is blocked.

---

### `TC-LOC-NEG-04`
* **Title**: Authentication with invalid credentials in Arabic mode returns HTTP 406 and displays toast alert
* **Requirement**: `REQ-LOGIN-07`
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'اسم المستخدم' })` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByRole('textbox', { name: 'كلمة المرور' })` with `'Wrong#123'`.
  3. Click `page.getByRole('button', { name: 'تسجيل الدخول', exact: true })`.
* **Expected Result**:
  * Network request `POST /Identity/api/Identity/Login` returns `HTTP 406 Not Acceptable`.
  * User remains on `/auth/login`.
  * Toast alert renders at bottom center displaying the error message notification.

---

### `TC-LOC-NEG-05`
* **Title**: Password visibility toggle accessible name remains in English in Arabic mode
* **Requirement**: Accessibility Defect (`REQ-LOGIN-20`)
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Inspect the accessible name of the password toggle button: `page.getByRole('button', { name: 'Toggle password visibility' })`.
* **Expected Result**:
  * Expected by localization standards: Button accessible name (`aria-label`) should translate to Arabic (e.g., `"تبديل ظهور كلمة المرور"`).
  * Actual observed behavior: Accessible name remains in English: `"Toggle password visibility"`.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-20 / Accessibility]`  
  *Known defect: Screen readers announce password visibility toggle in English when the portal is set to Arabic.*

---

### `TC-LOC-NEG-06`
* **Title**: Header PEAO logo image alt text remains in English in Arabic mode
* **Requirement**: Accessibility Defect (`REQ-LOGIN-20`)
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Inspect the image alt text of the top header logo: `page.locator('app-header img')`.
* **Expected Result**:
  * Expected by localization standards: Image `alt` attribute should localize to Arabic (e.g., `"شعار مكتب الشؤون التعليمية الخاصة"`).
  * Actual observed behavior: Image `alt` text remains hardcoded in English: `"PEAO Logo"`.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-20 / Accessibility]`  
  *Known defect: Logo image alternative text does not update to match active Arabic locale.*

---

## 3. Edge Test Cases

### `TC-LOC-EDGE-01`
* **Title**: Password at exact minimum length boundary (6 characters with complexity) is accepted in Arabic
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'اسم المستخدم' })` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByRole('textbox', { name: 'كلمة المرور' })` with `'Aa1#bb'` (exactly 6 characters: min boundary).
  3. Blur the field.
* **Expected Result**:
  * Field is marked `ng-valid`.
  * Complexity validation error message (`page.getByText('الرجاء إدخال كلمة مرور...')`) is hidden.
  * Form is eligible for submission.

---

### `TC-LOC-EDGE-02`
* **Title**: Password at exact maximum length boundary (12 characters with complexity) is accepted in Arabic
* **Requirement**: `REQ-LOGIN-08`
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Fill `page.getByRole('textbox', { name: 'اسم المستخدم' })` with `'apecouser@hotmail.com'`.
  2. Fill `page.getByRole('textbox', { name: 'كلمة المرور' })` with `'Aa1#bbCc2$dd'` (exactly 12 characters: max boundary).
  3. Blur the field.
* **Expected Result**:
  * Field is marked `ng-valid`.
  * Complexity validation error message is hidden.
  * Form is eligible for submission.

---

### `TC-LOC-EDGE-03`
* **Title**: Rapid sequential language switching preserves form controls and prevents UI rendering glitches
* **Requirement**: UI Lifecycle
* **Preconditions**: User is on `/auth/login`.
* **Steps**:
  1. Click language dropdown and select **العربية**.
  2. Immediately click language dropdown and select **English**.
  3. Repeat toggle sequence 3 times in rapid succession.
  4. Inspect page state and Angular console errors.
* **Expected Result**:
  * No duplicate dropdown overlays or unremoved backdrop nodes exist in the DOM.
  * Input controls remain responsive and accept user typing.
  * Zero uncaught JavaScript errors in browser console.

---

### `TC-LOC-EDGE-04`
* **Title**: Orthographic spelling inconsistency between placeholder and error message hamza
* **Requirement**: Linguistic Defect (`REQ-LOGIN-20`)
* **Preconditions**: User is on `/auth/login` in Arabic mode.
* **Steps**:
  1. Inspect the placeholder attribute of `page.getByRole('textbox', { name: 'اسم المستخدم' })`.
  2. Click `"تسجيل الدخول"` to trigger the required validation message.
  3. Inspect the text content of `page.getByText('الرجاء إدخال اسم المستخدم')`.
* **Expected Result**:
  * Expected by linguistic standards: Consistent spelling of the verb root (with or without hamza).
  * Actual observed behavior: Placeholder uses `"ادخل"` without hamza (`"ادخل اسم المستخدم الخاص بك"`), while the error message uses `"إدخال"` with hamza (`"الرجاء إدخال اسم المستخدم"`).
* **Regression Flag**: `[Planned Regression - Bug: Orthography / REQ-LOGIN-20]`  
  *Known defect: Inconsistent Arabic orthography (همزة القطع vs همزة الوصل) across input placeholders and error messages.*

---

### `TC-LOC-EDGE-05`
* **Title**: Two-column split-screen layout desktop viewport preserves container placement in RTL
* **Requirement**: Layout Defect (`REQ-LOGIN-20`)
* **Preconditions**: User is on `/auth/login` on desktop viewport (1280x720) in Arabic (`dir="rtl"`) mode.
* **Steps**:
  1. Measure horizontal bounding box coordinates of the hero image container (`.left-container` / student photo).
  2. Measure horizontal bounding box coordinates of the login form container (`.right-container` / card).
* **Expected Result**:
  * Expected in complete RTL desktop mirroring: The two main grid columns swap positions (hero photo on right, form card on left) to follow the right-to-left reading pattern.
  * Actual observed behavior: Hero image remains fixed on the left (x ~ 0) and the login card remains on the right (x > 600); only internal card elements mirror.
* **Regression Flag**: `[Planned Regression - Bug: REQ-LOGIN-20 / Layout]`  
  *Known defect: Top-level split-screen desktop grid does not mirror column positions in RTL.*
