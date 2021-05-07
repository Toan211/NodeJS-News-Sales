var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ProductModel = require(__path_models + 'products');
const TypeModel = require(__path_models + 'types');

const folderView	 = __path_views_sales + 'pages/product/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET home page. */
// router.get('/:id', async (req, res, next) => {
// 	let idArticle 		= ParamsHelpers.getParam(req.params, 'id', '');
// 	let itemArticle		= {};
// 	let itemsOthers		= [];

// 	// Article Info
// 	await ProductModel.getItemFrontend(idArticle, null ).then( (item) => { itemArticle = item; });

// 	// Article In Category
// 	await ProductModel.listItemsFrontend(itemArticle, {task: 'items-others'} ).then( (items) => { itemsOthers = items; });
	
// 	res.render(`${folderView}index`, {
// 		layout: layoutBlog,
// 		top_post: false,
// 		silde_bar: true,
// 		itemsOthers,
// 		itemArticle
// 	});
// });

router.get('/(:slug)?', async (req, res, next) => {
	let slugArticle 		= ParamsHelpers.getParam(req.params, 'slug', '');
	let itemArticle		= {};
	let itemsOthersBrand= [];
	let itemsOthers		= [];
	let params 		 	 = ParamsHelpers.createParam(req);
	let banner = {
		name: '', 
		slug: '',
		avatar: '',
	}
	
	// Article Info
	await ProductModel.getSlugArticle(slugArticle, null ).then( (item) => { itemArticle = item[0]; });
	//console.log(itemArticle);
	// Get Category
	await TypeModel.getItems({id: itemArticle.group.id}, {task: 'get-items-by-id'}).then( (items) => {itemMainCategory = items;});

	// Article In Category
	await ProductModel.listItemsFrontend(itemArticle, {task: 'items-others'} ).then( (items) => { itemsOthers = items; });

	// Article In Category
	await ProductModel.listItemsFrontend(itemArticle, {task: 'items-others-brand'} ).then( (items) => { itemsOthersBrand = items; });
	//console.log(itemsOthersBrand);

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		about_me: false,
		sub_banner: false,
		popular: true,
		itemsOthers,
		itemArticle,
		itemMainCategory,
		itemsOthersBrand,
		params,
		banner,
		titleHeader: itemArticle.name + " - PAVSHOP " ,
	});
});

module.exports = router;
