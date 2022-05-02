const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    title: String,
    description: String,
    language: String,
    url: String,
    level: Number
});

module.exports = mongoose.model('Resource', ResourceSchema);