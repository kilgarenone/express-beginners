const express = require('express');
const shopsViewModel = require('../viewModels/shops.js');
const csrfProtection = require('csurf')();
const ensureAuthenticated = require('../lib/auth.js').ensureAuthenticated;

const router = express.Router();


router.get('/all', ensureAuthenticated, csrfProtection, (req, res) => {
    // Create dummy data first if needed
    shopsViewModel(req).then((context) => {
        context.csrfToken = req.csrfToken();
        context.authRedirectUrl = req.originalUrl;

        res.render('shops', context);
    });
});


module.exports = router;
