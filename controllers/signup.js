const router = require('express').Router();
const passport = require('passport');
const config = require('../config.js')(process.env.NODE_ENV);

const authFB = config.auth.facebook;


router.get('/facebook', (req, res, next) => {
    // Use with 'successReturnToOrRedirect' in the callback, passport checks if session.returnTo is set with a redirect url
    // https://github.com/jaredhanson/passport/issues/120#issuecomment-16351157
    // http://stackoverflow.com/a/31738903/73323
    if (req.query.redirect) {
        req.session.returnTo = req.query.redirect;
    }

    passport.authenticate('facebook', {
        scope: 'email',
        failureFlash: true,
    })(req, res, next);
});

router.get('/facebook/callback',
    passport.authenticate('facebook', authFB.redirects)
);

module.exports = router;
