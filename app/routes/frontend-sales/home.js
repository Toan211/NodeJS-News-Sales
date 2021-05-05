var express = require('express');
var router = express.Router();

const ProductModel = require(__path_models + 'products');
const ParamsHelpers = require(__path_helpers + 'params')
const TypeModel 	= require(__path_models + 'types');

const folderView	 = __path_views_sales + 'pages/home/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next)=> {

	let idType = [];
	let itemsSpecialInType= [];
	let itemsSpecial2 	 	= [];
	let params 		 	 = ParamsHelpers.createParam(req);
	let sliderNumber = [0,1,2];

	// Latest News
	await ProductModel.listItemsFrontend(null, {task: 'items-special2'} ).then( (items) => { itemsSpecial2 = items; });

	await TypeModel.listItemsFrontend(null, {task: 'items-in-menu'} ).then( (items) => { itemTypes = items; });

	for (let i = 0; i < itemTypes.length; i++) {
		
		await ProductModel.listItemsFrontend({id: itemTypes[i]._id}, {task: 'items-cate-special'} ).then( (items) => { itemsSpecialInType.push(items)  ; });
		
	}
//console.log(itemsSpecialInType[0]);
	//console.log(itemTypes);
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: true,
		silde_bar: true,
		about_me: true,
		sub_banner: false,
		popular: true,
		params,
		itemsSpecial2,
		itemsSpecialInType,
		sliderNumber,
		titleHeader: "Home-BlackHOSTVN",
	});
});

module.exports = router;