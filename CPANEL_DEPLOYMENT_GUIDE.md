# 🚀 cPanel Deployment Guide - MWC System & INVO IT Portal

This step-by-step guide explains how to host both the Angular Frontend and Node.js MariaDB Backend on **cPanel**.

---

## 📋 Pre-Deployment Checklist

* [x] Angular Frontend built inside: `dist/mwc-portal/browser/`
* [x] Live schema ready: `invo_it.sql`
* [x] Dynamic API routing active (`environment.ts`)
* [x] Node Express server ready: `server/server.js` with `.env` support
* [x] Apache URL rewrite rule ready: `.htaccess`

---

## 🗄️ Step 1: Create Database & Import SQL in cPanel

1. Log in to your **cPanel Dashboard**.
2. Go to **Databases** -> **MySQL® Databases**.
3. **Create New Database**:
   * Name: `invoit` (cPanel will prefix it, e.g. `cpaneluser_invoit`).
4. **Create New Database User**:
   * Username: `dbuser` (e.g. `cpaneluser_dbuser`).
   * Password: Create a strong password and save it safely.
5. **Add User To Database**:
   * Select the user and database you just created.
   * Click **Add**.
   * Check **ALL PRIVILEGES** and click **Make Changes**.
6. **Import `invo_it.sql`**:
   * In cPanel, open **phpMyAdmin**.
   * Select your newly created database from the left sidebar.
   * Click the **Import** tab at the top.
   * Choose the file `invo_it.sql` from your computer and click **Import** (or **Go**).
   * All 14 tables and initial master data will be created instantly.

---

## ⚙️ Step 2: Setup Node.js Application in cPanel

cPanel comes with a built-in Node.js runner (Phusion Passenger).

1. In cPanel, search and open **Setup Node.js App**.
2. Click **Create Application**:
   * **Node.js version**: Choose `v18.x`, `v20.x`, or higher.
   * **Application mode**: `Production`
   * **Application root**: `backend` (or upload the project folder as `invoit-app`).
   * **Application URL**: Select your domain or subdomain:
     * If using a dedicated API subdomain: `api.yourdomain.com`
     * Or if running all-in-one: `yourdomain.com`
   * **Application startup file**: `server/server.js`
3. Click **Create**.
4. **Upload Backend Files**:
   * Using cPanel **File Manager**, navigate to the Application root folder created above.
   * Upload the following files/folders:
     * `server/` (contains `server.js`, `api.js`, `db.js`)
     * `package.json`
     * `dist/` (contains `dist/mwc-portal/browser/`)
5. **Configure Database Credentials**:
   * You can create a file named `.env` inside the `server/` folder:
     ```env
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_NAME=cpaneluser_invoit
     DB_USER=cpaneluser_dbuser
     DB_PASSWORD=your_database_password
     ```
   * *OR* in the cPanel Node.js App page, scroll to **Environment variables** and add:
     * `DB_NAME` = `cpaneluser_invoit`
     * `DB_USER` = `cpaneluser_dbuser`
     * `DB_PASSWORD` = `your_database_password`
     * `DB_HOST` = `127.0.0.1`
6. Click **Run NPM Install** in cPanel (or open terminal and run `npm install --production`).
7. Click **Restart** on the Node.js application.

---

## 🌐 Step 3: Deploy Frontend Files to `public_html`

*(Only required if you are hosting the frontend as static files in `public_html` and the Node.js API separately)*

1. Open cPanel **File Manager**.
2. Open `public_html` (or your domain's document root).
3. Upload all the files located inside your local folder:
   👉 `f:\mwcSystems\dist\mwc-portal\browser\`
   
   Make sure you upload:
   * `index.html`
   * `main-PC6QY2I7.js`
   * `polyfills-5CFQRCPP.js`
   * `styles-I2S4P77U.css`
   * `favicon.ico`
   * `.htaccess` *(Make sure "Show Hidden Files" is enabled in cPanel File Manager settings)*

---

## 🧪 Step 4: Verification & Test Checklist

Once deployed, verify the live website:

1. **Homepage & Catalog**:
   * Open `https://yourdomain.com` in your browser.
2. **Public Warranty Checker**:
   * Go to `/warranty-check`.
   * Test serial numbers:
     * `INVO-DP500-2026001` (Active Computer Warranty with 9-part breakdown)
     * `INVO-MON27-2026008` (Pending Sale status)
3. **Role-Based Single Login**:
   * Go to `/login`.
   * **Admin Login**: Username: `admin` | Password: `123`
   * **Distributor Login**: Mobile: `9827112233` | Password: `dist123`
4. **Page Refresh Test**:
   * Visit `https://yourdomain.com/admin` or `https://yourdomain.com/distributor` and press **F5 (Refresh)**.
   * The `.htaccess` file will ensure the page does not return a 404 error.

---

## 🛠️ Common cPanel Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **404 Not Found on Refresh** | Missing `.htaccess` file | Ensure `.htaccess` is uploaded to `public_html`. Enable "Show Hidden Files (dotfiles)" in cPanel File Manager settings. |
| **Database Connection Refused** | Incorrect DB name or user | cPanel always adds a prefix to database names and usernames (e.g., `user_invoit` instead of `invoit`). Update `.env` with the exact prefixed names. |
| **User Access Denied in DB** | User not attached to DB | In cPanel MySQL Databases, make sure you clicked **Add User to Database** and granted **ALL PRIVILEGES**. |
| **503 Service Unavailable** | Node.js process stopped | Go to cPanel "Setup Node.js App", check stderr logs, and click **Restart Application**. |
