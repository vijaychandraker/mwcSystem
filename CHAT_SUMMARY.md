# INVO IT & MWC System - Complete Chat History, Requirements & Implementation Record

**Session Dates:** September 4–5, 2026 | October 5–6, 2026  
**Project:** INVO IT (Mineral & Water Clean Technology / IT Hardware Serial Registry & Warranty Verification Portal)  
**Database:** MariaDB (`invo_it` on port 3306)  
**Backend:** Node.js Express (`server/server.js`, `server/api.js` on port 3000)  
**Frontend:** Angular 19 Standalone (`http://localhost:4200`)  

---

## 1. Chronological User Requests & Implementations

### Request 1: Project Architecture & Structure Inspection
- **User Prompt:** *read project structure / keval read karo / isko bhi read karo*
- **Action Taken:**
  - Analyzed complete project structure, Angular modules, Node server, and MariaDB SQL schema.
  - Inspected real user Excel sheets (`computer details.xlsx`, `IN-VO IT INDUSTRY PVT LTD.xlsx`) containing real data for 5 product categories (Computer, Monitor, TV, Interactive Panel, LED Bulb) and Bilaspur distributors/departments.

---

### Request 2: Multi-Category Product Entry & Distributor Sale Flow
- **User Prompt:** *ab ye sabhi Entry Admin Karega sabhi product ka individual warranty k sath aur distributor ko dega sale k lia ya fir khud hi direct sale kr sakta hai. Distributor product sale karega aur Invoice ID aur invoice date enter karega.*
- **Features Implemented:**
  1. **Admin Product Entry (`/admin`)**:
     - 5 Product Categories: Computer, Monitor, TV, Interactive Flat Panel, LED Bulb.
     - Dual-action paths:
       - **ALLOCATE**: Product assigned to distributor in pending sale status.
       - **DIRECT SALE**: Admin sells directly to end user / department.
  2. **Distributor Portal (`/distributor`)**:
     - Stock registration & serial view.
     - Sell unit modal requiring Customer Invoice ID and Sale Date.

---

### Request 3: Customer Modal & Form Fix
- **User Prompt:** *Add Customer krne pr koi form open nai ho rha a*
- **Fix:**
  - Added `showCustomerModal` and `newCustomer` model in `admin.component.ts`.
  - Added `addCustomer()` method syncing to `/api/customers`.
  - Added modal view in `admin.component.html` with fields for Name, Department, District, Contact Person, Mobile, Email, and Address.

---

### Request 4: Individual Component Warranty for Computers
- **User Prompt:** *computer k sabhi part ka indivisual warrenty add krega admin*
- **Features Implemented:**
  1. **Admin Modal Step 3 Component Specifications**:
     - Dedicated component cards for all 9 computer parts: Motherboard, Processor (CPU), RAM, SSD, Cabinet, Monitor, Keyboard, Mouse, Graphic Card (GPU).
     - Individual warranty dropdowns (12, 24, 36, 60 Months).
     - Batch Action Toolbar (`Set All 12 Mo`, `Set All 24 Mo`, `Set All 36 Mo`, `Set All 60 Mo`).
  2. **Inventory Tables & Warranty Badges**:
     - Badges displayed for each part (e.g. `CPU: 36M`, `MB: 36M`, `RAM: 36M`, etc.).
  3. **Public Warranty Check (`/warranty-check`)**:
     - Displays comprehensive breakdown table for individual components with expiry dates calculated from sale date.

---

### Request 5: Batch Warranty Button Highlight State Fix
- **User Prompt:** *set all 12 month click krne pr set all 36 month hi select dikh raha*
- **Fix:**
  - Added `selectedBatchWarranty: number = 36;` in `admin.component.ts`.
  - Replaced hardcoded CSS class with dynamic Angular binding `[class.btn-batch-active]="selectedBatchWarranty === m"`.

---

### Request 6: Single Unified Login with Role-Based Redirection
- **User Prompt:** *login window ek hi rahega sabhi k lia bus role base login hoga*
- **Features Implemented:**
  1. Converted `/login` into a clean, unified authentication window for all roles.
  2. Single login form accepts:
     - Admin Username / Email (`admin`)
     - Staff Sub-User ID / Email (`rahul_user`, `priya_user`)
     - Distributor Mobile Number / Email (`9827112233`, `sales@invoit-cg.com`)
  3. Automatic role detection and redirection:
     - Super Admin -> `/admin` (Super Admin mode)
     - Staff Sub-User -> `/admin` (Staff mode)
     - Distributor -> `/distributor` (Scoped to their distributor account)

---

### Request 7: Dedicated Self-Login for Each Distributor
- **User Prompt:** *har distributor ka apna self login hoga*
- **Features Implemented:**
  1. Each distributor in `mst_party` has their own credentials (`mobile` as primary login ID and `password`).
  2. When a distributor logs in:
     - The portal displays their business identity (e.g. *In-vo it industry pvt. Ltd.*).
     - Distributor switcher is automatically locked to their own account.
     - They can only view and manage products allocated to them.
     - Logout modal cleanly terminates their distributor session.

---

### Request 8: Admin Management of Sub-Users & Distributor Credentials
- **User Prompt:** *Admin Distributor k lia aur apne sub user k lia login ID ban sakta hai*
- **Features Implemented:**
  1. Added **"Users & Logins"** tab in Admin Portal (`/admin`).
  2. **Staff Sub-Users Management**:
     - Create, edit, toggle status, and delete sub-users.
     - Stores in MariaDB table `admin_users`.
  3. **Distributor Credentials Management**:
     - Direct credential manager modal for all distributors in `mst_party`.
     - Set password, update mobile/email, and toggle access status.

---

### Request 9: Strict Two-Role Limitation (Sub-User & Distributor)
- **User Prompt:** *only two role add subuser and Distributor*
- **Features Implemented:**
  - Removed older test roles (Sales Operator, Inventory Manager, Sub-Admin, Service Executive).
  - System restricted to exactly two roles:
    1. **SUB_USER**: Admin staff / operator.
    2. **DISTRIBUTOR**: Authorized dealer portal user.

---

### Request 10: Strict UserID & Email Uniqueness Enforced
- **User Prompt:** *make sure sabhi UserID or Email Unique ho*
- **Features Implemented:**
  - Backend validation in `/api/admin/sub-users` and `/api/admin/parties/:id/credentials`:
    - Checks `admin_users` and `mst_party` before insertion/update.
    - Rejects duplicate UserIDs or duplicate Email addresses with HTTP 400.
  - Frontend checks notify user immediately if a duplicate is attempted.

---

### Request 11: Zero Invoice Generation from Portal
- **User Prompt:** *koi bhi invoice generate nai ho apne portal se*
- **Features Implemented:**
  - Removed all invoice generation actions and invoice print modals.
  - Clarified UI that this portal does NOT generate invoices.
  - Renamed "Tax Invoice" references to "External Customer Invoice Reference".

---

### Request 12: Zero Inventory Quantity Management
- **User Prompt:** *hum kisi bhi prakar ki nventory bhi managen nai kr rahe*
- **Features Implemented:**
  - Removed warehouse quantity tracking, stock balances, and stock-adjustment flows.
  - Redefined system as a pure **Serial Number Registry & Warranty Verification Portal**.
  - All tabs, cards, and buttons reflect "Product Serials & Warranties".

---

### Request 13: 100% MariaDB Dynamic Data (Zero Hardcoded Data)
- **User Prompt:** *koi khi data hard coded nai hona cahia sub database se aana chaiya aur save hona cahia*
- **Features Implemented:**
  1. **Database Persistence Migration**:
     - Added `password` column to `mst_party` (`VARCHAR(255) DEFAULT 'dist123'`).
     - Created `admin_users` table in MariaDB `invo_it`.
     - Synced all distributors and sub-users into database.
  2. **Clean Frontend State**:
     - Emptied hardcoded mock arrays in `admin.component.ts` (`parties`, `categories`, `models`, `subUsers`, `customers`, `inventory`).
     - Emptied hardcoded `distributors` array in `distributor.component.ts`.
     - All lists load dynamically on `ngOnInit()` via REST APIs from MariaDB.
  3. **Node Server & API (`server/api.js`)**:
     - All read and write routes directly execute SQL against MariaDB:
       - `/api/auth/login` -> Authenticates directly from `admin_users` and `mst_party`.
       - `/api/admin/sub-users` -> CRUD directly in `admin_users`.
       - `/api/admin/parties/:id/credentials` -> Updates `mst_party`.
       - `/api/dashboard` -> SQL aggregate queries.
       - `/api/inventory` -> Inserts and selects from `trn_inventory_unit`.

---

### Request 14: Warranty Starts ONLY on Sale with Invoice Number & Sale Date
- **User Prompt:** *kisi bhi product ka warrenty tabhi start hoga jab usko sale kr invoice number aur sale date enter hoga, Sale date se warenty calculate hoga*
- **Features Implemented:**
  1. **Status Prior to Sale**:
     - When products are registered or allocated to dealers, their status is **`Pending Sale`**.
     - Warranty has **NOT** started yet.
     - In `/warranty-check`, an amber card displays:
       *"WARRANTY NOT STARTED YET - Product is genuine & registered. Warranty will calculate & start from customer Sale Date once invoiced."*
  2. **Mandatory Sale Fields**:
     - `Customer Invoice Number` is mandatory (cannot be empty or N/A).
     - `Customer Sale Date` is mandatory.
  3. **Dynamic Warranty Calculation**:
     - `warranty_start` = `sale.invoice_date`.
     - `warranty_end` = `sale.invoice_date + warranty_months`.
     - All component warranties (CPU, MB, RAM, SSD, Cabinet, Monitor, Mouse, Keyboard, GPU) calculate their end dates directly from this `invoice_date`.

---

### Request 15: Invoice Number & Sale Date are Permanent / Immutable (Cannot be Edited)
- **User Prompt:** *once we enter Invoice date and invoic number it cant be edit*
- **Features Implemented:**
  1. **Frontend Immutability in Distributor Portal (`/distributor`)**:
     - Sold units in the table display a **🔒 Lock Icon** next to the invoice number.
     - When clicking **"Details"** on a sold product:
       - Modal title displays: `Sold Product Details (Locked)`.
       - Notice banner: *"Permanent Record: Once entered, Invoice Number and Sale Date cannot be edited. This ensures warranty verification and certificate integrity."*
       - All inputs (`invoice_no`, `invoice_date`, `customer_name`, `zila`) are strictly disabled with lock badges (`🔒 Locked`).
### Request 12: Pagination Across All Tables
- **User Prompt:** *add pagging in all record which are loaded*
- **Features Implemented:**
  1. **Admin Portal (`/admin`)**:
     - Added dynamic pagination bar controls across all 6 data tables:
       - Serials & Warranties (`filteredInventory`): Page size options (5, 10, 25, 50).
       - Master Parties & Distributors (`parties`).
       - Product Models Directory (`models`).
       - Tax Invoices & Sales (`invoices`).
       - Master Customer Directory (`customers`).
       - Staff & Operator Sub-Users (`subUsers`).
     - Added page number navigation with active pill styling and `first_page`, `prev`, `next`, `last_page` controls.
  2. **Distributor Portal (`/distributor`)**:
     - Added pagination for the Dealer Registered Units table (`pagedRegisteredList`).

---

### Request 13: OEM Direct Sale & Invoice/Date Entry Flow
- **User Prompt:** *OEM khud sale karega to fir Invoice number and invoice date kaise enter karega / isme Action columan hata do*
- **Features Implemented:**
  1. **Flow (During Product Entry)**:
     - In Admin Portal, click **`+ Register Product & Serial`** (`showProductEntryModal`).
     - In **Step 4 (Product Destination & Warranty Activation)**, select **`Direct Sale to End Customer`**.
     - Form opens fields for:
       - Customer / Department Name (Mandatory)
       - District (Zila) (Mandatory)
       - Customer Tax Invoice Number (Mandatory)
       - Customer Sale Date (Mandatory, warranty starts from this date).
     - Saving registers the unit as `Active Warranty` directly in MariaDB.
  2. **Table Display**:
     - Serials & Warranties table strictly shows clean read-only columns: `Category & Model`, `Serial Number`, `Specifications / Components`, `Warranty Term`, `Warranty Status`, `Assigned Dealer / Partner`, and `Customer & Ref Details` (with locked invoice code and sale date for sold units).
     - Action column removed as per user instruction.

---

### Request 14: Warranty Status Badge Design Fix
- **User Prompt:** *iska design thik kro (with screenshot showing wrapped/split status text)*
- **Fix:**
  - In `admin.component.css` and global `styles.css`, fixed `.badge` with `display: inline-flex !important`, `white-space: nowrap !important`, `gap: 0.35rem`, `border-radius: 9999px`, and `.status-cell` with `min-width: 140px`.
  - Badges for `Active Warranty` and `Pending Sale` now render smoothly on a single line with icons, rounded borders, and correct padding without text wrapping or splitting.

---

### Request 15: Distributor Portal UI Cleanups
- **User Prompt:** *Register Customer Warrenty button hata do / [Dealer Information & Policy] bhi hata do*
- **Fix:**
  - Removed the `+ Register Customer Warranty` button from the top header of the Distributor Portal.
  - Removed the `Dealer Information & Policy` tab button and its section from `distributor.component.html` and `distributor.component.ts`.
  - The Distributor Portal now displays a focused and clean `Registered Products & Warranties` registry table where sales are activated directly per unit row.

---

### Request 16: Registered Office Address Update
- **User Prompt:** *BLOCK-A, Umiya Market, Near Madhav Timber, Bhanpuri, Raipur, C.G.- 492003 update Registried Office /contact*
- **Fix:**
  - Updated the registered office corporate address across `contact.component.html`, footer, and company info templates to:
    `BLOCK-A, Umiya Market, Near Madhav Timber, Bhanpuri, Raipur, C.G.- 492003`.

---

### Request 17: Official Project Branding Finalization
- **User Prompt:** *INVO IT rakho project ka name*
- **Action Taken:**
  - Finalized official branding across application metadata, titles, navbar headers, and documentation:
    **INVO IT - SMART TECHNOLOGY. RELIABLE INNOVATION.**

---

### Request 18: Homepage Modernization & Dynamic Carousel
- **User Prompt:** *home page me update karo top me project se related Carousal chalo, aur mix - mix add karo sabhi menu ka / carousal change karo product se releted full image generate kr carousel me add karo*
- **Features Implemented:**
  - Built an animated high-impact hero carousel showcasing real product hardware categories: Computer, Monitor, TV, Interactive Flat Panel, and LED Bulbs.
  - Integrated high-resolution product showcase media (`public/images/products/`).
  - Added multi-category mix highlights and feature overview sections.

---

### Request 19: Light Theme & Glassmorphism Design
- **User Prompt:** *home page ka the dark nai Light karo / transprant bano like glassmorphism / Engineered for Performance & Scale selected only three dikhao*
- **Features Implemented:**
  - Shifted primary theme to clean, luminous modern light mode with crystal glassmorphism (`backdrop-filter: blur(24px)`).
  - Streamlined "Engineered for Performance & Scale" highlights to exactly 3 sleek feature cards.

---

### Request 20: Products Catalog Polish
- **User Prompt:** */products me sabhi ka sub heading "Intel Core i5-14400 (14th Gen) • 16GB DDR4 • 512GB NVMe SSD • 24\" IPS Display" hata do / Warrenty button hata do / aignment thik karo*
- **Features Implemented:**
  - Removed hardcoded repetitive subheadings and redundant warranty buttons from product cards.
  - Aligned all product card grids with responsive badges, specifications, and modern card typography.

---

### Request 21: Header Interactive Login Menu (Desktop & Mobile)
- **User Prompt:** *show login menu in header*
- **Features Implemented:**
  1. **Guest State (Unauthenticated)**:
     - Prominent **Login ▾** button with animated dropdown.
     - Direct links to **Admin Portal** (`/login?role=admin`) and **Distributor Portal** (`/login?role=distributor`).
  2. **Authenticated State**:
     - **Admin**: Displays Administrator badge, username, quick link to **Admin Dashboard** (`/admin`), and 1-click **Logout**.
     - **Distributor**: Displays Distributor badge, dealer name, quick link to **Distributor Portal** (`/distributor`), and 1-click **Logout**.
  3. **Event & State Management**:
     - Added `@HostListener('document:click')` for automatic outside-click closing.
  4. **Mobile Navigation Drawer**:
     - Added dedicated mobile authentication card with 1-tap quick action buttons.

---

### Request 22: Live Server 24/7 Node API Keep-Alive via cPanel Cron Job
- **User Prompt:** *live server me node configer krne pr sub thik chal raha tha, but jaise hi C panel close krne pr live server invo.co.in ka API work nai kr raha hai / तरीका 2 update kr diya hai ab test kro*
- **Diagnosis & Fix:**
  - On cPanel Shared Hosting (CloudLinux OS), web terminal sessions kill background processes upon browser tab close due to the LVE Process Reaper.
  - Identified absolute Node path on server: `/usr/local/bin/node`.
  - Configured 24/7 cPanel Cron Job running every minute (`* * * * *`):
    ```bash
    curl -s http://127.0.0.1:3000/health > /dev/null || (cd /home/rggroupindia/public_html/invo.co.in && /usr/local/bin/node server.js > server.log 2>&1 &)
    ```
  - Verified live endpoints responding with 200 OK:
    - `http://invo.co.in/api/products` (10 active products loaded)
    - `http://invo.co.in/api/categories` (all 5 categories loaded)
  - Live server runs 24/7 permanently independent of terminal and cPanel sessions.

---

### Request 23: Admin Dashboard Left Sidebar Navigation Modernization
- **User Prompt:** */admin dashboard UI update karo / menu left sideview me rakho jaise normal portal me rahata hai*
- **Features Implemented:**
  1. **Executive Left Sidebar Navigation**:
     - Modern fixed vertical sidebar (`.admin-sidebar`) on the left, positioned cleanly under the main header.
     - Brand identity: `INVO IT ADMIN` badge with shield icon.
     - Quick Action Button: `+ Register Product` button embedded prominently in the sidebar.
     - Navigation items with icons and live pill counter badges:
       - **Overview** (`dashboard`)
       - **Serials & Warranties** (`devices`) + `inventory.length`
       - **Parties & Dealers** (`storefront`) + `parties.length`
       - **Product Models** (`inventory_2`) + `models.length`
       - **Sales & Dispatches** (`fact_check`) + `invoices.length`
       - **End Users & Clients** (`people`) + `customers.length`
       - **Sub-Users & Logins** (`manage_accounts`) + `subUsers.length`
     - Database status widget with pulsing MariaDB Live indicator & quick sync button.
     - Bottom user footer showing active Admin session profile and direct logout trigger.
  2. **Right Viewport & Topbar Workspace**:
     - Sticky topbar (`.admin-topbar`) featuring breadcrumbs (`Admin / [Active Tab]`), global search bar, quick sync button, and user logout button.
     - Full responsive mobile support with hamburger menu drawer toggle and backdrop blur overlay.
  3. **Build & Type Safety**:
     - Restored all form model definitions (`newProductEntry`, `newParty`, `newModel`, `newTransfer`, `newCustomer`).
     - Added `ngOnInit` implementation, fixed `Invoice` & `InventoryUnit` interface mappings.
     - Production build verified with `exit code 0`.

---

### Request 24: Footer Streamlining & Minimal Portal Footer
- **User Prompt:** *footer ko chota rakho*
- **Features Implemented:**
  1. **Dynamic Portal Footer**: On `/admin` and `/distributor` routes, replaced the massive 4-column marketing footer with an ultra-compact single-line portal footer:
     `© 2026 INVO IT Industries Pvt. Ltd. • Enterprise Console | Serial Registry & Warranty Portal v2.4`.
  2. **Aligned with Sidebar**: Configured `margin-left: 275px` so the portal footer does not overlap or clash with the left sidebar.
  3. **Streamlined Public Footer**: Cut public site footer top padding in half (`5rem` -> `2.5rem`), minimized description length, and tightened gaps.

---

### Request 25: Removal of Redundant Topbar and Overview Callout Banner
- **User Prompt:** *inko hato* (Attached screenshots of topbar and dark register serials callout banner)
- **Features Implemented:**
  1. **Removed Topbar**: Deleted `<header class="admin-topbar">` containing duplicate breadcrumbs, search bar, `+ Register Product`, sync, and logout (all already accessible in the persistent left sidebar).
  2. **Mobile Compatibility**: Retained a clean, lightweight mobile drawer hamburger menu (`.mobile-only-header`) visible only on devices with width <= 1024px.
  3. **Removed Dark Banner**: Removed `<div class="action-banner-card">` ("Register Product Serial with Component Specifications & Warranty") from the Overview tab, allowing the KPI cards and recent tables to flow seamlessly.
  4. Verified `ng build` passes with `exit code 0`.

---

### Request 26: Toll-Free Helpline Number Update to 0000-000-0000
- **User Prompt:** *is toll free ki jaga 0000-000-0000 update karo*
- **Features Implemented:**
  - Updated toll-free phone number across all UI components and templates to `0000-000-0000` (with `tel:0000-000-0000` links):
    1. Desktop & Mobile Header ([header.component.html](file:///f:/mwcSystems/src/app/components/header/header.component.html))
    2. Footer contact section ([footer.component.html](file:///f:/mwcSystems/src/app/components/footer/footer.component.html))
    3. Home page support block ([home.component.html](file:///f:/mwcSystems/src/app/pages/home/home.component.html))
    4. Service portal quick support CTA ([service.component.html](file:///f:/mwcSystems/src/app/pages/service/service.component.html))
    5. Contact us info directory ([contact.component.ts](file:///f:/mwcSystems/src/app/pages/contact/contact.component.ts))

---

### Request 27: Product Category-Wise Warranty Search Update
- **User Prompt:** *Product Category wise search update karo* (with screenshot of /warranty-check search card)
- **Features Implemented:**
  1. **Visual Category Filter Pills Bar**:
     - Added quick category selector pills for all 5 product categories + All Categories:
       `All Categories`, `Computer`, `Monitor`, `TV`, `Interactive Panel`, `LED Bulb`.
     - Integrated category selector dropdown into the primary search row.
  2. **Dynamic Context-Aware Inputs & Helpers**:
     - Input placeholder dynamically updates based on selected category (e.g. `Enter Computer Serial No...`, `Enter Smart TV Serial No...`).
     - Note banner dynamically displays the exact physical location hint where the serial number is printed for that product category.
     - Sample Serial badge dynamically presents a genuine serial from the selected category with a **1-click "Quick Test"** button to auto-fill and run.
  3. **Backend Category Verification & Friendly Mismatch Resolver**:
     - Updated backend `/api/warranty/:serialNumber` to accept `?category=` filter query.
     - When searching within a specific category, if a serial exists under a different category, returns a structured mismatch response.
     - Frontend presents an amber **Category Mismatch Card** with a 1-click **"Switch to [Actual Category] & View Warranty"** action.
  4. **Updated Files**:
     - [warranty-check.component.html](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.html)
     - [warranty-check.component.ts](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.ts)
     - [warranty-check.component.css](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.css)
     - [server/api.js](file:///f:/mwcSystems/server/api.js)

---

### Request 28: Removal of Top Category Filter Pills Bar on Warranty Check
- **User Prompt:** *ye hata do* (with screenshot of the top horizontal Product Category pills bar)
- **Features Implemented:**
  - Removed the top horizontal category pills bar (`.category-filter-pills-bar`) from [warranty-check.component.html](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.html).
  - Kept the sleek, compact **Category Selector Dropdown** directly integrated inside the main search row (`.category-select-box`).
  - Cleaned up obsolete CSS rules from [warranty-check.component.css](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.css).

---

### Request 29: Auto-Scroll Viewport to Warranty Card Upon Search
- **User Prompt:** *jaise hi warenty check buton per click kare window warrenty card pr set ho jae jise reference 2 image*
- **Features Implemented:**
  - Added `id="warranty-result-container"` to the warranty result card wrapper in [warranty-check.component.html](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.html).
  - Added `scroll-margin-top: 85px` in [warranty-check.component.css](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.css) so the card perfectly fits below the sticky navbar without being obscured.
  - Implemented `scrollToWarrantyResult()` in [warranty-check.component.ts](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.ts) triggered automatically when "Check Warranty", "Quick Test", or category switch completes.
  - Updated `resetSearch()` to smoothly scroll back to top when starting a new search.

---

### Request 30: Removal of Sample SN Card & Quick Test Button
- **User Prompt:** *ye hata do* (with screenshot of the Sample SN & Quick Test button card inside Note banner)
- **Features Implemented:**
  - Removed `<div class="barcode-badge">` containing the sample serial text and `Quick Test` button from [warranty-check.component.html](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.html).
  - Kept the clean serial location note text inside the note banner.
  - Cleaned up obsolete CSS rules from [warranty-check.component.css](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.css).

---

### Request 31: Hide Sales & Distribution and Executive Contact Cards on /contact
- **User Prompt:** */contact in dono ko hide kr do* (with screenshot of Sales & Distribution and Executive Contact cards)
- **Features Implemented:**
  - Removed `Sales & Distribution` (`sales@invo.co.in`) and `Executive Contact` (`rajagrawal@invo.co.in`) from `emailContacts` array in [contact.component.ts](file:///f:/mwcSystems/src/app/pages/contact/contact.component.ts).
  - The `/contact` page now cleanly displays only Customer Support (`support@invo.co.in`) and General Information (`info@invo.co.in`) along with the corporate office and helpline.

---

### Request 32: Update Working Hours to Mon - Sat: 10:00 AM - 6:00 PM
- **User Prompt:** *10:00 se 6 :00 update karo* (with screenshot of Working Hours card)
- **Features Implemented:**
  - Updated working hours from `9:00 AM - 6:00 PM` to `Mon - Sat: 10:00 AM - 6:00 PM` across:
    1. Contact Page generalInfo card ([contact.component.ts](file:///f:/mwcSystems/src/app/pages/contact/contact.component.ts))
    2. Home Page customer helpline support box ([home.component.html](file:///f:/mwcSystems/src/app/pages/home/home.component.html))

---

### Request 33: Production Build Generation
- **User Prompt:** *buid the project*
- **Features Implemented:**
  - Successfully executed `npm run build` (`ng build`) compiling production bundles into `dist/mwc-portal/browser/`.
  - Result: Exit code `0`, bundle size: `739.46 kB` (Estimated transfer: `150.97 kB`).
  - Production assets, `.htaccess`, scripts, fonts, and images verified ready for hosting/deployment.

---

### Request 34: Removal of Top Warranty Badges on Product Cards
- **User Prompt:** *Warranty tab hata do sabhi ka* (with screenshot of green `[✔ ... Mo Warranty]` badges on product cards)
- **Features Implemented:**
  - Removed `.warranty-badge` (`<span class="warranty-badge"><span class="material-icons-outlined">verified</span> {{ product.warranty_month }} Mo Warranty</span>`) from all product cards in [products.component.html](file:///f:/mwcSystems/src/app/pages/products/products.component.html).
  - Product cards now cleanly showcase the category feature tag (`.product-badge`) on the top bar.

---

### Request 35: Production Build Compilation
- **User Prompt:** *build it*
- **Features Implemented:**
  - Ran `npm run build` (`ng build`) producing fresh production bundle `main-YOXOOEDH.js` in `dist/mwc-portal/browser/`.
  - Result: Exit code `0`, bundle size: `739.33 kB` (Estimated transfer size: `150.90 kB`).
  - Production assets ready for live deployment.

---

### Request 36: Removal of Warranty from Technical Specifications Modal ("View Full Specs")
- **User Prompt:** *Full view Spece se bhai warenty hata do* (with screenshot of modal showing `Standard Warranty: 24 Months Complete`)
- **Features Implemented:**
  - In [products.component.html](file:///f:/mwcSystems/src/app/pages/products/products.component.html): Removed the `Standard Warranty` display item from the `.quick-summary-bar` at the top of the Technical Specifications modal.
  - In [products.component.ts](file:///f:/mwcSystems/src/app/pages/products/products.component.ts): Removed `{ label: 'Manufacturer Warranty', value: '3 year complete warranty' }` from `fullSpecs` for All In One PC, Desktop Computer, and Monitor, as well as the warranty card reference in the package contents.
  - Result: The "View Full Specs" modal now cleanly displays only technical hardware configuration parameters with zero warranty mentions.

---

### Request 37: Footer Copyright & Agency Developer Credit Link
- **User Prompt:** *Copyright © 2026 INVO IT Website Design & Developed By [Sirmor Software Solution Pvt. Ltd.](https://www.sirmor.com/) add karo footer me*
- **Features Implemented:**
  - In [footer.component.html](file:///f:/mwcSystems/src/app/components/footer/footer.component.html): Updated `.footer-bottom` bar to display `Copyright &copy; {{ currentYear }} INVO IT` along with `Website Design & Developed By <a href="https://www.sirmor.com/" target="_blank" rel="noopener noreferrer" class="developer-link">Sirmor Software Solution Pvt. Ltd.</a>`.
  - In [footer.component.css](file:///f:/mwcSystems/src/app/components/footer/footer.component.css): Styled `.developer-link` with brand blue accent (`#38bdf8`), smooth hover underline, and responsive stacking for mobile views.
  - Result: Professional agency copyright and hyperlink credits live in the footer across all public pages.

---

### Request 38: New Product Category "ALL IN ONE PC" with Component Detail Form
- **User Prompt:** *new Product Category Add karo "ALL IN ONE PC" with detail form use reference image*
- **Features Implemented:**
  1. **New Category Added**:
     - Added `ALL IN ONE PC` (ID: 6) in MariaDB `mst_category`, SQL schema files ([invo_it.sql](file:///f:/mwcSystems/invo_it.sql), [rggroupindia_invo.sql](file:///f:/mwcSystems/rggroupindia_invo.sql)), [server/api.js](file:///f:/mwcSystems/server/api.js), and frontend components.
  2. **Product Entry Modal with Reference Image Form Fields**:
     - In [admin.component.html](file:///f:/mwcSystems/src/app/pages/admin/admin.component.html): Step 1 category dropdown now includes `ALL IN ONE PC`.
     - Subtitle updated to: *Add Computer, ALL IN ONE PC, Monitor, TV, Interactive Panel, or LED Bulb & allocate or sell directly*.
     - In Step 3: Displays full Component Specifications & Individual Part Warranty form with every column from the user's reference Excel sheet:
       - **Motherboard**: Serial No (e.g. `H61M1112C09S4874`) + individual warranty dropdown.
       - **Processor (CPU)**: Processor Model (e.g. `i3 12th gen`) + Serial No (e.g. `U6692PF301300`) + warranty dropdown.
       - **RAM Memory**: Capacity (e.g. `16 GB`) + Serial No (e.g. `1.2E+07` / `12050063`) + warranty dropdown.
       - **Solid State Drive (SSD)**: Capacity (e.g. `512 GB`) + Serial No (e.g. `12050043`) + warranty dropdown.
       - **AIO Chassis & SMPS**: Chassis/Cabinet Serial No (e.g. `CX90917212`) + warranty dropdown.
       - **Built-in Display Screen**: Monitor Serial No (e.g. `9I0072508000BC`) + Screen Size/Panel (e.g. `23.8" FHD IPS`) + warranty dropdown.
       - **Keyboard**: Serial No (e.g. `250001`) + warranty dropdown.
       - **Optical Mouse**: Serial No (e.g. `500001`) + warranty dropdown.
       - **Graphic Card (GPU)**: Serial No (e.g. `ZAK11PW01704`) + warranty dropdown.
       - **Batch Warranty Toolbar**: Quick-set buttons (`Set All 12 Mo`, `Set All 24 Mo`, `Set All 36 Mo`, `Set All 60 Mo`).
     - In Step 4: Full support for Direct Sale capturing `End User Name` (`AC TRIBLE DIPARTMENT`), `District / Zila` (`BILASPUR`), `Sale Date` (`06-11-26`), and `Invoice No`.
  3. **Visual Badge & Registry**:
     - Added `.cat-6` styled pill in [admin.component.css](file:///f:/mwcSystems/src/app/pages/admin/admin.component.css) with indigo badge.
     - Table rows render all component badges for ALL IN ONE PC units.
  4. **Public Pages Integration**:
     - In [products.component.ts](file:///f:/mwcSystems/src/app/pages/products/products.component.ts): Added `ALL IN ONE PC` filter pill and assigned category ID 6 to the ALL IN ONE PC product model.
     - In [warranty-check.component.ts](file:///f:/mwcSystems/src/app/pages/warranty-check/warranty-check.component.ts) and [server/api.js](file:///f:/mwcSystems/server/api.js): Full support for querying ALL IN ONE PC serials with 9-part individual component warranty breakdown table.
     - In [distributor.component.html](file:///f:/mwcSystems/src/app/pages/distributor/distributor.component.html): Displays CPU, RAM, and SSD details for ALL IN ONE PC units.

---

## 2. Key Architecture & File Map

| File Path | Description |
|---|---|
| `server/server.js` | Express server entry point, static asset hosting, and API mount. |
| `server/api.js` | Complete backend API querying and mutating MariaDB (`invo_it`). Enforces role authentication, unique credentials, mandatory invoice/sale date, and lock on sold records. |
| `server/db.js` | MariaDB connection pool with 10s connection timeout & `.env` configuration. |
| `invo_it.sql` | Live MariaDB schema including `admin_users`, `mst_party`, `mst_product_model`, `trn_inventory_unit`, and specification tables. |
| `src/app/components/header/header.component.ts` | Header controller managing navigation, scroll glassmorphism, login dropdown states, and session logout. |
| `src/app/components/header/header.component.html` | Responsive header navigation template with dynamic desktop login dropdown & mobile auth section. |
| `src/app/components/header/header.component.css` | Glassmorphic styling, animations, user role pills, and mobile drawer styles. |
| `src/app/pages/login/login.component.ts` | Unified single login window for Admin, Staff Sub-Users, and Distributors. |
| `src/app/pages/login/login.component.html` | Login page template with quick-login demo pills. |
| `src/app/pages/admin/admin.component.ts` | Admin controller: 100% database-driven product registry, dealer allocation, direct sale, sub-user CRUD, and dealer credentials. |
| `src/app/pages/admin/admin.component.html` | Admin UI: Overview metrics, Serials & Warranties registry, Party Directory, Sub-Users management, and New Product Entry modal. |
| `src/app/pages/distributor/distributor.component.ts` | Distributor controller: loads dealer-allocated stock, locks sold records, and registers sales. |
| `src/app/pages/distributor/distributor.component.html` | Distributor UI: Stock table with status pills, and read-only locked modal for invoiced units. |
| `src/app/pages/warranty-check/warranty-check.component.html` | Public warranty verification page showing Active, Pending Sale, and Expired states with component breakdown. |
| `src/app/services/auth.service.ts` | Authentication service managing session state, role determination, and local storage tokens. |
| `CPANEL_DEPLOYMENT_GUIDE.md` | Complete hosting and deployment guide for cPanel. |
| `CHAT_SUMMARY.md` | Complete chat history, user requests, and requirements record. |

---

## 3. Login Credentials Reference

| Role | Username / Mobile / Email | Password | Landing Page | Description |
|---|---|---|---|---|
| **Super Admin** | `admin` (or `admin@invoit.in`) | `123` | `/admin` | Complete master control, user creation, dealer credentials. |
| **Sub-User (Staff)** | `rahul_user` (or `rahul@invoit.in`) | `123` | `/admin` | Admin staff operator. |
| **Sub-User (Staff)** | `priya_user` (or `priya@invoit.in`) | `123` | `/admin` | Admin staff operator. |
| **Distributor** | `9827112233` (or `sales@invoit-cg.com`) | `dist123` | `/distributor` | In-vo it industry pvt. Ltd. (Bilaspur) |
| **Distributor** | `9425234567` (or `rpenterprises@gmail.com`) | `dist123` | `/distributor` | R. P. ENTERPRISES (Bilaspur) |
| **Distributor** | `9826198765` (or `mrenterprises.bsp@gmail.com`) | `dist123` | `/distributor` | M. R. ENTERPRISES (Bilaspur) |
| **Distributor** | `9752109876` (or `gunjan.industry@outlook.com`) | `dist123` | `/distributor` | Gunjan Industry (Bilaspur) |
| **Distributor** | `9981234567` (or `starenterprises.bsp@gmail.com`) | `dist123` | `/distributor` | star enterprises (Bilaspur) |
| **Distributor** | `amit_dist` (or `9876500002`) | `123` | `/distributor` | TechNova Solutions / Amit Verma |

---

## 4. Business Rules Enforced

1. **Warranty Trigger:** Warranty **NEVER** starts upon product registration or dealer allocation. It **ONLY** starts when the customer sale invoice number and sale date are submitted.
2. **Warranty Calculation:** End dates for the overall unit and each internal component (CPU, MB, RAM, SSD, Cabinet, Monitor, Peripherals, GPU) are strictly calculated as `Sale Date + Warranty Months`.
3. **Immutability:** Once an Invoice Number and Sale Date are entered, they are **permanently locked**. They cannot be edited, modified, or overwritten by any portal user.
4. **Zero Invoice Generation:** The portal does not generate bills or invoices; it exclusively maintains serial numbers and warranty validity records.
5. **Zero Hardcoded Data:** All parties, users, models, categories, and inventory serials reside directly in MariaDB.
