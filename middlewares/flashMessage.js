const express = require('express');
const flash = require('connect-flash');

const router = express.Router();

router.use(flash());

router.use((req, res, next) => {
    res.locals.flash = req.flash('message');
    next();
});

module.exports = router;
