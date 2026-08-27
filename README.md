# 💧 MWC System - Water Purification & Warranty Portal

[![Angular](https://img.shields.io/badge/Angular-19.0.0-dd0031.svg?style=flat&logo=angular)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![MariaDB](https://img.shields.io/badge/MariaDB-Database-003545.svg?style=flat&logo=mariadb)](https://mariadb.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**MWC Portal** is a full-stack web application designed for MWC (Mineral & Water Clean Technology). It offers a customer portal for browsing water purification products, checking real-time warranty status by serial number, scheduling service requests, and accessing customer support.

---

## 🚀 Key Features

* 📦 **Product Catalog**: Browse water purifiers (RO, UV, UF, Commercial, Gravity) with specifications, purification stages, capacity, and pricing.
* 🛡️ **Warranty Checker**: Verification tool allowing customers to enter their product serial number (e.g., `MWC-12345`) to view active warranty coverage, purchase dates, and remaining days.
* 🔧 **Service Request Portal**: Form interface for booking installation, routine maintenance, filter replacement, and repairs.
* 📞 **Contact & Support**: Business contact details, customer service hotline, and inquiry submission.
* ⚡ **MariaDB Database Seeding**: Automated script to configure MariaDB schema and seed demo records.

---

## 🛠️ Technology Stack

### Frontend
* **Framework**: Angular 19 (Standalone Components Architecture)
* **Routing**: `@angular/router`
* **Icons & Fonts**: Google Material Symbols & Google Fonts (`Outfit`, `Inter`)
* **Styling**: Modern Vanilla CSS with CSS custom properties & dynamic responsive design

### Backend & Database
* **Runtime**: Node.js
* **Framework**: Express.js (`server/api.js`)
* **Database**: MariaDB (`mwcsystem_db`) via `mariadb` connection pool (`server/db.js`)
* **Database Driver**: `mariadb` npm package v3.5.3

---

## 📂 Project Architecture

```text
mwcsystem/
├── mwcsystem_db.sql            # MariaDB SQL schema creation & initial seed data
├── package.json                # Dependencies and CLI build scripts
├── CHANGELOG.md                # Project release history & version updates
├── README.md                   # Comprehensive project documentation
├── server/                     # Backend Server & Database Modules
│   ├── api.js                  # Express router defining API endpoints
│   ├── db.js                   # MariaDB connection pool config
│   └── init-db.js              # Database initialization & seeding runner
└── src/                        # Angular Frontend Application
    ├── main.ts                 # Application entry point
    ├── styles.css              # Global design tokens and utilities
    └── app/
        ├── app.routes.ts       # Router definitions
        ├── app.component.ts    # Root application container
        ├── components/         # Shared UI components (header, footer, hero, features)
        └── pages/              # Primary route views
            ├── home/           # Homepage
            ├── about/          # About MWC System
            ├── products/       # Products catalog
            ├── warranty-check/ # Serial number warranty lookup
            ├── service/        # Service booking portal
            └── contact/        # Contact us page
```

---

## 💾 Database Schema (`mwcsystem_db`)

The database consists of 5 relational tables:

| Table | Description |
| :--- | :--- |
| **`products`** | Water purifier models, category, price, warranty period, and status. |
| **`customers`** | Registered customer accounts, addresses, and contact info. |
| **`warranties`** | Warranty records mapping product serial numbers to customers and expiry dates. |
| **`service_requests`** | Service maintenance tickets, service types, descriptions, and scheduled dates. |
| **`contact_messages`** | Customer contact form submissions and support inquiries. |

---

## 📡 API Endpoints (`server/api.js`)

| Method | Endpoint | Description | Sample Query / Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/warranty/:serialNumber` | Fetch warranty status & owner info | `GET /api/warranty/MWC-12345` |
| `GET` | `/api/products` | Retrieve active products list | `GET /api/products` |

---

## ⚡ Getting Started & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MariaDB](https://mariadb.org/) / MySQL Server (running on port `3306`)
* [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### 1. Clone & Install Dependencies
```bash
# Clone repository or navigate to directory
cd mwcsystem

# Install npm packages
npm install
```

### 2. Configure & Initialize Database
Ensure MariaDB is running, then set environment variables (or use defaults) and execute the database init script:

```bash
# Environment variables (Optional defaults: host=127.0.0.1, user=root, password=123, port=3306)
set DB_HOST=127.0.0.1
set DB_USER=root
set DB_PASSWORD=123
set DB_PORT=3306

# Run database setup & seeding
node server/init-db.js
```

### 3. Run Development Server
Start the Angular frontend application:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

---

## 📜 Scripts

| Script | Command | Action |
| :--- | :--- | :--- |
| **`npm start`** | `ng serve` | Launches Angular dev server at `localhost:4200` |
| **`npm run build`** | `ng build` | Compiles production assets into `dist/` |
| **`npm run watch`** | `ng build --watch` | Rebuilds application on file change |
| **`npm test`** | `ng test` | Runs unit tests via Karma / Jasmine |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
