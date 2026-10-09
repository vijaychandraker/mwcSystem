const mariadb = require('mariadb');

async function testLive() {
  let conn;
  try {
    console.log('Testing connection to live database 103.102.234.77...');
    conn = await mariadb.createConnection({
      host: '103.102.234.77',
      user: 'rggroupindia_invo_user',
      password: '53U]MA=Ws,[^^zS7',
      database: 'rggroupindia_invo',
      port: 3306,
      connectTimeout: 15000
    });
    console.log('✅ Connected to live server successfully!');

    const categories = await conn.query('SELECT * FROM mst_category');
    console.log('Current live categories:', categories);

    const models = await conn.query('SELECT * FROM mst_product_model');
    console.log('Current live models count:', models.length);

    const units = await conn.query('SELECT unit_id, serial_no, category_id, model_no FROM trn_inventory_unit LIMIT 5');
    console.log('Sample units in live DB:', units);

  } catch (err) {
    console.error('❌ Connection error to live server:', err.message);
  } finally {
    if (conn) await conn.end();
    process.exit(0);
  }
}

testLive();
