-- ============================================
-- INVO IT WARRANTY MANAGEMENT DATABASE
-- MariaDB 10.6+
-- ============================================

CREATE DATABASE IF NOT EXISTS invo_it
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE invo_it;

-- ============================================
-- MASTER TABLE : PARTY (OEM & DISTRIBUTOR)
-- ============================================

CREATE TABLE IF NOT EXISTS mst_party (
    party_id INT AUTO_INCREMENT PRIMARY KEY,
    party_type ENUM('OEM','DISTRIBUTOR') NOT NULL,
    party_name VARCHAR(150) NOT NULL,
    gst_no VARCHAR(30),
    contact_person VARCHAR(100),
    mobile VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MASTER TABLE : CUSTOMER
-- ============================================

CREATE TABLE IF NOT EXISTS mst_customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    department VARCHAR(150),
    contact_person VARCHAR(100),
    mobile VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MASTER TABLE : CATEGORY
-- ============================================

CREATE TABLE IF NOT EXISTS mst_category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- ============================================
-- MASTER TABLE : PRODUCT MODEL
-- ============================================

CREATE TABLE IF NOT EXISTS mst_product_model (
    model_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    brand VARCHAR(100),
    model_no VARCHAR(100) NOT NULL,
    product_name VARCHAR(150),
    warranty_month INT NOT NULL,
    status TINYINT DEFAULT 1,
    FOREIGN KEY (category_id)
    REFERENCES mst_category(category_id)
);

-- ============================================
-- TRANSACTION : STOCK TRANSFER
-- OEM → DISTRIBUTOR
-- ============================================

CREATE TABLE IF NOT EXISTS trn_stock_transfer (
    transfer_id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_no VARCHAR(30) UNIQUE,
    from_party_id INT NOT NULL,
    to_party_id INT NOT NULL,
    model_id INT NOT NULL,
    serial_no VARCHAR(100) UNIQUE NOT NULL,
    dispatch_date DATE NOT NULL,
    sale_valid_till DATE NOT NULL,
    stock_status ENUM('IN_STOCK','SOLD','EXPIRED','EXTENDED')
    DEFAULT 'IN_STOCK',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (from_party_id)
    REFERENCES mst_party(party_id),

    FOREIGN KEY (to_party_id)
    REFERENCES mst_party(party_id),

    FOREIGN KEY (model_id)
    REFERENCES mst_product_model(model_id)
);

-- ============================================
-- TRANSACTION : EXTENSION REQUEST
-- ============================================

CREATE TABLE IF NOT EXISTS trn_extension_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_id INT NOT NULL,
    request_date DATE NOT NULL,
    reason TEXT,
    status ENUM('PENDING','APPROVED','REJECTED')
    DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (transfer_id)
    REFERENCES trn_stock_transfer(transfer_id)
);

-- ============================================
-- TRANSACTION : EXTENSION APPROVAL
-- ============================================

CREATE TABLE IF NOT EXISTS trn_extension_approval (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    approved_by INT NOT NULL,
    extend_days INT NOT NULL,
    old_valid_till DATE,
    new_valid_till DATE,
    approval_date DATE,
    remarks TEXT,

    FOREIGN KEY (request_id)
    REFERENCES trn_extension_request(request_id),

    FOREIGN KEY (approved_by)
    REFERENCES mst_party(party_id)
);

-- ============================================
-- TRANSACTION : INVOICE HEADER
-- ============================================

CREATE TABLE IF NOT EXISTS trn_invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    seller_party_id INT NOT NULL,
    customer_id INT NOT NULL,
    sale_type ENUM('DIRECT','DISTRIBUTOR') NOT NULL,
    invoice_date DATE NOT NULL,
    total_qty INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seller_party_id)
    REFERENCES mst_party(party_id),

    FOREIGN KEY (customer_id)
    REFERENCES mst_customer(customer_id)
);

-- ============================================
-- TRANSACTION : INVOICE ITEM
-- WARRANTY STARTS FROM INVOICE DATE
-- ============================================

CREATE TABLE IF NOT EXISTS trn_invoice_item (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    transfer_id INT NULL,
    model_id INT NOT NULL,
    serial_no VARCHAR(100) UNIQUE NOT NULL,
    warranty_start DATE NOT NULL,
    warranty_end DATE NOT NULL,

    FOREIGN KEY (invoice_id)
    REFERENCES trn_invoice(invoice_id)
    ON DELETE CASCADE,

    FOREIGN KEY (transfer_id)
    REFERENCES trn_stock_transfer(transfer_id),

    FOREIGN KEY (model_id)
    REFERENCES mst_product_model(model_id)
);

-- ============================================
-- COMPUTER SPECIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS trn_computer_spec (
    item_id INT PRIMARY KEY,
    processor VARCHAR(100),
    processor_sn VARCHAR(100),
    motherboard_sn VARCHAR(100),
    ram_size VARCHAR(20),
    ram_sn VARCHAR(100),
    ssd_size VARCHAR(20),
    ssd_sn VARCHAR(100),
    cabinet_sn VARCHAR(100),
    monitor_sn VARCHAR(100),
    keyboard_sn VARCHAR(100),
    mouse_sn VARCHAR(100),

    FOREIGN KEY (item_id)
    REFERENCES trn_invoice_item(item_id)
    ON DELETE CASCADE
);

-- ============================================
-- MONITOR SPECIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS trn_monitor_spec (
    item_id INT PRIMARY KEY,
    screen_size VARCHAR(30),
    panel_type VARCHAR(30),
    monitor_sn VARCHAR(100),

    FOREIGN KEY (item_id)
    REFERENCES trn_invoice_item(item_id)
    ON DELETE CASCADE
);

-- ============================================
-- TV SPECIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS trn_tv_spec (
    item_id INT PRIMARY KEY,
    screen_size VARCHAR(30),
    motherboard_sn VARCHAR(100),
    panel_sn VARCHAR(100),

    FOREIGN KEY (item_id)
    REFERENCES trn_invoice_item(item_id)
    ON DELETE CASCADE
);

-- ============================================
-- INTERACTIVE PANEL SPECIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS trn_panel_spec (
    item_id INT PRIMARY KEY,
    ram VARCHAR(20),
    rom VARCHAR(20),
    ops_serial VARCHAR(100),
    ops_ram VARCHAR(20),
    ops_rom VARCHAR(20),

    FOREIGN KEY (item_id)
    REFERENCES trn_invoice_item(item_id)
    ON DELETE CASCADE
);

-- ============================================
-- LED BULB SPECIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS trn_bulb_spec (
    item_id INT PRIMARY KEY,
    watt VARCHAR(20),
    color VARCHAR(30),

    FOREIGN KEY (item_id)
    REFERENCES trn_invoice_item(item_id)
    ON DELETE CASCADE
);

-- ============================================
-- DUMMY SEED DATA FOR ALL TABLES
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Reset tables to populate clean sample data
TRUNCATE TABLE trn_bulb_spec;
TRUNCATE TABLE trn_panel_spec;
TRUNCATE TABLE trn_tv_spec;
TRUNCATE TABLE trn_monitor_spec;
TRUNCATE TABLE trn_computer_spec;
TRUNCATE TABLE trn_invoice_item;
TRUNCATE TABLE trn_invoice;
TRUNCATE TABLE trn_extension_approval;
TRUNCATE TABLE trn_extension_request;
TRUNCATE TABLE trn_stock_transfer;
TRUNCATE TABLE mst_product_model;
TRUNCATE TABLE mst_category;
TRUNCATE TABLE mst_customer;
TRUNCATE TABLE mst_party;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. MASTER TABLE : PARTY (OEM & DISTRIBUTORS)
INSERT INTO mst_party (party_id, party_type, party_name, gst_no, contact_person, mobile, email, address, district, state, pincode, status) VALUES
(1, 'OEM', 'INVO IT Industries Pvt. Ltd.', '07AAAAA0000A1Z5', 'Rajesh Gupta', '9876543210', 'info@invoit.in', 'Plot 42, Tech Park, Okhla Phase 3', 'South East Delhi', 'Delhi', '110020', 1),
(2, 'DISTRIBUTOR', 'TechNova Solutions Pvt Ltd', '07BBBBA1111B1Z2', 'Amit Verma', '9811122233', 'sales@technova.com', '102 Nehru Place Main Market', 'South Delhi', 'Delhi', '110019', 1),
(3, 'DISTRIBUTOR', 'MicroNet Infotech', '27CCCCC2222C1Z4', 'Sanjay Kulkarni', '9822033445', 'sanjay@micronet.in', '45 Lamington Road', 'Mumbai City', 'Maharashtra', '400007', 1),
(4, 'DISTRIBUTOR', 'CyberVision Enterprises', '29DDDDD3333D1Z6', 'Venkatesh Rao', '9845099887', 'contact@cybervision.co.in', '88 SP Road, Electronics Market', 'Bengaluru Urban', 'Karnataka', '560002', 1),
(5, 'DISTRIBUTOR', 'Apex Digital Systems', '19EEEEE4444E1Z8', 'Debabrata Mukherjee', '9830077665', 'apex.digital@gmail.com', '12 Chandni Chowk Street', 'Kolkata', 'West Bengal', '700072', 1);

-- 2. MASTER TABLE : CUSTOMER
INSERT INTO mst_customer (customer_id, customer_name, department, contact_person, mobile, email, address, district, state, pincode, status) VALUES
(1, 'St. Xavier Higher Secondary School', 'IT & Smart Classroom Dept', 'Brother Joseph', '9810011223', 'admin@stxaviers.edu.in', '12 Convent Road', 'South Delhi', 'Delhi', '110003', 1),
(2, 'Apollo Healthcare Solutions', 'IT Infrastructure', 'Dr. Alok Mishra', '9820033441', 'alok.mishra@apollohealth.com', '78 Sector 14, CBD Belapur', 'Navi Mumbai', 'Maharashtra', '400614', 1),
(3, 'National Informatics Centre', 'E-Governance Project', 'Suresh Menon', '9844055667', 'suresh.menon@nic.in', 'Koramangala 4th Block', 'Bengaluru Urban', 'Karnataka', '560034', 1),
(4, 'Priya & Vikram Malhotra', 'Home Consumer', 'Vikram Malhotra', '9871144556', 'vikram.malhotra@gmail.com', '502 Green Valley Apartments', 'Gurugram', 'Haryana', '122001', 1),
(5, 'Zenith Infotech Corporate Office', 'Administration & HR', 'Meenakshi Sundaram', '9831166778', 'admin@zenithinfotech.com', '5th Floor, Salt Lake Sector 5', 'Kolkata', 'West Bengal', '700091', 1);

-- 3. MASTER TABLE : CATEGORY
INSERT INTO mst_category (category_id, category_name) VALUES
(1, 'Computer'),
(2, 'Monitor'),
(3, 'TV'),
(4, 'Interactive Panel'),
(5, 'LED Bulb');

-- 4. MASTER TABLE : PRODUCT MODEL
INSERT INTO mst_product_model (model_id, category_id, brand, model_no, product_name, warranty_month, status) VALUES
(1, 1, 'INVO', 'INVO-DP500', 'INVO DeskPro i5 PC', 24, 1),
(2, 1, 'INVO', 'INVO-WS700', 'INVO Workstation i7 Desktop', 36, 1),
(3, 2, 'INVO', 'INVO-MON24', 'INVO Vue 24" IPS FHD Monitor', 12, 1),
(4, 2, 'INVO', 'INVO-MON27', 'INVO Vue 27" Curved Gaming Monitor', 24, 1),
(5, 3, 'INVO', 'INVO-TV43', 'INVO Smart Vision 43" 4K Smart TV', 24, 1),
(6, 3, 'INVO', 'INVO-TV55', 'INVO Ultra 55" QLED 4K TV', 36, 1),
(7, 4, 'INVO', 'INVO-IFP65', 'INVO Board 65" 4K Interactive Flat Panel', 36, 1),
(8, 4, 'INVO', 'INVO-IFP75', 'INVO Board 75" Premium Touch IFP', 36, 1),
(9, 5, 'INVO', 'INVO-B09W', 'INVO EcoBulb 9W Cool Daylight LED', 12, 1),
(10, 5, 'INVO', 'INVO-B15W', 'INVO BrightMax 15W High Watt Bulb', 12, 1);

-- 5. TRANSACTION : STOCK TRANSFER (OEM → DISTRIBUTORS)
INSERT INTO trn_stock_transfer (transfer_id, transfer_no, from_party_id, to_party_id, model_id, serial_no, dispatch_date, sale_valid_till, stock_status, remarks) VALUES
(1, 'ST-2026-001', 1, 2, 1, 'INVO-DP500-2026001', '2026-01-10', '2026-07-10', 'SOLD', 'Dispatched 5 units to TechNova Delhi'),
(2, 'ST-2026-002', 1, 2, 3, 'INVO-MON24-2026002', '2026-01-10', '2026-07-10', 'SOLD', 'Dispatched with PC batch'),
(3, 'ST-2026-003', 1, 3, 7, 'INVO-IFP65-2026003', '2026-02-01', '2026-08-01', 'SOLD', 'Smart classroom panel for Mumbai distributor'),
(4, 'ST-2026-004', 1, 3, 5, 'INVO-TV43-2026004', '2026-02-15', '2026-08-15', 'SOLD', 'Dispatched 10 Smart TVs to MicroNet'),
(5, 'ST-2026-005', 1, 4, 2, 'INVO-WS700-2026005', '2026-03-01', '2026-09-01', 'SOLD', 'High-end workstation for Bengaluru market'),
(6, 'ST-2026-006', 1, 4, 8, 'INVO-IFP75-2026006', '2026-03-10', '2026-09-10', 'EXTENDED', '75-inch IFP transferred to CyberVision'),
(7, 'ST-2026-007', 1, 5, 9, 'INVO-B09W-2026007', '2026-04-01', '2026-10-01', 'SOLD', 'Bulk LED bulb transfer to Kolkata distributor'),
(8, 'ST-2026-008', 1, 2, 4, 'INVO-MON27-2026008', '2026-04-15', '2026-10-15', 'IN_STOCK', '27 inch curved monitor in distributor stock'),
(9, 'ST-2026-009', 1, 3, 6, 'INVO-TV55-2026009', '2026-05-01', '2026-11-01', 'IN_STOCK', '55 inch QLED TV stock at MicroNet'),
(10, 'ST-2026-010', 1, 5, 10, 'INVO-B15W-2026010', '2026-05-20', '2026-11-20', 'IN_STOCK', '15W LED Bulbs in stock at Apex Digital');

-- 6. TRANSACTION : EXTENSION REQUEST
INSERT INTO trn_extension_request (request_id, transfer_id, request_date, reason, status) VALUES
(1, 6, '2026-08-25', 'Institution client purchase order delayed due to approval cycle. Need 60 days extension.', 'APPROVED'),
(2, 8, '2026-08-30', 'Slow festive season movement, requesting 30 days stock extension.', 'PENDING');

-- 7. TRANSACTION : EXTENSION APPROVAL
INSERT INTO trn_extension_approval (approval_id, request_id, approved_by, extend_days, old_valid_till, new_valid_till, approval_date, remarks) VALUES
(1, 1, 1, 60, '2026-09-10', '2026-11-09', '2026-08-27', 'Approved by OEM Sales Head for institutional deal clearance.');

-- 8. TRANSACTION : INVOICE HEADER
INSERT INTO trn_invoice (invoice_id, invoice_no, seller_party_id, customer_id, sale_type, invoice_date, total_qty) VALUES
(1, 'INV-2026-101', 2, 1, 'DISTRIBUTOR', '2026-02-15', 2),
(2, 'INV-2026-102', 3, 2, 'DISTRIBUTOR', '2026-03-01', 2),
(3, 'INV-2026-103', 4, 3, 'DISTRIBUTOR', '2026-03-25', 1),
(4, 'INV-2026-104', 1, 4, 'DIRECT', '2026-04-10', 1),
(5, 'INV-2026-105', 5, 5, 'DISTRIBUTOR', '2026-04-20', 1);

-- 9. TRANSACTION : INVOICE ITEM (WARRANTY RECORDS)
INSERT INTO trn_invoice_item (item_id, invoice_id, transfer_id, model_id, serial_no, warranty_start, warranty_end) VALUES
(1, 1, 1, 1, 'INVO-DP500-2026001', '2026-02-15', '2028-02-15'),
(2, 1, 2, 3, 'INVO-MON24-2026002', '2026-02-15', '2027-02-15'),
(3, 2, 3, 7, 'INVO-IFP65-2026003', '2026-03-01', '2029-03-01'),
(4, 2, 4, 5, 'INVO-TV43-2026004', '2026-03-01', '2028-03-01'),
(5, 3, 5, 2, 'INVO-WS700-2026005', '2026-03-25', '2029-03-25'),
(6, 4, NULL, 5, 'INVO-TV43-DIR-9901', '2026-04-10', '2028-04-10'),
(7, 5, 7, 9, 'INVO-B09W-2026007', '2026-04-20', '2027-04-20');

-- 10. COMPUTER SPECIFICATION
INSERT INTO trn_computer_spec (item_id, processor, processor_sn, motherboard_sn, ram_size, ram_sn, ssd_size, ssd_sn, cabinet_sn, monitor_sn, keyboard_sn, mouse_sn) VALUES
(1, 'Intel Core i5-13400', 'CPU-INT13400-8841', 'MB-ASUS-B760-9921', '16GB DDR4', 'RAM-CRUCIAL-16G-1102', '512GB NVMe SSD', 'SSD-SAMSUNG-512G-4401', 'CAB-INVO-TOWER-001', 'MON-INVO-24-9921', 'KB-INVO-KM100-A', 'MS-INVO-KM100-B'),
(5, 'Intel Core i7-13700K', 'CPU-INT13700K-9902', 'MB-MSI-Z790-7712', '32GB DDR5', 'RAM-CORSAIR-32G-8812', '1TB NVMe Gen4 SSD', 'SSD-WD-1TB-7721', 'CAB-INVO-PRO-002', 'MON-INVO-27-8812', 'KB-INVO-MECH-002', 'MS-INVO-GAMING-002');

-- 11. MONITOR SPECIFICATION
INSERT INTO trn_monitor_spec (item_id, screen_size, panel_type, monitor_sn) VALUES
(2, '24 Inch (60.9 cm)', 'IPS Full HD', 'INVO-MON24-2026002');

-- 12. TV SPECIFICATION
INSERT INTO trn_tv_spec (item_id, screen_size, motherboard_sn, panel_sn) VALUES
(4, '43 Inch (108 cm)', 'MB-TV43-SMART-3321', 'PNL-LG-43FHD-8891'),
(6, '43 Inch (108 cm)', 'MB-TV43-SMART-9901', 'PNL-BOE-434K-1120');

-- 13. INTERACTIVE PANEL SPECIFICATION
INSERT INTO trn_panel_spec (item_id, ram, rom, ops_serial, ops_ram, ops_rom) VALUES
(3, '8GB DDR4', '128GB eMMC', 'OPS-INVO-i5-77881', '16GB', '256GB SSD');

-- 14. LED BULB SPECIFICATION
INSERT INTO trn_bulb_spec (item_id, watt, color) VALUES
(7, '9W', 'Cool Daylight (6500K)');

-- ============================================
-- END OF SCRIPT
-- ============================================
