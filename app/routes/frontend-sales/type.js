var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ProductModel 	= require(__path_models + 'products');
const TypeModel = require(__path_models + 'types');

const folderView	 = __path_views_sales + 'pages/type/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET home page. */
// router.get('/:id', async (req, res, next) => {
// 	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
// 	let params 		 	 = ParamsHelpers.createParam(req);

// 	let itemsInCategory	= [];
// 	let itemsInArticle	= [];
// 	// Article In Category
// 	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

// 	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

// 	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

// 	res.render(`${folderView}index`, {
// 		layout: layoutBlog,
// 		top_post: false,
// 		silde_bar: true,
// 		about_me: false,
// 		itemsInCategory,
// 		itemsInArticle,
		
// 		itemsRandom,
// 		params
// 	});
// });


router.get('/(:slug)?', async (req, res, next) => {
	let slugCategory 		= ParamsHelpers.getParam(req.params, 'slug', '');
	let params 		 	 = ParamsHelpers.createParam(req);
	let idCategory;
	let itemsInCategory	= [];
	let itemsInArticle	= [];
	//console.log(slugCategory);
	// find id of category
    await TypeModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id});
	// Article In Category
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		about_me: false,
		sub_banner: true,
		popular: true,
		itemsInCategory,
		itemsInArticle,
		itemsRandom,
		params,
		titleHeader: itemsInCategory[0].group.name + " - BlackHOSTVN" ,
		
		
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