const ShopModel = require('../models/shops.js');


function getAllShops(req) {
    var currency = req.session.currency || 'USD';

    return ShopModel.getShops()
        .then((shops) => {
            var context = {
                shops: shops.map(shop => ({
                    id: shop._id,
                    name: shop.name,
                    description: shop.description,
                })),
            };

            switch (currency) {
                case 'GBP': context.currencyGBP = 'selected'; break;
                case 'BTC': context.currencyBTC = 'selected'; break;
                default: context.currencyUSD = 'selected';
            }

            return context;
        });
}

module.exports = getAllShops;
