const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const errorMessage = require('../helpers/error-messages');
const secretKey = require('../helpers/secret-dev-key');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(errorMessage.NEED_AUTH_ERR);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey.DEV_KEY);
  } catch (err) {
    throw new AuthError(errorMessage.NEED_AUTH_ERR);
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
