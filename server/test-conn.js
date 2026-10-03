const db = require('./db');

async function testConnection() {
  try {
    const conn = await db.getConnection();
    console.log('✅ MariaDB invo_it Connection Successful!');
    
    const parties = await conn.query('SELECT COUNT(*) as count FROM mst_party');
    console.log(' ├── 🏢 Parties Count in DB:     ', Number(parties[0].count));

    const models = await conn.query('SELECT COUNT(*) as count FROM mst_product_model');
    console.log(' ├── 📦 Product Models Count:    ', Number(models[0].count));

    const transfers = await conn.query('SELECT COUNT(*) as count FROM trn_stock_transfer');
    console.log(' ├── 🚚 Stock Transfers Count:   ', Number(transfers[0].count));

    const invoices = await conn.query('SELECT COUNT(*) as count FROM trn_invoice');
    console.log(' ├── 📄 Invoices Count in DB:    ', Number(invoices[0].count));

    const customers = await conn.query('SELECT COUNT(*) as count FROM mst_customer');
    console.log(' └── 👤 Customers Count in DB:   ', Number(customers[0].count));

    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Connection Test Error:', err.message);
    process.exit(1);
  }
}

testConnection();
