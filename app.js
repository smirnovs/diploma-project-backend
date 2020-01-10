const express = require('express');
require('./database/mongodb');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const joiObjectId = require('joi-objectid');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorMessage = require('./helpers/error-messages');


Joi.objectId = joiObjectId(Joi);

// const corsOptions = {
//   origin: 'http://localhost:8080/',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };


const {
  login, createUser,
} = require('./controllers/users');

const {
  router, articlesRoute, usersRoute, errorPage, unAuth,
} = require('./routes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});


const { PORT = 3000 } = process.env;

const app = express();

app.use(cors({ credentials: true }));
// app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use('/', router);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .error(new Error(errorMessage.NEED_MAIL_ERR)),
    password: Joi.string().required().min(5)
      .error(new Error(errorMessage.NEED_PWD_ERR)),
    name: Joi.string().required().min(2).max(30)
      .error(new Error(errorMessage.NEED_NAME_ERR)),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .error(new Error(errorMessage.WRONG_NAME_OR_PWD)),
    password: Joi.string().required().min(5)
      .error(new Error(errorMessage.WRONG_NAME_OR_PWD)),
  }),
}), login);
app.use(auth);

app.use('/users', usersRoute);
app.use('/articles', articlesRoute);
app.use('/unauth', unAuth);
app.use('*', errorPage);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? errorMessage.SERVER_ERR
        : message,
    });
  next();
});

app.listen(PORT);
