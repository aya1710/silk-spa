
const { Pool } = require('pg');

const connStr = process.env.DATABASE_URL;
let config;

if (connStr) {
  config = { connectionString: connStr };
  if (!/localhost|127\.0\.0\.1/i.test(connStr)) {
    config.ssl = { rejectUnauthorized: false };
  }
  console.log('[DB] Using DATABASE_URL');
} else {
config = {
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.PGPORT || process.env.DB_PORT) || 5432,
  database: process.env.PGDATABASE || process.env.DB_NAME || 'visitor_db',
  user: process.env.PGUSER || process.env.DB_USER || 'postgres',
  password: String(process.env.PGPASSWORD || process.env.DB_PASSWORD || '')
};

  console.log(`[DB] Using discrete vars → host=${config.host} db=${config.database} user=${config.user}`);
}

const pool = new Pool(config);
pool.on('error', (err) => console.error('[DB] Pool error:', err.message));

module.exports = pool;
