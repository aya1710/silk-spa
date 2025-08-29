const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../../db/pool');
const { signToken } = require('../../utils/jwt');

const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email, password required' });
    }

    const q = await pool.query(
      `SELECT * FROM users WHERE lower(email)=lower($1)`,
      [email]
    );
    if (!q.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = q.rows[0];
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
