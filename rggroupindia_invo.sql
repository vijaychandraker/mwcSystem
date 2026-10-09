-- --------------------------------------------------------
-- Host:                         103.102.234.77
-- Database:                     rggroupindia_invo
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `rggroupindia_invo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `rggroupindia_invo`;

-- Dumping structure for table admin_users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `display_name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'OPERATOR',
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`user_id`, `username`, `display_name`, `email`, `mobile`, `password`, `role`, `status`, `created_at`) VALUES
	(1, 'admin', 'Super Administrator', 'admin@invoit.in', '9876543210', '123', 'SUB_USER', 1, '2026-09-05 02:48:54'),
	(2, 'rahul_user', 'Rahul Sharma', 'rahul@invoit.in', '9876500001', '123', 'SUB_USER', 1, '2026-09-05 02:48:54'),
	(3, 'amit_dist', 'Amit Verma (Distributor)', 'amit.technova@invoit.in', '9876500002', '123', 'DISTRIBUTOR', 1, '2026-09-05 02:48:54'),
	(4, 'priya_user', 'Priya Patel', 'priya@invoit.in', '9876500003', '123', 'SUB_USER', 1, '2026-09-05 02:48:54')
ON DUPLICATE KEY UPDATE `display_name`=VALUES(`display_name`), `email`=VALUES(`email`), `mobile`=VALUES(`mobile`), `password`=VALUES(`password`), `role`=VALUES(`role`), `status`=VALUES(`status`);

-- Dumping structure for table mst_category
CREATE TABLE IF NOT EXISTS `mst_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mst_category` (`category_id`, `category_name`) VALUES
	(1, 'Computer'),
	(2, 'Monitor'),
	(3, 'TV'),
	(4, 'Interactive Panel'),
	(5, 'LED Bulb'),
	(6, 'ALL IN ONE PC')
ON DUPLICATE KEY UPDATE `category_name`=VALUES(`category_name`);

-- Dumping structure for table mst_customer
CREATE TABLE IF NOT EXISTS `mst_customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(200) NOT NULL,
  `department` varchar(150) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mst_customer` (`customer_id`, `customer_name`, `department`, `contact_person`, `mobile`, `email`, `address`, `district`, `state`, `pincode`, `status`, `created_at`) VALUES
	(1, 'St. Xavier Higher Secondary School', 'IT & Smart Classroom Dept', 'Brother Joseph', '9810011223', 'admin@stxaviers.edu.in', '12 Convent Road', 'South Delhi', 'Delhi', '110003', 1, '2026-09-05 02:46:29'),
	(2, 'Apollo Healthcare Solutions', 'IT Infrastructure', 'Dr. Alok Mishra', '9820033441', 'alok.mishra@apollohealth.com', '78 Sector 14, CBD Belapur', 'Navi Mumbai', 'Maharashtra', '400614', 1, '2026-09-05 02:46:29'),
	(3, 'National Informatics Centre', 'E-Governance Project', 'Suresh Menon', '9844055667', 'suresh.menon@nic.in', 'Koramangala 4th Block', 'Bengaluru Urban', 'Karnataka', '560034', 1, '2026-09-05 02:46:29'),
	(4, 'Priya & Vikram Malhotra', 'Home Consumer', 'Vikram Malhotra', '9871144556', 'vikram.malhotra@gmail.com', '502 Green Valley Apartments', 'Gurugram', 'Haryana', '122001', 1, '2026-09-05 02:46:29'),
	(5, 'Zenith Infotech Corporate Office', 'Administration & HR', 'Meenakshi Sundaram', '9831166778', 'admin@zenithinfotech.com', '5th Floor, Salt Lake Sector 5', 'Kolkata', 'West Bengal', '700091', 1, '2026-09-05 02:46:29')
ON DUPLICATE KEY UPDATE `customer_name`=VALUES(`customer_name`), `mobile`=VALUES(`mobile`), `email`=VALUES(`email`);

-- Dumping structure for table mst_party
CREATE TABLE IF NOT EXISTS `mst_party` (
  `party_id` int(11) NOT NULL AUTO_INCREMENT,
  `party_type` enum('OEM','DISTRIBUTOR') NOT NULL,
  `party_name` varchar(150) NOT NULL,
  `gst_no` varchar(30) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `password` varchar(255) DEFAULT 'dist123',
  PRIMARY KEY (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mst_party` (`party_id`, `party_type`, `party_name`, `gst_no`, `contact_person`, `mobile`, `email`, `address`, `district`, `state`, `pincode`, `status`, `created_at`, `password`) VALUES
	(1, 'OEM', 'INVO IT Industries Pvt. Ltd.', '07AAAAA0000A1Z5', 'Rajesh Gupta', '9876543210', 'info@invoit.in', 'Plot 42, Tech Park, Okhla Phase 3', 'South East Delhi', 'Delhi', '110020', 1, '2026-09-05 02:46:29', 'admin'),
	(2, 'DISTRIBUTOR', 'In-vo it industry pvt. Ltd.', '22AABCI1234F1Z8', 'Sandeep Tiwari', '9827112233', 'sales@invoit-cg.com', 'Trade Center, Link Road', 'BILASPUR', 'Chhattisgarh', '495001', 1, '2026-09-05 02:46:29', 'dist123'),
	(3, 'DISTRIBUTOR', 'R. P. ENTERPRISES', '22RPENT5678G1Z1', 'Ramesh Patel', '9425234567', 'rpenterprises@gmail.com', 'Gol Bazar', 'BILASPUR', 'Chhattisgarh', '495001', 1, '2026-09-05 02:46:29', 'dist123'),
	(4, 'DISTRIBUTOR', 'M. R. ENTERPRISES', '22MRENT9012H1Z3', 'Manish Rawat', '9826198765', 'mrenterprises.bsp@gmail.com', 'Vyapar Vihar', 'BILASPUR', 'Chhattisgarh', '495004', 1, '2026-09-05 02:46:29', 'dist123'),
	(5, 'DISTRIBUTOR', 'Gunjan Industry', '22GUNJN3456J1Z5', 'Gunjan Sharma', '9752109876', 'gunjan.industry@outlook.com', 'Industrial Estate, Sirgitti', 'BILASPUR', 'Chhattisgarh', '495004', 1, '2026-09-05 02:46:29', 'dist123'),
	(6, 'DISTRIBUTOR', 'star enterprises', '22STARE7890K1Z7', 'Sunil Agrawal', '9981234567', 'starenterprises.bsp@gmail.com', 'Telipara Main Road', 'BILASPUR', 'Chhattisgarh', '495001', 1, '2026-09-05 02:48:54', 'dist123'),
	(7, 'DISTRIBUTOR', 'TechNova Solutions Pvt Ltd', '07BBBBA1111B1Z2', 'Amit Verma', '9811122233', 'sales@technova.com', '102 Nehru Place Main Market', 'South Delhi', 'Delhi', '110019', 1, '2026-09-05 02:48:54', 'dist123')
ON DUPLICATE KEY UPDATE `party_name`=VALUES(`party_name`), `gst_no`=VALUES(`gst_no`), `mobile`=VALUES(`mobile`), `email`=VALUES(`email`), `password`=VALUES(`password`);

-- Dumping structure for table mst_product_model
CREATE TABLE IF NOT EXISTS `mst_product_model` (
  `model_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model_no` varchar(100) NOT NULL,
  `product_name` varchar(150) DEFAULT NULL,
  `warranty_month` int(11) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`model_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fk_model_category` FOREIGN KEY (`category_id`) REFERENCES `mst_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mst_product_model` (`model_id`, `category_id`, `brand`, `model_no`, `product_name`, `warranty_month`, `status`) VALUES
	(1, 1, 'INVO', 'INVO-DP500', 'INVO DeskPro i5 PC', 24, 1),
	(2, 1, 'INVO', 'INVO-WS700', 'INVO Workstation i7 Desktop', 36, 1),
	(3, 2, 'INVO', 'INVO-MON24', 'INVO Vue 24" IPS FHD Monitor', 12, 1),
	(4, 2, 'INVO', 'INVO-MON27', 'INVO Vue 27" Curved Gaming Monitor', 24, 1),
	(5, 3, 'INVO', 'INVO-TV43', 'INVO Smart Vision 43" 4K Smart TV', 24, 1),
	(6, 3, 'INVO', 'INVO-TV55', 'INVO Ultra 55" QLED 4K TV', 36, 1),
	(7, 4, 'INVO', 'INVO-IFP65', 'INVO Board 65" 4K Interactive Flat Panel', 36, 1),
	(8, 4, 'INVO', 'INVO-IFP75', 'INVO Board 75" Premium Touch IFP', 36, 1),
	(9, 5, 'INVO', 'INVO-B09W', 'INVO EcoBulb 9W Cool Daylight LED', 12, 1),
	(10, 5, 'INVO', 'INVO-B15W', 'INVO BrightMax 15W High Watt Bulb', 12, 1)
ON DUPLICATE KEY UPDATE `model_no`=VALUES(`model_no`), `product_name`=VALUES(`product_name`), `warranty_month`=VALUES(`warranty_month`);

-- Dumping structure for table trn_stock_transfer
CREATE TABLE IF NOT EXISTS `trn_stock_transfer` (
  `transfer_id` int(11) NOT NULL AUTO_INCREMENT,
  `transfer_no` varchar(30) DEFAULT NULL,
  `from_party_id` int(11) NOT NULL,
  `to_party_id` int(11) NOT NULL,
  `model_id` int(11) NOT NULL,
  `serial_no` varchar(100) NOT NULL,
  `dispatch_date` date NOT NULL,
  `sale_valid_till` date NOT NULL,
  `stock_status` enum('IN_STOCK','SOLD','EXPIRED','EXTENDED') DEFAULT 'IN_STOCK',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`transfer_id`),
  UNIQUE KEY `serial_no` (`serial_no`),
  UNIQUE KEY `transfer_no` (`transfer_no`),
  KEY `from_party_id` (`from_party_id`),
  KEY `to_party_id` (`to_party_id`),
  KEY `model_id` (`model_id`),
  CONSTRAINT `fk_trf_from` FOREIGN KEY (`from_party_id`) REFERENCES `mst_party` (`party_id`),
  CONSTRAINT `fk_trf_to` FOREIGN KEY (`to_party_id`) REFERENCES `mst_party` (`party_id`),
  CONSTRAINT `fk_trf_model` FOREIGN KEY (`model_id`) REFERENCES `mst_product_model` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_stock_transfer` (`transfer_id`, `transfer_no`, `from_party_id`, `to_party_id`, `model_id`, `serial_no`, `dispatch_date`, `sale_valid_till`, `stock_status`, `remarks`, `created_at`) VALUES
	(1, 'ST-2026-001', 1, 2, 1, 'INVO-DP500-2026001', '2026-01-10', '2026-07-10', 'SOLD', 'Dispatched 5 units to TechNova Delhi', '2026-09-05 02:46:29'),
	(2, 'ST-2026-002', 1, 2, 3, 'INVO-MON24-2026002', '2026-01-10', '2026-07-10', 'SOLD', 'Dispatched with PC batch', '2026-09-05 02:46:29'),
	(3, 'ST-2026-003', 1, 3, 7, 'INVO-IFP65-2026003', '2026-02-01', '2026-08-01', 'SOLD', 'Smart classroom panel for Mumbai distributor', '2026-09-05 02:46:29'),
	(4, 'ST-2026-004', 1, 3, 5, 'INVO-TV43-2026004', '2026-02-15', '2026-08-15', 'SOLD', 'Dispatched 10 Smart TVs to MicroNet', '2026-09-05 02:46:29'),
	(5, 'ST-2026-005', 1, 4, 2, 'INVO-WS700-2026005', '2026-03-01', '2026-09-01', 'SOLD', 'High-end workstation for Bengaluru market', '2026-09-05 02:46:29'),
	(6, 'ST-2026-006', 1, 4, 8, 'INVO-IFP75-2026006', '2026-03-10', '2026-09-10', 'EXTENDED', '75-inch IFP transferred to CyberVision', '2026-09-05 02:46:29'),
	(7, 'ST-2026-007', 1, 5, 9, 'INVO-B09W-2026007', '2026-04-01', '2026-10-01', 'SOLD', 'Bulk LED bulb transfer to Kolkata distributor', '2026-09-05 02:46:29'),
	(8, 'ST-2026-008', 1, 2, 4, 'INVO-MON27-2026008', '2026-04-15', '2026-10-15', 'IN_STOCK', '27 inch curved monitor in distributor stock', '2026-09-05 02:46:29'),
	(9, 'ST-2026-009', 1, 3, 6, 'INVO-TV55-2026009', '2026-05-01', '2026-11-01', 'IN_STOCK', '55 inch QLED TV stock at MicroNet', '2026-09-05 02:46:29'),
	(10, 'ST-2026-010', 1, 5, 10, 'INVO-B15W-2026010', '2026-05-20', '2026-11-20', 'IN_STOCK', '15W LED Bulbs in stock at Apex Digital', '2026-09-05 02:46:29'),
	(12, 'TRF-78371', 1, 2, 1, 'IN0000000126', '2026-09-05', '2027-03-05', 'SOLD', NULL, '2026-09-05 03:14:04'),
	(13, 'TRF-14616', 1, 1, 1, 'IN0000000129', '2026-09-05', '2027-03-05', 'SOLD', NULL, '2026-09-05 03:21:00')
ON DUPLICATE KEY UPDATE `stock_status`=VALUES(`stock_status`), `sale_valid_till`=VALUES(`sale_valid_till`);

-- Dumping structure for table trn_extension_request
CREATE TABLE IF NOT EXISTS `trn_extension_request` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `transfer_id` int(11) NOT NULL,
  `request_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`request_id`),
  KEY `transfer_id` (`transfer_id`),
  CONSTRAINT `fk_ext_req_trf` FOREIGN KEY (`transfer_id`) REFERENCES `trn_stock_transfer` (`transfer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_extension_request` (`request_id`, `transfer_id`, `request_date`, `reason`, `status`, `created_at`) VALUES
	(1, 6, '2026-08-25', 'Institution client purchase order delayed due to approval cycle. Need 60 days extension.', 'APPROVED', '2026-09-05 02:46:29'),
	(2, 8, '2026-08-30', 'Slow festive season movement, requesting 30 days stock extension.', 'PENDING', '2026-09-05 02:46:29')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);

-- Dumping structure for table trn_extension_approval
CREATE TABLE IF NOT EXISTS `trn_extension_approval` (
  `approval_id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NOT NULL,
  `approved_by` int(11) NOT NULL,
  `extend_days` int(11) NOT NULL,
  `old_valid_till` date DEFAULT NULL,
  `new_valid_till` date DEFAULT NULL,
  `approval_date` date DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  PRIMARY KEY (`approval_id`),
  KEY `request_id` (`request_id`),
  KEY `approved_by` (`approved_by`),
  CONSTRAINT `fk_ext_appr_req` FOREIGN KEY (`request_id`) REFERENCES `trn_extension_request` (`request_id`),
  CONSTRAINT `fk_ext_appr_party` FOREIGN KEY (`approved_by`) REFERENCES `mst_party` (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_extension_approval` (`approval_id`, `request_id`, `approved_by`, `extend_days`, `old_valid_till`, `new_valid_till`, `approval_date`, `remarks`) VALUES
	(1, 1, 1, 60, '2026-09-10', '2026-11-09', '2026-08-27', 'Approved by OEM Sales Head for institutional deal clearance.')
ON DUPLICATE KEY UPDATE `extend_days`=VALUES(`extend_days`), `new_valid_till`=VALUES(`new_valid_till`);

-- Dumping structure for table trn_invoice
CREATE TABLE IF NOT EXISTS `trn_invoice` (
  `invoice_id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(50) NOT NULL,
  `seller_party_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `sale_type` enum('DIRECT','DISTRIBUTOR') NOT NULL,
  `invoice_date` date NOT NULL,
  `total_qty` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `invoice_no` (`invoice_no`),
  KEY `seller_party_id` (`seller_party_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `fk_inv_party` FOREIGN KEY (`seller_party_id`) REFERENCES `mst_party` (`party_id`),
  CONSTRAINT `fk_inv_cust` FOREIGN KEY (`customer_id`) REFERENCES `mst_customer` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_invoice` (`invoice_id`, `invoice_no`, `seller_party_id`, `customer_id`, `sale_type`, `invoice_date`, `total_qty`, `created_at`) VALUES
	(1, 'INV-2026-101', 2, 1, 'DISTRIBUTOR', '2026-02-15', 2, '2026-09-05 02:46:29'),
	(2, 'INV-2026-102', 3, 2, 'DISTRIBUTOR', '2026-03-01', 2, '2026-09-05 02:46:29'),
	(3, 'INV-2026-103', 4, 3, 'DISTRIBUTOR', '2026-03-25', 1, '2026-09-05 02:46:29'),
	(4, 'INV-2026-104', 1, 4, 'DIRECT', '2026-04-10', 1, '2026-09-05 02:46:29'),
	(5, 'INV-2026-105', 5, 5, 'DISTRIBUTOR', '2026-04-20', 1, '2026-09-05 02:46:29'),
	(6, 'INV0000-1203', 2, 1, 'DISTRIBUTOR', '2026-09-05', 1, '2026-09-05 03:15:08'),
	(7, 'OEM-INV-2026-9901', 1, 1, 'DIRECT', '2026-09-05', 1, '2026-09-05 04:23:08'),
	(8, 'INV00001234', 1, 1, 'DIRECT', '2026-09-05', 1, '2026-09-05 04:50:23')
ON DUPLICATE KEY UPDATE `total_qty`=VALUES(`total_qty`);

-- Dumping structure for table trn_invoice_item
CREATE TABLE IF NOT EXISTS `trn_invoice_item` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_id` int(11) NOT NULL,
  `transfer_id` int(11) DEFAULT NULL,
  `model_id` int(11) NOT NULL,
  `serial_no` varchar(100) NOT NULL,
  `warranty_start` date NOT NULL,
  `warranty_end` date NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `serial_no` (`serial_no`),
  KEY `invoice_id` (`invoice_id`),
  KEY `transfer_id` (`transfer_id`),
  KEY `model_id` (`model_id`),
  CONSTRAINT `fk_item_inv` FOREIGN KEY (`invoice_id`) REFERENCES `trn_invoice` (`invoice_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_trf` FOREIGN KEY (`transfer_id`) REFERENCES `trn_stock_transfer` (`transfer_id`),
  CONSTRAINT `fk_item_model` FOREIGN KEY (`model_id`) REFERENCES `mst_product_model` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_invoice_item` (`item_id`, `invoice_id`, `transfer_id`, `model_id`, `serial_no`, `warranty_start`, `warranty_end`) VALUES
	(1, 1, 1, 1, 'INVO-DP500-2026001', '2026-02-15', '2028-02-15'),
	(2, 1, 2, 3, 'INVO-MON24-2026002', '2026-02-15', '2027-02-15'),
	(3, 2, 3, 7, 'INVO-IFP65-2026003', '2026-03-01', '2029-03-01'),
	(4, 2, 4, 5, 'INVO-TV43-2026004', '2026-03-01', '2028-03-01'),
	(5, 3, 5, 2, 'INVO-WS700-2026005', '2026-03-25', '2029-03-25'),
	(6, 4, NULL, 5, 'INVO-TV43-DIR-9901', '2026-04-10', '2028-04-10'),
	(7, 5, 7, 9, 'INVO-B09W-2026007', '2026-04-20', '2027-04-20'),
	(8, 6, NULL, 1, 'IN0000000126', '2026-09-05', '2028-09-05'),
	(9, 7, NULL, 1, 'IN0000000129', '2026-09-05', '2028-09-05'),
	(10, 8, NULL, 1, '2536521452', '2026-09-05', '2027-09-05')
ON DUPLICATE KEY UPDATE `warranty_start`=VALUES(`warranty_start`), `warranty_end`=VALUES(`warranty_end`);

-- Dumping structure for table trn_computer_spec
CREATE TABLE IF NOT EXISTS `trn_computer_spec` (
  `item_id` int(11) NOT NULL,
  `processor` varchar(100) DEFAULT NULL,
  `processor_sn` varchar(100) DEFAULT NULL,
  `motherboard_sn` varchar(100) DEFAULT NULL,
  `ram_size` varchar(20) DEFAULT NULL,
  `ram_sn` varchar(100) DEFAULT NULL,
  `ssd_size` varchar(20) DEFAULT NULL,
  `ssd_sn` varchar(100) DEFAULT NULL,
  `cabinet_sn` varchar(100) DEFAULT NULL,
  `monitor_sn` varchar(100) DEFAULT NULL,
  `keyboard_sn` varchar(100) DEFAULT NULL,
  `mouse_sn` varchar(100) DEFAULT NULL,
  `graphic_card_sn` varchar(100) DEFAULT NULL,
  `cabinet_warr` int(11) DEFAULT 12,
  `motherboard_warr` int(11) DEFAULT 36,
  `ram_warr` int(11) DEFAULT 36,
  `ssd_warr` int(11) DEFAULT 36,
  `processor_warr` int(11) DEFAULT 36,
  `monitor_warr` int(11) DEFAULT 36,
  `mouse_warr` int(11) DEFAULT 12,
  `keyboard_warr` int(11) DEFAULT 12,
  `graphic_card_warr` int(11) DEFAULT 36,
  PRIMARY KEY (`item_id`),
  CONSTRAINT `fk_comp_item` FOREIGN KEY (`item_id`) REFERENCES `trn_invoice_item` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_computer_spec` (`item_id`, `processor`, `processor_sn`, `motherboard_sn`, `ram_size`, `ram_sn`, `ssd_size`, `ssd_sn`, `cabinet_sn`, `monitor_sn`, `keyboard_sn`, `mouse_sn`, `graphic_card_sn`, `cabinet_warr`, `motherboard_warr`, `ram_warr`, `ssd_warr`, `processor_warr`, `monitor_warr`, `mouse_warr`, `keyboard_warr`, `graphic_card_warr`) VALUES
	(1, 'Intel Core i5-13400', 'CPU-INT13400-8841', 'MB-ASUS-B760-9921', '16GB DDR4', 'RAM-CRUCIAL-16G-1102', '512GB NVMe SSD', 'SSD-SAMSUNG-512G-4401', 'CAB-INVO-TOWER-001', 'MON-INVO-24-9921', 'KB-INVO-KM100-A', 'MS-INVO-KM100-B', NULL, 12, 36, 36, 36, 36, 36, 12, 12, 36),
	(5, 'Intel Core i7-13700K', 'CPU-INT13700K-9902', 'MB-MSI-Z790-7712', '32GB DDR5', 'RAM-CORSAIR-32G-8812', '1TB NVMe Gen4 SSD', 'SSD-WD-1TB-7721', 'CAB-INVO-PRO-002', 'MON-INVO-27-8812', 'KB-INVO-MECH-002', 'MS-INVO-GAMING-002', NULL, 12, 36, 36, 36, 36, 36, 12, 12, 36)
ON DUPLICATE KEY UPDATE `processor`=VALUES(`processor`), `motherboard_sn`=VALUES(`motherboard_sn`);

-- Dumping structure for table trn_monitor_spec
CREATE TABLE IF NOT EXISTS `trn_monitor_spec` (
  `item_id` int(11) NOT NULL,
  `screen_size` varchar(30) DEFAULT NULL,
  `panel_type` varchar(30) DEFAULT NULL,
  `monitor_sn` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  CONSTRAINT `fk_mon_item` FOREIGN KEY (`item_id`) REFERENCES `trn_invoice_item` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_monitor_spec` (`item_id`, `screen_size`, `panel_type`, `monitor_sn`) VALUES
	(2, '24 Inch (60.9 cm)', 'IPS Full HD', 'INVO-MON24-2026002')
ON DUPLICATE KEY UPDATE `screen_size`=VALUES(`screen_size`), `panel_type`=VALUES(`panel_type`);

-- Dumping structure for table trn_tv_spec
CREATE TABLE IF NOT EXISTS `trn_tv_spec` (
  `item_id` int(11) NOT NULL,
  `screen_size` varchar(30) DEFAULT NULL,
  `motherboard_sn` varchar(100) DEFAULT NULL,
  `panel_sn` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  CONSTRAINT `fk_tv_item` FOREIGN KEY (`item_id`) REFERENCES `trn_invoice_item` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_tv_spec` (`item_id`, `screen_size`, `motherboard_sn`, `panel_sn`) VALUES
	(4, '43 Inch (108 cm)', 'MB-TV43-SMART-3321', 'PNL-LG-43FHD-8891'),
	(6, '43 Inch (108 cm)', 'MB-TV43-SMART-9901', 'PNL-BOE-434K-1120')
ON DUPLICATE KEY UPDATE `screen_size`=VALUES(`screen_size`), `motherboard_sn`=VALUES(`motherboard_sn`);

-- Dumping structure for table trn_panel_spec
CREATE TABLE IF NOT EXISTS `trn_panel_spec` (
  `item_id` int(11) NOT NULL,
  `ram` varchar(20) DEFAULT NULL,
  `rom` varchar(20) DEFAULT NULL,
  `ops_serial` varchar(100) DEFAULT NULL,
  `ops_ram` varchar(20) DEFAULT NULL,
  `ops_rom` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  CONSTRAINT `fk_panel_item` FOREIGN KEY (`item_id`) REFERENCES `trn_invoice_item` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_panel_spec` (`item_id`, `ram`, `rom`, `ops_serial`, `ops_ram`, `ops_rom`) VALUES
	(3, '8GB DDR4', '128GB eMMC', 'OPS-INVO-i5-77881', '16GB', '256GB SSD')
ON DUPLICATE KEY UPDATE `ram`=VALUES(`ram`), `rom`=VALUES(`rom`);

-- Dumping structure for table trn_bulb_spec
CREATE TABLE IF NOT EXISTS `trn_bulb_spec` (
  `item_id` int(11) NOT NULL,
  `watt` varchar(20) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  CONSTRAINT `fk_bulb_item` FOREIGN KEY (`item_id`) REFERENCES `trn_invoice_item` (`item_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_bulb_spec` (`item_id`, `watt`, `color`) VALUES
	(7, '9W', 'Cool Daylight (6500K)')
ON DUPLICATE KEY UPDATE `watt`=VALUES(`watt`), `color`=VALUES(`color`);

-- Dumping structure for table trn_inventory_unit
CREATE TABLE IF NOT EXISTS `trn_inventory_unit` (
  `unit_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `model_no` varchar(100) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `serial_no` varchar(100) NOT NULL,
  `warranty_months` int(11) DEFAULT 36,
  `specs` longtext DEFAULT NULL,
  `status` enum('IN_STOCK','SOLD') DEFAULT 'IN_STOCK',
  `assigned_party_id` int(11) NOT NULL,
  `dispatch_date` date NOT NULL,
  `sale_info` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`unit_id`),
  UNIQUE KEY `serial_no` (`serial_no`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `trn_inventory_unit` (`unit_id`, `category_id`, `model_no`, `product_name`, `serial_no`, `warranty_months`, `specs`, `status`, `assigned_party_id`, `dispatch_date`, `sale_info`, `created_at`) VALUES
	(1, 1, 'IN22-0125DS', 'INVO Entry Level Desktop i3 12th Gen', 'IN22135001', 36, '{"cabinet_sn":"CX90917212","cabinet_warr":12,"motherboard_sn":"H61M1112C09S4874","motherboard_warr":36,"ram_sn":"12050063","ram_size":"16 GB","ram_warr":36,"ssd_sn":"12050043","ssd_size":"512 GB","ssd_warr":36,"processor":"i3 12th gen","processor_sn":"U6692PF301300","processor_warr":36,"monitor_sn":"910072508000BC","monitor_warr":36,"mouse_sn":"500001","mouse_warr":12,"keyboard_sn":"250001","keyboard_warr":12,"graphic_card_sn":"ZAK11PV01704","graphic_card_warr":36}', 'SOLD', 6, '2026-10-01', '{"invoice_no":"INV-CG-012501","invoice_date":"2026-11-06","customer_name":"C TRIBLE DIPARTMEN","zila":"BILASPUR","seller_party_id":6,"seller_party_name":"In-vo it industry pvt. Ltd.","sale_type":"DISTRIBUTOR","warranty_start":"2026-11-06","warranty_end":"2029-11-06"}', '2026-09-04 16:30:03'),
	(2, 1, 'IN22-0125DS', 'INVO Entry Level Desktop i3 12th Gen', 'IN22135002', 36, '{"cabinet_sn":"CX90918108","cabinet_warr":12,"motherboard_sn":"H61M1112C09S4894","motherboard_warr":36,"ram_sn":"12050062","ram_size":"16 GB","ram_warr":36,"ssd_sn":"12050028","ssd_size":"512 GB","ssd_warr":36,"processor":"i3 12th gen","processor_sn":"U6692PF301274","processor_warr":36,"monitor_sn":"9100725100014A","monitor_warr":36,"mouse_sn":"500002","mouse_warr":12,"keyboard_sn":"250002","keyboard_warr":12,"graphic_card_sn":"ZAK11PV01705","graphic_card_warr":36}', 'IN_STOCK', 6, '2026-10-01', NULL, '2026-09-04 16:30:03'),
	(4, 1, 'IN22-0125DS', 'INVO Entry Level Desktop i3 12th Gen', 'INVO-DB-777', 36, '{"cabinet_sn":"","cabinet_warr":12,"motherboard_sn":"MB-777","motherboard_warr":36,"ram_sn":"RAM-777","ram_size":"16 GB","ram_warr":36,"ssd_sn":"","ssd_size":"512 GB","ssd_warr":36,"processor":"i3 12th gen","processor_sn":"CPU-777","processor_warr":36,"monitor_sn":"","monitor_warr":36,"mouse_sn":"","mouse_warr":12,"keyboard_sn":"","keyboard_warr":12,"graphic_card_sn":"","graphic_card_warr":36}', 'IN_STOCK', 2, '2026-09-04', NULL, '2026-09-04 16:38:05'),
	(5, 3, 'INV-32LED', 'INVO 32" HD Ready Smart LED TV', 'IN0000000123', 24, '{"screen_size":"32\\"","motherboard_sn":"EDT1234567"}', 'IN_STOCK', 6, '2026-09-05', NULL, '2026-09-05 02:43:09'),
	(7, 3, 'INV-32LED', 'INVO 32" HD Ready Smart LED TV', 'IN0000000126', 24, '{"screen_size":"32\\"","motherboard_sn":"EBT0000123"}', 'SOLD', 2, '2026-09-05', '{"invoice_no":"INV0000-1203","invoice_date":"2026-09-05","customer_name":"AC TRIBLE DIPARTMENT","zila":"BILASPUR","seller_party_id":2,"seller_party_name":"In-vo it industry pvt. Ltd.","sale_type":"DISTRIBUTOR","warranty_start":"2026-09-05","warranty_end":"2028-09-05"}', '2026-09-05 03:14:04'),
	(8, 3, 'INV-32LED', 'INVO 32" HD Ready Smart LED TV', 'IN0000000129', 24, '{"screen_size":"32\\"","motherboard_sn":"EBT0000129"}', 'SOLD', 1, '2026-09-05', '{"invoice_no":"OEM-INV-2026-9901","invoice_date":"2026-09-05","customer_name":"AC TRIBLE DIPARTMENT","zila":"BILASPUR","seller_party_id":1,"seller_party_name":"INVO IT Industries Pvt. Ltd.","sale_type":"DIRECT","warranty_start":"2026-09-05","warranty_end":"2028-09-05"}', '2026-09-05 03:21:00'),
	(9, 5, 'INB09WW', 'INVO 60W Heavy Duty LED Bulb', '2536521452', 12, '{"watt":"60W","color":"Cool Daylight 6500K"}', 'SOLD', 1, '2026-09-05', '{"invoice_no":"INV00001234","invoice_date":"2026-09-05","customer_name":"AC TRIBLE DIPARTMENT","zila":"BILASPUR","seller_party_id":1,"seller_party_name":"INVO IT Industries Pvt. Ltd.","sale_type":"DIRECT","warranty_start":"2026-09-05","warranty_end":"2027-09-05"}', '2026-09-05 04:50:23')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`), `sale_info`=VALUES(`sale_info`), `specs`=VALUES(`specs`);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
