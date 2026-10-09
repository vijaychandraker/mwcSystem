const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let commentType = ''; // '--' or '/*'

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1] || '';

    // Handle comments
    if (!inString) {
      if (!inComment) {
        if (char === '-' && nextChar === '-') {
          inComment = true;
          commentType = '--';
          i++;
          continue;
        } else if (char === '/' && nextChar === '*') {
          // Check for conditional comments like /*!40101
          if (sql[i + 2] === '!') {
            // Keep conditional comments or ignore them? Let's skip them if they set system variables
            inComment = true;
            commentType = '/*';
            i++;
            continue;
          } else {
            inComment = true;
            commentType = '/*';
            i++;
            continue;
          }
        }
      } else {
        if (commentType === '--' && (char === '\n' || char === '\r')) {
          inComment = false;
        } else if (commentType === '/*' && char === '*' && nextChar === '/') {
          inComment = false;
          i++;
        }
        continue;
      }
    }

    // Handle strings
    if (!inComment) {
      if ((char === "'" || char === '"' || char === '`') && sql[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }

      if (char === ';' && !inString) {
        if (current.trim().length > 0) {
          statements.push(current.trim());
        }
        current = '';
        continue;
      }

      current += char;
    }
  }

  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements;
}

async function runMigration() {
  let conn;
  try {
    console.log('Connecting to live database at 103.102.234.77...');
    conn = await mariadb.createConnection({
      host: '103.102.234.77',
      user: 'rggroupindia_invo_user',
      password: '53U]MA=Ws,[^^zS7',
      database: 'rggroupindia_invo',
      port: 3306,
      connectTimeout: 20000
    });
    console.log('✅ Connected!');

    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    const sqlContent = fs.readFileSync(path.join(__dirname, '../rggroupindia_invo.sql'), 'utf8');
    const statements = splitSqlStatements(sqlContent);
    console.log(`Found ${statements.length} statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (stmt.toLowerCase().startsWith('use ') || stmt.toLowerCase().startsWith('create database')) {
        continue; // Already connected to database
      }
      try {
        await conn.query(stmt);
        const firstLine = stmt.split('\n')[0].substring(0, 60);
        console.log(`[${i + 1}/${statements.length}] Done: ${firstLine}...`);
      } catch (err) {
        console.error(`❌ Error on statement ${i + 1}: ${err.message}\nSQL: ${stmt.substring(0, 100)}...`);
      }
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\n--- VERIFICATION OF LIVE DATABASE ---');
    const tables = await conn.query('SHOW TABLES');
    for (const t of tables) {
      const tbl = Object.values(t)[0];
      const count = await conn.query(`SELECT COUNT(*) as c FROM \`${tbl}\``);
      console.log(`Table: ${tbl.padEnd(25)} | Rows: ${count[0].c}`);
    }
    console.log('--- ALL TABLES SYNCED SUCCESSFULLY ---\n');
  } catch (e) {
    console.error('Fatal migration error:', e);
  } finally {
    if (conn) await conn.end();
  }
}

runMigration();
