/*
    To start authenticating with Facebook via passport.js,
    you need to do a couple of things:

    1)  Login to developers.facebook.com.
    2)  Create a new app.
    3)  Note down the app's APP_ID and APP_SECRET in the app's dashboard.
        These two pieces of information will go into the configs.js's corresponding fields.
    4)  Go to 'App Review' of the app, and toggle 'Make <app_name> public' to YES.
    5)  In the 'PRODUCTS' section on the left sidebar, click '+Add Product' to add 'Facebook Login' on the next page.
    6)  Go to the 'settings' of the 'Facebook Login'.Under the field of 'Valid OAuth redirect URIs',
        provides your passport's facebook callback url, in this case, 'http://localhost:8080/auth/facebook/callback'.

        And that's it! It's over! BYE!
*/


const router = require('express').Router();
const passport = require('passport');
const configs = require('configs');

const authFB = configs.auth.facebook;

/*
    Redirect the user to Facebook for authentication.  When complete,
    Facebook will redirect the user back to the application at
    /auth/facebook/callback

    See: http://passportjs.org/docs/facebook
*/
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

/*
    Facebook will redirect the user to this URL after approval. Finish the
    authentication process by attempting to obtain an access token. If
    access was granted, the user will be logged in. Otherwise,
    authentication has failed.

        - http://passportjs.org/docs/facebook
*/
router.get('/facebook/callback',
    passport.authenticate('facebook', authFB.redirects)
);

module.exports = router;
