# Product Requirements Document (PRD)

## 📋 Document Overview
* **Product Name:** MWC System (Mineral & Water Clean Technology Portal)
* **Document Version:** 1.0.0
* **Date:** 2026-08-26
* **Status:** Approved / Active
* **Tech Stack:** Angular 19, Node.js Express, MariaDB, CSS3, Material Symbols

---

## 🎯 1. Executive Summary & Goals

### 1.1 Purpose
The **MWC System** is a customer-facing web portal and service management platform designed for MWC Water Purifiers. The portal allows consumers and commercial clients to explore high-grade water purification products, perform instant warranty validation via product serial numbers, schedule service appointments, and contact customer support.

### 1.2 Core Objectives
* **Instant Warranty Verification:** Provide customers with zero-friction, instant validation of product warranty coverage and remaining days.
* **Streamlined Service Booking:** Reduce customer service response time by enabling direct online booking for installations, routine checkups, filter replacements, and repairs.
* **Product Showcase:** Present the complete line of residential, commercial, and industrial water purification units with transparent specs and pricing.
* **High Operational Reliability:** Utilize robust relational schema management in MariaDB to guarantee data consistency between products, customers, warranties, and service tickets.

---

## 👤 2. User Personas

### Persona 1: Residential Customer (Rahul)
* **Goal:** Wants to check when his water purifier warranty expires and schedule annual filter replacement.
* **Pain Point:** Unsure of purchase date or warranty paperwork location. Needs a fast online lookup using the serial number on his unit.

### Persona 2: Business / Commercial Manager (Priya)
* **Goal:** Oversees water purification systems across multi-floor commercial facilities and requires high-capacity units (e.g. 50L/hr).
* **Pain Point:** Needs clear product specs, warranty terms (24-month extended coverage), and reliable maintenance scheduling.

### Persona 3: Service Operations Team
* **Goal:** Manage incoming service tickets, assign repair tasks, and maintain customer database records efficiently.

---

## ⚙️ 3. Functional Requirements

### 3.1 Feature Area 1: Product Catalog Management (`/products`)
| Req ID | Feature Description | Acceptance Criteria |
| :--- | :--- | :--- |
| **FR-1.1** | Display Product Cards | The system MUST render all active water purifiers with product image/icon, name, category, price, and key features. |
| **FR-1.2** | Feature Highlights | Each product MUST highlight purification technology (RO, UV, UF, Gravity), storage capacity, and warranty duration. |
| **FR-1.3** | Badge Callouts | Highlight special tags (e.g., "Best Seller", "Popular", "Premium", "Value", "New"). |

### 3.2 Feature Area 2: Warranty Lookup System (`/warranty-check`)
| Req ID | Feature Description | Acceptance Criteria |
| :--- | :--- | :--- |
| **FR-2.1** | Serial Number Lookup | Users CAN input a product serial number (e.g., `MWC-12345`) to query status. |
| **FR-2.2** | Real-time Search Execution | The system queries backend API `GET /api/warranty/:serialNumber` and returns status within 1 second. |
| **FR-2.3** | Status Summary Display | Upon match, display Product Name, Serial Number, Purchase Date, Expiry Date, Owner Name, Status (`Active`, `Expiring Soon`, `Expired`), and Days Remaining calculation. |
| **FR-2.4** | Fallback & Error Handling | Display clear user feedback if the serial number is not found in the database. |

### 3.3 Feature Area 3: Service Request Portal (`/service`)
| Req ID | Feature Description | Acceptance Criteria |
| :--- | :--- | :--- |
| **FR-3.1** | Service Scheduling Form | Allow users to submit service requests for Installation, Routine Maintenance, Filter Replacement, or Repair. |
| **FR-3.2** | Data Capture | Form fields MUST validate Full Name, Phone Number, Serial Number, Service Type, Preferred Date, and Issue Description. |
| **FR-3.3** | Unique Ticket ID | Generate a unique tracking request number (e.g. `SR-2026-001`) stored in `service_requests`. |

### 3.4 Feature Area 4: Customer Contact (`/contact`)
| Req ID | Feature Description | Acceptance Criteria |
| :--- | :--- | :--- |
| **FR-4.1** | Contact Form | Capture inquiries with Full Name, Email, Subject, and Message. |
| **FR-4.2** | Support Info Display | Display customer care hotline, support email address, office address, and business operating hours. |

---

## 📐 4. Non-Functional Requirements

### 4.1 Performance & Speed
* **Page Load Time:** Initial page load under 1.5 seconds on broadband connections.
* **API Latency:** API endpoints (`/api/warranty`, `/api/products`) MUST respond within 200ms under standard database loads.

### 4.2 Security & Data Integrity
* **SQL Injection Prevention:** All MariaDB database queries MUST use parameterized inputs.
* **Data Sanitization:** Input fields in forms MUST trim whitespace and sanitize HTML characters.

### 4.3 UI/UX Design Standards
* **Design System:** Sleek, modern dark-mode aesthetic with vibrant accent colors (Cyan `#00f2fe`, Royal Blue `#4facfe`, Emerald `#10b981`).
* **Typography:** Clean, legible Google Fonts (`Outfit` for headings, `Inter` for body text).
* **Responsive Layout:** 100% fluid responsive design supporting Mobile (320px+), Tablet (768px+), and Desktop (1200px+).

---

## 🗄️ 5. Data Architecture & Schema

### 5.1 Database Entity Relationship Summary (`mwcsystem_db`)
1. **`products`**: `id` (PK), `product_code` (UQ), `name`, `category`, `price`, `warranty_period_months`, `description`, `status`
2. **`customers`**: `id` (PK), `full_name`, `email` (UQ), `phone`, `address`, `city`, `state`, `pincode`
3. **`warranties`**: `id` (PK), `serial_number` (UQ), `product_id` (FK), `customer_id` (FK), `purchase_date`, `expiry_date`, `status`
4. **`service_requests`**: `id` (PK), `request_number` (UQ), `customer_id` (FK), `serial_number`, `service_type`, `issue_description`, `status`, `scheduled_date`
5. **`contact_messages`**: `id` (PK), `full_name`, `email`, `phone`, `subject`, `message`, `status`

---

## 🗺️ 6. Roadmap & Future Scope (Phase 2)

* 🔐 **User Accounts & Authentication:** Customer dashboard to manage multiple owned devices and past service tickets.
* 📲 **SMS & WhatsApp Notifications:** Automated reminders sent 30 days before warranty expiration.
* 💳 **Online Payment Gateway:** Integration for purchasing annual maintenance contracts (AMC) and replacement filters directly.
* 👨‍🔧 **Technician Mobile Portal:** Mobile UI for service engineers to update ticket status (`In Progress`, `Completed`) in real time.
