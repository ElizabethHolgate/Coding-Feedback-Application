const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Lecturer = require('./models/lecturer');
const Module = require('./models/module');
const ExpressError = require('./utils/EpressError');

let url = "mongodb+srv://elizabeth:GA3zRjUwqtXC6U1W@coding-feedback-applica.kwyi9.mongodb.net/codeFeedbackApplication?retryWrites=true&w=majority";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/modules/new', (req, res) => {
    res.render('modules/new');
});

app.post('/modules', catchAsync(async (req, res) => {
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
    const module = await Module.findById(req.params.id);
    res.render('modules/show', { module });
}));

app.get('/modules/:id/edit', catchAsync(async (req, res) => {
    const module = await Module.findById(req.params.id)
    res.render('modules/edit', { module });
}));

app.put('/modules/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const module = await Module.findByIdAndUpdate(id, { ...req.body.module });
    res.redirect(`/modules/${module._id}`)
}));

app.delete('/modules/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Module.findByIdAndDelete(id);
    res.redirect('/modules');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
}); 

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
});

app.use((err, req, res, next) => {
    res.send("Something went wrong!");
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});