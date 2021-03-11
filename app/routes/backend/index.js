var express = require('express');
var router = express.Router();

const middleAuthentication = require(__path_middleware + 'auth');

router.use('/', middleAuthentication , require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/categories', require('./categories'));
router.use('/rss', require('./rss'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/articles', require('./articles'));


module.exports = router;
