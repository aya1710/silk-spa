const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const ACCESS_EXPIRES = '1h';
function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES }
  );
}

module.exports = { signToken };
