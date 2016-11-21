/*
    A view model separates the logic and transformations of data from the model
    or controller, keeping both of them clean.

    It transforms data as desired from the corresponding model to be rendered
    in the corresponding view.

    In this case, the 'getAllShops' function is called in the route '/all' in
    /controllers/shops.js.

    'getAllShops' function in turn brings in and transform data by calling 'getShops' api from /models/shops.js.

    More info: https://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/
*/
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
