const multer = require('multer');
const path = require('path');
const passport = require('passport');
const app = require('./config/app.js').getApp(path, passport);
const upload = multer({ dest: __dirname+ '/tmp/'});
const fs = require('fs');
const db= require('./mongoinfo.js');
const payment= require('./payment.js');
const refresh= require('./refresh.js');
const register= require('./routes/registration.js')(app, path, db);
const login= require('./routes/login.js')(app,path,db);
const google= require('./routes/google.js')(app, passport, db);
const customer= require('./routes/customer.js')(app, path, db);
const email= require('./routes/email.js')(app,path);
const authApi= require('./routes/api/auth.js');
const dashboardApi= require('./routes/api/dashboard.js');
const profileApi= require('./routes/api/profile.js');
const projectsApi= require('./routes/api/projects.js');
const notificationsApi= require('./routes/api/notifications.js');

app.use('/api/auth', authApi);
app.use('/api/dashboard', dashboardApi);
app.use('/api/profile', profileApi);
app.use('/api/projects', projectsApi);
app.use('/api/notifications', notificationsApi);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/success', async function(req, res) {
  const id= req.query.id;
  const sessionId= req.query.session_id;
  const verified= id && sessionId && await payment.verifyPayment(sessionId, id);
  if(!verified){
    res.redirect('/cancel?id=' + encodeURIComponent(id || ''));
    return;
  }
  db.makeFullPayment(id);
  res.sendFile(path.join(__dirname, 'templates/success.html'));
});

app.get('/cancel', function(req, res) {
 
  res.sendFile(path.join(__dirname, 'templates/cancel.html'));
});

app.get('/header', function(req,res){
  res.sendFile(path.join(__dirname, 'templates/newhome.html'));
});

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

app.get('/profile', async function(req, res){
  refresh.refreshProperties('profile', req, res, db, path);
});

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

app.post('/profile', async function(req, res){
  const body= req.body;
  if(req.session.user){
    await db.updateProfile(req.session.user, body, req.session.path)
  
    res.redirect('/profile');
  }
  else{
    res.redirect('/')
  }

});

app.get('/contractor', function(req,res){
	res.render(path.join(__dirname, 'templates/404.html'));
})

app.get('/contact', function(req,res){
	res.render(path.join(__dirname, 'templates/contact.html'));
})

app.get('/404', function(req,res){
	res.render(path.join(__dirname, 'templates/404.html'));
})

app.post('/saveAvatar', upload.single('file'),async function (req,res){
  if(!req.session.user){
    res.writeHead(401);
    res.end();
    return;
  }
  var tmp_path = req.file.path;
  var filename= String(Math.floor(Math.random() * 90000) + 10000);
  var safeOriginalName= path.basename(req.file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
  var target_path = 'public/images/user' + String(req.session.user._id) + "/" + filename + safeOriginalName;
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  db.updateUserAvatar(target_path, req.session.user);
  res.writeHead(200, {'content-type': 'text/plain'});
  res.end(target_path);
});


app.get('/.well-known/apple-developer-merchantid-domain-association',function (req,res){
	 res.sendFile(path.join(__dirname, '.well-known/apple-developer-merchantid-domain-association'));
});

app.get('/sitemap.xml', function(req, res){
	res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});

// SPA catch-all: any path not matched by an API route or one of the legacy
// pages above falls through to the React app's client-side router. New pages
// (e.g. /login, /register) get added here as they're migrated off the legacy
// routes; until a given legacy route above is removed, it still wins since
// Express matches routes in registration order.
app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/app/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Starting Server on port #: " + port)
});

module.exports=app;
