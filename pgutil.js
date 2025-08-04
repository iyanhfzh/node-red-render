const { Pool } = require('pg');

let pool = null;

function initPg() {
    const pgUrl = process.env.DATABASE_URL || "";

    if (!pgUrl) {
        console.log("No DATABASE_URL provided, skipping PostgreSQL setup");
        return;
    }

    pool = new Pool({
        connectionString: pgUrl,
        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log("PostgreSQL pool created");
}

async function doSQL(sql) {
    if (!pool) return;
    const client = await pool.connect();
    try {
        await client.query(sql);
    } finally {
        client.release();
    }
}

async function createTable() {
    if (!pool) {
        console.log("PostgreSQL not initialized. Skipping createTable.");
        return;
    }
    const sql = `
        CREATE TABLE IF NOT EXISTS flows (
            id SERIAL PRIMARY KEY,
            flow JSONB
        );
    `;
    await doSQL(sql);
}

module.exports = {
    initPg,
    doSQL,
    createTable
};
