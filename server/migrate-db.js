const mariadb = require('mariadb');

async function migrate() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '123',
      database: 'invo_it'
    });
    console.log('Connected to MariaDB for database sync...');

    // 1. Ensure mst_party has password column
    const partyCols = await conn.query('DESCRIBE mst_party');
    const hasPassword = partyCols.some(c => c.Field === 'password');
    if (!hasPassword) {
      console.log('Adding password column to mst_party...');
      await conn.query("ALTER TABLE mst_party ADD COLUMN password VARCHAR(255) DEFAULT 'dist123'");
    }

    // 2. Ensure admin_users table exists and has proper schema
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        mobile VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('ADMIN', 'SUB_USER', 'DISTRIBUTOR') DEFAULT 'SUB_USER',
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Seed admin_users if empty
    const adminCount = await conn.query('SELECT COUNT(*) as cnt FROM admin_users');
    if (Number(adminCount[0].cnt) === 0) {
      console.log('Seeding initial admin and sub-users into admin_users...');
      await conn.query(`
        INSERT INTO admin_users (username, display_name, email, mobile, password, role, status) VALUES
        ('admin', 'Super Administrator', 'admin@invoit.in', '9876543210', '123', 'ADMIN', 1),
        ('rahul_user', 'Rahul Sharma', 'rahul@invoit.in', '9876500001', '123', 'SUB_USER', 1),
        ('amit_dist', 'Amit Verma (Distributor)', 'amit.technova@invoit.in', '9876500002', '123', 'DISTRIBUTOR', 1),
        ('priya_user', 'Priya Patel', 'priya@invoit.in', '9876500003', '123', 'SUB_USER', 1)
      `);
    }

    // 4. Update or insert parties so standard distributors exist with passwords
    const parties = [
      { party_id: 1, party_type: 'OEM', party_name: 'INVO IT Industries Pvt. Ltd.', gst_no: '07AAAAA0000A1Z5', contact_person: 'Rajesh Gupta', mobile: '9876543210', email: 'info@invoit.in', password: 'admin', address: 'Plot 42, Tech Park, Okhla Phase 3', district: 'South East Delhi', state: 'Delhi', pincode: '110020' },
      { party_id: 2, party_type: 'DISTRIBUTOR', party_name: 'In-vo it industry pvt. Ltd.', gst_no: '22AABCI1234F1Z8', contact_person: 'Sandeep Tiwari', mobile: '9827112233', email: 'sales@invoit-cg.com', password: 'dist123', address: 'Trade Center, Link Road', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001' },
      { party_id: 3, party_type: 'DISTRIBUTOR', party_name: 'R. P. ENTERPRISES', gst_no: '22RPENT5678G1Z1', contact_person: 'Ramesh Patel', mobile: '9425234567', email: 'rpenterprises@gmail.com', password: 'dist123', address: 'Gol Bazar', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001' },
      { party_id: 4, party_type: 'DISTRIBUTOR', party_name: 'M. R. ENTERPRISES', gst_no: '22MRENT9012H1Z3', contact_person: 'Manish Rawat', mobile: '9826198765', email: 'mrenterprises.bsp@gmail.com', password: 'dist123', address: 'Vyapar Vihar', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495004' },
      { party_id: 5, party_type: 'DISTRIBUTOR', party_name: 'Gunjan Industry', gst_no: '22GUNJN3456J1Z5', contact_person: 'Gunjan Sharma', mobile: '9752109876', email: 'gunjan.industry@outlook.com', password: 'dist123', address: 'Industrial Estate, Sirgitti', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495004' },
      { party_id: 6, party_type: 'DISTRIBUTOR', party_name: 'star enterprises', gst_no: '22STARE7890K1Z7', contact_person: 'Sunil Agrawal', mobile: '9981234567', email: 'starenterprises.bsp@gmail.com', password: 'dist123', address: 'Telipara Main Road', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001' },
      { party_id: 7, party_type: 'DISTRIBUTOR', party_name: 'TechNova Solutions Pvt Ltd', gst_no: '07BBBBA1111B1Z2', contact_person: 'Amit Verma', mobile: '9811122233', email: 'sales@technova.com', password: 'dist123', address: '102 Nehru Place Main Market', district: 'South Delhi', state: 'Delhi', pincode: '110019' }
    ];

    for (let p of parties) {
      const exists = await conn.query('SELECT party_id FROM mst_party WHERE party_id = ?', [p.party_id]);
      if (exists.length > 0) {
        await conn.query(
          `UPDATE mst_party SET 
            party_type = ?, party_name = ?, gst_no = ?, contact_person = ?, mobile = ?, email = ?, password = ?, address = ?, district = ?, state = ?, pincode = ?, status = 1
           WHERE party_id = ?`,
          [p.party_type, p.party_name, p.gst_no, p.contact_person, p.mobile, p.email, p.password, p.address, p.district, p.state, p.pincode, p.party_id]
        );
      } else {
        await conn.query(
          `INSERT INTO mst_party (party_id, party_type, party_name, gst_no, contact_person, mobile, email, password, address, district, state, pincode, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [p.party_id, p.party_type, p.party_name, p.gst_no, p.contact_person, p.mobile, p.email, p.password, p.address, p.district, p.state, p.pincode]
        );
      }
    }
    console.log('✅ Parties table synced with real distributor data & credentials.');

    // 5. Check trn_inventory_unit
    const unitCount = await conn.query('SELECT COUNT(*) as cnt FROM trn_inventory_unit');
    console.log(`trn_inventory_unit has ${unitCount[0].cnt} registered products.`);

    console.log('Database sync complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    if (conn) conn.end();
  }
}

migrate();
