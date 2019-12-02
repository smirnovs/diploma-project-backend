const router = require('express').Router();
const articlesRoute = require('./articles');
const usersRoute = require('./users');

const mainPage = (req, res) => {
  res.send({ message: 'Тут находится API' });
};

const errorPage = (req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
};

router.get('/', mainPage);

module.exports = {
  router, articlesRoute, usersRoute, errorPage,
};
