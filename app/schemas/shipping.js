const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');


var schema = new mongoose.Schema({ 
    name: String, 
    code: String,
    cost: { type: Number, default: 0 }
});

module.exports = mongoose.model(databaseConfig.col_shipping, schema );