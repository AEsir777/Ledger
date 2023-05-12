import express from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

import * as dotenv from 'dotenv';
dotenv.config();

// middlewares
const trackerRouter = express.Router();
// mongoose schema
mongoose.connect(process.env.uri);

// schema for one query
const querySchema = new Schema({
    date: {
        type: Date
    },
    type: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    },
});

// schema for query related one user
const queryCollectionSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true
    },
    queries: {
        type: [querySchema],
        default: undefined
    },
    unit: {
        type: String,
        default: "USD"
    }
});

const queryCollection = mongoose.model("queryCollection", queryCollectionSchema);

function ensureAuthenticated(req, res, next) {
    if ( req.isAuthenticated() ) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Authentication to the home route
trackerRouter.get('/home', ensureAuthenticated);

// all income expense queries
trackerRouter.route('/queries').get(ensureAuthenticated, async function(req, res) {
    console.log(req.user);
    await queryCollection.find({_id: req.user._id}).catch((err) => {
        console.error(err);
    }).then((userQuery) => {
        res.send(userQuery.queries);
    });
}).post(ensureAuthenticated, async function(req, res) {

});

export default trackerRouter;