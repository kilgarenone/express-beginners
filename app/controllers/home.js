const router = require('express').Router();
// Get random weather data for demo in /partials/weather.handlebars template later
const weather = require('getWeatherData.js');

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

module.exports = router;
