const jwt = require('jsonwebtoken');
function authGuard(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Authentication required. Sign in and send a Bearer token.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch (_error) { return res.status(401).json({ error: 'Your session is invalid or expired. Please sign in again.' }); }
}
function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'You do not have permission to perform this action.' });
}
module.exports = { authGuard, allowRoles };
