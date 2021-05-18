var express = require('express');
var router = express.Router();

const ParamsHelpers = require(__path_helpers + 'params');
const ContactModel 		= require(__path_models + 'contact');
const NotifyHelpers		= require(__path_helpers + 'notify');
const linkIndex		 	=  `/sales/contact`;

const folderView	 = __path_views_sales + 'pages/contact/';
const layoutBlog    = __path_views_sales + 'frontend';

/* GET contact page. */
router.get('/', async (req, res, next) => {
	
	let params 		 	 = ParamsHelpers.createParam(req);
	let banner = {
		name: 'liên hệ với chúng tôi', 
		slug: '',
		avatar: 'pavshop/images/contact-page.jpg',
	}

	res.render(`${folderView}index`, {
		layout: layoutBlog,
		top_post: false,
		silde_bar: false,
		about_me: true,
		sub_banner: true,
		popular: false,
		params,
		banner,
		titleHeader: "Liên hệ-PAVSHOP",
	});
});

router.post('/save',   async(req, res, next) => {

  
	req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
	await  ContactModel.saveItem(item, {task: 'add'}).then((result) => {
			NotifyHelpers.show(req, res, linkIndex, {task: 'add-contact'});
	  });
  });

module.exports = router;
