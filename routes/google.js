const {google} = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var userprofile= ''
var user= ''

module.exports = function(app, passport, db){
  
  passport.use(new GoogleStrategy({
      clientID: process.env['AUTHID'],
      clientSecret: process.env['AUTHSEC'],
      callbackURL: "https://maddoggsoftware.com/oauth2callback/google/"
    },
    async function(accessToken, refreshToken, profile, done) {
        userprofile=profile;
      
        user =await db.googleAuth(userprofile);
        return done(null, userprofile);
    }
  ));

  app.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  //passport.authenticate('youtube'));

  app.get('/oauth2callback/google/', passport.authenticate('google', { failureRedirect: '/error' }), function(req,res){
    const token= req.query.code;
   
   // yt.upload('test-short.mp4', 'test-video #Shorts', 'i am testing', 'private', token);
    req.session.user=user;
    req.session.token= token;
    res.redirect('/dashboard');

  });


}