const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

// Automatically read .env if present (useful for cPanel & production)
function loadEnv() {
  const envPaths = [path.join(__dirname, '.env'), path.join(__dirname, '../.env')];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let value = (match[2] || '').trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            if (!process.env[key]) process.env[key] = value;
          }
        });
        break;
      } catch (e) {}
    }
  }
}
loadEnv();

// MariaDB Connection Pool configuration
const pool = mariadb.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'invo_it',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  connectTimeout: 10000,
  acquireTimeout: 10000
});

async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  pool,
  getConnection
};
