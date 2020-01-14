const Aticle = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const AccessDenied = require('../errors/access-denied');
const NoContent = require('../errors/no-content');
const SomeError = require('../errors/some-error');
const errorMessage = require('../helpers/error-messages');

const getArticles = (req, res, next) => {
  const owner = req.user._id;
  Aticle.find({ owner })
    .then((articles) => {
      if (articles.length <= 0) {
        throw new NotFoundError(errorMessage.NO_CARDS_ERR);
      } else {
        res.send({ data: articles });
      }
    }).catch(next);
};

const getArticle = (req, res, next) => {
  const owner = req.user._id;
  // const { date } = req.body;
  const { pseudoid } = req.params;
  Aticle.find({ owner, pseudoId: pseudoid })
    .then((articles) => {
      if (articles.length <= 0) {
        throw new NoContent(errorMessage.NO_CARDS_ERR);
      } else {
        res.send({ data: articles });
      }
    }).catch(next);
};

const saveArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    pseudoId, keyword, title, text, date, source, link, image,
  } = req.body;
  Aticle.create({
    pseudoId, keyword, title, text, date, source, link, image, owner,
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
      throw new NotFoundError(errorMessage.NO_CARD_WITH_ID_ERR);
    }
    const articleOwner = article.owner.toString();
    if (articleOwner !== currentUser) {
      throw new AccessDenied(errorMessage.ACCESS_DENIED_ERR);
    } else {
      Aticle.findByIdAndRemove(articleId)
        .then((deletedArticle) => {
          if (!deletedArticle) {
            throw new SomeError(errorMessage.CANT_DELETE_ERR);
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
  getArticles, saveArticle, deleteArticle, getArticle,
};
