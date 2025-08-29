

const express = require('express');
const pool = require('../../db/pool');
const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const hours = await pool.query(`
      SELECT dow,
             to_char(open_time,'HH24:MI') AS open,
             to_char(close_time,'HH24:MI') AS close,
             is_closed
      FROM opening_hours
      ORDER BY dow
    `);
    res.json({  opening_hours: hours.rows });
  } catch (e) {
     console.error("❌ Opening hours error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
module.exports = router;
