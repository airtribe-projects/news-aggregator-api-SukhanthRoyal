const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.sendStatus(401);
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    return res.sendStatus(401);
  }
}

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

module.exports = { auth, signToken };