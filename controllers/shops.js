const express = require('express');
const ShopModel = require('../models/shops.js');

const router = express.Router();


router.get('/all', (req, res) => {
    // Create dummy data first if needed

    var currency = req.session.currency || 'USD';

    ShopModel.getShops()
        .then((shops) => {
            var context = {
                shops: shops.map(shop => ({
                    id: shop._id,
                    name: shop.name,
                    description: shop.description,
                })
                ),
            };

            switch (currency) {
                case 'GBP': context.currencyGBP = 'selected'; break;
                case 'BTC': context.currencyBTC = 'selected'; break;
                default: context.currencyUSD = 'selected';
            }

            res.render('shops', context);
        });
});

module.exports = router;
