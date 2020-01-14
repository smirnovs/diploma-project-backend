const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const errorMessage = require('../helpers/error-messages');
const secretKey = require('../helpers/secret-dev-key');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey.DEV_KEY);
  } catch (err) {
    throw new AuthError(errorMessage.NEED_AUTH_ERR);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
