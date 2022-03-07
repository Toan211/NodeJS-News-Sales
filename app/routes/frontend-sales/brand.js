var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ProductModel 	= require(__path_models + 'products');
const BrandModel = require(__path_models + 'brands');

const folderView	 = __path_views_sales + 'pages/brand/';
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
	let banner = {
		name: '', 
		slug: '',
		avatar: '',
	}
	let title = '';
	let max, min;
	//console.log(slugCategory);
	if(slugCategory !== 'giam-gia' && slugCategory !== '' )
	{
		// find id of category
		await BrandModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {
			idCategory = items[0].id;
			banner.name = items[0].name;
			banner.avatar = "uploads/brands/" + items[0].avatar;});
	
		// Article In Category
		await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-brand'} ).then( (items) => { itemsInCategory = items; });
		
		title = itemsInCategory[0].brand.name + "PAVSHOP";
	} else if(slugCategory == 'giam-gia') {
		banner.name = 'Giảm giá';
		banner.avatar = 'uploads/types/sale.jpg';
		await ProductModel.listItemsFrontend(null, {task: 'discount-items'}).then( (items) => {itemsInCategory = items;});
		title = "Giảm giá - PAVSHOP";
	} else {
		banner.name = 'tất cả đồng hồ';
		banner.avatar = 'uploads/types/Influential-Watches.jpg';
		await ProductModel.listItemsFrontend(null, {task: 'all-items'}).then( (items) => {itemsInCategory = items;});
		title = "Tất cả - PAVSHOP";
	}

	//console.log(itemsInCategory);
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

	await ProductModel.comparisonItems(null, {task:'max-value'}).then((values)=> {max = values[0].price;});
	
	await ProductModel.comparisonItems(null, {task:'min-value'}).then((values)=> {min = values[0].price;});
	

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
		banner,
		max, min,
		titleHeader: title ,
		
		
	});
});

router.get('/:id/json', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');

	let itemsBrandJs	= [];
	// Article In Category
	
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-brand'} ).then( (items) => { itemsBrandJs = items; });

	res.json(itemsBrandJs);
});

router.get('/filter/(:slug&)?gia=:min-:max', async (req, res, next) => {
	
	let minPrice = ParamsHelpers.getParam(req.params, 'min', '');
	let maxPrice = ParamsHelpers.getParam(req.params, 'max', '');
	let slugCategory 	= await ParamsHelpers.getParam(req.params, 'slug', '');
	let params 		 	= ParamsHelpers.createParam(req);
	let idCategory;
	let banner = {
		name: '', 
		slug: '',
		avatar: '',
	}
	let max, min;
	console.log(slugCategory);
	let itemsInCategory = [];

	if(slugCategory !== 'giam-gia' && slugCategory !== '') {
		// find id of category
		await BrandModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {
			idCategory = items[0].id; 
			banner.name = items[0].name;
			banner.avatar = "uploads/brands/" + items[0].avatar;});
		
		await ProductModel.listItemsFrontend({min: minPrice, max: maxPrice, id: idCategory}, {task: 'filter-price-brands'}).then( (items) => {itemsInCategory = items;});
	} else if(slugCategory == 'giam-gia'){
		banner.name = 'Giảm giá';
		banner.avatar = 'uploads/types/sale.jpg';
		await ProductModel.listItemsFrontend({min: minPrice, max: maxPrice}, {task: 'filter-price-discounts'}).then( (items) => {itemsInCategory = items;});
		
	} else {
		banner.name = 'tất cả đồng hồ';
		banner.avatar = 'uploads/types/Influential-Watches.jpg';
		await ProductModel.listItemsFrontend({min: minPrice, max: maxPrice}, {task: 'filter-price'}).then( (items) => {itemsInCategory = items;});
	}

	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

	await ProductModel.comparisonItems(null, {task:'max-value'}).then((values)=> {max = values[0].price;});
	
	await ProductModel.comparisonItems(null, {task:'min-value'}).then((values)=> {min = values[0].price;});

	res.render(`${folderView}index`, { 
	  
	  layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		about_me: false,
		sub_banner: true,
		popular: true,
		itemsInCategory,
		itemsRandom,
		banner,
		params,
		min, max,
		titleHeader: "lọc giá - PAVSHOP",
	});
  });

  module.exports = router;

  