var express = require('express');
var router = express.Router();

const MainModel = require(__path_models + 'products');
const ParamsHelpers = require(__path_helpers + 'params');
const folderView	 = __path_views_sales + 'pages/cart/';
const layoutBlog    = __path_views_sales + 'frontend';
const linkIndex     = '/cart/';

//price: item.price - (item.price * (item.sale_off/100))
//thumb: item.thumb[2]

router.post('/add-to-cart', async (req, res, next) => {
  let item = [];
  let cart = [];
  let isExist = false;
  let cookie = req.cookies.cart;

  req.body = JSON.parse(JSON.stringify(req.body));
  await MainModel.getItem(req.body.id).then( (data) => {item = data;});
  console.log(item);
  if(cookie === undefined) {
    cart.push({ id: req.body.id, name: item.name, quantity: req.body.quantity, price: item.price - (item.price * (item.sale_off/100)), avatar: item.avatar[0], slug: item.slug });
  } else {
    cart = cookie;
    for(let i = 0; i < cart.length; i++) {
      if(req.body.id === cart[i].id && req.body.size === cart[i].size) {
        isExist = true;
        cart[i].quantity = Number(cart[i].quantity) + Number(req.body.quantity);
      }
    }
    if(isExist === false) cart.push({ id: req.body.id, name: item.name, quantity: req.body.quantity, price: item.price - (item.price * (item.sale_off/100)), avatar: item.avatar[0], slug: item.slug });
  }
  res.cookie('cart', cart);
  res.json(cart);
});

router.get('/', async (req, res, next) => {
  let items = [];
  let params 		 	 = ParamsHelpers.createParam(req);
  if(req.cookies.cart !== undefined) {
    items = req.cookies.cart;
  }
  res.render(`${folderView}index`, {
    layout: layoutBlog,
    top_post: false,
    silde_bar: false,
    about_me: false,
    sub_banner: true,
    popular: true,
    params,
    titleHeader: " - BlackHOSTVN " ,
    items,        
  });
});

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', '');
  let items = req.cookies.cart;
  for(let i = 0; i < items.length; i++) {
    if(id === items[i].id) items.splice(i, 1);
  }
  res.cookie('cart', items);
  res.redirect(linkIndex);
});

// Delete
router.get('/change-quantity-:state/:id', (req, res, next) => {
	let id				  = ParamsHelpers.getParam(req.params, 'id', '');
  let state				= ParamsHelpers.getParam(req.params, 'state', '');
  let value       = (state === 'increase') ? 1 : -1;
  let items = req.cookies.cart;
  for(let i = 0; i < items.length; i++) {
    if(id === items[i].id) {
      items[i].quantity = Number(items[i].quantity) + value;
    }
  }
  res.cookie('cart', items);
  res.redirect(linkIndex);
});

module.exports = router;
