const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  // todo: setup http-only cookie token exchange
  const { authorization } = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }
  req.user = payload;
  next();
};
