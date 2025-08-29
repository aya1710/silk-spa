const express = require("express");
const pool = require("../../db/pool");
const authenticateToken = require("../../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const q = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id=$1`,
      [req.user.id]
    );
    res.json(q.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
