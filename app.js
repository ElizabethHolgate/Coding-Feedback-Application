const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const { moduleValidation, taskValidation } = require('./validationSchemas');
const methodOverride = require('method-override');
const Lecturer = require('./models/lecturer');
const Module = require('./models/module');
const Task = require('./models/task');
const ExpressError = require('./utils/EpressError');
const req = require('express/lib/request');

let url = "mongodb+srv://elizabeth:GA3zRjUwqtXC6U1W@coding-feedback-applica.kwyi9.mongodb.net/codeFeedbackApplication?retryWrites=true&w=majority";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateModule = (req, res, next) => {
    const { error } = moduleValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const validateTask = (req, res, next) => {
    const { error } = taskValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/modules/new', (req, res) => {
    res.render('modules/new');
});

app.post('/modules', validateModule, catchAsync(async (req, res) => {
    const module = new Module(req.body.module);
    await module.save();
    res.redirect(`/modules/${module._id}`)
}));

app.get('/modules', catchAsync(async(req, res) => {
    const modules = await Module.find({});
    res.render('modules/index', { modules });
}));

app.get('/lecturers', catchAsync(async(req, res) => {
    const lecturer = await Lecturer.find({ _id: '624c130e7b5228a4eb7c3fd0'});
    res.render('lecturers/index', { lecturer })
}));

app.get('/modules/:id', catchAsync(async(req, res) => {
    const module = await Module.findById(req.params.id).populate('tasks');
    res.render('modules/show', { module });
}));

app.get('/modules/:id/edit', catchAsync(async (req, res) => {
    const module = await Module.findById(req.params.id)
    res.render('modules/edit', { module });
}));

app.put('/modules/:id', validateModule, catchAsync(async (req, res) => {
    const { id } = req.params;
    const module = await Module.findByIdAndUpdate(id, { ...req.body.module });
    res.redirect(`/modules/${module._id}`)
}));

app.delete('/modules/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndDelete(id);
    res.redirect('/modules');
}));

app.post('/modules/:id/tasks', validateTask, catchAsync(async (req, res) => {
    const module = await Module.findById(req.params.id);
    const task = new Task(req.body.task);
    module.tasks.push(task);
    await task.save();
    await module.save();
    res.redirect(`/modules/${module._id}`);
}));

// app.put('/modules/:id/tasks/:taskId', validateTask, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Module.findById(id);
//     await Task.findByIdAndUpdate(taskId, { ...req.body.module });
//     res.redirect(`/modules/${id}`);
// }));

app.delete('/modules/:id/tasks/:taskId', catchAsync(async (req, res) => {
    const { id, taskId } = req.params;
    await Module.findByIdAndUpdate(id, { $pull: { tasks: taskId } });
    await Task.findByIdAndDelete(taskId);
    res.redirect(`/modules/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
}); 

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});