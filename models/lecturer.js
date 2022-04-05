const mongoose = require('mongoose');
//const Module = require('./module');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const LecturerSchema = new Schema({
    name: String,
    modules: [
        {
            //code: String
            type: Schema.Types.ObjectId,
            ref: 'Module'
        }
    ]
}, opts);

module.exports = mongoose.model('Lecturer', LecturerSchema);