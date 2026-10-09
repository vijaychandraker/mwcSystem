const db = require('./db');

async function migrate() {
  let conn;
  try {
    conn = await db.getConnection();
    console.log('Connected to MariaDB.');

    // 1. Add Category 'ALL IN ONE PC'
    await conn.query(`
      INSERT INTO mst_category (category_id, category_name) 
      VALUES (6, 'ALL IN ONE PC') 
      ON DUPLICATE KEY UPDATE category_name = VALUES(category_name)
    `);
    console.log('✅ Added / Updated category: ALL IN ONE PC (ID: 6)');

    // 2. Add / Update Model for ALL IN ONE PC
    try {
      await conn.query(`
        UPDATE mst_product_model 
        SET category_id = 6, model_no = 'INVO-AIO24', product_name = 'INVO All In One Computer 23.8" FHD', warranty_month = 36 
        WHERE model_id = 9
      `);
      console.log('✅ Updated model 9 to INVO-AIO24 for category 6');
    } catch (e) {
      console.warn('Model update note:', e.message);
    }

    // 3. Print current categories
    const categories = await conn.query('SELECT * FROM mst_category ORDER BY category_id ASC');
    console.log('Current categories in DB:', categories);

    // 4. Print product models
    const models = await conn.query('SELECT model_id, category_id, model_no, product_name FROM mst_product_model ORDER BY model_id ASC');
    console.log('Current models in DB:', models);

  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    if (conn) conn.release();
    process.exit(0);
  }
}

migrate();
