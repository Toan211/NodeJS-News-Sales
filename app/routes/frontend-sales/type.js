var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ProductModel 	= require(__path_models + 'products');

const folderView	 = __path_views_sales + 'pages/type/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
	let params 		 	 = ParamsHelpers.createParam(req);

	let itemsInCategory	= [];
	let itemsInArticle	= [];
	// Article In Category
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		itemsInCategory,
		itemsInArticle,
		itemsRandom,
		params
	});
});

router.get('/:id/json', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');

	let itemsArticleJs	= [];
	// Article In Category
	
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsArticleJs = items; });

	res.json(itemsArticleJs);
});

module.exports = router;