const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const isEmail = require('validator/lib/isEmail');
const AccessDenied = require('../errors/access-denied');
const errorMessage = require('../helpers/error-messages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: errorMessage.WRONG_MAIL_FORMAT_ERR,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // так что - обязательное поле
    minlength: 2, // минимальная длина  — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AccessDenied(errorMessage.WRONG_MAIL_OR_PWD_ERR);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AccessDenied(errorMessage.WRONG_MAIL_OR_PWD_ERR);
          }
          return user; // теперь user доступен
        });
    });
};

userSchema.plugin(uniqueValidator, { message: errorMessage.EMAIL_EXIST_ERR });

module.exports = mongoose.model('user', userSchema);
