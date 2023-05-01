import express from "express";
import session from "express-session";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

import * as dotenv from 'dotenv';
dotenv.config();

// middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: 'screte made by kebing',
    resave: false,
    saveUninitialized: false,
}));

// mongoose schema
mongoose.connect(process.env.uri);
const userSchema = new Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

app.get('/', function (req, res, next) {
    res.send('Enter Home Page');
});

/* const user = new User({
    username: req.body.username,
    password: req.body.password
}); */

app.route('/login').get(function (req, res, next) {
    res.render('login');
}).post(passport.authenticate('local', {failureRedirect: '/login'}),
    function(req, res) {
        console.log(req.body);
        res.redirect('/');
    }
);

app.listen(3000 || process.env.port, function() {
    console.log("Server is running on port 3000.");
});