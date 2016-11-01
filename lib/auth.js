const User = require('../models/users.js');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config.js')(process.env.NODE_ENV);


passport.serializeUser((user, done) => {
    console.log(`serializing user: ${user}`);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id)
        .then((user) => {
            console.log(`de-serializing user: ${user}`);
            return done(null, user);
        })
        .catch(err => done(err, null));
});

function init() {
    const authFB = config.auth.facebook;

  // configure Facebook strategy
    passport.use(new FacebookStrategy({
        clientID: authFB.appId,
        clientSecret: authFB.appSecret,
        callbackURL: authFB.callbackURL,
    }, (accessToken, refreshToken, profile, done) => {
        const authId = `facebook:${profile.id}`;
        User.getOneUser({ authId })
            .then((user) => {
                if (user) return done(null, user);
                const newUser = User.createUserModel({
                    authId,
                    name: profile.displayName,
                    created: Date.now(),
                    role: 'customer',
                });
                User.saveNewUser.call(newUser)
                    .then(() => done(null, newUser))
                    .catch(err => done(err, null));
            })
            .catch(err => done(err, null));
    }));
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Return error content: res.jsonp(...) or redirect: res.redirect('/login')
    res.render('loginSignUp', { authRedirectUrl: req.originalUrl });
}

module.exports = { init, ensureAuthenticated };

