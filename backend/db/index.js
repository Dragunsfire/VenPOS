// backend/db/index.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'wilfredo',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'pos_service',
  password: process.env.POSTGRES_PASSWORD || '22479708',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5433,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
