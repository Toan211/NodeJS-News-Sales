const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    code: String, 
    status: String,
    shipping_fee: Number,
    user: {
        first_name: String, 
        last_name: String,
        email: String,
        phone: String,
        address: String,
        message: String,
    },
    product: [{
        id: String,
        name: String,
        quantity: Number,
        
        price: Number,
        avatar: String,
        slug: String
    }],
    time: Date,
    promo_code: String,
    total: Number
});

module.exports = mongoose.model(databaseConfig.col_order, schema );