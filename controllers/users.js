const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-error');

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
    .then((users) => res.status(201).send(users))
    .catch(() => {
      res.send({ message: 'Такая почта уже используется' });
      next(new AuthError('Такая почта уже используется'));
    });
};

const getUser = (req, res, next) => {
  const currenrUser = req.user._id;
  User.find({ _id: currenrUser })
    .then((users) => {
      if (users.length <= 0) {
        res.send({ message: 'Такого пользователя нет' });
        throw new NotFoundError('Такого пользователя нет');
      } else {
        res.send({ data: users });
      }
    }).catch(next);
};

const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser, getUser, login,
};
