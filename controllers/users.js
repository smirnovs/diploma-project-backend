const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-error');
const errorMessage = require('../helpers/error-messages');
const secretKey = require('../helpers/secret-dev-key');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((users) => res.status(201).send({
      email: users.email,
      name: users.name,
    }))
    .catch(() => {
      next(new AuthError(errorMessage.EMAIL_EXIST_ERR));
    });
};

const getUser = (req, res, next) => {
  const currenrUser = req.user._id;
  User.findById({ _id: currenrUser })
    .then((users) => {
      if (!users) {
        throw new NotFoundError(errorMessage.USER_EXIST_ERR);
      } else {
        const clearUser = users._doc;
        delete clearUser._id;
        delete clearUser.__v;
        res.send(clearUser);
      }
    }).catch(next);
};

const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : secretKey.DEV_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, login,
};
