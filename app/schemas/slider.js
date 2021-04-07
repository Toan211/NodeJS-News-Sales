const { suppressDeprecationWarnings } = require('moment');
const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name: String, 
    status: String,
    link: String,
    ordering: Number,
    content: String,
    avatar: String,

    created: {
        user_id: String,
        user_name: String,
        time: Date
    },
});

module.exports = mongoose.model(databaseConfig.col_slider, schema );