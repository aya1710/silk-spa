const express = require('express');
const pool = require('../../db/pool');

const router = express.Router();


router.get('/', async (_req, res) => {
  try {
    const q = await pool.query(`
      SELECT s.id, s.title, s.image_url, s.image_alt,
             json_agg(
               json_build_object(
                 'id', v.id,
                 'duration_min', v.duration_min,
                 'price', v.price::float8,
                 'popular', v.popular
               )
               ORDER BY v.duration_min
             ) AS variants
      FROM services s
      JOIN service_variants v ON v.service_id = s.id
      WHERE s.active = TRUE
      GROUP BY s.id
      ORDER BY s.id DESC
    `);
    res.json(q.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
