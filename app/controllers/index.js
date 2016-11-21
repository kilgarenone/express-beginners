/*
    This index.js ties all controller's routes to corresponding namespace.

    For example, to request the '/all' router that is in controllers/shops.js,
    the path would be '/shops/all' and etc.
*/

const router = require('express').Router();

// Init routes from controllers
(function initRoutes() {
    const routes = [
        'shops',
        'favShops',
        'auth',
    ];

    routes.forEach((route) => {
        router.use(`/${route}`, require(`./${route}`));
    });

    // Global home route
    router.use('/', require('./home'));
}());

// Error handler
router.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('form tampered with');
});

module.exports = router;
