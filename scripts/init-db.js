const fs = require('fs');
const path = require('path');
const pool = require('../src/models/db');

async function initDb() {
  const sqlPath = path.join(__dirname, '..', 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  await pool.query(sql);
  console.log('✅ Database schema ready');
}

initDb()
  .catch((err) => {
    console.error('❌ Database init failed:', err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
