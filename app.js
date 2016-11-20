// Capture uncaught exception in other files prior to running this file
process.on('uncaughtException', (err) => {
    console.trace(`Caught exception: ${err.stack}`);
});

// LIBRARY
// CONFIGS
const configs = require('./configs.js');
// For logging purposes
const logger = require('./lib/logger.js');
// Upload files to local disk
const fileUpload = require('./lib/fileUploadLocal.js');
// Get MongoDB methods that have been exposed
const mongoDb = require('./lib/mongoDb.js');
// To enable session with redis-store enabled
const sessionMiddleware = require('./lib/session.js');
// For mapping urls to static path
const staticAssetsMapper = require('./lib/staticAssetsMapper.js');
// To init social media authentication with facebook
const auth = require('./lib/auth.js');
/*
    // Uncomment to enable email service
    const emailService = require('./lib/email.js')(credentials);
*/


// NPM MODULES
// Enable gzip compression
const compress = require('compression');
const express = require('express');
// Parse request body data into JSON obj. Availabe under the req.body property.
const bodyParser = require('body-parser');
// Logging library
const morgan = require('morgan');
// Handlebar templates
const handlebarTemplate = require('express-handlebars');


// EXPRESS INITIATION
const app = express();
// CONNECT TO MongoDB DATABASE
mongoDb.connect('mode_production');
// PORT CONFIGURATION
app.set('port', process.env.PORT || 8080);
// Check if app is in development or production mode
const production = (app.get('env') === 'production');

// trust first proxy if in production
if (production) {
    app.enable('trust proxy');
}

// RESPONSE'S HEADER CONFIGURATION
// disable sensitive server information
app.disable('x-powered-by');

// STATIC RESOURCES
app.use(express.static(configs.staticDir));

// USER AUTHENICATION
auth.init();

// TEMPLATING ENGINE
// Set up handlebars view engine
const handlebars = handlebarTemplate.create(
    {
        defaultLayout: 'main',
        partialsDir: ['views/partials/'], // dir for your partial templates
        helpers: {
            section(name, options) {
                if (!this.sections) this.sections = {};
                this.sections[name] = options.fn(this);
                return null;
            },
            static(name) {
                return staticAssetsMapper.map(name);
            },
        },
    });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// Uncomment to enable template caching for development
app.set('view cache', production);


/*
    // SEND EMAIL AND EMAIL ERROR TO NOTIFIY ONCE OCCURED
    try {
        // do something iffy here....
    } catch(ex) {
        email.sendError('the widget broke down!', __filename, ex);
        // ... display error message to user
    }

    emailService.send('2313ersddfdf@gmail.com', 'Hood River!', 'Get \'em while they\'re hot!');
*/


// MIDDLEWARE
// Stream logging through Winston
if (!production) {
    // compact, colorful dev logging
    app.use(morgan('dev', { stream: logger.stream }));
}

// Serve the fav icon
app.use(require('serve-favicon')(configs.favIconPath));
// Create application/json parser
app.use(bodyParser.json());
// Create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// SET UP SESSION/COOKIES
app.use(sessionMiddleware);
// Handle session init error
app.use((req, res, next) => {
    if (!req.session) {
        return next(new Error('Session initialization Failed'));
    }
    // otherwise continue
    next();
    return true;
});
// ENABLE GZIP COMPRESSION
app.use(compress({ threshold: 0 }));
// LOAD ALL OTHER MIDDLEWARES IN MIDDLEWARES/INDEX.JS
app.use(require('./middlewares'));

// LOAD ALL THE CONTROLLERS DEFINED IN CONTROLLERS/INDEX.JS
app.use(require('./controllers'));

// DEMONSTRATE CLIENT-SIDE RENDERING WITH HANDLEBAR
app.get('/nursery-rhyme', (req, res) => {
    res.render('nursery-rhyme');
});
// Only send JSON data back to client's templates
app.get('/data/nursery-rhyme', (req, res) => {
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.get('/thank-you', (req, res) => {
    // This is how to access a session key, in this case, called 'firstSession'
    logger.info(req.session.firstSession);
    res.render('thank-you');
});

// DEMONSTRATE FILE UPLOADS TO LOCAL DISK
app.get('/vacation-photo', (req, res) => {
    const now = new Date();
    res.render('vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth(),
    });
});
app.post('/vacation-photo/:year/:month', (req, res) => {
    fileUpload.upload([{ name: 'photo', maxCount: 1 }], req, res);
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
app.listen(app.get('port'), () => {
    console.log(`Express started in ${app.get('env')} mode on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
});
