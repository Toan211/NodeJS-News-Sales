var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + 'get-user-info');
const middleGetCategoryForMenu  = require(__path_middleware + 'get-category-for-menu');
const middleArticleRandom       = require(__path_middleware + 'get-article-random');
const middleArticleInCategory   = require(__path_middleware + 'get-article-in-category'); // do thg này mà bị lỗi js .me??? lolololol

router.use('/', middleGetUserInfo, middleGetCategoryForMenu ,middleArticleRandom, require('./home'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));
router.use('/about', require('./about'));
router.use('/contact', require('./contact'));
router.use('/rss', require('./rss'));
router.use('/auth', require('./auth'));

module.exports = router;