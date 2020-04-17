const User = require('../models/user.model');
const FBStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FB_CB_URL = '/auth/fb/cb';
const GOOGLE_CB_URL = '/auth/google/cb';

const FB_PROVIDER = 'facebook';
const GOOGLE_PROVIDER = 'google';

module.exports.setup = (passport) => {
  passport.serializeUser((user, next) => {
    next(null, user._id);
});

passport.deserializeUser((id, next) => {
    User.findById(id)
        .then(user => {
            next(null, user);
        })
        .catch(error => next(error));
});

passport.use('fb-auth', new FBStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: FB_CB_URL,
    profileFields: ['id', 'emails']
}, authenticateOAuthUser));

    passport.use('google-auth', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CB_URL
    }, authenticateOAuthUser));

    function authenticateOAuthUser(accessToken, refreshToken, profile, next) {
        let provider;
        if (profile.provider === FB_PROVIDER) {
            provider = 'facebookId'
        } else if (profile.provider === GOOGLE_PROVIDER) {
            provider = 'googleId';
        } else {
            next();
        }
        User.findOne({ [`social.${provider}`]: profile.id })
            .then(user => {
                if (user) {
                    next(null, user);
                } else {
                    const email = profile.emails ? profile.emails[0].value : null;
                    user = new User({
                        userEmail: email || DEFAULT_USERNAME,
                        username: email.split("@" , 1),
                        password: Math.random().toString(36).slice(-8), // FIXME: insecure, use secure random seed
                        social: {
                            [provider]: profile.id
                        }
                    });
                    user.save()
                        .then(() => {
                            next(null, user);
                        })
                        .catch(error => next(error));
                }
            })
            .catch(error => next(error));
    }
 }

module.exports.isAuthenticated = (req, res, next) => {
     if (req.isAuthenticated()) {
         next()
     } else {
         res.status(401);
         res.redirect('/login');
     }
 }

module.exports.checkRole = (role) => {
     return (req, res, next) => {
         if (!req.isAuthenticated()) {
             res.status(401);
             res.redirect('/login');
         } else if (req.user.role === role) {
             next();
         } else {
             res.status(403);
             res.render('error', {
                 message: 'Forbidden',
                 error: {}
             });
         }
     }
 }
