var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const ParamsHelpers = require(__path_helpers + 'params')

const folderView	 = __path_views_sales + 'pages/home/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next)=> {

	
	let itemsNews 	 	= [];
	let params 		 	 = ParamsHelpers.createParam(req);
	let sliderNumber = [0,1];

	// Latest News
	await ProductModel.listItemsFrontend(null, {task: 'items-news'} ).then( (items) => { itemsNews = items; });

	
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: true,
		silde_bar: true,
		about_me: true,
		sub_banner: false,
		popular: true,
		params,
		itemsNews,
		sliderNumber,
		titleHeader: "Home-BlackHOSTVN",
	});
});

module.exports = router;