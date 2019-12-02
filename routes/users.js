const usersRoute = require('express').Router();
const { getUser } = require('../controllers/users');


usersRoute.get('/me', getUser);

module.exports = usersRoute;
