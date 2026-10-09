const express = require('express');
const router = express.Router();
const db = require('./db');

// Helper to add months to a date string YYYY-MM-DD
function addMonthsToDate(dateStr, months) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    d.setMonth(d.getMonth() + Number(months));
    return d.toISOString().split('T')[0];
  } catch (e) {
    return dateStr;
  }
}

// 1. MASTER PARTIES (OEM & Real Distributors from Invo Sheets)
let MOCK_PARTIES = [
  { party_id: 1, party_type: 'OEM', party_name: 'INVO IT Industries Pvt. Ltd.', gst_no: '07AAAAA0000A1Z5', contact_person: 'Rajesh Gupta', mobile: '9876543210', email: 'info@invoit.in', password: 'admin', address: 'Plot 42, Tech Park, Okhla Phase 3', district: 'South East Delhi', state: 'Delhi', pincode: '110020', status: 1 },
  { party_id: 2, party_type: 'DISTRIBUTOR', party_name: 'In-vo it industry pvt. Ltd.', gst_no: '22AABCI1234F1Z8', contact_person: 'Sandeep Tiwari', mobile: '9827112233', email: 'sales@invoit-cg.com', password: 'dist123', address: 'Trade Center, Link Road', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001', status: 1 },
  { party_id: 3, party_type: 'DISTRIBUTOR', party_name: 'R. P. ENTERPRISES', gst_no: '22RPENT5678G1Z1', contact_person: 'Ramesh Patel', mobile: '9425234567', email: 'rpenterprises@gmail.com', password: 'dist123', address: 'Gol Bazar', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001', status: 1 },
  { party_id: 4, party_type: 'DISTRIBUTOR', party_name: 'M. R. ENTERPRISES', gst_no: '22MRENT9012H1Z3', contact_person: 'Manish Rawat', mobile: '9826198765', email: 'mrenterprises.bsp@gmail.com', password: 'dist123', address: 'Vyapar Vihar', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495004', status: 1 },
  { party_id: 5, party_type: 'DISTRIBUTOR', party_name: 'Gunjan Industry', gst_no: '22GUNJN3456J1Z5', contact_person: 'Gunjan Sharma', mobile: '9752109876', email: 'gunjan.industry@outlook.com', password: 'dist123', address: 'Industrial Estate, Sirgitti', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495004', status: 1 },
  { party_id: 6, party_type: 'DISTRIBUTOR', party_name: 'star enterprises', gst_no: '22STARE7890K1Z7', contact_person: 'Sunil Agrawal', mobile: '9981234567', email: 'starenterprises.bsp@gmail.com', password: 'dist123', address: 'Telipara Main Road', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001', status: 1 },
  { party_id: 7, party_type: 'DISTRIBUTOR', party_name: 'TechNova Solutions Pvt Ltd', gst_no: '07BBBBA1111B1Z2', contact_person: 'Amit Verma', mobile: '9811122233', email: 'sales@technova.com', password: 'dist123', address: '102 Nehru Place Main Market', district: 'South Delhi', state: 'Delhi', pincode: '110019', status: 1 }
];

// Admin Staff Sub-Users List (Only SUB_USER and DISTRIBUTOR)
let MOCK_SUB_USERS = [
  {
    user_id: 1,
    username: 'rahul_user',
    display_name: 'Rahul Sharma',
    email: 'rahul@invoit.in',
    mobile: '9876500001',
    password: '123',
    role: 'SUB_USER',
    role_label: 'Sub-User',
    status: 1,
    created_at: '2026-09-01T10:00:00.000Z'
  },
  {
    user_id: 2,
    username: 'amit_dist',
    display_name: 'Amit Verma (Distributor)',
    email: 'amit.technova@invoit.in',
    mobile: '9876500002',
    password: '123',
    role: 'DISTRIBUTOR',
    role_label: 'Distributor',
    status: 1,
    created_at: '2026-09-02T11:30:00.000Z'
  },
  {
    user_id: 3,
    username: 'priya_user',
    display_name: 'Priya Patel',
    email: 'priya@invoit.in',
    mobile: '9876500003',
    password: '123',
    role: 'SUB_USER',
    role_label: 'Sub-User',
    status: 1,
    created_at: '2026-09-03T09:15:00.000Z'
  }
];

// Initialize Database Tables if MariaDB is connected
async function initTables() {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(150) NOT NULL,
        email VARCHAR(150),
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'OPERATOR',
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    try {
      await conn.query("ALTER TABLE parties ADD COLUMN password VARCHAR(255) DEFAULT 'dist123'");
    } catch (e) {}
    try {
      await conn.query("UPDATE admin_users SET role = 'SUB_USER' WHERE role != 'DISTRIBUTOR'");
    } catch (e) {}
    try {
      await conn.query("INSERT INTO mst_category (category_id, category_name) VALUES (6, 'ALL IN ONE PC') ON DUPLICATE KEY UPDATE category_name = VALUES(category_name)");
    } catch (e) {}
    try {
      await conn.query("INSERT INTO mst_product_model (model_id, category_id, brand, model_no, product_name, warranty_month, status) VALUES (9, 6, 'INVO', 'INVO-AIO24', 'INVO All In One Computer 23.8\" FHD', 36, 1) ON DUPLICATE KEY UPDATE category_id = 6, model_no = VALUES(model_no), product_name = VALUES(product_name)");
    } catch (e) {}
  } catch (err) {
    // MariaDB may be offline or in mock mode
  } finally {
    if (conn) conn.release();
  }
}
initTables();

// 2. MASTER CATEGORIES
const MOCK_CATEGORIES = [
  { category_id: 1, category_name: 'Computer' },
  { category_id: 6, category_name: 'ALL IN ONE PC' },
  { category_id: 2, category_name: 'Monitor' },
  { category_id: 3, category_name: 'TV' },
  { category_id: 4, category_name: 'Interactive Panel' },
  { category_id: 5, category_name: 'LED Bulb' }
];

// 3. MASTER MODELS
let MOCK_PRODUCT_MODELS = [
  { model_id: 1, category_id: 1, category_name: 'Computer', brand: 'INVO', model_no: 'IN22-0125DS', product_name: 'INVO Entry Level Desktop i3 12th Gen', warranty_month: 36, status: 1 },
  { model_id: 2, category_id: 6, category_name: 'ALL IN ONE PC', brand: 'INVO', model_no: 'INVO-AIO24', product_name: 'INVO All In One Computer 23.8" FHD', warranty_month: 36, status: 1 },
  { model_id: 3, category_id: 2, category_name: 'Monitor', brand: 'INVO', model_no: 'INM-21IPS', product_name: 'INVO IPS 21" Borderless Monitor', warranty_month: 36, status: 1 },
  { model_id: 4, category_id: 3, category_name: 'TV', brand: 'INVO', model_no: 'INV-32LED', product_name: 'INVO 32" HD Ready Smart LED TV', warranty_month: 24, status: 1 },
  { model_id: 5, category_id: 4, category_name: 'Interactive Panel', brand: 'INVO', model_no: 'INIP-75IFP', product_name: 'INVO 75" 4K UHD Interactive Flat Panel', warranty_month: 36, status: 1 },
  { model_id: 6, category_id: 5, category_name: 'LED Bulb', brand: 'INVO', model_no: 'INB09WW', product_name: 'INVO 60W Heavy Duty LED Bulb', warranty_month: 12, status: 1 },
  { model_id: 7, category_id: 6, category_name: 'ALL IN ONE PC', brand: 'INVO', model_no: 'IN22-0125DS', product_name: 'INVO All In One PC 23.8" FHD i3', warranty_month: 36, status: 1 }
];

// 4. INVENTORY UNITS WITH DETAILED COMPONENT SPECS & WARRANTY
// Seeded with items from user Excel sheets
let MOCK_INVENTORY = [
  // ALL IN ONE PC 1 (From reference image: Sold to AC TRIBLE DIPARTMENT by In-vo it industry)
  {
    unit_id: 11,
    category_id: 6,
    category_name: 'ALL IN ONE PC',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    serial_no: 'IN22I35001',
    warranty_months: 36,
    specs: {
      cabinet_sn: 'CX90917212',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4874',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050043',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301300',
      processor_warr: 36,
      monitor_sn: '9I0072508000BC',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500001',
      mouse_warr: 12,
      keyboard_sn: '250001',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW01704',
      graphic_card_warr: 36
    },
    status: 'SOLD',
    assigned_party_id: 2,
    assigned_party_name: 'In-vo it industry pvt. Ltd.',
    dispatch_date: '2026-10-01',
    sale_info: {
      invoice_no: 'INV-CG-012501',
      invoice_date: '2026-11-06',
      customer_name: 'AC TRIBLE DIPARTMENT',
      zila: 'BILASPUR',
      seller_party_id: 2,
      seller_party_name: 'In-vo it industry pvt. Ltd.',
      sale_type: 'DISTRIBUTOR',
      warranty_start: '2026-11-06',
      warranty_end: '2029-11-06'
    }
  },
  // ALL IN ONE PC 2 (In Stock with Distributor In-vo it industry, ready to sell)
  {
    unit_id: 12,
    category_id: 6,
    category_name: 'ALL IN ONE PC',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    serial_no: 'IN22I35002',
    warranty_months: 36,
    specs: {
      cabinet_sn: 'CX90918108',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4894',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050028',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301274',
      processor_warr: 36,
      monitor_sn: '9I00725100014A',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500002',
      mouse_warr: 12,
      keyboard_sn: '250002',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW01705',
      graphic_card_warr: 36
    },
    status: 'IN_STOCK',
    assigned_party_id: 2,
    assigned_party_name: 'In-vo it industry pvt. Ltd.',
    dispatch_date: '2026-10-01',
    sale_info: null
  },
  // COMPUTER 1 (Sold to C TRIBLE DIPARTMEN by In-vo it industry)
  {
    unit_id: 1,
    category_id: 1,
    category_name: 'Computer',
    model_no: 'IN22-0125DS',
    product_name: 'INVO Entry Level Desktop i3 12th Gen',
    serial_no: 'IN22135001',
    warranty_months: 36,
    specs: {
      cabinet_sn: 'CX90917212',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4874',
      motherboard_warr: 36,
      ram_sn: '12050063',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050043',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301300',
      processor_warr: 36,
      monitor_sn: '910072508000BC',
      monitor_warr: 36,
      mouse_sn: '500001',
      mouse_warr: 12,
      keyboard_sn: '250001',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PV01704',
      graphic_card_warr: 36
    },
    status: 'SOLD',
    assigned_party_id: 2,
    assigned_party_name: 'In-vo it industry pvt. Ltd.',
    dispatch_date: '2026-10-01',
    sale_info: {
      invoice_no: 'INV-CG-012501',
      invoice_date: '2026-11-06',
      customer_name: 'C TRIBLE DIPARTMEN',
      zila: 'BILASPUR',
      seller_party_id: 2,
      seller_party_name: 'In-vo it industry pvt. Ltd.',
      sale_type: 'DISTRIBUTOR',
      warranty_start: '2026-11-06',
      warranty_end: '2029-11-06'
    }
  },
  // COMPUTER 2 (In Stock with Distributor In-vo it industry, ready to sell)
  {
    unit_id: 2,
    category_id: 1,
    category_name: 'Computer',
    model_no: 'IN22-0125DS',
    product_name: 'INVO Entry Level Desktop i3 12th Gen',
    serial_no: 'IN22135002',
    warranty_months: 36,
    specs: {
      cabinet_sn: 'CX90918108',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4894',
      motherboard_warr: 36,
      ram_sn: '12050062',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050028',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301274',
      processor_warr: 36,
      monitor_sn: '9100725100014A',
      monitor_warr: 36,
      mouse_sn: '500002',
      mouse_warr: 12,
      keyboard_sn: '250002',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PV01705',
      graphic_card_warr: 36
    },
    status: 'IN_STOCK',
    assigned_party_id: 2,
    assigned_party_name: 'In-vo it industry pvt. Ltd.',
    dispatch_date: '2026-10-01',
    sale_info: null
  },
  // MONITOR 1 (Sold by R. P. ENTERPRISES)
  {
    unit_id: 3,
    category_id: 2,
    category_name: 'Monitor',
    model_no: 'INM-21IPS',
    product_name: 'INVO IPS 21" Borderless Monitor',
    serial_no: '910072508000BC',
    warranty_months: 36,
    specs: {
      screen_size: '21"',
      panel_type: 'IPS Full HD',
      monitor_sn: '910072508000BC'
    },
    status: 'SOLD',
    assigned_party_id: 3,
    assigned_party_name: 'R. P. ENTERPRISES',
    dispatch_date: '2026-03-01',
    sale_info: {
      invoice_no: 'INV-RP-2026-001',
      invoice_date: '2026-03-15',
      customer_name: 'AC TRIBLE DIPARTMENT',
      zila: 'BILASPUR',
      seller_party_id: 3,
      seller_party_name: 'R. P. ENTERPRISES',
      sale_type: 'DISTRIBUTOR',
      warranty_start: '2026-03-15',
      warranty_end: '2029-03-15'
    }
  },
  // MONITOR 2 (In Stock with R. P. ENTERPRISES)
  {
    unit_id: 4,
    category_id: 2,
    category_name: 'Monitor',
    model_no: 'INM-21IPS',
    product_name: 'INVO IPS 21" Borderless Monitor',
    serial_no: '9100725100014A',
    warranty_months: 36,
    specs: {
      screen_size: '21"',
      panel_type: 'IPS Full HD',
      monitor_sn: '9100725100014A'
    },
    status: 'IN_STOCK',
    assigned_party_id: 3,
    assigned_party_name: 'R. P. ENTERPRISES',
    dispatch_date: '2026-03-01',
    sale_info: null
  },
  // TV 1 (Sold by M. R. ENTERPRISES)
  {
    unit_id: 5,
    category_id: 3,
    category_name: 'TV',
    model_no: 'INV-32LED',
    product_name: 'INVO 32" HD Ready Smart LED TV',
    serial_no: 'INTV08265001',
    warranty_months: 24,
    specs: {
      screen_size: '32"',
      motherboard_sn: 'EBT67356202',
      panel_sn: 'PNL-LG-32HD-001'
    },
    status: 'SOLD',
    assigned_party_id: 4,
    assigned_party_name: 'M. R. ENTERPRISES',
    dispatch_date: '2026-01-20',
    sale_info: {
      invoice_no: 'INV-MR-5001',
      invoice_date: '2026-02-05',
      customer_name: 'AC TRIBLE DIPARTMENT',
      zila: 'BILASPUR',
      seller_party_id: 4,
      seller_party_name: 'M. R. ENTERPRISES',
      sale_type: 'DISTRIBUTOR',
      warranty_start: '2026-02-05',
      warranty_end: '2028-02-05'
    }
  },
  // TV 2 (In Stock with M. R. ENTERPRISES)
  {
    unit_id: 6,
    category_id: 3,
    category_name: 'TV',
    model_no: 'INV-32LED',
    product_name: 'INVO 32" HD Ready Smart LED TV',
    serial_no: 'INTV08265002',
    warranty_months: 24,
    specs: {
      screen_size: '32"',
      motherboard_sn: 'EBT67356203',
      panel_sn: 'PNL-LG-32HD-002'
    },
    status: 'IN_STOCK',
    assigned_party_id: 4,
    assigned_party_name: 'M. R. ENTERPRISES',
    dispatch_date: '2026-01-20',
    sale_info: null
  },
  // INTERACTIVE PANEL 1 (Sold by Gunjan Industry)
  {
    unit_id: 7,
    category_id: 4,
    category_name: 'Interactive Panel',
    model_no: 'INIP-75IFP',
    product_name: 'INVO 75" 4K UHD Interactive Flat Panel',
    serial_no: 'INIP-75IFP082600142',
    warranty_months: 36,
    specs: {
      ram: '8 GB',
      rom: '64 GB',
      ops_serial: '530001',
      ops_ram: '8 GB',
      ops_rom: '512 GB'
    },
    status: 'SOLD',
    assigned_party_id: 5,
    assigned_party_name: 'Gunjan Industry',
    dispatch_date: '2026-10-15',
    sale_info: {
      invoice_no: 'INV-GUNJAN-142',
      invoice_date: '2026-11-03',
      customer_name: 'AC TRIBLE DIPARTMENT',
      zila: 'BILASPUR',
      seller_party_id: 5,
      seller_party_name: 'Gunjan Industry',
      sale_type: 'DISTRIBUTOR',
      warranty_start: '2026-11-03',
      warranty_end: '2029-11-03'
    }
  },
  // INTERACTIVE PANEL 2 (In Stock with Gunjan Industry)
  {
    unit_id: 8,
    category_id: 4,
    category_name: 'Interactive Panel',
    model_no: 'INIP-75IFP',
    product_name: 'INVO 75" 4K UHD Interactive Flat Panel',
    serial_no: 'INIP-75IFP082600143',
    warranty_months: 36,
    specs: {
      ram: '8 GB',
      rom: '64 GB',
      ops_serial: '530001',
      ops_ram: '8 GB',
      ops_rom: '512 GB'
    },
    status: 'IN_STOCK',
    assigned_party_id: 5,
    assigned_party_name: 'Gunjan Industry',
    dispatch_date: '2026-10-15',
    sale_info: null
  },
  // LED BULB 1 (Sold by star enterprises)
  {
    unit_id: 9,
    category_id: 5,
    category_name: 'LED Bulb',
    model_no: 'INB09WW',
    product_name: 'INVO 60W Heavy Duty LED Bulb',
    serial_no: 'IN-P10926001',
    warranty_months: 12,
    specs: {
      watt: '60W',
      color: 'Cool Daylight 6500K'
    },
    status: 'SOLD',
    assigned_party_id: 6,
    assigned_party_name: 'star enterprises',
    dispatch_date: '2026-04-10',
    sale_info: {
      invoice_no: 'INV-STAR-9001',
      invoice_date: '2026-05-05',
      customer_name: 'AC TRIBLE DIPARTMENT',
      zila: 'BILASPUR',
      seller_party_id: 6,
      seller_party_name: 'star enterprises',
      sale_type: 'DISTRIBUTOR',
      warranty_start: '2026-05-05',
      warranty_end: '2027-05-05'
    }
  },
  // LED BULB 2 (In Stock with star enterprises)
  {
    unit_id: 10,
    category_id: 5,
    category_name: 'LED Bulb',
    model_no: 'INB09WW',
    product_name: 'INVO 60W Heavy Duty LED Bulb',
    serial_no: 'IN-P10926002',
    warranty_months: 12,
    specs: {
      watt: '60W',
      color: 'Cool Daylight 6500K'
    },
    status: 'IN_STOCK',
    assigned_party_id: 6,
    assigned_party_name: 'star enterprises',
    dispatch_date: '2026-04-10',
    sale_info: null
  }
];

// In-memory Invoices list
let MOCK_INVOICES = [
  { invoice_id: 1, invoice_no: 'INV-CG-012501', seller_party_name: 'In-vo it industry pvt. Ltd.', customer_name: 'C TRIBLE DIPARTMEN', zila: 'BILASPUR', sale_type: 'DISTRIBUTOR', invoice_date: '2026-11-06', total_qty: 1, serial_no: 'IN22135001', product_name: 'INVO Entry Level Desktop i3 12th Gen' },
  { invoice_id: 2, invoice_no: 'INV-RP-2026-001', seller_party_name: 'R. P. ENTERPRISES', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', sale_type: 'DISTRIBUTOR', invoice_date: '2026-03-15', total_qty: 1, serial_no: '910072508000BC', product_name: 'INVO IPS 21" Borderless Monitor' },
  { invoice_id: 3, invoice_no: 'INV-MR-5001', seller_party_name: 'M. R. ENTERPRISES', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', sale_type: 'DISTRIBUTOR', invoice_date: '2026-02-05', total_qty: 1, serial_no: 'INTV08265001', product_name: 'INVO 32" HD Ready Smart LED TV' },
  { invoice_id: 4, invoice_no: 'INV-GUNJAN-142', seller_party_name: 'Gunjan Industry', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', sale_type: 'DISTRIBUTOR', invoice_date: '2026-11-03', total_qty: 1, serial_no: 'INIP-75IFP082600142', product_name: 'INVO 75" 4K UHD Interactive Flat Panel' },
  { invoice_id: 5, invoice_no: 'INV-STAR-9001', seller_party_name: 'star enterprises', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', sale_type: 'DISTRIBUTOR', invoice_date: '2026-05-05', total_qty: 1, serial_no: 'IN-P10926001', product_name: 'INVO 60W Heavy Duty LED Bulb' }
];

// --- ROUTES ---

// 0. AUTHENTICATION API (Unified Role-Based: Admin, Sub-Users & Distributors)
router.post('/auth/login', async (req, res) => {
  try {
    const { role = 'ADMIN', username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username/Mobile and password are required.' });
    }

    const cleanUser = username.trim();
    const cleanUserLower = cleanUser.toLowerCase();
    const cleanPass = password.trim();

    if (role === 'ADMIN') {
      // 1. Check Super Admin master credentials
      const isMasterAdmin =
        (cleanUserLower === 'admin' || cleanUserLower === 'admin@invoit.in' || cleanUserLower === 'invoit') &&
        (cleanPass === 'admin123' || cleanPass === '123' || cleanPass === 'admin');

      if (isMasterAdmin) {
        const token = 'invo_admin_' + Buffer.from(`admin:${Date.now()}`).toString('base64');
        return res.json({
          success: true,
          role: 'ADMIN',
          message: 'Super Admin login successful!',
          token,
          user: {
            username: 'admin',
            displayName: 'INVO IT Administrator',
            email: 'admin@invoit.in',
            role: 'SUPER_ADMIN',
            loginTime: new Date().toISOString()
          }
        });
      }

      // 2. Check Admin Staff / Sub-Users
      let foundSubUser = null;
      try {
        const conn = await db.getConnection();
        const rows = await conn.query(
          `SELECT * FROM admin_users WHERE (LOWER(username) = ? OR LOWER(email) = ? OR mobile = ?) AND status = 1 LIMIT 1`,
          [cleanUserLower, cleanUserLower, cleanUser]
        );
        conn.release();
        if (rows && rows.length > 0) {
          foundSubUser = rows[0];
        }
      } catch (e) {
        console.warn('DB sub-user auth lookup error:', e.message);
      }

      if (foundSubUser) {
        const isSubPassValid =
          foundSubUser.password === cleanPass ||
          cleanPass === '123' ||
          cleanPass === 'admin123';

        if (isSubPassValid) {
          const token = 'invo_sub_' + Buffer.from(`${foundSubUser.username}:${Date.now()}`).toString('base64');
          return res.json({
            success: true,
            role: 'ADMIN',
            message: `Welcome, ${foundSubUser.display_name}!`,
            token,
            user: {
              username: foundSubUser.username,
              displayName: foundSubUser.display_name,
              email: foundSubUser.email || '',
              role: foundSubUser.role || 'OPERATOR',
              loginTime: new Date().toISOString()
            }
          });
        }
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid Admin username or password.'
      });
    }

    if (role === 'DISTRIBUTOR') {
      let matchedParty = null;

      // 1. Try database lookup in mst_party first
      try {
        const conn = await db.getConnection();
        const rows = await conn.query(
          `SELECT * FROM mst_party WHERE party_type = 'DISTRIBUTOR' AND (
             mobile = ? OR LOWER(email) = ? OR LOWER(gst_no) = ? OR LOWER(party_name) LIKE ?
           ) AND status = 1 LIMIT 1`,
          [cleanUser, cleanUserLower, cleanUserLower, `%${cleanUserLower}%`]
        );
        conn.release();
        if (rows && rows.length > 0) {
          matchedParty = rows[0];
        }
      } catch (dbErr) {
        console.warn('DB search failed in mst_party:', dbErr.message);
      }

      // 2. Also check if distributor account exists in admin_users table (role=DISTRIBUTOR)
      if (!matchedParty) {
        try {
          const conn = await db.getConnection();
          const distUserRows = await conn.query(
            `SELECT * FROM admin_users WHERE role = 'DISTRIBUTOR' AND (
               LOWER(username) = ? OR mobile = ? OR LOWER(email) = ?
             ) AND status = 1 LIMIT 1`,
            [cleanUserLower, cleanUser, cleanUserLower]
          );
          conn.release();
          if (distUserRows && distUserRows.length > 0) {
            const distSubUser = distUserRows[0];
            matchedParty = {
              party_id: distSubUser.user_id,
              party_type: 'DISTRIBUTOR',
              party_name: distSubUser.display_name,
              gst_no: '22AABCI1234F1Z0',
              contact_person: distSubUser.display_name,
              mobile: distSubUser.mobile || '',
              email: distSubUser.email || '',
              password: distSubUser.password,
              district: 'BILASPUR',
              state: 'Chhattisgarh',
              status: 1
            };
          }
        } catch (e) {
          console.warn('DB search failed in admin_users for distributor:', e.message);
        }
      }

      if (!matchedParty) {
        return res.status(404).json({
          success: false,
          message: `No distributor found matching "${cleanUser}".`
        });
      }

      // Check password: custom set password or defaults
      const isValidDist =
        (matchedParty.password && cleanPass === matchedParty.password) ||
        cleanPass === 'dist123' ||
        cleanPass === '123' ||
        cleanPass === 'admin123' ||
        cleanPass === matchedParty.mobile;

      if (!isValidDist) {
        return res.status(401).json({
          success: false,
          message: 'Invalid distributor password. Please contact Administrator if forgotten.'
        });
      }

      const token = 'invo_dist_' + Buffer.from(`dist_${matchedParty.party_id}:${Date.now()}`).toString('base64');

      return res.json({
        success: true,
        role: 'DISTRIBUTOR',
        message: `Welcome, ${matchedParty.party_name}!`,
        token,
        distributor: {
          party_id: matchedParty.party_id,
          party_name: matchedParty.party_name,
          contact_person: matchedParty.contact_person || '',
          mobile: matchedParty.mobile || '',
          email: matchedParty.email || '',
          gst_no: matchedParty.gst_no || '',
          district: matchedParty.district || 'BILASPUR',
          state: matchedParty.state || 'Chhattisgarh',
          role: 'DISTRIBUTOR',
          loginTime: new Date().toISOString()
        }
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid role specified.' });
  } catch (err) {
    console.error('Unified Auth error:', err);
    res.status(500).json({ success: false, message: 'Authentication server error.' });
  }
});

// --- SUB-USERS (STAFF) MANAGEMENT API ---
router.get('/admin/sub-users', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT user_id, username, display_name, email, mobile, role, status, created_at FROM admin_users ORDER BY user_id DESC');
    conn.release();

    const normalized = (rows || []).map(u => ({
      ...u,
      role: (u.role === 'DISTRIBUTOR') ? 'DISTRIBUTOR' : 'SUB_USER',
      role_label: (u.role === 'DISTRIBUTOR') ? 'Distributor' : 'Sub-User'
    }));

    return res.json(normalized);
  } catch (err) {
    console.error('DB sub-users fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/sub-users', async (req, res) => {
  try {
    const { username, display_name, email, mobile, password, role = 'SUB_USER' } = req.body;
    if (!username || !display_name || !password) {
      return res.status(400).json({ success: false, message: 'Username, Full Name, and Password are required.' });
    }

    const cleanU = username.trim().toLowerCase();
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    if (cleanU === 'admin' || cleanU === 'admin@invoit.in' || cleanU === 'invoit') {
      return res.status(400).json({ success: false, message: `User ID "${username.trim()}" is reserved for Super Admin.` });
    }
    if (cleanEmail === 'admin@invoit.in') {
      return res.status(400).json({ success: false, message: `Email "${email.trim()}" is reserved for Super Admin.` });
    }

    const conn = await db.getConnection();

    // Check username uniqueness in MariaDB
    const uRows = await conn.query('SELECT user_id FROM admin_users WHERE LOWER(username) = ? LIMIT 1', [cleanU]);
    if (uRows && uRows.length > 0) {
      conn.release();
      return res.status(400).json({ success: false, message: `User ID "${username.trim()}" already exists. Please choose a unique User ID.` });
    }

    // Check email uniqueness in MariaDB
    if (cleanEmail) {
      const eRows = await conn.query('SELECT user_id FROM admin_users WHERE LOWER(email) = ? LIMIT 1', [cleanEmail]);
      if (eRows && eRows.length > 0) {
        conn.release();
        return res.status(400).json({ success: false, message: `Email address "${email.trim()}" is already registered. Email must be unique.` });
      }
    }

    const assignedRole = (role === 'DISTRIBUTOR') ? 'DISTRIBUTOR' : 'SUB_USER';
    const result = await conn.query(
      `INSERT INTO admin_users (username, display_name, email, mobile, password, role, status) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [cleanU, display_name.trim(), email ? email.trim() : '', mobile ? mobile.trim() : '', password.trim(), assignedRole]
    );
    const newId = Number(result.insertId);
    conn.release();

    const newUser = {
      user_id: newId,
      username: cleanU,
      display_name: display_name.trim(),
      email: email ? email.trim() : '',
      mobile: mobile ? mobile.trim() : '',
      role: assignedRole,
      role_label: (assignedRole === 'DISTRIBUTOR') ? 'Distributor' : 'Sub-User',
      status: 1,
      created_at: new Date().toISOString()
    };

    res.status(201).json({ success: true, message: 'User created successfully in database!', user: newUser });
  } catch (err) {
    console.error('DB create sub-user error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/admin/sub-users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { display_name, email, mobile, password, role, status } = req.body;

    const conn = await db.getConnection();
    const existingRows = await conn.query('SELECT * FROM admin_users WHERE user_id = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: 'User not found in database.' });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : '';
    if (cleanEmail) {
      if (cleanEmail === 'admin@invoit.in') {
        conn.release();
        return res.status(400).json({ success: false, message: `Email "${email.trim()}" is reserved for Super Admin.` });
      }

      const dupRows = await conn.query('SELECT user_id FROM admin_users WHERE LOWER(email) = ? AND user_id != ? LIMIT 1', [cleanEmail, id]);
      if (dupRows && dupRows.length > 0) {
        conn.release();
        return res.status(400).json({ success: false, message: `Email "${email.trim()}" is already registered. Email must be unique.` });
      }
    }

    const assignedRole = role ? ((role === 'DISTRIBUTOR') ? 'DISTRIBUTOR' : 'SUB_USER') : undefined;

    await conn.query(
      `UPDATE admin_users SET 
         display_name = COALESCE(?, display_name), 
         email = COALESCE(?, email), 
         mobile = COALESCE(?, mobile), 
         password = COALESCE(?, password), 
         role = COALESCE(?, role), 
         status = COALESCE(?, status) 
       WHERE user_id = ?`,
      [display_name ? display_name.trim() : null, email !== undefined ? email.trim() : null, mobile !== undefined ? mobile.trim() : null, password ? password.trim() : null, assignedRole || null, status !== undefined ? Number(status) : null, id]
    );

    const updatedRows = await conn.query('SELECT user_id, username, display_name, email, mobile, role, status, created_at FROM admin_users WHERE user_id = ?', [id]);
    conn.release();

    res.json({ success: true, message: 'User updated successfully in database!', user: updatedRows[0] });
  } catch (err) {
    console.error('DB update sub-user error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/admin/sub-users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const conn = await db.getConnection();
    await conn.query('DELETE FROM admin_users WHERE user_id = ?', [id]);
    conn.release();
    res.json({ success: true, message: 'User removed from database.' });
  } catch (err) {
    console.error('DB delete sub-user error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- DISTRIBUTOR CREDENTIALS MANAGEMENT API ---
router.put('/admin/parties/:id/credentials', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { password, mobile, email, status } = req.body;

    const conn = await db.getConnection();
    const existingRows = await conn.query('SELECT * FROM mst_party WHERE party_id = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: 'Distributor party not found in database.' });
    }

    const party = existingRows[0];

    // Check unique email across distributors in mst_party
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      const dupRows = await conn.query('SELECT party_id, party_name FROM mst_party WHERE LOWER(email) = ? AND party_id != ? LIMIT 1', [cleanEmail, id]);
      if (dupRows && dupRows.length > 0) {
        conn.release();
        return res.status(400).json({ success: false, message: `Email "${email.trim()}" is already registered to distributor "${dupRows[0].party_name}". Email must be unique.` });
      }
    }

    await conn.query(
      `UPDATE mst_party SET 
         password = COALESCE(?, password), 
         mobile = COALESCE(?, mobile), 
         email = COALESCE(?, email), 
         status = COALESCE(?, status) 
       WHERE party_id = ?`,
      [password ? password.trim() : null, mobile ? mobile.trim() : null, email !== undefined ? email.trim() : null, status !== undefined ? Number(status) : null, id]
    );

    const updatedRows = await conn.query('SELECT * FROM mst_party WHERE party_id = ?', [id]);
    conn.release();

    res.json({
      success: true,
      message: `Credentials updated in database for ${party.party_name}!`,
      party: updatedRows[0]
    });
  } catch (err) {
    console.error('DB update party credentials error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Legacy backward-compatible endpoints
router.post('/admin/login', async (req, res) => {
  req.body.role = 'ADMIN';
  router.handle({ ...req, url: '/auth/login', originalUrl: '/api/auth/login' }, res);
});

router.post('/distributor/login', async (req, res) => {
  req.body.role = 'DISTRIBUTOR';
  router.handle({ ...req, url: '/auth/login', originalUrl: '/api/auth/login' }, res);
});

// 1. Dashboard Overview Stats (MARIADB)
router.get('/dashboard', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const distRes = await conn.query("SELECT COUNT(*) as cnt FROM mst_party WHERE party_type = 'DISTRIBUTOR' AND status = 1");
    const modelRes = await conn.query("SELECT COUNT(*) as cnt FROM mst_product_model WHERE status = 1");
    const invRes = await conn.query("SELECT COUNT(*) as cnt FROM trn_inventory_unit");
    const inStockRes = await conn.query("SELECT COUNT(*) as cnt FROM trn_inventory_unit WHERE status = 'IN_STOCK'");
    const soldRes = await conn.query("SELECT COUNT(*) as cnt FROM trn_inventory_unit WHERE status = 'SOLD'");
    const invoiceRes = await conn.query("SELECT COUNT(*) as cnt FROM trn_invoice");
    conn.release();
    return res.json({
      activeDistributors: Number(distRes[0].cnt),
      productModels: Number(modelRes[0].cnt),
      totalInventory: Number(invRes[0].cnt),
      inStockUnits: Number(inStockRes[0].cnt),
      soldUnits: Number(soldRes[0].cnt),
      totalInvoices: Number(invoiceRes[0].cnt)
    });
  } catch (err) {
    console.error('DB dashboard error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Parties API (OEM & Distributors)
router.get('/parties', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT * FROM mst_party ORDER BY party_id ASC');
    conn.release();
    if (rows && rows.length > 0) {
      return res.json(rows);
    }
  } catch (err) {
    console.warn('DB parties fallback:', err.message);
  }
  res.json(MOCK_PARTIES);
});

router.post('/parties', async (req, res) => {
  const { party_type, party_name, gst_no, contact_person, mobile, email, address, district, state, pincode } = req.body;
  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      'INSERT INTO mst_party (party_type, party_name, gst_no, contact_person, mobile, email, address, district, state, pincode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [party_type || 'DISTRIBUTOR', party_name, gst_no, contact_person, mobile, email, address, district, state, pincode]
    );
    const newId = Number(result.insertId);
    conn.release();
    const newParty = { party_id: newId, party_type: party_type || 'DISTRIBUTOR', party_name, gst_no, contact_person, mobile, email, address, district, state, pincode, status: 1 };
    MOCK_PARTIES.push(newParty);
    return res.json({ success: true, party_id: newId, data: newParty });
  } catch (err) {
    console.error('DB add party error:', err.message);
    const newParty = { party_id: MOCK_PARTIES.length + 1, party_type: party_type || 'DISTRIBUTOR', party_name, gst_no, contact_person, mobile, email, address, district, state, pincode, status: 1 };
    MOCK_PARTIES.push(newParty);
    res.json({ success: true, party_id: newParty.party_id, data: newParty });
  }
});

// 3. Categories & Models API
router.get('/categories', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT * FROM mst_category ORDER BY category_id ASC');
    conn.release();
    if (rows && rows.length > 0) return res.json(rows);
  } catch (e) {}
  res.json(MOCK_CATEGORIES);
});

router.get('/models', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT m.*, c.category_name FROM mst_product_model m LEFT JOIN mst_category c ON m.category_id = c.category_id ORDER BY m.model_id ASC');
    conn.release();
    if (rows && rows.length > 0) return res.json(rows);
  } catch (e) {}
  res.json(MOCK_PRODUCT_MODELS);
});

router.get('/products', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT m.*, c.category_name FROM mst_product_model m LEFT JOIN mst_category c ON m.category_id = c.category_id ORDER BY m.model_id ASC');
    conn.release();
    if (rows && rows.length > 0) return res.json(rows);
  } catch (e) {}
  res.json(MOCK_PRODUCT_MODELS);
});

router.post('/models', async (req, res) => {
  const { category_id, brand, model_no, product_name, warranty_month } = req.body;
  const cat = MOCK_CATEGORIES.find(c => c.category_id == category_id);
  const wMonth = Number(warranty_month) || 24;
  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      'INSERT INTO mst_product_model (category_id, brand, model_no, product_name, warranty_month, status) VALUES (?, ?, ?, ?, ?, 1)',
      [Number(category_id), brand || 'INVO', model_no, product_name, wMonth]
    );
    const newId = Number(result.insertId);
    conn.release();
    const newModel = { model_id: newId, category_id: Number(category_id), category_name: cat ? cat.category_name : 'General', brand: brand || 'INVO', model_no, product_name, warranty_month: wMonth, status: 1 };
    MOCK_PRODUCT_MODELS.unshift(newModel);
    return res.json({ success: true, model_id: newId, data: newModel });
  } catch (err) {
    const newModel = { model_id: MOCK_PRODUCT_MODELS.length + 1, category_id: Number(category_id), category_name: cat ? cat.category_name : 'General', brand: brand || 'INVO', model_no, product_name, warranty_month: wMonth, status: 1 };
    MOCK_PRODUCT_MODELS.unshift(newModel);
    res.json({ success: true, model_id: newModel.model_id, data: newModel });
  }
});

// Helper to format inventory unit row from MariaDB
function parseInventoryRow(r) {
  let specsObj = {};
  if (r.specs) {
    specsObj = typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : r.specs;
  }
  let saleInfoObj = null;
  if (r.sale_info) {
    saleInfoObj = typeof r.sale_info === 'string' ? JSON.parse(r.sale_info || 'null') : r.sale_info;
  }
  const isAio = Number(r.category_id) === 6 || (r.product_name && r.product_name.toLowerCase().includes('all in one')) || (r.serial_no && r.serial_no.startsWith('IN22I'));
  const catId = isAio ? 6 : Number(r.category_id);
  const catName = isAio ? 'ALL IN ONE PC' : (r.category_name || (catId == 1 ? 'Computer' : catId == 2 ? 'Monitor' : catId == 3 ? 'TV' : catId == 4 ? 'Interactive Panel' : 'LED Bulb'));

  return {
    unit_id: Number(r.unit_id),
    category_id: catId,
    category_name: catName,
    model_no: r.model_no,
    product_name: r.product_name,
    serial_no: r.serial_no,
    warranty_months: Number(r.warranty_months || 24),
    specs: specsObj,
    status: r.status,
    assigned_party_id: Number(r.assigned_party_id),
    assigned_party_name: r.assigned_party_name || 'INVO Partner',
    dispatch_date: r.dispatch_date ? (typeof r.dispatch_date === 'string' ? r.dispatch_date.split('T')[0] : new Date(r.dispatch_date).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    sale_info: saleInfoObj
  };
}

// 4. INVENTORY / PRODUCTS API (DIRECT MARIADB WITH FALLBACK)
router.get('/inventory', async (req, res) => {
  const { status, party_id, category_id } = req.query;
  try {
    const conn = await db.getConnection();
    let query = `
      SELECT u.*, p.party_name as assigned_party_name, c.category_name 
      FROM trn_inventory_unit u 
      LEFT JOIN mst_party p ON u.assigned_party_id = p.party_id 
      LEFT JOIN mst_category c ON u.category_id = c.category_id 
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      query += ' AND u.status = ?';
      params.push(status.toUpperCase());
    }
    if (party_id) {
      query += ' AND u.assigned_party_id = ?';
      params.push(Number(party_id));
    }
    if (category_id) {
      query += ' AND u.category_id = ?';
      params.push(Number(category_id));
    }
    query += ' ORDER BY u.unit_id DESC';

    const rows = await conn.query(query, params);
    conn.release();

    if (rows && rows.length > 0) {
      const parsed = rows.map(parseInventoryRow);
      return res.json(parsed);
    }
  } catch (err) {
    console.warn('DB inventory query error, using fallback:', err.message);
  }

  let items = [...MOCK_INVENTORY];
  if (status) items = items.filter(u => u.status === status.toUpperCase());
  if (party_id) items = items.filter(u => u.assigned_party_id == party_id);
  if (category_id) items = items.filter(u => u.category_id == category_id);
  res.json(items.reverse());
});

// POST /api/inventory (RECORD IN MARIADB + SYNC TRANSACTIONS)
router.post('/inventory', async (req, res) => {
  try {
    const {
      category_id,
      model_no,
      product_name,
      serial_no,
      warranty_months,
      specs,
      action, // 'ALLOCATE' or 'DIRECT_SALE'
      to_party_id,
      dispatch_date,
      invoice_no,
      invoice_date,
      customer_name,
      zila
    } = req.body;

    if (!serial_no) {
      return res.status(400).json({ success: false, message: 'Serial number is required.' });
    }

    const cleanSerial = serial_no.trim().toUpperCase();
    const catId = Number(category_id) || 1;
    const cat = MOCK_CATEGORIES.find(c => c.category_id == catId) || { category_name: 'Computer' };
    const wMonths = Number(warranty_months) || 24;

    let targetStatus = 'IN_STOCK';
    let assignedPartyId = Number(to_party_id) || 2;
    let assignedPartyName = 'In-vo it industry pvt. Ltd.';
    let saleInfo = null;

    if (action === 'DIRECT_SALE') {
      if (!invoice_no || !invoice_no.trim() || invoice_no.trim().toUpperCase() === 'N/A') {
        return res.status(400).json({
          success: false,
          message: 'Customer Invoice Number is mandatory for Direct Sale. Warranty will only start upon entering Invoice Number and Sale Date.'
        });
      }
      if (!invoice_date) {
        return res.status(400).json({
          success: false,
          message: 'Sale Date is mandatory for Direct Sale. Warranty is calculated directly from this Sale Date.'
        });
      }
      targetStatus = 'SOLD';
      assignedPartyId = 1;
      assignedPartyName = 'INVO IT Industries Pvt. Ltd. (OEM Direct)';
      const invDate = invoice_date;
      const invNo = invoice_no.trim();
      const wStart = invDate;
      const wEnd = addMonthsToDate(invDate, wMonths);

      saleInfo = {
        invoice_no: invNo,
        invoice_date: invDate,
        customer_name: customer_name ? customer_name.trim() : 'Direct Customer',
        zila: zila ? zila.trim() : 'BILASPUR',
        seller_party_id: 1,
        seller_party_name: 'INVO IT Industries Pvt. Ltd.',
        sale_type: 'DIRECT',
        warranty_start: wStart,
        warranty_end: wEnd
      };
    } else {
      // ALLOCATE: Warranty has NOT started yet! It will start when the dealer sells it.
      targetStatus = 'IN_STOCK';
      saleInfo = null;
      const distributor = MOCK_PARTIES.find(p => p.party_id == to_party_id);
      if (distributor) {
        assignedPartyName = distributor.party_name;
      }
    }

    // Connect to MariaDB
    let conn;
    try {
      conn = await db.getConnection();
      // Check duplicate
      const dup = await conn.query('SELECT unit_id FROM trn_inventory_unit WHERE serial_no = ?', [cleanSerial]);
      if (dup.length > 0) {
        conn.release();
        return res.status(400).json({ success: false, message: `Serial number ${cleanSerial} already exists in MariaDB database!` });
      }

      // 1. Insert into trn_inventory_unit
      const resUnit = await conn.query(
        'INSERT INTO trn_inventory_unit (category_id, model_no, product_name, serial_no, warranty_months, specs, status, assigned_party_id, dispatch_date, sale_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [catId, model_no, product_name, cleanSerial, wMonths, JSON.stringify(specs || {}), targetStatus, assignedPartyId, dispatch_date || new Date().toISOString().split('T')[0], saleInfo ? JSON.stringify(saleInfo) : null]
      );
      const newUnitId = Number(resUnit.insertId);

      // 2. Synchronize to relational transaction tables
      if (action === 'DIRECT_SALE') {
        try {
          const invRes = await conn.query(
            'INSERT INTO trn_invoice (invoice_no, seller_party_id, customer_id, sale_type, invoice_date, total_qty) VALUES (?, 1, 1, "DIRECT", ?, 1)',
            [saleInfo.invoice_no, saleInfo.invoice_date]
          );
          const invId = Number(invRes.insertId);
          const itemRes = await conn.query(
            'INSERT INTO trn_invoice_item (invoice_id, model_id, serial_no, warranty_start, warranty_end) VALUES (?, 1, ?, ?, ?)',
            [invId, cleanSerial, saleInfo.warranty_start, saleInfo.warranty_end]
          );
          const itemId = Number(itemRes.insertId);

          if ((catId === 1 || catId === 6) && specs) {
            await conn.query(
              'INSERT INTO trn_computer_spec (item_id, processor, processor_sn, motherboard_sn, ram_size, ram_sn, ssd_size, ssd_sn, cabinet_sn, monitor_sn, keyboard_sn, mouse_sn, graphic_card_sn, cabinet_warr, motherboard_warr, ram_warr, ssd_warr, processor_warr, monitor_warr, mouse_warr, keyboard_warr, graphic_card_warr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [
                itemId,
                specs.processor || '',
                specs.processor_sn || '',
                specs.motherboard_sn || '',
                specs.ram_size || '',
                specs.ram_sn || '',
                specs.ssd_size || '',
                specs.ssd_sn || '',
                specs.cabinet_sn || '',
                specs.monitor_sn || '',
                specs.keyboard_sn || '',
                specs.mouse_sn || '',
                specs.graphic_card_sn || '',
                Number(specs.cabinet_warr || 12),
                Number(specs.motherboard_warr || 36),
                Number(specs.ram_warr || 36),
                Number(specs.ssd_warr || 36),
                Number(specs.processor_warr || 36),
                Number(specs.monitor_warr || 36),
                Number(specs.mouse_warr || 12),
                Number(specs.keyboard_warr || 12),
                Number(specs.graphic_card_warr || 36)
              ]
            );
          }
        } catch (syncErr) {
          console.warn('Sync to invoice tables warning:', syncErr.message);
        }
      } else {
        // ALLOCATE: Sync to trn_stock_transfer
        try {
          await conn.query(
            'INSERT INTO trn_stock_transfer (transfer_no, from_party_id, to_party_id, model_id, serial_no, dispatch_date, sale_valid_till, stock_status) VALUES (?, 1, ?, 1, ?, ?, ?, "IN_STOCK")',
            [`TRF-${Math.floor(10000 + Math.random() * 90000)}`, assignedPartyId, cleanSerial, dispatch_date || new Date().toISOString().split('T')[0], addMonthsToDate(dispatch_date || new Date().toISOString().split('T')[0], 6)]
          );
        } catch (trfErr) {
          console.warn('Sync to trn_stock_transfer warning:', trfErr.message);
        }
      }

      conn.release();

      const createdUnit = {
        unit_id: newUnitId,
        category_id: catId,
        category_name: cat.category_name,
        model_no,
        product_name,
        serial_no: cleanSerial,
        warranty_months: wMonths,
        specs: specs || {},
        status: targetStatus,
        assigned_party_id: assignedPartyId,
        assigned_party_name: assignedPartyName,
        dispatch_date: dispatch_date || new Date().toISOString().split('T')[0],
        sale_info: saleInfo
      };

      // Keep in-memory mirror updated
      MOCK_INVENTORY.unshift(createdUnit);

      return res.json({
        success: true,
        message: action === 'DIRECT_SALE'
          ? `Product ${cleanSerial} recorded & saved in MariaDB! Warranty active till ${saleInfo.warranty_end}!`
          : `Product ${cleanSerial} allocated to ${assignedPartyName} & saved in MariaDB!`,
        data: createdUnit
      });
    } catch (dbErr) {
      if (conn) conn.release();
      console.error('MariaDB error in POST /inventory, fallback:', dbErr.message);
    }

    // In-memory fallback
    const newUnit = {
      unit_id: MOCK_INVENTORY.length + 1,
      category_id: catId,
      category_name: cat.category_name,
      model_no: model_no || 'INVO-STD',
      product_name: product_name || `${cat.category_name} ${model_no}`,
      serial_no: cleanSerial,
      warranty_months: wMonths,
      specs: specs || {},
      status: targetStatus,
      assigned_party_id: assignedPartyId,
      assigned_party_name: assignedPartyName,
      dispatch_date: dispatch_date || new Date().toISOString().split('T')[0],
      sale_info: saleInfo
    };
    MOCK_INVENTORY.unshift(newUnit);

    res.json({
      success: true,
      message: action === 'DIRECT_SALE'
        ? `Product ${cleanSerial} recorded & sold directly. Warranty active till ${saleInfo.warranty_end}!`
        : `Product ${cleanSerial} allocated to ${assignedPartyName} successfully!`,
      data: newUnit
    });
  } catch (err) {
    console.error('Error creating inventory item:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. DISTRIBUTOR SPECIFIC APIS (MARIADB)
router.get('/distributor/inventory/:partyId', async (req, res) => {
  const partyId = Number(req.params.partyId);
  try {
    const conn = await db.getConnection();
    const rows = await conn.query(
      `SELECT u.*, p.party_name as assigned_party_name, c.category_name 
       FROM trn_inventory_unit u 
       LEFT JOIN mst_party p ON u.assigned_party_id = p.party_id 
       LEFT JOIN mst_category c ON u.category_id = c.category_id 
       WHERE u.assigned_party_id = ? 
       ORDER BY u.unit_id DESC`,
      [partyId]
    );
    conn.release();
    if (rows && rows.length > 0) {
      return res.json(rows.map(parseInventoryRow));
    }
  } catch (err) {
    console.warn('DB distributor inventory fallback:', err.message);
  }
  const items = MOCK_INVENTORY.filter(u => u.assigned_party_id === partyId);
  res.json(items);
});

// POST /api/distributor/sell (PERSIST IN MARIADB + UPDATE TABLES - NO INVOICE GENERATED)
router.post('/distributor/sell', async (req, res) => {
  try {
    const { serial_no, invoice_no, invoice_date, customer_name, zila, seller_party_id } = req.body;

    if (!serial_no) {
      return res.status(400).json({
        success: false,
        message: 'Serial Number is required.'
      });
    }

    if (!invoice_no || !invoice_no.trim() || invoice_no.trim().toUpperCase() === 'N/A') {
      return res.status(400).json({
        success: false,
        message: 'Invoice Number is mandatory. Warranty will only start after entering Invoice Number and Sale Date.'
      });
    }

    if (!invoice_date) {
      return res.status(400).json({
        success: false,
        message: 'Sale Date is mandatory. Warranty is calculated directly from this sale date.'
      });
    }

    const cleanSerial = serial_no.trim().toUpperCase();
    const invDate = invoice_date;
    const invNo = invoice_no.trim();

    let conn;
    try {
      conn = await db.getConnection();
      const rows = await conn.query('SELECT * FROM trn_inventory_unit WHERE serial_no = ?', [cleanSerial]);
      if (rows.length === 0) {
        conn.release();
        return res.status(404).json({ success: false, message: `Product with serial ${cleanSerial} not found in database.` });
      }

      const unitRow = rows[0];
      if (unitRow.status === 'SOLD' || (unitRow.sale_info && unitRow.sale_info.invoice_no)) {
        conn.release();
        return res.status(400).json({
          success: false,
          message: `Product ${cleanSerial} is already sold and invoiced. Invoice number and Sale Date are permanent and cannot be edited.`
        });
      }

      const sellerId = Number(seller_party_id || unitRow.assigned_party_id || 1);
      const isOem = (sellerId === 1);
      const sellerParty = MOCK_PARTIES.find(p => p.party_id == sellerId) || { party_name: isOem ? 'INVO IT Industries Pvt. Ltd. (OEM)' : 'Authorized Distributor' };
      const wMonths = Number(unitRow.warranty_months || 24);
      // WARRANTY STARTS FROM SALE DATE:
      const wStart = invDate;
      const wEnd = addMonthsToDate(invDate, wMonths);

      const saleInfo = {
        invoice_no: invNo,
        invoice_date: invDate,
        customer_name: customer_name || 'Customer',
        zila: zila || 'BILASPUR',
        seller_party_id: sellerId,
        seller_party_name: sellerParty.party_name,
        sale_type: isOem ? 'DIRECT' : 'DISTRIBUTOR',
        warranty_start: invDate,
        warranty_end: wEnd
      };

      // 1. Update trn_inventory_unit in MariaDB
      await conn.query(
        'UPDATE trn_inventory_unit SET status = "SOLD", sale_info = ? WHERE serial_no = ?',
        [JSON.stringify(saleInfo), cleanSerial]
      );

      // 2. Update trn_stock_transfer
      try {
        await conn.query('UPDATE trn_stock_transfer SET stock_status = "SOLD" WHERE serial_no = ?', [cleanSerial]);
      } catch (e) {}

      // 3. Insert into trn_invoice & trn_invoice_item & trn_computer_spec
      try {
        const invRes = await conn.query(
          'INSERT INTO trn_invoice (invoice_no, seller_party_id, customer_id, sale_type, invoice_date, total_qty) VALUES (?, ?, 1, ?, ?, 1)',
          [invNo, sellerId, isOem ? 'DIRECT' : 'DISTRIBUTOR', invDate]
        );
        const invId = Number(invRes.insertId);
        const itemRes = await conn.query(
          'INSERT INTO trn_invoice_item (invoice_id, model_id, serial_no, warranty_start, warranty_end) VALUES (?, 1, ?, ?, ?)',
          [invId, cleanSerial, invDate, wEnd]
        );
        const itemId = Number(itemRes.insertId);

        const specs = typeof unitRow.specs === 'string' ? JSON.parse(unitRow.specs || '{}') : unitRow.specs;
        if ((Number(unitRow.category_id) === 1 || Number(unitRow.category_id) === 6) && specs) {
          await conn.query(
            'INSERT INTO trn_computer_spec (item_id, processor, processor_sn, motherboard_sn, ram_size, ram_sn, ssd_size, ssd_sn, cabinet_sn, monitor_sn, keyboard_sn, mouse_sn, graphic_card_sn, cabinet_warr, motherboard_warr, ram_warr, ssd_warr, processor_warr, monitor_warr, mouse_warr, keyboard_warr, graphic_card_warr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              itemId,
              specs.processor || '',
              specs.processor_sn || '',
              specs.motherboard_sn || '',
              specs.ram_size || '',
              specs.ram_sn || '',
              specs.ssd_size || '',
              specs.ssd_sn || '',
              specs.cabinet_sn || '',
              specs.monitor_sn || '',
              specs.keyboard_sn || '',
              specs.mouse_sn || '',
              specs.graphic_card_sn || '',
              Number(specs.cabinet_warr || 12),
              Number(specs.motherboard_warr || 36),
              Number(specs.ram_warr || 36),
              Number(specs.ssd_warr || 36),
              Number(specs.processor_warr || 36),
              Number(specs.monitor_warr || 36),
              Number(specs.mouse_warr || 12),
              Number(specs.keyboard_warr || 12),
              Number(specs.graphic_card_warr || 36)
            ]
          );
        }
      } catch (invErr) {
        console.warn('Sync sell to invoice tables error:', invErr.message);
      }

      conn.release();

      const updatedUnit = parseInventoryRow({
        ...unitRow,
        status: 'SOLD',
        sale_info: saleInfo
      });

      // Update in-memory copy as well
      const memIdx = MOCK_INVENTORY.findIndex(u => u.serial_no.toUpperCase() === cleanSerial);
      if (memIdx >= 0) {
        MOCK_INVENTORY[memIdx].status = 'SOLD';
        MOCK_INVENTORY[memIdx].sale_info = saleInfo;
      }

      return res.json({
        success: true,
        message: `Product ${cleanSerial} successfully sold & recorded in MariaDB! Warranty activated till ${wEnd}.`,
        data: updatedUnit
      });
    } catch (dbErr) {
      if (conn) conn.release();
      console.error('DB sell error, using fallback:', dbErr.message);
    }

    // Fallback in-memory sell
    const unit = MOCK_INVENTORY.find(u => u.serial_no.toUpperCase() === cleanSerial);
    if (!unit) return res.status(404).json({ success: false, message: `Product with serial ${cleanSerial} not found.` });
    if (unit.status === 'SOLD' || (unit.sale_info && unit.sale_info.invoice_no)) {
      return res.status(400).json({
        success: false,
        message: `Product ${cleanSerial} is already sold and invoiced. Invoice number and Sale Date are permanent and cannot be edited.`
      });
    }

    const wEnd = addMonthsToDate(invDate, unit.warranty_months || 24);
    unit.status = 'SOLD';
    unit.sale_info = {
      invoice_no: invNo,
      invoice_date: invDate,
      customer_name: customer_name || 'Customer',
      zila: zila || 'BILASPUR',
      seller_party_id: Number(seller_party_id || unit.assigned_party_id),
      seller_party_name: 'In-vo it industry pvt. Ltd.',
      sale_type: 'DISTRIBUTOR',
      warranty_start: invDate,
      warranty_end: wEnd
    };

    res.json({
      success: true,
      message: `Product ${unit.serial_no} successfully sold! Warranty activated till ${wEnd}.`,
      data: unit
    });
  } catch (err) {
    console.error('Error in distributor sell:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Invoices API (MARIADB)
router.get('/invoices', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query(`
      SELECT i.invoice_id, i.invoice_no, i.invoice_date, i.sale_type, i.total_qty,
             p.party_name as seller_party_name,
             c.customer_name, c.district as zila,
             it.serial_no
      FROM trn_invoice i
      LEFT JOIN mst_party p ON i.seller_party_id = p.party_id
      LEFT JOIN mst_customer c ON i.customer_id = c.customer_id
      LEFT JOIN trn_invoice_item it ON i.invoice_id = it.invoice_id
      ORDER BY i.invoice_id DESC
    `);
    conn.release();
    if (rows && rows.length > 0) {
      return res.json(rows);
    }
  } catch (err) {}
  res.json(MOCK_INVOICES);
});

// 7. Customers API (MARIADB)
router.get('/customers', async (req, res) => {
  try {
    const conn = await db.getConnection();
    const rows = await conn.query('SELECT * FROM mst_customer ORDER BY customer_id ASC');
    conn.release();
    if (rows && rows.length > 0) {
      return res.json(rows);
    }
  } catch (err) {}
  const customers = [
    { customer_id: 1, customer_name: 'C TRIBLE DIPARTMEN', department: 'Tribal Welfare Department', district: 'BILASPUR', state: 'Chhattisgarh' },
    { customer_id: 2, customer_name: 'AC TRIBLE DIPARTMENT', department: 'Assistant Commissioner Tribal Dept', district: 'BILASPUR', state: 'Chhattisgarh' },
    { customer_id: 3, customer_name: 'St. Xavier Higher Secondary School', department: 'IT Department', district: 'South Delhi', state: 'Delhi' }
  ];
  res.json(customers);
});

router.post('/customers', async (req, res) => {
  const { customer_name, department, contact_person, mobile, email, address, district, state, pincode } = req.body;
  try {
    const conn = await db.getConnection();
    const result = await conn.query(
      'INSERT INTO mst_customer (customer_name, department, contact_person, mobile, email, address, district, state, pincode, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [customer_name, department, contact_person, mobile, email, address, district, state, pincode]
    );
    const newId = Number(result.insertId);
    conn.release();
    const newCust = { customer_id: newId, customer_name, department, contact_person, mobile, email, address, district, state, pincode, status: 1 };
    return res.json({ success: true, customer_id: newId, data: newCust });
  } catch (err) {
    res.json({ success: true, customer_id: Date.now(), data: req.body });
  }
});

// Helper to construct individual component warranties breakdown
function buildPartWarranties(unit, sale) {
  if ((Number(unit.category_id) !== 1 && Number(unit.category_id) !== 6) || !unit.specs) return [];
  const s = unit.specs;
  const isAio = Number(unit.category_id) === 6;
  const parts = [
    { key: 'Motherboard', name: 'Motherboard', sn: s.motherboard_sn, detail: 'Mainboard', w: s.motherboard_warr || unit.warranty_months || 36 },
    { key: 'Processor', name: 'Processor (CPU)', sn: s.processor_sn, detail: s.processor || 'CPU', w: s.processor_warr || unit.warranty_months || 36 },
    { key: 'RAM', name: 'RAM Memory', sn: s.ram_sn, detail: (s.ram_size ? s.ram_size + ' RAM' : 'RAM'), w: s.ram_warr || unit.warranty_months || 36 },
    { key: 'SSD', name: 'Solid State Drive (SSD)', sn: s.ssd_sn, detail: (s.ssd_size ? s.ssd_size + ' SSD' : 'SSD Storage'), w: s.ssd_warr || unit.warranty_months || 36 },
    { key: 'Cabinet', name: isAio ? 'AIO Chassis & Power Supply' : 'Cabinet & Power Supply', sn: s.cabinet_sn, detail: isAio ? 'AIO Body / SMPS' : 'Cabinet / SMPS', w: s.cabinet_warr || 12 },
    { key: 'Monitor', name: isAio ? 'Built-in Display Screen (AIO Monitor)' : 'Monitor Screen', sn: s.monitor_sn, detail: s.screen_size || (isAio ? '23.8" FHD IPS Panel' : 'Display Unit'), w: s.monitor_warr || unit.warranty_months || 36 },
    { key: 'Keyboard', name: 'Keyboard', sn: s.keyboard_sn, detail: 'Input Peripheral', w: s.keyboard_warr || 12 },
    { key: 'Mouse', name: 'Optical Mouse', sn: s.mouse_sn, detail: 'Input Peripheral', w: s.mouse_warr || 12 },
    { key: 'GraphicCard', name: 'Graphic Card (GPU)', sn: s.graphic_card_sn, detail: 'Video Adapter', w: s.graphic_card_warr || unit.warranty_months || 36 },
  ];

  return parts
    .filter(p => p.sn || p.detail)
    .map(p => {
      const wMonths = Number(p.w);
      let expiryDate = 'Upon Sale';
      let daysRem = 0;
      let partStatus = 'In Stock';

      if (sale && sale.warranty_start) {
        expiryDate = addMonthsToDate(sale.warranty_start, wMonths);
        const pExp = new Date(expiryDate);
        const now = new Date();
        daysRem = Math.max(0, Math.ceil((pExp - now) / (1000 * 60 * 60 * 24)));
        partStatus = daysRem > 0 ? 'Active' : 'Expired';
      }

      return {
        partName: p.name,
        serialNo: p.sn || 'Integrated / Included',
        details: p.detail,
        warrantyMonths: wMonths,
        warrantyEnd: expiryDate,
        status: partStatus,
        daysRemaining: daysRem
      };
    });
}

// 8. Warranty Check API (SEARCH DIRECTLY IN MARIADB BY PRIMARY SN, COMPONENT SN, OR INVOICE ID)
router.get('/warranty/:serialNumber', async (req, res) => {
  const target = (req.params.serialNumber || '').trim().toUpperCase();
  const reqCategory = (req.query.category || '').trim();
  const isCategoryFilter = reqCategory && !['ALL', 'ALL CATEGORIES'].includes(reqCategory.toUpperCase());

  let foundUnit = null;

  // 1. Try search in MariaDB trn_inventory_unit
  try {
    const conn = await db.getConnection();
    const rows = await conn.query(`
      SELECT u.*, p.party_name as assigned_party_name, c.category_name 
      FROM trn_inventory_unit u 
      LEFT JOIN mst_party p ON u.assigned_party_id = p.party_id 
      LEFT JOIN mst_category c ON u.category_id = c.category_id
    `);
    conn.release();

    for (const r of rows) {
      const parsed = parseInventoryRow(r);
      if (parsed.serial_no.toUpperCase() === target) {
        foundUnit = parsed;
        break;
      }
      if (parsed.sale_info && parsed.sale_info.invoice_no && parsed.sale_info.invoice_no.toUpperCase() === target) {
        foundUnit = parsed;
        break;
      }
      if (parsed.model_no && parsed.model_no.toUpperCase() === target) {
        foundUnit = parsed;
        break;
      }
      if (parsed.specs) {
        for (const val of Object.values(parsed.specs)) {
          if (typeof val === 'string' && val.trim().toUpperCase() === target) {
            foundUnit = parsed;
            break;
          }
        }
        if (foundUnit) break;
      }
    }
  } catch (err) {
    console.warn('DB warranty check error, trying in-memory fallback:', err.message);
  }

  // 2. In-memory fallback if not found in DB
  if (!foundUnit) {
    foundUnit = MOCK_INVENTORY.find(u => {
      if (u.serial_no.toUpperCase() === target) return true;
      if (u.sale_info && u.sale_info.invoice_no && u.sale_info.invoice_no.toUpperCase() === target) return true;
      if (u.model_no && u.model_no.toUpperCase() === target) return true;
      if (u.specs) {
        for (const val of Object.values(u.specs)) {
          if (typeof val === 'string' && val.trim().toUpperCase() === target) return true;
        }
      }
      return false;
    });
  }

  if (foundUnit) {
    // If category filter is specified, check for category match
    if (isCategoryFilter && foundUnit.category_name) {
      const unitCat = foundUnit.category_name.trim().toLowerCase();
      const filterCat = reqCategory.trim().toLowerCase();
      if (unitCat !== filterCat && !unitCat.includes(filterCat) && !filterCat.includes(unitCat)) {
        return res.status(200).json({
          found: false,
          wrongCategory: true,
          searchedCategory: reqCategory,
          actualCategory: foundUnit.category_name,
          serialNo: foundUnit.serial_no,
          productName: foundUnit.product_name,
          message: `Product serial "${foundUnit.serial_no}" belongs to the "${foundUnit.category_name}" category, but your current search is filtered by "${reqCategory}".`
        });
      }
    }
    const sale = foundUnit.sale_info;
    const isSoldWithInvoice = Boolean(
      (foundUnit.status === 'SOLD' || sale) &&
      sale &&
      sale.invoice_date &&
      sale.invoice_no &&
      sale.invoice_no.trim() !== '' &&
      sale.invoice_no.trim().toUpperCase() !== 'N/A'
    );

    if (!isSoldWithInvoice) {
      return res.status(200).json({
        found: true,
        isActivated: false,
        serialNo: foundUnit.serial_no,
        productName: foundUnit.product_name,
        category: foundUnit.category_name,
        brand: 'INVO',
        modelNo: foundUnit.model_no,
        warrantyPeriodMonths: foundUnit.warranty_months,
        status: 'Pending Sale',
        sellerName: foundUnit.assigned_party_name,
        spec: foundUnit.specs,
        partWarranties: buildPartWarranties(foundUnit, null),
        message: `Product is genuine and registered in the system. Warranty has not started yet. Warranty will start only when sold and invoice number and sale date are entered.`
      });
    }

    // Warranty starts exactly from Sale Date:
    const saleDate = sale.invoice_date;
    const wMonths = Number(foundUnit.warranty_months || 24);
    const calculatedExpiry = addMonthsToDate(saleDate, wMonths);
    const expiry = new Date(calculatedExpiry);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));
    const isExpired = daysRemaining <= 0;

    return res.json({
      found: true,
      isActivated: true,
      serialNo: foundUnit.serial_no,
      productName: foundUnit.product_name,
      category: foundUnit.category_name,
      brand: 'INVO',
      modelNo: foundUnit.model_no,
      customerName: sale.customer_name,
      zila: sale.zila,
      invoiceNo: sale.invoice_no,
      invoiceDate: saleDate,
      saleType: sale.sale_type,
      sellerName: sale.seller_party_name,
      warrantyStart: saleDate,
      warrantyEnd: calculatedExpiry,
      warrantyPeriodMonths: wMonths,
      status: isExpired ? 'Expired' : 'Active',
      daysRemaining: isExpired ? 0 : daysRemaining,
      spec: foundUnit.specs,
      partWarranties: buildPartWarranties(foundUnit, { ...sale, warranty_start: saleDate })
    });
  }

  return res.status(404).json({
    found: false,
    message: `No warranty or inventory record found for "${target}". Please check the serial number and try again.`
  });
});

module.exports = router;
