var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_sales + 'pages/orders-tracking/';
const layoutShop    = __path_views_sales + 'frontend';


router.get('/', async (req, res, next) => {
  let params 		 	 = ParamsHelpers.createParam(req);
  
  let query = ParamsHelpers.getParam(req.query, 'code', '');
  let item = [];
  await OrdersModel.getItems({code: query}, {task: 'get-items-by-code-order'}).then( (data) => {
    item = data;
  });
  

  res.render(`${folderView}index`, {
    titleHeader : 'Order tracking',
    layout: layoutShop,
    top_post: false,
    silde_bar: false,
    about_me: false,
    sub_banner: false,
    popular: false,
    params,
    query,
    item,
  });
});

router.get('/:id', async (req, res, next) => {

  let idOrder = ParamsHelpers.getParam(req.params, 'id', '');

  res.render(`${folderView}index`, {
    pageTitle : 'Order tracking',
    layout: layoutShop,
    top_post: false,
    silde_bar: false,
    about_me: false,
    sub_banner: false,
    popular: false,
    idOrder,
  });
});

module.exports = router;
