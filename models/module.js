const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
    code: String,
    title: String,
    description: String,
    tasks: [ {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    } ]
});

module.exports = mongoose.model('Module', ModuleSchema);