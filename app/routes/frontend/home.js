var express = require('express');
var router = express.Router();

const ArticleModel = require(__path_models + 'articles');

const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next)=> {

	
	let itemsNews 	 	= [];

	// Latest News
	await ArticleModel.listItemsFrontend(null, {task: 'items-news'} ).then( (items) => { itemsNews = items; });

	
	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: true,
		silde_bar: true,
		
		itemsNews,
	});
});


router.get('/items/json', async (req, res, next) => {
	let itemsCategory   = [];
	
	//category
	await CategoryModel.listItemsFrontend(null,{task: 'items-in-menu'} ).then( (items) => { itemsCategory = items; });
  
	res.json(itemsCategory);
  });

module.exports = router;