var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ProductModel 	= require(__path_models + 'products');
const TypeModel = require(__path_models + 'types');

const folderView	 = __path_views_sales + 'pages/type/';
const layoutBlog    = __path_views_sales + 'frontend';

//#region 
// GET home page.
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

//#endregion

router.get('/(:slug)?', async (req, res, next) => {
	let slugCategory 		= ParamsHelpers.getParam(req.params, 'slug', '');
	let params 		 	 = ParamsHelpers.createParam(req);
	let idCategory;
	let itemsInCategory	= [];
	let banner = {
		name: '', 
		slug: '',
		avatar: '',
	}
	let title = '';
	//let itemsInArticle	= [];
	console.log(slugCategory);

	if(slugCategory !== 'giam-gia' && slugCategory !== '' ) {
	// find id of category
	console.log("what?");
    await TypeModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {
		idCategory = items[0].id;
		banner.name = items[0].name;
		banner.avatar = "uploads/types/" + items[0].avatar;});
	// Article In Category
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

	//chọn product có price lớn nhất, cho nó vào 1 biến
	//chọn product có số price nhỏ nhất, nho nó vào 1 biến

	title = itemsInCategory[0].group.name + " - PAVSHOP";
	} else if(slugCategory == 'giam-gia'){
		banner.name = 'Giảm giá';
		banner.avatar = 'uploads/types/sale.jpg';
		await ProductModel.listItemsFrontend(null, {task: 'discount-items'}).then( (items) => {itemsInCategory = items;});
		title = "Giảm giá - PAVSHOP";
		
	}
	else {
		banner.name = 'tất cả đồng hồ';
		banner.avatar = 'uploads/types/Influential-Watches.jpg';
	await ProductModel.listItemsFrontend(null, {task: 'all-items'}).then( (items) => {itemsInCategory = items;});
	title = "Tất cả - PAVSHOP";
	}
	//await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		about_me: false,
		sub_banner: true,
		popular: true,
		itemsInCategory,
		banner,
		//itemsInArticle,
		itemsRandom,
		params,
		titleHeader: title ,
		
		
	});
});

router.get('/:id/json', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');

	let itemsArticleJs	= [];
	// Article In Category
	
	await ProductModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsArticleJs = items; });

	res.json(itemsArticleJs);
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
	
	console.log(slugCategory);
	let itemsInCategory = [];

	if(slugCategory !== 'giam-gia' && slugCategory !== '') {
		// find id of category
		await TypeModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {
			idCategory = items[0].id; 
			banner.name = items[0].name;
			banner.avatar = "uploads/types/" + items[0].avatar;});
		console.log("router type");
		await ProductModel.listItemsFrontend({min: minPrice, max: maxPrice, id: idCategory}, {task: 'filter-price-items'}).then( (items) => {itemsInCategory = items;});
	} else if(slugCategory == 'giam-gia'){
		console.log("router giam gia");
		banner.name = 'Giảm giá';
		banner.avatar = 'uploads/types/sale.jpg';
		await ProductModel.listItemsFrontend({min: minPrice, max: maxPrice}, {task: 'filter-price-discounts'}).then( (items) => {itemsInCategory = items;});
		
	} else {
		banner.name = 'tất cả đồng hồ';
		banner.avatar = 'uploads/types/Influential-Watches.jpg';
		console.log("router all");
		await ProductModel.listItemsFrontend({min: minPrice, max: maxPrice}, {task: 'filter-price'}).then( (items) => {itemsInCategory = items;});
	}

	await ProductModel.listItemsFrontend(null, {task: 'items-random'} ).then( (items) => {itemsRandom = items; });

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
		titleHeader: "lọc giá - PAVSHOP" ,
	});
  });

  //get thêm cái /giam-gia ở đây, có thể slug? &giam-gia&gia=min max

module.exports = router;