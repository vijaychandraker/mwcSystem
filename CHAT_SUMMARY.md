# INVO IT & MWC System - Complete Chat History, Requirements & Implementation Record

**Session Dates:** September 4–5, 2026  
**Project:** MWC System / INVO IT Serial Registry & Warranty Verification Portal  
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

## 2. Key Architecture & File Map

| File Path | Description |
|---|---|
| `server/api.js` | Complete backend API querying and mutating MariaDB (`invo_it`). Enforces role authentication, unique credentials, mandatory invoice/sale date, and lock on sold records. |
| `server/db.js` | MariaDB connection pool with 10s connection timeout. |
| `invo_it.sql` | Live MariaDB schema including `admin_users`, `mst_party`, `mst_product_model`, `trn_inventory_unit`, and specification tables. |
| `src/app/pages/login/login.component.ts` | Unified single login window for Admin, Staff Sub-Users, and Distributors. |
| `src/app/pages/login/login.component.html` | Login page template with quick-login demo pills. |
| `src/app/pages/admin/admin.component.ts` | Admin controller: 100% database-driven product registry, dealer allocation, direct sale, sub-user CRUD, and dealer credentials. |
| `src/app/pages/admin/admin.component.html` | Admin UI: Overview metrics, Serials & Warranties registry, Party Directory, Sub-Users management, and New Product Entry modal. |
| `src/app/pages/distributor/distributor.component.ts` | Distributor controller: loads dealer-allocated stock, locks sold records, and registers sales. |
| `src/app/pages/distributor/distributor.component.html` | Distributor UI: Stock table with status pills, and read-only locked modal for invoiced units. |
| `src/app/pages/warranty-check/warranty-check.component.html` | Public warranty verification page showing Active, Pending Sale, and Expired states with component breakdown. |
| `src/app/services/auth.service.ts` | Authentication service managing session state, role determination, and local storage tokens. |
| `CHAT_SUMMARY.md` | Complete chat history and requirements record. |

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
