const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  // todo: setup http-only cookie token exchange
  const { authorization } = req.headers;
  const { SECRET_KEY = 'secret-key' } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }
  req.user = payload;
  next();
};
