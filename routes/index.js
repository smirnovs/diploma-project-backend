const router = require('express').Router();
// const cookies = require('cookies');
const articlesRoute = require('./articles');
const usersRoute = require('./users');
const NotFoundError = require('../errors/not-found-err');
const errorMessage = require('../helpers/error-messages');
const usualMessage = require('../helpers/usual-messages');

const mainPage = (req, res) => {
  res.send({ message: usualMessage.API_HERE_MSG });
};

const errorPage = () => {
  throw new NotFoundError(errorMessage.NOT_FOUND_ERR);
};

const unAuth = (req, res) => {
  // cookies.set('jwt', { expires: Date.now() });
  res.clearCookie('jwt');
  res.send({ message: 'azaaza' });
};

router.get('/', mainPage);

module.exports = {
  router, articlesRoute, usersRoute, errorPage, unAuth,
};
