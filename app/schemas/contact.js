const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String,
    email: String,
    phone: String,
    message: String,
    status: String,
});

module.exports = db.model(databaseConfig.col_contact, schema );