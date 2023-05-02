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
app.use(passport.authenticate('session'));

// mongoose schema
mongoose.connect(process.env.uri);
const userSchema = new Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res, next) {
    if ( req.isAuthenticated() ) {
        res.send('Enter Home Page');
    } else {
        res.redirect("/login");
    }
    
});

/* const user = new User({
    username: req.body.username,
    password: req.body.password
}); */

app.route('/signup').get(function(req, res, next) {
    res.render('signup');
}).post(function(req, res, next) {
    User.register({ username: req.body.username }, req.body.password).then((user) => {
        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    }).catch((err) => {
        console.log(err);
        res.redirect("/signup");
    });
});

app.route('/login').get(function (req, res, next) {
    res.render('login');
}).post(passport.authenticate('local', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
    }
);

app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
})

app.listen(3000 || process.env.port, function() {
    console.log("Server is running on port 3000.");
});