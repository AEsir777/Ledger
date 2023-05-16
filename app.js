import express from "express";
import session from "express-session";
import passport from "passport";

import authRouter from "./routes/auth.js";
import trackerRouter from "./routes/tracker.js";

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


app.use('/', trackerRouter);
app.use('/', authRouter);


app.listen(3000 || process.env.port, function () {
    console.log("Server is running on port 3000.");
});