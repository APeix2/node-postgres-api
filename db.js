require('dotenv').config();
const { Pool } = require('pg');

// 建立 PostgreSQL 連線池
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
