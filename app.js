const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Lecturer = require('./model/lecturer');

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

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/addlecturer', async (req, res) => {
    const lec = new Lecturer({name: "Shirley Atkinson", class: "COMP2000"});
    await lec.save();
    res.send(lec);
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});