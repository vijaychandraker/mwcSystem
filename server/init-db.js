const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  let conn;
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306');
  
  // Try connecting with configured password ('123'), then try empty password ('')
  let passwordsToTry = [process.env.DB_PASSWORD || '123', ''];

  try {
    for (let pass of passwordsToTry) {
      try {
        console.log(`Attempting connection to MariaDB (${host}:${port}) as root with password: "${pass}"...`);
        conn = await mariadb.createConnection({
          host,
          user: 'root',
          password: pass,
          port,
          multipleStatements: true
        });
        console.log(`✅ Connected successfully with password "${pass}"!`);

        // Set root password to '123' if it was empty
        if (pass === '') {
          try {
            await conn.query("ALTER USER 'root'@'localhost' IDENTIFIED BY '123';");
            await conn.query("FLUSH PRIVILEGES;");
            console.log("🔑 Updated root password to '123'.");
          } catch (e) {
            // Ignore if user alter format varies
          }
        }
        break;
      } catch (err) {
        if (err.errno === 1045) {
          console.log(`Password "${pass}" denied. Trying next...`);
          continue;
        }
        throw err;
      }
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('⚠️ MariaDB server is currently offline / not running on port 3306.');
    } else {
      console.error('⚠️ Connection error:', err.message);
    }
  }

  if (!conn) {
    console.error('\n⚠️ MariaDB service is not running on 127.0.0.1:3306 or root authentication failed.');
    console.log('📌 You can import "invo_it.sql" directly using MySQL Workbench, DBeaver, or command line:');
    console.log('   mysql -u root -p < invo_it.sql\n');
    return;
  }

  try {
    // Read the SQL script file
    const sqlPath = path.join(__dirname, '..', 'invo_it.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('\n📄 Executing database schema and seed script (invo_it.sql)...');
    
    // Execute full SQL script
    await conn.query(sql);

    console.log('✅ Database "invo_it" and all tables created successfully!');

    // Switch to database and check tables
    await conn.query('USE invo_it');
    const tableList = [
      'mst_party', 'mst_customer', 'mst_category', 'mst_product_model',
      'trn_stock_transfer', 'trn_extension_request', 'trn_extension_approval',
      'trn_invoice', 'trn_invoice_item', 'trn_computer_spec',
      'trn_monitor_spec', 'trn_tv_spec', 'trn_panel_spec', 'trn_bulb_spec'
    ];

    const summary = [];
    for (let tbl of tableList) {
      const res = await conn.query(`SELECT COUNT(*) as total FROM ${tbl}`);
      summary.push({ Table: tbl, Rows: Number(res[0].total) });
    }

    console.log('\n📊 SUMMARY OF ALL 14 TABLES & DUMMY DATA IN "invo_it":');
    console.table(summary);

  } catch (err) {
    console.error('❌ Schema Execution Error:', err.message);
  } finally {
    if (conn) conn.end();
  }
}

initDatabase();
