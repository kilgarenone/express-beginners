const router = require('express').Router();
const shopsViewModel = require('../viewModels/shops.js');
const csrfProtection = require('csurf')();
const ensureAuthenticated = require('../lib/auth.js').ensureAuthenticated;

/*
    Run both functions 'ensureAuthenticated' follows by 'csrfProtection' BEFORE
    running '/all' router handler.

    See: http://expressjs.com/en/4x/api.html#app.METHOD

*/
router.get('/all', ensureAuthenticated, csrfProtection, (req, res) => {
    // Create dummy data first if needed
    shopsViewModel(req).then((context) => {
        context.csrfToken = req.csrfToken();
        context.authRedirectUrl = req.originalUrl;

        res.render('shops', context);
    });
});

router.get('/set-currency/:currency', (req, res) => {
    // Session will persist even after shut and start app again.
    req.session.currency = req.params.currency;
    return res.redirect(303, '/shops');
});

module.exports = router;
