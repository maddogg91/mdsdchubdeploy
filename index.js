const path = require('path');
const passport = require('passport');
const app = require('./config/app.js').getApp(path, passport);
const db= require('./mongoinfo.js');
const google= require('./routes/google.js')(app, passport, db);
const authApi= require('./routes/api/auth.js');
const dashboardApi= require('./routes/api/dashboard.js');
const profileApi= require('./routes/api/profile.js');
const projectsApi= require('./routes/api/projects.js');
const notificationsApi= require('./routes/api/notifications.js');
const contactApi= require('./routes/api/contact.js');
const checkoutApi= require('./routes/api/checkout.js');
const adminApi= require('./routes/api/admin.js');

app.use('/api/auth', authApi);
app.use('/api/dashboard', dashboardApi);
app.use('/api/profile', profileApi);
app.use('/api/projects', projectsApi);
app.use('/api/notifications', notificationsApi);
app.use('/api/contact', contactApi);
app.use('/api/checkout', checkoutApi);
app.use('/api/admin', adminApi);

// Legacy pages deliberately kept server-rendered: huge static legal text with
// no interactive behavior worth porting to the SPA (see Phase 3 PR notes).
app.get('/terms', function(req,res){
  res.render(path.join(__dirname, 'templates/terms.html'))

})

app.get('/privacy', function(req,res){
  res.render(path.join(__dirname, 'templates/privacy.html'))

})

app.get('/cookies', function(req,res){
  res.render(path.join(__dirname, 'templates/cookies.html'))

})

app.get('/logout', function(req,res){
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Archive/restore was never fully implemented upstream (db.restore() calls a
// function that doesn't exist and isn't exported) and has no React page yet;
// left as-is rather than silently dropping the feature.
app.get('/archived', async function(req,res){
  if(!req.session.user){
     res.redirect('/')
    }

  var data = await db.loadArchived(req.query.data, req.session.user);

  res.render(path.join(__dirname, 'templates/archived.html'), {'data' : data.data, 'type': data.type});

})

app.post('/restore', function(req,res){
  db.restore(req.body.data, req.body.type, req.session.user);

})

app.get('/.well-known/apple-developer-merchantid-domain-association',function (req,res){
	 res.sendFile(path.join(__dirname, '.well-known/apple-developer-merchantid-domain-association'));
});

app.get('/sitemap.xml', function(req, res){
	res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});

// SPA catch-all: any path not matched by an API route or one of the legacy
// pages above falls through to the React app's client-side router.
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/app/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Starting Server on port #: " + port)
});

module.exports=app;
