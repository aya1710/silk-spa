const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../../db/pool");
const { signToken } = require("../../utils/jwt");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password required" });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const check = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
      if (check.rowCount > 0) {
        return res.status(400).json({ error: "E-Mail bereits registriert" });
      }

    const q = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1,$2,$3,$4,'user')
       RETURNING id, name, email, role`,
      [name, email, phone || null, hashed]
    );

    const user = q.rows[0];
    const token = signToken(user);
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
