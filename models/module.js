const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    code: String,
    title: String,
    description: String
});

module.exports = mongoose.model('Module', ModuleSchema);