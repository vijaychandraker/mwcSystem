-- ========================================================
-- MWC SYSTEM - MARIADB DATABASE SCHEMA & INITIAL DATA
-- Database Name: mwcsystem_db
-- Compatible with: MariaDB 10.x / 11.x / 12.x
-- ========================================================

CREATE DATABASE IF NOT EXISTS `mwcsystem_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mwcsystem_db`;

-- --------------------------------------------------------
-- 1. Table: products
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `warranty_period_months` INT DEFAULT 12,
  `description` TEXT,
  `status` ENUM('active', 'discontinued') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Products Data
INSERT INTO `products` (`product_code`, `name`, `category`, `price`, `warranty_period_months`, `description`) VALUES
('MWC-AP500', 'MWC AquaPure 500', 'RO Water Purifier', 12999.00, 12, '7-Stage Purification with TDS Controller and 8L Storage'),
('MWC-CC300', 'MWC CrystalClear 300', 'UV Water Purifier', 8499.00, 12, 'UV+UF Technology with Auto-Shut Off and 6L Storage'),
('MWC-PC700', 'MWC ProClean 700', 'RO+UV+UF Purifier', 18999.00, 24, '9-Stage Purification with Mineral Cartridge and 10L Storage'),
('MWC-SF200', 'MWC SmartFlow 200', 'Gravity Water Purifier', 3999.00, 12, 'Non-Electric Sediment Filter with 16L Storage'),
('MWC-INDPRO', 'MWC Industrial Pro', 'Commercial Purifier', 49999.00, 24, 'Industrial Grade High Capacity 50L/hr Output'),
('MWC-TG100', 'MWC TankGuard', 'Water Tank Cleaner', 6999.00, 12, 'Auto Cleaning UV Sterilization with Smart Timer');

-- --------------------------------------------------------
-- 2. Table: customers
-- --------------------------------------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(50),
  `state` VARCHAR(50),
  `pincode` VARCHAR(10),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Customers Data
INSERT INTO `customers` (`full_name`, `email`, `phone`, `address`, `city`, `state`, `pincode`) VALUES
('Rahul Sharma', 'rahul.sharma@example.com', '+91 9876543210', '102 Green Acres, Bandra West', 'Mumbai', 'Maharashtra', '400050'),
('Priya Patel', 'priya.patel@example.com', '+91 9876543211', '45 Sunshine Apartments, MG Road', 'Pune', 'Maharashtra', '411001'),
('Amit Kumar', 'amit.kumar@example.com', '+91 9876543212', '78 Sector 15, Vashi', 'Navi Mumbai', 'Maharashtra', '400703');

-- --------------------------------------------------------
-- 3. Table: warranty_records (Database Structure Spec)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `warranty_records`;
CREATE TABLE `warranty_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `serial_no` VARCHAR(100) NOT NULL UNIQUE,
  `product_id` INT NOT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_mobile` VARCHAR(20) NOT NULL,
  `installation_date` DATE NOT NULL,
  `warranty_period_months` INT DEFAULT 12,
  `warranty_end_date` DATE NOT NULL,
  `status` ENUM('Active', 'Expired') DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Warranty Records Data
INSERT INTO `warranty_records` (`serial_no`, `product_id`, `customer_name`, `customer_mobile`, `installation_date`, `warranty_period_months`, `warranty_end_date`, `status`) VALUES
('MWC-12345', 1, 'Rahul Sharma', '+91 9876543210', '2026-03-15', 12, '2027-03-15', 'Active'),
('MWC-67890', 2, 'Priya Patel', '+91 9876543211', '2026-01-10', 12, '2027-01-10', 'Active'),
('MWC-99999', 3, 'Amit Kumar', '+91 9876543212', '2025-06-01', 24, '2027-06-01', 'Active'),
('MWC-88888', 4, 'Rahul Sharma', '+91 9876543210', '2024-05-10', 12, '2025-05-10', 'Expired'),
('MWC-10001', 1, 'Vikram Sethi', '+91 9811122233', '2026-05-01', 12, '2027-05-01', 'Active'),
('MWC-20002', 3, 'Ananya Roy', '+91 9722233344', '2025-11-15', 24, '2027-11-15', 'Active'),
('MWC-30003', 6, 'Rajesh Gupta', '+91 9633344455', '2026-02-20', 12, '2027-02-20', 'Active'),
('MWC-40004', 2, 'Sunita Rao', '+91 9544455566', '2024-01-10', 12, '2025-01-10', 'Expired'),
('MWC-50005', 5, 'TechPark Infra Ltd', '+91 9455566677', '2023-08-01', 24, '2025-08-01', 'Expired');

-- --------------------------------------------------------
-- Table: warranties (Legacy Alias)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `warranties`;
CREATE TABLE `warranties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `serial_number` VARCHAR(100) NOT NULL UNIQUE,
  `product_id` INT NOT NULL,
  `customer_id` INT DEFAULT NULL,
  `purchase_date` DATE NOT NULL,
  `expiry_date` DATE NOT NULL,
  `status` ENUM('Active', 'Expiring Soon', 'Expired', 'Claimed') DEFAULT 'Active',
  `registration_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `warranties` (`serial_number`, `product_id`, `customer_id`, `purchase_date`, `expiry_date`, `status`) VALUES
('MWC-12345', 1, 1, '2025-03-15', '2026-03-15', 'Active'),
('MWC-67890', 2, 2, '2025-01-10', '2026-01-10', 'Active'),
('MWC-99999', 3, 3, '2024-06-01', '2026-06-01', 'Active'),
('MWC-88888', 4, 1, '2023-05-10', '2024-05-10', 'Expired');


-- --------------------------------------------------------
-- 4. Table: service_requests
-- --------------------------------------------------------
DROP TABLE IF EXISTS `service_requests`;
CREATE TABLE `service_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `request_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NOT NULL,
  `serial_number` VARCHAR(100),
  `service_type` ENUM('Installation', 'Maintenance', 'Filter Replacement', 'Repair', 'Inspection') NOT NULL,
  `issue_description` TEXT,
  `status` ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
  `scheduled_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Service Requests Data
INSERT INTO `service_requests` (`request_number`, `customer_id`, `serial_number`, `service_type`, `issue_description`, `status`, `scheduled_date`) VALUES
('SR-2026-001', 1, 'MWC-12345', 'Filter Replacement', 'Annual filter change request', 'Pending', '2026-08-30'),
('SR-2026-002', 2, 'MWC-67890', 'Maintenance', 'Routine checkup and water flow test', 'In Progress', '2026-08-26');

-- --------------------------------------------------------
-- 5. Table: contact_messages
-- --------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20),
  `subject` VARCHAR(150),
  `message` TEXT NOT NULL,
  `status` ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
