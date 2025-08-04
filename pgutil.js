const pg = require('pg');
let pool = null;

const initPG = () => {
  const pgUrl = process.env.DATABASE_URL;
  console.log('pgUrl:', pgUrl);

  if (!pgUrl) {
    console.warn('[pgutil] DATABASE_URL not set. Skipping PG init.');
    return null;
  }

  try {
    pool = new pg.Pool({
      connectionString: pgUrl,
      ssl: { rejectUnauthorized: false }
    });
    return pool;
  } catch (err) {
    console.error('[pgutil] Failed to initialize PG:', err.message);
    pool = null;
    return null;
  }
};

const doSQL = async (query, values) => {
  let client;
  try {
    if (!pool) throw new Error('No PG instance');
    client = await pool.connect();
    return await client.query(query, values);
  } catch (err) {
    console.error('[pgutil] SQL Error:', err.message);
    return null;
  } finally {
    if (client) client.release();
  }
};

const createTable = async () => {
  if (!pool) {
    console.warn('[pgutil] Pool not available. Skipping table creation.');
    return;
  }

  console.log('[pgutil] Creating PostgreSQL tables...');
  const query = `
    CREATE TABLE IF NOT EXISTS "eConfigs" (
      id SERIAL PRIMARY KEY,
      appname character varying(255) NOT NULL,
      flows text,
      credentials text,
      packages text,
      settings text,
      "secureLink" text
    );
    CREATE TABLE IF NOT EXISTS "eLibs" (
      id SERIAL PRIMARY KEY,
      appname character varying(255) NOT NULL,
      type text,
      path text,
      meta text,
      body text
    );
    CREATE TABLE IF NOT EXISTS "ePrivateNodes" (
      id SERIAL PRIMARY KEY,
      appname character varying(255) NOT NULL,
      "packageName" text,
      data text
    );
  `;
  await doSQL(query, null);
};

// ... fungsi-fungsi lain (loadConfig, saveConfig, dst.) tetap sama ...
// Untuk ringkasnya tidak dituliskan ulang di sini, karena tidak memicu error startup.

exports.initPG = initPG;
exports.createTable = createTable;
// Ekspor fungsi lain jika tetap digunakan
