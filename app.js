const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/EpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// const catchAsync = require('./utils/catchAsync');
// const Lecturer = require('./models/lecturer');

const moduleRoutes = require('./routes/modules');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

let url = "mongodb+srv://elizabeth:GA3zRjUwqtXC6U1W@coding-feedback-applica.kwyi9.mongodb.net/codeFeedbackApplication?retryWrites=true&w=majority";
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisisasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/modules', moduleRoutes);
app.use('/modules/:id/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// app.get('/lecturers', catchAsync(async(req, res) => {
//     const lecturer = await Lecturer.find({ _id: '624c130e7b5228a4eb7c3fd0'});
//     res.render('lecturers/index', { lecturer })
// }));

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