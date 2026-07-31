const {google} = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(app, passport, db){

  passport.use(new GoogleStrategy({
      clientID: process.env['AUTHID'],
      clientSecret: process.env['AUTHSEC'],
      callbackURL: "https://maddoggsoftware.com/oauth2callback/google/"
    },
    async function(accessToken, refreshToken, profile, done) {
        const user= await db.googleAuth(profile);
        return done(null, user);
    }
  ));

  app.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  app.get('/oauth2callback/google/', passport.authenticate('google', { failureRedirect: '/error' }), function(req,res){
    // req.user is set per-request by passport.authenticate() from the verify
    // callback's done(null, user) above; previously this read a module-level
    // variable shared across all concurrent requests (a race condition).
    req.session.user= req.user;
    res.redirect('/dashboard');

  });


}