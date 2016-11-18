/*
    This index.js ties all controller's routes to corresponding namespace.

    For example, to request the '/all' router that is in controllers/shops.js,
    the path would be '/shops/all' and etc.
*/

const router = require('express').Router();
// Get random weather data for demo in /partials/weather.handlebars template later
const weather = require('../lib/getWeatherData.js');

router.get('/', (req, res) => {
    /*
     *  Store the weather demo data in 'partials' object with 'weatherData' key.
     *  'Partials' object is itself in 'res.locals' object, which is available globally.
    */
    res.locals.partials.weatherData = weather.getWeatherData();
    // This is how you set a session
    req.session.firstSession = 'OHH YEAHHH!';
    // Render the 'home.handlebars' template in /views
    res.render('home');
});

router.use('/shops', require('./shops'));
router.use('/fav', require('./favShops'));
router.use('/auth', require('./signup'));

// Error handler
router.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    res.status(403);
    res.send('form tampered with');
});

module.exports = router;
