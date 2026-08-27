const express = require('express');
const router = express.Router();
const db = require('./db');

// Mock in-memory database fallback when MariaDB is not connected
const MOCK_WARRANTY_DB = {
  'MASTO-240815-000123': {
    serialNo: 'MASTO-240815-000123',
    productName: 'Masto Water Cooler',
    category: 'Commercial Water Cooler',
    customerName: 'Rahul Sharma',
    customerMobile: '+91 9876543210',
    installationDate: '2026-08-15',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2027-08-14',
    status: 'Active'
  },
  'MWC-12345': {
    serialNo: 'MWC-12345',
    productName: 'MWC AquaPure 500',
    category: 'RO Water Purifier',
    customerName: 'Rahul Sharma',
    customerMobile: '+91 9876543210',
    installationDate: '2026-03-15',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2027-03-15',
    status: 'Active'
  },
  'MWC-67890': {
    serialNo: 'MWC-67890',
    productName: 'MWC CrystalClear 300',
    category: 'UV Water Purifier',
    customerName: 'Priya Patel',
    customerMobile: '+91 9876543211',
    installationDate: '2026-01-10',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2027-01-10',
    status: 'Active'
  },
  'MWC-99999': {
    serialNo: 'MWC-99999',
    productName: 'MWC ProClean 700',
    category: 'RO+UV+UF Purifier',
    customerName: 'Amit Kumar',
    customerMobile: '+91 9876543212',
    installationDate: '2025-06-01',
    warrantyPeriodMonths: 24,
    warrantyEndDate: '2027-06-01',
    status: 'Active'
  },
  'MWC-88888': {
    serialNo: 'MWC-88888',
    productName: 'MWC SmartFlow 200',
    category: 'Gravity Water Purifier',
    customerName: 'Rahul Sharma',
    customerMobile: '+91 9876543210',
    installationDate: '2024-05-10',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2025-05-10',
    status: 'Expired'
  },
  'MWC-10001': {
    serialNo: 'MWC-10001',
    productName: 'MWC AquaPure 500',
    category: 'RO Water Purifier',
    customerName: 'Vikram Sethi',
    customerMobile: '+91 9811122233',
    installationDate: '2026-05-01',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2027-05-01',
    status: 'Active'
  },
  'MWC-20002': {
    serialNo: 'MWC-20002',
    productName: 'MWC ProClean 700',
    category: 'RO+UV+UF Purifier',
    customerName: 'Ananya Roy',
    customerMobile: '+91 9722233344',
    installationDate: '2025-11-15',
    warrantyPeriodMonths: 24,
    warrantyEndDate: '2027-11-15',
    status: 'Active'
  },
  'MWC-30003': {
    serialNo: 'MWC-30003',
    productName: 'MWC TankGuard',
    category: 'Water Tank Cleaner',
    customerName: 'Rajesh Gupta',
    customerMobile: '+91 9633344455',
    installationDate: '2026-02-20',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2027-02-20',
    status: 'Active'
  },
  'MWC-40004': {
    serialNo: 'MWC-40004',
    productName: 'MWC CrystalClear 300',
    category: 'UV Water Purifier',
    customerName: 'Sunita Rao',
    customerMobile: '+91 9544455566',
    installationDate: '2024-01-10',
    warrantyPeriodMonths: 12,
    warrantyEndDate: '2025-01-10',
    status: 'Expired'
  },
  'MWC-50005': {
    serialNo: 'MWC-50005',
    productName: 'MWC Industrial Pro',
    category: 'Commercial Purifier',
    customerName: 'TechPark Infra Ltd',
    customerMobile: '+91 9455566677',
    installationDate: '2023-08-01',
    warrantyPeriodMonths: 24,
    warrantyEndDate: '2025-08-01',
    status: 'Expired'
  }
};

// 1. GET Warranty Details by Serial Number
router.get('/warranty/:serialNumber', async (req, res) => {
  const targetSerial = (req.params.serialNumber || '').trim().toUpperCase();
  let conn;

  try {
    conn = await db.getConnection();
    const rows = await conn.query(
      `SELECT w.serial_no, w.customer_name, w.customer_mobile, w.installation_date,
              w.warranty_period_months, w.warranty_end_date, w.status,
              p.name as product_name, p.category
       FROM warranty_records w
       JOIN products p ON w.product_id = p.id
       WHERE w.serial_no = ?`,
      [targetSerial]
    );

    if (rows.length > 0) {
      const item = rows[0];
      const expiry = new Date(item.warranty_end_date);
      const today = new Date();
      const daysRemaining = Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));
      const isExpired = daysRemaining <= 0 || item.status === 'Expired';

      return res.json({
        found: true,
        serialNo: item.serial_no,
        productName: item.product_name,
        category: item.category,
        customerName: item.customer_name,
        customerMobile: item.customer_mobile,
        installationDate: new Date(item.installation_date).toISOString().split('T')[0],
        warrantyPeriodMonths: item.warranty_period_months,
        warrantyEndDate: new Date(item.warranty_end_date).toISOString().split('T')[0],
        status: isExpired ? 'Expired' : 'Active',
        daysRemaining: isExpired ? 0 : daysRemaining
      });
    }
  } catch (err) {
    console.warn('⚠️ MariaDB lookup warning (falling back to memory DB):', err.message);
  } finally {
    if (conn) conn.release();
  }

  // Memory fallback matching database structure diagram
  if (MOCK_WARRANTY_DB[targetSerial]) {
    const item = MOCK_WARRANTY_DB[targetSerial];
    const expiry = new Date(item.warrantyEndDate);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));
    const isExpired = daysRemaining <= 0 || item.status === 'Expired';

    return res.json({
      found: true,
      ...item,
      status: isExpired ? 'Expired' : 'Active',
      daysRemaining: isExpired ? 0 : daysRemaining
    });
  }

  return res.status(404).json({
    found: false,
    message: 'No warranty record found for this serial number. Please verify and try again.'
  });
});

// 2. GET All Products
const MOCK_PRODUCTS_LIST = [
  { id: 1, product_code: 'MWC-AP500', name: 'MWC AquaPure 500', category: 'RO Water Purifier', price: 12999, warranty_period_months: 12, description: '7-Stage Purification with TDS Controller and 8L Storage', status: 'active' },
  { id: 2, product_code: 'MWC-CC300', name: 'MWC CrystalClear 300', category: 'UV Water Purifier', price: 8499, warranty_period_months: 12, description: 'UV+UF Technology with Auto-Shut Off and 6L Storage', status: 'active' },
  { id: 3, product_code: 'MWC-PC700', name: 'MWC ProClean 700', category: 'RO+UV+UF Purifier', price: 18999, warranty_period_months: 24, description: '9-Stage Purification with Mineral Cartridge and 10L Storage', status: 'active' },
  { id: 4, product_code: 'MWC-SF200', name: 'MWC SmartFlow 200', category: 'Gravity Water Purifier', price: 3999, warranty_period_months: 12, description: 'Non-Electric Sediment Filter with 16L Storage', status: 'active' },
  { id: 5, product_code: 'MWC-INDPRO', name: 'MWC Industrial Pro', category: 'Commercial Purifier', price: 49999, warranty_period_months: 24, description: 'Industrial Grade High Capacity 50L/hr Output', status: 'active' },
  { id: 6, product_code: 'MWC-TG100', name: 'MWC TankGuard', category: 'Water Tank Cleaner', price: 6999, warranty_period_months: 12, description: 'Auto Cleaning UV Sterilization with Smart Timer', status: 'active' }
];

router.get('/products', async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const rows = await conn.query('SELECT * FROM products WHERE status = "active"');
    if (rows && rows.length > 0) {
      return res.json(rows);
    }
  } catch (err) {
    console.warn('⚠️ MariaDB products lookup warning (falling back to memory DB):', err.message);
  } finally {
    if (conn) conn.release();
  }

  res.json(MOCK_PRODUCTS_LIST);
});

module.exports = router;
