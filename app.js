var server;
process.on('uncaughtException', (err) => {
    console.trace(`Caught exception: ${err.stack}`);
});
// CREDENTIALS
// const credentials = require('./credentials.js');
// LIBRARY
const fortune = require('./lib/fortunecookies.js');
const weather = require('./lib/getWeatherData.js');
const logger = require('./lib/logger.js');
const fileUpload = require('./lib/fileUploadLocal.js');
const mongoDb = require('./lib/mongoDb.js');
const sessionMiddleware = require('./lib/session.js');
// const redisClient = require('./lib/redisClient.js');
// const emailService = require('./lib/email.js')(credentials);

// NPM MODULES
// const fs = require('fs');
const compress = require('compression');
// const http = require('http');
const express = require('express');
const domain = require('domain');
const cluster = require('cluster');
const path = require('path');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const RedisSessionStore = require('connect-redis')(session);
const morgan = require('morgan');
const handlebarTemplate = require('express-handlebars');
// const mongoObjectId = require('mongodb').ObjectId;
// const mongoose = require('mongoose');
// const connect = require('connect');


// EXPRESS INITIATION
const app = express();
// CONNECT TO MongoDB DATABASE
mongoDb.connect();
// PORT CONFIGURATION
app.set('port', process.env.PORT || 8080);

const development = app.get('env') !== 'production';

if (!development) {
    app.enable('trust proxy'); // trust first proxy
}

// RESPONSE'S HEADER CONFIGURATION
// disable sensitive server information
app.disable('x-powered-by');

// STATIC RESOURCES
app.use(express.static(path.join(__dirname, 'public')));

// ENGINE
// Set up handlebars view engine
const handlebars = handlebarTemplate.create(
    {
        defaultLayout: 'main',
        partialsDir: ['views/partials/'],
        helpers: {
            section(name, options) {
                if (!this.sections) this.sections = {};
                this.sections[name] = options.fn(this);
                return null;
            },
        },
    });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// app.set('view cache', true); //Enable template caching for development

// SEND EMAIL AND EMAIL ERROR TO NOTIFIY ONCE OCCURED
/*
    try {
        // do something iffy here....
    } catch(ex) {
        email.sendError('the widget broke down!', __filename, ex);
        // ... display error message to user
    }

    emailService.send('2313ersddfdf@gmail.com', 'Hood River!', 'Get \'em while they\'re hot!');
*/

// MIDDLEWARE
/* [DEPRECATED: Use Promise's error handler to catch async's exception instead]
 * Exception handler as a domain to trap any uncaught errors in every request in a domain
 */
app.use((req, res, next) => {
    // create a domain for this request
    const domainObj = domain.create();
    // handle errors on this domain
    domainObj.on('error', (err) => {
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(() => {
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);
            // disconnect from the cluster
            const worker = cluster.worker;
            if (worker) worker.disconnect();
            // stop taking new requests
            server.close();
            try {
                // attempt to use Express error route
                next(err);
            } catch (error) {
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (error) {
            console.error('Unable to send 500 response.\n', error.stack);
        }
    });
    // add the request and response objects to the domain
    domainObj.add(req);
    domainObj.add(res);
    // execute the rest of the request chain in the domain
    domainObj.run(next);
});

// Logger
if (development) {
    // compact, colorful dev logging
    app.use(morgan('tiny', { stream: logger.stream }));
}

// Serve the fav icon
app.use(require('serve-favicon')(path.join(__dirname, 'public', 'img', 'favicon.ico')));
// Parse request body data into JSON obj
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

// SET UP SESSION/COOKIES
app.use(sessionMiddleware);

app.use((req, res, next) => {
    if (!req.session) {
        return next(new Error('Session initialization Failed')); // handle error
    }
    next(); // otherwise continue
    return true;
});
// ENABLE GZIP COMPRESSION
app.use(compress({ threshold: 0 }));
// Accepts 'test=1' querystring to enable testing on a specific page
app.use((req, res, next) => {
    res.locals.showTests = development && req.query.test === '1';
    next();
});


// Middleware to inject data into res.locals.partials
app.use((req, res, next) => {
    if (!res.locals.partials) {
        res.locals.partials = {};
    }
    res.locals.partials.weatherData = weather.getWeatherData();
    next();
});

app.use((req, res, next) => {
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});
// ROUTES
app.get('/', (req, res) => {
    req.session.damnson = 'WOWOWWWW';
    res.render('home');
});

app.use(require('./controllers'));

app.get('/epic-fail', () => {
    process.nextTick(() => {
        throw new Error('Kaboom!');
    });
});

app.get('/set-currency/:currency', (req, res) => {
    req.session.currency = req.params.currency;
    return res.redirect(303, '/shops');
});

app.get('/about', (req, res) => {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js',
    });
});

app.get('/jquery-test', (req, res) => {
    res.render('jquery-test');
});

app.get('/nursery-rhyme', (req, res) => {
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', (req, res) => {
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.get('/thank-you', (req, res) => {
    res.render('thank-you');
});

app.get('/newsletter', (req, res) => {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.get('/contest/vacation-photo', (req, res) => {
    const now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth(),
    });
});

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
    fileUpload.upload([{ name: 'photo', maxCount: 1 }], req, res);
});

app.post('/process', (req, res) => {
    console.log(`Form (from querystring): ${req.query.form}`);
    console.log(`CSRF token (from hidden form field): ${req.body.csrf}`);
    console.log(`Name (from visible form field): ${req.body.name}`);
    console.log(`Email (from visible form field): ${req.body.email}`);
    if (req.xhr || req.accepts('json,html') === 'json') {
    // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
    // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
});


// ERROR HANDLING
// Middleware for custom 404 catch-all handler
app.use((req, res) => {
    res.status(404);
    res.render('404');
});

// Middleware for custom 500 error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// SERVER CONFIGURATION
// app.listen(app.get('port'), function(){
// console.log( 'Express started in ' + app.get('env') +
// ' mode on http://localhost:' + app.get('port') +
// '; press Ctrl-C to terminate.' );
// });

server = app.listen(app.get('port'), () => {
    console.log(`Express started in ${app.get('env')} mode on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});

// exports.httpServer = server;
// exports.expressApp = app;
