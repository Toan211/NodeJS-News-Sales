
const { suppressDeprecationWarnings } = require('moment');
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    status: String,
    price: Number,
    amount: Number,
    used_times: Number,
    duration: String,
});

module.exports = mongoose.model(databaseConfig.col_promo, schema );