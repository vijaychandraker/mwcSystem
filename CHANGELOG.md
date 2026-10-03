# Changelog

All notable changes to the **MWC System (mwc-portal)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-09-04

### Added
- **Multi-Category Admin Product Entry & Inventory Management**:
  - Full product entry workflow supporting 5 product categories: Computer, Monitor, TV, Interactive Flat Panel, and LED Bulb.
  - Category-specific exact specifications (Cabinet, Motherboard, RAM, SSD, CPU, Panel, Screen Size, Wattage).
  - Allocation to authorized distributors or direct sale to end customers.
- **Computer Individual Component Warranty Management**:
  - Individual warranty period selector (12, 24, 36, 60 Months) for all 9 computer parts: Motherboard, Processor, RAM, SSD, Cabinet/SMPS, Monitor Screen, Keyboard, Mouse, and Graphic Card.
  - Quick-apply batch warranty toolbar with dynamic active button selection (`Set All 12 Mo`, `Set All 24 Mo`, `Set All 36 Mo`, `Set All 60 Mo`).
  - Individual part warranty badges in Admin inventory table and Distributor stock cards.
- **Distributor Portal & Sales Workflow**:
  - Multi-distributor switcher for authorized dealers.
  - Product selling modal logging official Invoice ID, Invoice Date, Customer Name, and District (Zila) to activate warranty coverage.
  - GST Tax Invoice generation and preview with browser print capability.
- **Enhanced Public Warranty Verification**:
  - Detailed "Computer Parts Individual Warranty Details" table showing each part's serial number, individual warranty duration, calculated expiration date, and active/expired status badges.
  - Inclusion of individual component warranty summary in the official printable certificate.
- **100% MariaDB Database Integration**:
  - Complete integration of Express backend (`server/api.js`) with MariaDB (`invo_it` on port 3306).
  - Persistent storage in `trn_inventory_unit`, `trn_stock_transfer`, `trn_invoice`, `trn_invoice_item`, and `trn_computer_spec` tables.
  - Dynamic querying and syncing of products, parties, customers, models, and tax invoices.

## [1.0.0] - 2026-08-26

### Added
- **Angular 19 Frontend Application**:
  - Built using Angular 19 Standalone Components architecture.
  - Full routing structure: Home (`/`), About (`/about`), Products (`/products`), Warranty Check (`/warranty-check`), Service Requests (`/service`), and Contact Us (`/contact`).
  - Shared layout components: Navigation Header (`app-header`), Footer (`app-footer`), Hero Section (`app-hero`), and Feature Highlights (`app-features`).
  - Integrated design system with custom CSS design tokens, modern typography (`Outfit`, `Inter`), and Google Material Symbols icons.

- **Product Management & Catalog**:
  - Product listing view displaying water purification products (AquaPure 500, CrystalClear 300, ProClean 700, SmartFlow 200, Industrial Pro, TankGuard).

- **Warranty Check System**:
  - Interactive serial number search interface to verify product warranty coverage, active status, purchase dates, and days remaining.

- **Service Request Portal**:
  - Service request scheduling form for installation, maintenance, filter replacement, and repair services.

- **Node.js Express Backend (`server/api.js`)**:
  - API endpoint `GET /api/warranty/:serialNumber` to query warranty details from database.
  - API endpoint `GET /api/products` to fetch active product catalog items.

- **MariaDB Database Integration (`mwcsystem_db.sql`)**:
  - Full schema for `products`, `customers`, `warranties`, `service_requests`, and `contact_messages` tables.
  - Express MariaDB connection pool (`server/db.js`).
  - Database initialization and seed script (`server/init-db.js`).
