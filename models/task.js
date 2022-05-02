const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    task: String,
    modelAnswer: String,
    studentAnswers: [ {
        student: {  type: Schema.Types.ObjectId,
                    ref: 'User'},
        answer: String,
        similarity: Number,
        comments: [ {
            username: String,
            comment: String
        } ]
    } ]
});

module.exports = mongoose.model('Task', TaskSchema);