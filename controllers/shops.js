const express = require('express');
const shopsViewModel = require('../viewModels/shops.js');

const router = express.Router();


router.get('/all', (req, res) => {
    // Create dummy data first if needed
    shopsViewModel(req).then((context) => {
        res.render('shops', context);
    });
});

module.exports = router;
