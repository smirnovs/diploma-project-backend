const Aticle = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const AccessDenied = require('../errors/access-denied');
const SomeError = require('../errors/some-error');


const getArticles = (req, res, next) => {
  Aticle.find({})
    .then((articles) => {
      if (articles.length <= 0) {
        res.send({ message: 'Карточек пока что нет' });
        throw new NotFoundError('Карточек пока что нет');
      } else {
        res.send({ data: articles });
      }
    }).catch(next);
};

const saveArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Aticle.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      res.send({ data: article });
    }).catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const currentUser = req.user._id;
  Aticle.findById(articleId).then((article) => {
    if (!article) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    const articleOwner = article.owner.toString();
    if (articleOwner !== currentUser) {
      res.send({ message: 'Отказано в доступе' });
      throw new AccessDenied('Отказано в доступе');
    } else {
      Aticle.findByIdAndRemove(articleId)
        .then((deletedArticle) => {
          if (!deletedArticle) {
            throw new SomeError('Не удалось удалить');
          }
          //  показываем карточку
          res.send({ data: deletedArticle });
          //  catch при ошибке поиска карточки
        })
        .catch(next);
    }
  }).catch(next);
};

module.exports = {
  getArticles, saveArticle, deleteArticle,
};
