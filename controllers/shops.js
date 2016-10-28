const express = require('express');
const shopsViewModel = require('../viewModels/shops.js');
const csrfProtection = require('csurf')();

const router = express.Router();


router.get('/all', csrfProtection, (req, res) => {
    // Create dummy data first if needed
    shopsViewModel(req).then((context) => {
        context.csrfToken = req.csrfToken();
        res.render('shops', context);
    });
});


module.exports = router;
