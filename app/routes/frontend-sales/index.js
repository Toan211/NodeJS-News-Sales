var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + 'get-user-info');
const middleGetTypeForMenu  = require(__path_middleware + 'get-type-for-menu');
const middleProductRandom       = require(__path_middleware + 'get-product-random');
//const middleArticleInCategory   = require(__path_middleware + 'get-article-in-category'); // do thg này mà bị lỗi js .me??? lolololol

router.use('/', middleGetUserInfo, middleGetTypeForMenu ,middleProductRandom, require('./home'));
// router.use('/category', require('./category'));
// router.use('/article', require('./article'));
// router.use('/about', require('./about'));
// router.use('/contact', require('./contact'));
// router.use('/rss', require('./rss'));
// router.use('/auth', require('./auth'));

module.exports = router;