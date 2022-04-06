const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    task: String,
    modelAnswer: String,
    studentAnswers: [{
        student: String,
        answer: String
    }]
});

module.exports = mongoose.model('Task', TaskSchema);