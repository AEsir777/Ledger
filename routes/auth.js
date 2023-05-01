import express from "express";

var router = express.Router();

router.get('/login', function(req, res, next) {
    res.render('login');
}).post(async function(req, res, next) {
    const user = new User
});

export default router;