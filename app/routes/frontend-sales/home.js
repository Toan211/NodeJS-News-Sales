var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');

const folderView	 = __path_views_sales + 'pages/home/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next)=> {

	let itemsSpecial 	= [];
	let itemsNews 	 	= [];

	await ProductModel.listItemsFrontend(null, {task: 'items-special'} ).then( (items) => { itemsSpecial = items; });

	// Latest News
	await ProductModel.listItemsFrontend(null, {task: 'items-news'} ).then( (items) => { itemsNews = items; });

	
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: true,
		silde_bar: true,
		itemsSpecial,
		itemsNews,
	});
});

module.exports = router;