const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Lecturer = require('./models/lecturer');
const Module = require('./models/module');

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
//app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/modules/new', (req, res) => {
    res.render('modules/new');
});
app.post('/modules', async (req, res) => {
    const module = new Module(req.body.module);
    await module.save();
    res.redirect(`/modules/${module._id}`)
});
app.get('/modules', async(req, res) => {
    const modules = await Module.find({});
    res.render('modules/index', { modules });
});
app.get('/lecturers', async(req, res) => {
    const lecturer = await Lecturer.find({ _id: '624c130e7b5228a4eb7c3fd0'});
    res.render('lecturers/index', { lecturer })
});

app.get('/modules/:id', async(req, res) => {
    const module = await Module.findById(req.params.id);
    res.render('modules/show', { module });
});


app.listen(3000, () => {
    console.log('Serving on port 3000')
});