const articlesRoute = require('express').Router();
const { getArticles, saveArticle, deleteArticle } = require('../controllers/articles');


articlesRoute.get('/', getArticles);
articlesRoute.post('/', saveArticle);
articlesRoute.delete('/:articleId', deleteArticle);

module.exports = articlesRoute;
