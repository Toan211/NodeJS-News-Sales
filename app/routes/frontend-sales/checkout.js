var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const StringHelpers   = require(__path_helpers + 'string');
const EmailHelpers		= require(__path_helpers + 'email');
const ParamsHelpers = require(__path_helpers + 'params');

const folderView	 = __path_views_sales + 'pages/checkout/';
const layoutShop    = __path_views_sales + 'frontend';
const linkIndex     = '/orders-tracking';


router.get('/', async (req, res, next) => {
  let items = [];
  let params 		 	 = ParamsHelpers.createParam(req);
  if(req.cookies.cart !== undefined) {
    items = req.cookies.cart;
  }
  
  res.render(`${folderView}index`, {
    titleHeader : 'Checkout',
    layout: layoutShop,
    top_post: false,
    silde_bar: false,
    about_me: false,
    sub_banner: true,
    popular: false,
    params,
    items,
  });
});

router.get('/get-shipping-fee',   async (req, res, next) => {
  let fee = [
      {name: 'An Giang', value: '10'},
      {name: 'Bà Rịa - Vũng Tàu', value: '3'},
      {name: 'Bắc Giang', value: '12'},
      {name: 'Bắc Kạn', value: '12'},
      {name: 'Bạc Liêu', value: '8'},
      {name: 'Bắc Ninh', value: '15'},
      {name: 'Bến Tre', value: '6'},
      {name: 'Bình Định', value: '6'},
      {name: 'Bình Dương', value: '2'},
      {name: 'Bình Phước', value: '4'},
      {name: 'Bình Thuận', value: '4'},
      {name: 'Cà Mau', value: '2'},
      {name: 'Cần Thơ', value: '3'},
      {name: 'Cao Bằng', value: '15'},
      {name: 'Đà Nẵng', value: '7'},
      {name: 'Đắk Lắk', value: '10'},
      {name: 'Đắk Nông', value: '10'},
      {name: 'Điện Biên', value: '20'},
      {name: 'Đồng Nai', value: '2'},
      {name: 'Đồng Tháp', value: '3'},
      {name: 'Gia Lai', value: '8'},
      {name: 'Hà Giang', value: '10'},
      {name: 'Hà Nam', value: '10'},
      {name: 'Hà Nội', value: '12'},
      {name: 'Hà Tĩnh', value: '11'},
      {name: 'Hải Dương', value: '13'},
      {name: 'Hải Phòng', value: '12'},
      {name: 'Hậu Giang', value: '5'},
      {name: 'Hồ Chí Minh', value: '1'},
      {name: 'Hòa Bình', value: '8'},
      {name: 'Hưng Yên', value: '6'},
      {name: 'Khánh Hòa', value: '6'},
      {name: 'Kiên Giang', value: '7'},
      {name: 'Kon Tum', value: '8'},
      {name: 'Lai Châu', value: '9'},
      {name: 'Lâm Đồng', value: '10'},
      {name: 'Lạng Sơn', value: '16'},
      {name: 'Lào Cai', value: '14'},
      {name: 'Long An', value: '3'},
      {name: 'Nam Định', value: '5'},
      {name: 'Nghệ An', value: '5'},
      {name: 'Ninh Bình', value: '4'},
      {name: 'Ninh Thuận', value: '4'},
      {name: 'Phú Thọ', value: '7'},
      {name: 'Phú Yên', value: '7'},
      {name: 'Quảng Bình', value: '16'},
      {name: 'Quảng Nam', value: '6'},
      {name: 'Quảng Ngãi', value: '6'},
      {name: 'Quảng Ninh', value: '18'},
      {name: 'Quảng Trị', value: '8'},
      {name: 'Sóc Trăng', value: '4'},
      {name: 'Sơn La', value: '20'},
      {name: 'Tây Ninh', value: '15'},
      {name: 'Thái Bình', value: '13'},
      {name: 'Thái Nguyên', value: '10'},
      {name: 'Thanh Hóa', value: '7'},
      {name: 'Thừa Thiên Huế', value: '7'},
      {name: 'Tiền Giang', value: '2'},
      {name: 'Trà Vinh', value: '4'},
      {name: 'Tuyên Quang', value: '6'},
      {name: 'Vĩnh Long', value: '4'},
      {name: 'Vĩnh Phúc', value: '5'},
  ];
  res.json(fee);
});


router.post('/save', async (req, res, next) => {
  let product = JSON.parse(JSON.stringify(req.cookies.cart));
  let invoiceCode = StringHelpers.generateCode(10);
  req.body = JSON.parse(JSON.stringify(req.body));
  let user = req.body;

  await OrdersModel.saveItems(invoiceCode, product, user).then( (result) => {
    EmailHelpers.sendEmail(result.user.email, invoiceCode)
    res.clearCookie("cart");
    res.redirect(linkIndex);
  });
});

module.exports = router;
