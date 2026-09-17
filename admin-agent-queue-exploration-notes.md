# Agent Queue Exploration Notes

## Agent-Queue

### Flows

1. **Super Admin Authentication & Portal Entry**:
   1. Navigate to the Admin Portal URL: `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/`.
   2. The portal loads at `/login` in Arabic by default.
   3. Click the language switcher button **"English"** (`button:has-text("English")`) to toggle the interface to English LTR.
   4. Locate the **Email** field and enter valid super admin credentials: `admin.qc@hotmail.com`.
   5. Locate the **Password** field and enter the admin password: `Adm1n#tro3eh`.
   6. Click the **"Login"** button (`button:has-text("Login")`).
   7. The portal authenticates the user and automatically redirects directly to `/agent-queue`.

2. **Agent Queue Overview & Metric Inspection Flow**:
   1. On `/agent-queue`, observe the page header title displaying **"Agent Queue (2998)"**.
   2. Review the 4 high-level summary KPI metric cards:
      * **All Requests** (total count: `2998`)
      * **Assigned to Me** (count: `403`)
      * **Open** (count: `857`)
      * **Closed** (count: `2059`)
   3. Note that the metric cards are non-clickable display widgets; clicking them does not filter the grid.

3. **"Assigned to Me" Filter Flow**:
   1. In the filter bar above the table, locate the **"Assigned to Me"** filter control.
   2. Click the label `label[for="assignedToMe"]` to check the filter (the native input `<input type="checkbox">` is hidden).
   3. The page URL updates with query parameter `assignedToMe=true`.
   4. The table refreshes to display only requests assigned to the logged-in agent (`Admin QC`).
   5. Click `label[for="assignedToMe"]` again to uncheck and restore global view (`assignedToMe=false`).

4. **Advanced Filter & Request Search Flow**:
   1. Click the **"Filter"** button (`button.advanced-filter-btn`) in the toolbar.
   2. An off-canvas / drawer modal (`#agent-filter`) opens titled **"Advanced Filter"**.
   3. Locate the **"Request Number"** input field (`#agent-filter input`).
   4. Enter the target Request Number (e.g., `14680`).
   5. Click the primary **"Filter"** button (`#agent-filter button.btn-main`).
   6. The drawer closes and the URL updates with `requestNumber=14680&appliedFiltersCount=1`.
   7. The table updates to display the matching application record (`IDINAPSUFOPRSCPE14680`).
   8. To reset, reopen the **"Filter"** drawer and click **"Clear Filter"** (`#agent-filter button:has-text("Clear Filter")`).

5. **Data Export Flow**:
   1. Locate the **"Export"** button (`button.btn-info:has-text("Export")`) in the top right header.
   2. Click **"Export"**.
   3. The browser triggers a file download of the queue dataset as an Excel spreadsheet named `Agents.xlsx`.

6. **Request Details Inspection & Review Flow**:
   1. In the Agent Queue table, click the hyperlinked Request ID in the `#` column (e.g., `IDINAPSUFOPRSCPE14680` -> `a[href*="request-details/14680"]`).
   2. The browser navigates to `/requests/request-details/{id}`.
   3. Review the header information:
      * Back button (`button.new-back-btn`).
      * Applicant title (e.g., `Applicant: Anas Mohamed`).
   4. Review the workflow status timeline:
      * **Step 1**: `Pending` — `APECO Employee Review` (current active stage).
      * **Step 2**: `Upcoming` — `Technical Engineer Review`.
      * **Step 3**: `Upcoming` — `Accepted`.
   5. Review the 5 read-only application steps:
      * `1 Application Information` (personal details, DOB, contact address — inputs disabled).
      * `2 Owners Profiles`.
      * `3 School Information`.
      * `4 Attachments`.
      * `5 Summary`.
   6. Review the workflow action buttons at the top:
      * **"Approve"**: Opens approval dialog requiring mandatory `Comments *` before enabling `Save`.
      * **"Return"**: Opens return dialog requiring mandatory `Return reasons *` dropdown selection and optional `Comments`.
      * **"Reject"**: Opens rejection dialog requiring mandatory `Rejection reasons *` dropdown selection and optional `Comments`.
   7. Click **"Back"** (`button.new-back-btn`) to return to the Agent Queue.

7. **Table Pagination Flow**:
   1. Scroll to the bottom of the table to the pagination component (`ul.ngx-pagination`).
   2. Click on page number **"2"** (`.ngx-pagination a:has-text("2")`).
   3. The URL appends `pageIndex=2` and the table dynamically renders the next 30 records without a full page reload.

---

### Selectors

#### 1. Authentication & Language Selection
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Language Switch Button (English)** | `page.getByRole('button', { name: 'English' })` | `page.locator('button:has-text("English")')` |
| **Language Switch Button (Arabic)** | `page.getByRole('button', { name: 'عربي' })` | `page.locator('button:has-text("عربي")')` |
| **Email Field** | `page.getByPlaceholder('Type email address')` | `page.locator('input[placeholder*="email" i]')` |
| **Password Field** | `page.getByPlaceholder('Type password')` | `page.locator('input[type="password"]')` |
| **Login Button** | `page.getByRole('button', { name: 'Login' })` | `page.locator('button:has-text("Login")')` |
| **Login Error Banner / Toast** | `page.locator('.ant-message-error, .alert-danger, .toast-error')` | `page.locator('[role="alert"]')` |

#### 2. Agent Queue Dashboard & Filter Controls
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Queue Page Title** | `page.locator('.page-title, h1, h2, h3').filter({ hasText: 'Agent Queue' })` | `page.locator('text=Agent Queue')` |
| **Export Button** | `page.getByRole('button', { name: /Export/i })` | `page.locator('button.btn-info:has-text("Export")')` |
| **KPI Card: All Requests** | `page.getByRole('heading', { name: 'All Requests' }).locator('..')` | `page.locator('h3:has-text("All Requests")')` |
| **KPI Card: Assigned to Me** | `page.getByRole('heading', { name: 'Assigned to Me' }).locator('..')` | `page.locator('h3:has-text("Assigned to Me")')` |
| **KPI Card: Open** | `page.getByRole('heading', { name: 'Open' }).locator('..')` | `page.locator('h3:has-text("Open")')` |
| **KPI Card: Closed** | `page.getByRole('heading', { name: 'Closed' }).locator('..')` | `page.locator('h3:has-text("Closed")')` |
| **"Assigned to Me" Checkbox Label** | `page.locator('label[for="assignedToMe"]')` | `page.locator('label:has-text("Assigned to Me")')` |
| **Inline Search Field** | `page.getByRole('textbox', { name: 'Search' })` | `page.locator('input[placeholder="Search"]:not(aside *)')` |
| **Advanced Filter Drawer Button** | `page.locator('button.advanced-filter-btn')` | `page.getByRole('button', { name: /filter Filter|Filter/i })` |
| **Advanced Filter: Request Number** | `page.locator('#agent-filter').getByRole('textbox').first()` | `page.locator('#agent-filter input').first()` |
| **Advanced Filter: Apply Filter** | `page.locator('#agent-filter button.btn-main')` | `page.locator('#agent-filter').getByRole('button', { name: 'Filter', exact: true })` |
| **Advanced Filter: Clear Filter** | `page.locator('#agent-filter button:has-text("Clear Filter")')` | `page.locator('#agent-filter').getByRole('button', { name: 'Clear Filter' })` |
| **Advanced Filter: Close/Back** | `page.locator('#agent-filter button:has-text("Back")')` | `page.locator('#agent-filter').getByRole('button', { name: 'Back' })` |

#### 3. Agent Queue Table & Pagination
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Requests Table** | `page.getByRole('table')` | `page.locator('table.table')` |
| **Table Header Row** | `page.getByRole('table').locator('thead tr')` | `page.locator('table.table thead tr')` |
| **Request ID Link** | `page.getByRole('link', { name: /ID[A-Z0-9]+/i })` | `page.locator('table.table tbody tr a[href*="request-details"]')` |
| **Table Row by Request ID** | `page.getByRole('row').filter({ hasText: '14680' })` | `page.locator('table.table tbody tr:has-text("14680")')` |
| **Pagination Container** | `page.getByRole('navigation', { name: 'Pagination' })` | `page.locator('ul.ngx-pagination')` |
| **Pagination Page 2 Link** | `page.locator('.ngx-pagination a:has-text("2")')` | `page.locator('ul.ngx-pagination li a').filter({ hasText: '2' })` |
| **Pagination Next Button** | `page.locator('.ngx-pagination .pagination-next a')` | `page.getByRole('link', { name: /Next/i })` |

#### 4. Request Details & Workflow Modals
| Element | Recommended Locator | Fallback / Technical Selector |
| :--- | :--- | :--- |
| **Details Back Button** | `page.locator('button.new-back-btn')` | `page.getByRole('button', { name: ' Back' })` |
| **Applicant Title Header** | `page.getByRole('heading', { level: 1 })` | `page.locator('h1:has-text("Applicant:")')` |
| **Approve Action Button** | `page.getByRole('button', { name: 'Approve', exact: true })` | `page.locator('button:has-text("Approve")')` |
| **Return Action Button** | `page.getByRole('button', { name: 'Return', exact: true })` | `page.locator('button:has-text("Return")')` |
| **Reject Action Button** | `page.getByRole('button', { name: 'Reject', exact: true })` | `page.locator('button:has-text("Reject")')` |
| **Workflow Modal Container** | `page.locator('div.modal.show')` | `page.locator('[id*="workflow-action-model"].show')` |
| **Approve Modal: Comments Field** | `page.locator('div.modal.show').getByPlaceholder('Type description')` | `page.locator('div.modal.show textarea')` |
| **Modal: Save Submission Button** | `page.locator('div.modal.show button:has-text("Save")')` | `page.locator('div.modal.show button.btn-main')` |
| **Modal: Back/Dismiss Button** | `page.locator('div.modal.show button:has-text("Back")')` | `page.locator('div.modal.show button.btn-dark')` |
| **Return Modal: Reason Select** | `page.locator('div.modal.show select, div.modal.show nz-select').first()` | `page.locator('div.modal.show [placeholder*="reason" i]')` |
| **Reject Modal: Reason Select** | `page.locator('div.modal.show select, div.modal.show nz-select').first()` | `page.locator('div.modal.show [placeholder*="reason" i]')` |

---

### Surprises

1. **Default Arabic Locale on Admin Login**:
   * **What I Did**: Navigated directly to the base admin portal URL `https://apeco-admin-portal-qc.graycliff-e2cfdb11.eastus.azurecontainerapps.io/`.
   * **What I Expected**: Admin portal to either respect browser `Accept-Language` headers or load in English by default.
   * **What Actually Happened**: The portal loaded in Arabic (`RTL`) with Arabic placeholders (`اكتب البريد الإلكتروني`). Tests must explicitly interact with `button:has-text("English")` if executing in English locale.

2. **Passive Metric Cards (Non-Clickable KPI Widgets)**:
   * **What I Did**: Clicked the dashboard metric card **"Assigned to Me"** (`heading "Assigned to Me"` showing `403` items) to filter the queue.
   * **What I Expected**: Clicking the metric card would filter the grid to show only the 403 assigned requests.
   * **What Actually Happened**: Nothing happened to the table. The cards are purely informational KPI counters and do not function as interactive filter tabs.

3. **Hidden Checkbox Input for "Assigned to Me"**:
   * **What I Did**: Attempted to click `page.locator('input[type="checkbox"]#assignedToMe')` or use `page.getByRole('checkbox', { name: 'Assigned to Me' })`.
   * **What I Expected**: Playwright would check the checkbox element.
   * **What Actually Happened**: Playwright timed out with `element is not visible` because the `<input>` element has `display: none` and is replaced with a custom CSS graphic. Interaction must be performed via `page.locator('label[for="assignedToMe"]')`.

4. **Inline Search Input Does Not Filter on Enter**:
   * **What I Did**: Typed the Request Number `14680` into the inline `Search` field and pressed `Enter`.
   * **What I Expected**: The grid would trigger an API search call and filter rows matching `14680`.
   * **What Actually Happened**: The query string remained unchanged and the grid was not filtered. Finding a specific request number required opening the **"Filter"** drawer (`button.advanced-filter-btn`), populating the dedicated `Request Number` input, and clicking `Filter`.

5. **School Name Column Displays Placeholder Dashes (`--`)**:
   * **What I Did**: Filtered the queue to find the recently submitted request `IDINAPSUFOPRSCPE14680` (Initial application - Submission for a Private School Permit).
   * **What I Expected**: The `School Name` column in the table would display the school name entered during application (`Modern Future School ...`).
   * **What Actually Happened**: The `School Name` column displayed `--` for this permit application (presumably because the school is newly proposed and not yet registered as an active school entity in the master database).

6. **Strict Mode Violations on Common Action Selectors**:
   * **What I Did**: Attempted to use generic locators like `page.locator('button:has-text("Back")')` and `page.locator('button:has-text("Filter")')`.
   * **What I Expected**: Single matching button on the visible page.
   * **What Actually Happened**: Strict mode errors threw because the DOM contains hidden off-canvas drawer buttons (`#agent-filter`, `#confirm-action`, `#workflow-popup`) simultaneously matching the text. Selectors must be strictly scoped (e.g. `button.new-back-btn`, `#agent-filter button.btn-main`).

7. **Consolidated Wizard Review Steps (5 Steps vs 6 Steps)**:
   * **What I Did**: Inspected the application review stepper in the Admin Request Details view.
   * **What I Expected**: The same 6 steps that the applicant filled out during submission (including Step 4 "Download Documents").
   * **What Actually Happened**: The Admin view consolidates the wizard into 5 review steps (`Application Information`, `Owners Profiles`, `School Information`, `Attachments`, `Summary`), omitting the applicant-specific "Download Documents" step.
