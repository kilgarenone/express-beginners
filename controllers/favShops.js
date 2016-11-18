const router = require('express').Router();
const FavShopsModel = require('../models/favShops.js');
const csrfProtection = require('csurf')();


router.post('/favThisShop/:id', csrfProtection, (req, res) => {
    FavShopsModel.favThisShop(req.params.id)
        .then(() => {
            req.flash('message', 'Succesfully followed!');
            return res.redirect(303, '/thank-you');
        })
        .catch((err) => {
            req.flash('message', 'Failed to follow!');
            return res.redirect(303, '/thank-you');
        });
});

module.exports = router;
