const express = require("express");
const pool = require("../../db/pool");
const authenticateToken = require("../../middleware/auth");
const { isProvider } = require("../../middleware/role");

const router = express.Router();


router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role === "provider") {
      const q = await pool.query(`
        SELECT 
          b.id,
            (b.date::date + b.time::time) AS start_at,
          b.status,
          b.duration_min,
          b.price_at_booking AS price,
          u.name AS user_name,
          s.title AS service_title
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        ORDER BY b.date DESC
      `);
      const rows = q.rows.map(r => ({
      ...r,
      start_at: r.start_at ? new Date(r.start_at).toISOString() : null
    }));
     return res.json(rows);
    } else {
      res.status(403).json({ error: "Nur für Provider erlaubt" });
    }
  } catch (err) {
    console.error("❌ Fehler beim Laden der Provider-Buchungen:", err.message);
    res.status(500).json({ error: "Serverfehler" });
  }
});
router.get("/me", authenticateToken, async (req, res) => {
  try {
    if (req.user.role === "provider") {
      // كل الحجوزات
      const q = await pool.query(`
        SELECT 
          b.id,
          (b.date::date + b.time::time) AS start_at,
          b.status,
          b.duration_min,
          b.price_at_booking AS price,
          u.name AS user_name,
          s.title AS service_title
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        ORDER BY b.date DESC
      `);
      const rows = q.rows.map(r => ({
  ...r,
  start_at: r.start_at ? new Date(r.start_at).toISOString() : null
}));
      return res.json(rows);
    } else {
     
      const q = await pool.query(`
       SELECT 
            b.id,
           (b.date::date + b.time::time) AS start_at,
            b.status,
            b.duration_min,
            b.price_at_booking AS price,
            s.title AS service_title
          FROM bookings b
          JOIN services s ON b.service_id = s.id
          WHERE b.user_id = $1
          ORDER BY b.date DESC
      `, [req.user.id]);
      const rows = q.rows.map(r => ({
  ...r,
  start_at: r.start_at ? new Date(r.start_at).toISOString() : null
}));
      return res.json(rows);
    }
  } catch (e) {
    console.error("Booking Error:", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { service_id, variant_id, date, time, notes } = req.body;

    if (!service_id || !variant_id || !date || !time) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich" });
    }

   
    const variantQ = await pool.query(
      `SELECT duration_min, price FROM service_variants WHERE id=$1 AND service_id=$2`,
      [variant_id, service_id]
    );

    if (!variantQ.rows.length) {
      return res.status(400).json({ error: "Variante nicht gefunden" });
    }

    const { duration_min, price } = variantQ.rows[0];

   
    const q = await pool.query(
      `INSERT INTO bookings (user_id, service_id, variant_id, date, time, notes, duration_min, price_at_booking, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING *`,
      [req.user.id, service_id, variant_id, date, time, notes, duration_min, price]
    );
const result = {
      ...booking,
      start_at: startAt,
      variant_title: title
    };

    res.status(201).json(result);
  } catch (e) {
    console.error("❌ Booking error:", e.message);
    res.status(500).json({ error: e.message });
  }
});




router.patch("/:id", authenticateToken, isProvider, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED = new Set(["pending", "accepted", "rejected"]);
    if (!ALLOWED.has(status)) {
      return res.status(400).json({ error: "Ungültiger Status" });
    }

    const q = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );

    if (!q.rows.length) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = q.rows[0];

   
    const rawDate = booking.date ? String(booking.date) : null;
    const rawTime = booking.time ? String(booking.time).split('.')[0] : null;

    let start_at = null;
    if (rawDate && rawTime) {
      const iso = `${rawDate}T${rawTime}`;
      const d = new Date(iso);
      if (!isNaN(d.getTime())) {
        start_at = d.toISOString();
      }
    }

    return res.json({ ...booking, start_at });
  } catch (e) {
    console.error("❌ Update-Fehler:", e.message);
    return res.status(500).json({ error: "Serverfehler" });
  }
});

module.exports = router;
