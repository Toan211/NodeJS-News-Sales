var express = require('express');
var router = express.Router();

const middleShop = 'shop/';

const middleGetUserInfo         = require(__path_middleware + 'get-user-info');
const middleGetTypeForMenu  = require(__path_middleware + middleShop + 'get-type-for-menu');
const middleGetBrandForMenu  = require(__path_middleware + middleShop + 'get-brand-for-menu');
const middleGetSlider  = require(__path_middleware + middleShop + 'get-slider-shop');
const middleProductSpecial      = require(__path_middleware + middleShop + 'get-product-special');
const middleProductNews      = require(__path_middleware + middleShop + 'get-product-news');

//const middleArticleInCategory   = require(__path_middleware + 'get-article-in-category'); // do thg này mà bị lỗi js .me??? lolololol

router.use('/',middleGetSlider, middleGetUserInfo, middleGetTypeForMenu, middleGetBrandForMenu , middleProductSpecial, require('./home'));
router.use('/type', require('./type'));
router.use('/brand', require('./brand'));
router.use('/search', require('./search'));
router.use('/product', require('./product'));
router.use('/about', require('./about'));
router.use('/contact', require('./contact'));
router.use('/cart', require('./cart'));
router.use('/checkout', require('./checkout'));
router.use('/orders-tracking', require('./orders-tracking'));

// router.use('/auth', require('./auth'));

module.exports = router;