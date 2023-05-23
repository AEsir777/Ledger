import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import * as dotenv from 'dotenv'
dotenv.config()

import authRouter from "./routes/auth.js";
import trackerRouter from "./routes/tracker.js";
import paymentRouter from "./routes/payment.js";

// application level middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'screte made by kebing',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

mongoose.connect(process.env.uri);

app.use('/', authRouter);
app.use('/', trackerRouter);
app.use('/', paymentRouter);

app.listen(3000 || process.env.port, () => {
    console.log("Server is running on port 3000.");
});