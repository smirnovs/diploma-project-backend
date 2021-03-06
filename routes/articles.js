const articlesRoute = require('express').Router();
const { getArticles, saveArticle, deleteArticle, getArticle } = require('../controllers/articles');


articlesRoute.get('/', getArticles);
articlesRoute.get('/:date', getArticle);
articlesRoute.post('/', saveArticle);
articlesRoute.delete('/:articleId', deleteArticle);

module.exports = articlesRoute;
