import express from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

import * as dotenv from 'dotenv';
dotenv.config();

// middlewares
const trackerRouter = express.Router();

function ensureAuthenticated(req, res, next) {
    if ( req.isAuthenticated() ) {
        res.send('Enter Home Page');
    } else {
        res.redirect("/login");
    }
}

// Authentication to the home route
trackerRouter.get('/home', ensureAuthenticated);

// all income expense queries
trackerRouter.route('/queries').get(ensureAuthenticated, async function(req, res) {
    res.send('all query');
}).post(ensureAuthenticated);

export default trackerRouter;