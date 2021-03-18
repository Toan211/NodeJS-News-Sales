var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ArticleModel 	= require(__path_models + 'articles');

const folderView	 = __path_views_blog + 'pages/category/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');
	let params 		 	 = ParamsHelpers.createParam(req);

	let itemsInCategory	= [];
	let itemsInArticle	= [];
	// Article In Category
	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'} ).then( (items) => { itemsInCategory = items; });

	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-news'} ).then( (items) => { itemsInArticle = items; });

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: true,
		itemsInCategory,
		itemsInArticle,
		params
	});
});

router.get('/:id/json', async (req, res, next) => {
	let idCategory 		= ParamsHelpers.getParam(req.params, 'id', '');

	let itemsArticleJs	= [];
	// Article In Category
	
	await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-news-category'} ).then( (items) => { itemsArticleJs = items; });

	res.json(itemsArticleJs);
});

router.get('/items/json', async (req, res, next) => {
	let itemsCategory   = [];
	
	//category
	await CategoryModel.listItemsFrontend(null,{task: 'items-in-menu'} ).then( (items) => { itemsCategory = items; });
  
	res.json(itemsCategory);
  });
  
  

module.exports = router;