const mariadb = require('mariadb');

// MariaDB Connection Pool configuration
const pool = mariadb.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'mwcsystem_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  connectTimeout: 500,
  acquireTimeout: 500
});

async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  pool,
  getConnection
};
