const { Pool } = require("pg");

let pool = null;

function initPG() {
  const pgUrl = process.env.DATABASE_URL;
  if (!pgUrl) {
    console.warn("[pgutil] DATABASE_URL not found. Skipping PG setup.");
    return null;
  }

  try {
    pool = new Pool({ connectionString: pgUrl });
    return pool;
  } catch (err) {
    console.warn("[pgutil] Failed to init PG:", err.message);
    return null;
  }
}

async function doSQL(query, values) {
  if (!pool) return;

  const client = await pool.connect();
  try {
    return await client.query(query, values);
  } finally {
    client.release();
  }
}

async function createTable() {
  if (!pool) {
    console.warn('[pgutil] Pool not available. Skipping table creation.');
    return;
  }

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

  try {
    await doSQL(query);
  } catch (err) {
    console.warn("[pgutil] Failed to create tables:", err.message);
  }
}

module.exports = {
  initPG,
  createTable,
  doSQL
};
