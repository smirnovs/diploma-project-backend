const mongoose = require('mongoose');
const errorMessage = require('../helpers/error-messages');

const articleSchema = new mongoose.Schema({
  keyword: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // так что - обязательное поле
    minlength: 2, // минимальная длина  — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

articleSchema.path('link').validate((val) => {
  const imgRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;
  return imgRegex.test(val);
}, errorMessage.LINK_TO_ORIGIN_ERR);

articleSchema.path('image').validate((val) => {
  const imgRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
  return imgRegex.test(val);
}, errorMessage.NO_IMG_URL_ERR);

module.exports = mongoose.model('article', articleSchema);
