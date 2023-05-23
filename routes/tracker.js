import express from "express";
import Event from "../models/event_model.js";

import * as dotenv from 'dotenv';
dotenv.config();

// middlewares
const trackerRouter = express.Router();

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
// GET: get all queries
// POST: add a new query
// DELETE: delete all queirs
trackerRouter.route('/queries').get(ensureAuthenticated, async (req, res) => {
    console.log(req.user);
    await Event.find({ userId: req.user._id }).catch((err) => {
        console.error(err);
    }).then((events) => {
        res.send(events);
    });
}).post(ensureAuthenticated, async (req, res) => {
    const newEvent = new Event({
        userId: req.user._id,
        date: req.body.date, 
        type: req.body.type, 
        description: req.body.description, 
        amount: req.body.amount,
        unit: req.body.unit
    });

    await newEvent.save().catch((err) => {
        console.error(err);
    }).then(() => {
        res.send("saved succesfully");
    });
}).delete(ensureAuthenticated, async (req, res) => {
    Event.deleteMany({ userId: req.user._id },).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
    });
});

// single income expense query
trackerRouter.route('/queries/:id').get(ensureAuthenticated, async(req, res) => {
    await Event.find({ _id: req.params.id, userId: req.user._id }).catch((err) => {
        console.error(err);
    }).then((event) => {
        res.send(event);
    }).catch((err) => {
        console.log(err);
    });
}).get(ensureAuthenticated, async(req, res) => {
    await Event.replaceOne({ _id: req.user._id, userId: req.user._id }, {
        userId: req.user._id,
        date: req.body.date, 
        type: req.body.type, 
        description: req.body.description, 
        amount: req.body.amount,
        unit: req.body.unit
    }).then(() => {
        res.send("sucess");
    }).catch((err) => {
        console.log(err);
    });
}).patch(ensureAuthenticated, async(req, res) => {
    await Event.updateOne({ _id: req.user._id, userId: req.user._id }, {
        date: req.body.date, 
        type: req.body.type, 
        description: req.body.description, 
        amount: req.body.amount,
        unit: req.body.unit
    }).then(() => {
        res.send("success");
    }).catch((err) => {
        console.error(err);
    });
}).delete(ensureAuthenticated, async(req, res) => {
    await Event.deleteOne({ _id: req.user._id, userId: req.user._id}).then((result) => {
        res.send("result");
    }).catch((err) => {
        console.error(err);
    });
});


export default trackerRouter;