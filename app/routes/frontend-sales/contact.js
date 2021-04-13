var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');

const folderView	 = __path_views_sales + 'pages/contact/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET contact page. */
router.get('/', async (req, res, next) => {
	
	let params 		 	 = ParamsHelpers.createParam(req);

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		popular: false,
		silde_bar: true,
		about_me: false,
		sub_banner: true,
		params
	});
});

module.exports = router;
