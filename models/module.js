const mongoose = require('mongoose');
const Task = require('./task');
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

ModuleSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Task.deleteMany({
            _id: {
                $in: doc.tasks
            }
        })
    }
})

module.exports = mongoose.model('Module', ModuleSchema);