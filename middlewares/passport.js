/*
    passport.initialize() middleware is required to initialize Passport
    passport.session() middleware is required for persistent login sessions.exports

    See: http://passportjs.org/docs/#middleware
*/
const router = require('express').Router();
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

module.exports = router;
