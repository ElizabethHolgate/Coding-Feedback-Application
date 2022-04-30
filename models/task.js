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

TaskSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Answer.deleteMany({
            _id: {
                $in: doc.tasks
            }
        })
    }
});

TaskSchema.post('deleteMany', async function (doc) {
    if (doc) {
        await Answer.deleteMany({
            _id: {
                $in: doc.tasks
            }
        })
    }
});

module.exports = mongoose.model('Task', TaskSchema);