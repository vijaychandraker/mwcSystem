# Changelog

All notable changes to the **MWC System (mwc-portal)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
