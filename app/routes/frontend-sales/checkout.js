var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const PromoModel = require(__path_models + 'promo');
const StringHelpers   = require(__path_helpers + 'string');
const EmailHelpers		= require(__path_helpers + 'email');
const ParamsHelpers = require(__path_helpers + 'params');


const folderView	 = __path_views_sales + 'pages/checkout/';
const layoutShop    = __path_views_sales + 'frontend';
const linkIndex     = '/orders-tracking';


router.get('/', async (req, res, next) => {
  let items = [];
  let sale_off = 0;
  let params 		 	 = ParamsHelpers.createParam(req);
  if(req.cookies.cart !== undefined) {
    items = req.cookies.cart;
  }
  if(req.cookies.sale_off !== undefined) {
    sale_off = req.cookies.sale_off.saleOff;
  }
  res.render(`${folderView}index`, {
    titleHeader : 'Checkout',
    layout: layoutShop,
    top_post: false,
    silde_bar: false,
    about_me: false,
    sub_banner: false,
    popular: false,
    params,
    items,
    sale_off,
  });
});

router.get('/get-shipping-fee',   async (req, res, next) => {
  let fee = [
      {name: 'An Giang', value: '10000'},
      {name: 'Bà Rịa - Vũng Tàu', value: '3000'},
      {name: 'Bắc Giang', value: '12000'},
      {name: 'Bắc Kạn', value: '12000'},
      {name: 'Bạc Liêu', value: '8000'},
      {name: 'Bắc Ninh', value: '15000'},
      {name: 'Bến Tre', value: '6000'},
      {name: 'Bình Định', value: '6000'},
      {name: 'Bình Dương', value: '2000'},
      {name: 'Bình Phước', value: '4000'},
      {name: 'Bình Thuận', value: '4000'},
      {name: 'Cà Mau', value: '2000'},
      {name: 'Cần Thơ', value: '3000'},
      {name: 'Cao Bằng', value: '15000'},
      {name: 'Đà Nẵng', value: '7000'},
      {name: 'Đắk Lắk', value: '10000'},
      {name: 'Đắk Nông', value: '10000'},
      {name: 'Điện Biên', value: '20000'},
      {name: 'Đồng Nai', value: '2000'},
      {name: 'Đồng Tháp', value: '3000'},
      {name: 'Gia Lai', value: '8000'},
      {name: 'Hà Giang', value: '10000'},
      {name: 'Hà Nam', value: '10000'},
      {name: 'Hà Nội', value: '12000'},
      {name: 'Hà Tĩnh', value: '11000'},
      {name: 'Hải Dương', value: '13000'},
      {name: 'Hải Phòng', value: '12000'},
      {name: 'Hậu Giang', value: '5000'},
      {name: 'Hồ Chí Minh', value: '1000'},
      {name: 'Hòa Bình', value: '8000'},
      {name: 'Hưng Yên', value: '6000'},
      {name: 'Khánh Hòa', value: '6000'},
      {name: 'Kiên Giang', value: '7000'},
      {name: 'Kon Tum', value: '8000'},
      {name: 'Lai Châu', value: '9000'},
      {name: 'Lâm Đồng', value: '10000'},
      {name: 'Lạng Sơn', value: '16000'},
      {name: 'Lào Cai', value: '14000'},
      {name: 'Long An', value: '3000'},
      {name: 'Nam Định', value: '5000'},
      {name: 'Nghệ An', value: '5000'},
      {name: 'Ninh Bình', value: '4000'},
      {name: 'Ninh Thuận', value: '4000'},
      {name: 'Phú Thọ', value: '7000'},
      {name: 'Phú Yên', value: '7000'},
      {name: 'Quảng Bình', value: '16000'},
      {name: 'Quảng Nam', value: '6000'},
      {name: 'Quảng Ngãi', value: '6000'},
      {name: 'Quảng Ninh', value: '18000'},
      {name: 'Quảng Trị', value: '8000'},
      {name: 'Sóc Trăng', value: '4000'},
      {name: 'Sơn La', value: '20000'},
      {name: 'Tây Ninh', value: '15000'},
      {name: 'Thái Bình', value: '13000'},
      {name: 'Thái Nguyên', value: '10000'},
      {name: 'Thanh Hóa', value: '7000'},
      {name: 'Thừa Thiên Huế', value: '7000'},
      {name: 'Tiền Giang', value: '2000'},
      {name: 'Trà Vinh', value: '4000'},
      {name: 'Tuyên Quang', value: '6000'},
      {name: 'Vĩnh Long', value: '4000'},
      {name: 'Vĩnh Phúc', value: '5000'},
  ];
  res.json(fee);
});


router.post('/save', async (req, res, next) => {
  let product = JSON.parse(JSON.stringify(req.cookies.cart));
  let sale_off = {};
  let invoiceCode = StringHelpers.generateCode(10);
  req.body = JSON.parse(JSON.stringify(req.body));
  let user = req.body;

  if(req.cookies.sale_off !== undefined) {
    sale_off = JSON.parse(JSON.stringify(req.cookies.sale_off));
  }

  await OrdersModel.saveItems(invoiceCode, product, user, sale_off).then( (result) => {
    EmailHelpers.sendEmail(result.user.email, invoiceCode)
    res.clearCookie("cart");
    res.clearCookie("sale_off");
    res.redirect("/sales" + linkIndex);
  });
});

router.post('/apply-promo-code', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = req.body;
  let saleOff = 0;
  
  await PromoModel.applyPromo(item.code).then( (item) => {
    saleOff = item.price;
    console.log(item.price);
  });
  res.cookie('sale_off', {code: item.code, saleOff: saleOff});
  res.json({saleOff: saleOff, msg: 'Apply success', name: item.code});
});

router.get('/del-promo-code', async (req, res, next) => {
  
  res.clearCookie("sale_off");
  res.redirect("/sales/cart");
  
});


module.exports = router;
