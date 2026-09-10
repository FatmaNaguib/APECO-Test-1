## Login Localization

### Flows
1. Navigate to the login URL: `https://apeco-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/auth/login`.
2. Locate the language switcher dropdown in the header and click it.
3. Select **العربية** (`Arabic`) from the dropdown options.
4. Verify the page layout updates to Right-to-Left orientation (`dir="rtl"`) and form elements render in Arabic.
5. In the **اسم المستخدم** field, enter your username or email address (`apecouser@hotmail.com`).
6. In the **كلمة المرور** field, enter your password (`P0rtal#Cqnyp`).
7. (Optional) Click the password visibility toggle button to verify masked/unmasked password states in RTL.
8. Click the **تسجيل الدخول** (`Login`) button.
9. Verify successful authentication and redirection to the `/workspace` dashboard.

---

### Selectors

| Element | Recommended Locator | Fallback / Notes |
| :--- | :--- | :--- |
| **Language Switcher Dropdown** | `page.locator('app-language-switcher nz-select')` | `page.getByText('English English')` or `page.getByText('العربية العربية')` |
| **Arabic Option** | `page.getByTitle('العربية')` | `page.locator('.ant-select-item-option[title="العربية"]')` |
| **English Option** | `page.getByTitle('English')` | `page.locator('.ant-select-item-option[title="English"]')` |
| **Login Heading (Arabic)** | `page.getByRole('heading', { name: 'تسجيل الدخول', level: 1 })` | `page.locator('h1')` |
| **Login Subtitle (Arabic)** | `page.getByText('سجّل الدخول إلى حسابك للمتابعة')` | `page.locator('p')` |
| **Sign in with UAE PASS (Arabic)** | `page.getByRole('button', { name: 'UAE PASS تسجيل الدخول باستخدام UAE PASS' })` | `page.locator('button.uae-pass-button')` |
| **Username Field (Arabic)** | `page.getByRole('textbox', { name: 'اسم المستخدم' })` | `page.getByPlaceholder('ادخل اسم المستخدم الخاص بك')` |
| **Password Field (Arabic)** | `page.getByRole('textbox', { name: 'كلمة المرور' })` | `page.getByPlaceholder('ادخل كلمة المرور الخاصة بك')` |
| **Password Visibility Toggle** | `page.getByRole('button', { name: 'Toggle password visibility' })` | `page.locator('button.password-toggle')` |
| **Forgot Password Link (Arabic)** | `page.getByRole('link', { name: 'هل نسيت كلمة المرور؟' })` | `page.locator('a[routerlink="/auth/forget-password"]')` |
| **Login Button (Arabic)** | `page.getByRole('button', { name: 'تسجيل الدخول', exact: true })` | `page.locator('button[type="submit"]')` |
| **Create Account Link (Arabic)** | `page.getByRole('link', { name: 'إنشاء حساب جديد' })` | `page.locator('a[routerlink="/auth/new-account"]')` |
| **Missing Username Error (Arabic)** | `page.getByText('الرجاء إدخال اسم المستخدم')` | `page.locator('.validation-message')` |
| **Missing Password Error (Arabic)** | `page.getByText('الرجاء إدخال كلمة المرور')` | `page.locator('.validation-message')` |
| **Invalid Email Error (Arabic)** | `page.getByText('الرجاء إدخال بريد إلكتروني صحيح')` | `page.locator('.validation-message')` |
| **Password Complexity Error (Arabic)** | `page.getByText('الرجاء إدخال كلمة مرور من 6 إلى 12 خانة وتحتوي على أحرف، أرقام، رموز، وحروف كبيرة وصغيرة')` | `page.locator('.validation-message')` |

---

### Surprises

| # | What I Did | Expected | Actual |
|---|---|---|---|
| **1** | Switched interface to Arabic and inspected password visibility toggle button accessibility attributes. | Button accessible name (`aria-label`) translates to Arabic (e.g., `"تبديل ظهور كلمة المرور"`). | Accessible name remains in English (`button "Toggle password visibility"`), meaning screen readers for Arabic users announce this action in English. |
| **2** | Switched interface to Arabic and inspected the PEAO header logo image. | Logo `alt` attribute updates to localized Arabic text (e.g., `alt="شعار مكتب الشؤون التعليمية الخاصة"`). | Logo `alt` text remains static English (`img "PEAO Logo"`). |
| **3** | Triggered empty field validation in both English and Arabic modes to compare error message standards. | Both locales follow consistent capitalization and tone. | English uses informal, uncapitalized lowercase strings (`"please enter user name"` / `"please enter the password"`), whereas Arabic uses formal polite phrasing starting with a noun (`"الرجاء إدخال اسم المستخدم"` / `"الرجاء إدخال كلمة المرور"`). |
| **4** | Compared the spelling of the verb "enter" across Arabic placeholders and validation messages. | Consistent orthography and spelling conventions across all Arabic input strings. | The placeholder uses `"ادخل"` without hamza (`ادخل اسم المستخدم الخاص بك`), whereas the validation message uses `"إدخال"` with hamza (`الرجاء إدخال اسم المستخدم`). |
| **5** | Observed the desktop two-column split-screen layout after switching to Right-to-Left (`dir="rtl"`). | Two-column desktop grid mirrors (student hero image moves to the right, login card moves to the left). | Hero image remains fixed on the left and login card remains on the right; mirroring only applies to internal card contents and header items. |
