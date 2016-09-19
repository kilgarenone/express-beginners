// LIBRARY
var fortune = require('./lib/fortunecookies.js');
var weather = require('./lib/getWeatherData.js');

// NPM MODULES
var express = require('express');
var bodyParser  = require('body-parser');
var formidable = require('formidable');

// EXPRESS INITIATION
var app     = express();

// RESPONSE'S HEADER CONFIGURATION
// disable sensitive server information
app.disable('x-powered-by');

// STATIC RESOURCES
app.use(express.static(__dirname + '/public'));

// ENGINE
// Set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main',
														helpers: {
															section: function(name, options){
																if(!this._sections) this._sections = {};
																this._sections[name] = options.fn(this);
																return null;
															}
														}
													});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// app.set('view cache', true); //Enable template caching for development

// PORT CONFIGURATION
app.set('port', process.env.PORT || 3000);

// MIDDLEWARE
// Accepts 'test=1' querystring to enable testing on a specific page
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' &&
	req.query.test === '1';
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Middleware to inject data into res.locals.partials
app.use(function(req, res, next){
	if(!res.locals.partials) {
		res.locals.partials = {};
	}
	res.locals.partials.weatherData = weather.getWeatherData();
	next();
});

// ROUTES 
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});

app.get('/jquery-test', function(req, res){
	res.render('jquery-test');
});

app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
});

app.get('/thank-you', function(req, res){
	res.render('thank-you');
});

app.get('/newsletter', function(req, res){
	// we will learn about CSRF later...for now, we just
	// provide a dummy value
	res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo',{
		year: now.getFullYear(),
		month: now.getMonth()
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303, '/thank-you');
	});
});


app.post('/process', function(req, res){
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	if(req.xhr || req.accepts('json,html')==='json'){
		// if there were an error, we would send { error: 'error description' }
		res.send({ success: true });
	} else {
		// if there were an error, we would redirect to an error page
		res.redirect(303, '/thank-you');
	}
});


// ERROR HANDLING
// Middleware for custom 404 catch-all handler
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// Middleware for custom 500 error handler
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// SERVER CONFIGURATION
app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' + 
		app.get('port') + '; press Ctrl-C to terminate.' );
});
