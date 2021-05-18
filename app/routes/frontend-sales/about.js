var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');

const folderView	 = __path_views_sales + 'pages/about/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET about page. */
router.get('/', async (req, res, next) => {

	let params 		 	 = ParamsHelpers.createParam(req);
	
	let banner = {
		name: 'Giới thiệu về chúng tôi', 
		slug: '',
		avatar: 'pavshop/images/contact-page.jpg',
	}

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: false,
		about_me: true,
		sub_banner: true,
		popular: false,
		params,
		banner,
		titleHeader: "Giới thiệu-PAVSHOP",
	});
});

module.exports = router;
