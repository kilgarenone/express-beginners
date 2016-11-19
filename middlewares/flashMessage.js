/*
    Using the connect-flash library to add flash messages on a particular page

    https://github.com/jaredhanson/connect-flash
*/
const router = require('express').Router();
const flash = require('connect-flash');

router.use(flash());

router.use((req, res, next) => {
    res.locals.flash = req.flash('message');
    next();
});

module.exports = router;
