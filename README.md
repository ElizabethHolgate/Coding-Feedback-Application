# Code Feedback Prototype Application
Code Feedback is a prototype application developed as part of my Final Stage Computing Project. A live, public version of the website, hosted by Heroku, is available [here](https://code-feedback.herokuapp.com/).

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Screenshots](#screenshots)
### General Info
This application is aimed at University lecturers and students to aid in teaching basic coding principles. It allows lecturers to set tasks and students to submit responses. The app also provides automated feedback to students in response to their answers by comparing them to the model answer.
## Technologies
A list of technologies used within the project:
* [EJS](https://ejs.co)
* [Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
* [Node.js](https://nodejs.org/en/)
* [Express](http://expressjs.com)
* [Mongo Atlas](https://www.mongodb.com/atlas)
## Installation
Clone using git and then use NPM to install dependencies.
```
$ git clone https://github.com/ElizabethHolgate/Coding-Feedback-Application.git
$ cd ../Coding-Feedback-Application
$ npm install
$ npm start app.js
```
## Screenshots
### Lecturer Account
![Lecturer Profile](./screenshots/Lecturer_Profile.png?raw=true "Lecturer Profile")
![Module view 1](./screenshots/Module1.png?raw=true "Module view 1")
![Module view 2](./screenshots/Module2.png?raw=true "Module view 2")
![View student answers](./screenshots/Student_Answers.png?raw=true "Student Answers")
![Resources](./screenshots/All_Resources.png?raw=true "Resources")
### Student Account
![Submit answer](./screenshots/Submit_Answer.png?raw=true "Submit Answers")
![Feedback](./screenshots/Auto_Feedback.png?raw=true "Automated Feedback")
