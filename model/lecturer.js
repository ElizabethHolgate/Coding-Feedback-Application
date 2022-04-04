const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LecturerSchema = new Schema({
    name: String,
    classes: [
        {code: String}
    ]
});

module.exports = mongoose.model('Lecturer', LecturerSchema);