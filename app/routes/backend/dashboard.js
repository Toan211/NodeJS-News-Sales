var express = require('express');
var router = express.Router();

const folderView	 = __path_views_admin + 'pages/dashboard/';

const ItemsModel 	= require(__path_schemas + 'items');
const GroupsModel 	= require(__path_schemas + 'groups');
const UsersModel 	= require(__path_schemas + 'users');
const CategoryModel = require(__path_schemas + 'categories');
const ArticleModel 	= require(__path_schemas + 'articles');
const SliderModel 	= require(__path_schemas + 'slider');
const ContactModel 	= require(__path_schemas + 'contact');
const RSSModel 		= require(__path_schemas + 'rss');
const ProductModel 	= require(__path_schemas + 'products');
const TypeModel 	= require(__path_schemas + 'types');
const BrandModel 	= require(__path_schemas + 'brands');

const countItemHelpers 	= require(__path_helpers + 'count-items');

/* GET dashboard page. */
router.get('/', async(req, res, next) => {
	let totalItems = 0;
	totalItems = await countItemHelpers.countItems2(ItemsModel);
	let totalGroups = 0;
  	totalGroups = await countItemHelpers.countItems2(GroupsModel);
  	let totalUsers = 0;
	totalUsers = await countItemHelpers.countItems2(UsersModel);
  	let totalCategories = 0;
	totalCategories = await countItemHelpers.countItems2(CategoryModel);
	let totalArticles = 0;
	totalArticles = await countItemHelpers.countItems2(ArticleModel);
	let totalProducts = 0;
	totalProducts = await countItemHelpers.countItems2(ProductModel);
	let totalTypes = 0;
	totalTypes = await countItemHelpers.countItems2(TypeModel);
	let totalBrands = 0;
	totalBrands = await countItemHelpers.countItems2(BrandModel);
	let totalContacts = 0;
	totalContacts = await countItemHelpers.countItems2(ContactModel);
	let totalRss = 0;
	totalRss = await countItemHelpers.countItems2(RSSModel);
	let totalSliders = 0;
	totalSliders = await countItemHelpers.countItems2(SliderModel);

	res.render(`${folderView}index`, { 
		pageTitle: 'Dashboard Page', 
		totalItems,
    	totalGroups,
    	totalUsers,
    	totalCategories,
		totalArticles,
		totalProducts,
		totalTypes,
		totalContacts,
		totalRss,
		totalSliders,
		totalBrands,
	});
});

module.exports = router;
