var express = require('express');
var router = express.Router();

const middleGetUserInfo         = require(__path_middleware + 'get-user-info');
const middleGetTypeForMenu  = require(__path_middleware + 'get-type-for-menu');

const middleProductSpecial      = require(__path_middleware + 'get-product-special');
//const middleArticleInCategory   = require(__path_middleware + 'get-article-in-category'); // do thg này mà bị lỗi js .me??? lolololol

router.use('/', middleGetUserInfo, middleGetTypeForMenu , middleProductSpecial, require('./home'));
router.use('/type', require('./type'));
router.use('/product', require('./product'));
router.use('/about', require('./about'));
router.use('/contact', require('./contact'));
// router.use('/rss', require('./rss'));
// router.use('/auth', require('./auth'));

module.exports = router;