const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  let conn;
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306');
  
  // Try connecting with configured password ('123'), then try empty password ('')
  let passwordsToTry = [process.env.DB_PASSWORD || '123', ''];

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

  if (!conn) {
    console.error('❌ Could not authenticate with MariaDB root user.');
    return;
  }

  try {
    // Read the SQL script file
    const sqlPath = path.join(__dirname, '..', 'mwcsystem_db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('\n📄 Executing database schema and seed script (mwcsystem_db.sql)...');
    
    // Execute full SQL script
    await conn.query(sql);

    console.log('✅ Database "mwcsystem_db" and all tables created successfully!');

    // Switch to database and check tables
    await conn.query('USE mwcsystem_db');
    const tables = await conn.query('SHOW TABLES');
    console.log('\n📊 Tables created in mwcsystem_db:');
    console.table(tables);

    const productCount = await conn.query('SELECT COUNT(*) as total FROM products');
    const warrantyCount = await conn.query('SELECT COUNT(*) as total FROM warranties');
    const customerCount = await conn.query('SELECT COUNT(*) as total FROM customers');

    console.log('\n🎉 SUMMARY OF CREATED TABLES & SEED DATA:');
    console.log(` ├── 📦 Products Table:    ${productCount[0].total} items`);
    console.log(` ├── 🛡️ Warranties Table:  ${warrantyCount[0].total} records`);
    console.log(` └── 👤 Customers Table:   ${customerCount[0].total} users`);

  } catch (err) {
    console.error('❌ Schema Execution Error:', err.message);
  } finally {
    if (conn) conn.end();
  }
}

initDatabase();
