import express from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import GoogleStrategy from "passport-google-oauth20";

import * as dotenv from 'dotenv';
dotenv.config();

// middlewares
const authRouter = express.Router();

// mongoose schema
mongoose.connect(process.env.uri);
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // TODO: add pattern requirements for password
    password: {
        type: String
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
// register the strategy
passport.use(User.createStrategy());
passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3000/auth/home"
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* const user = new User({
    username: req.body.username,
    password: req.body.password
}); */

authRouter.route('/signup').get((req, res, next) => {
    res.render('signup');
}).post(function (req, res, next) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    User.register(newUser, req.body.password).then((user) => {
        passport.authenticate("local")(req, res, function () {
            res.redirect("/home");
        });
    }).catch((err) => {
        console.log(err);
        res.redirect("/signup");
    });
});

authRouter.route('/login').get((req, res, next) => {
    res.render('login');
}).post(passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/home');
    }
);

authRouter.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// OAUTH for google
authRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

authRouter.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/');
});

export default authRouter;