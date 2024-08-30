const multer = require('multer');
const path = require('path');
const passport = require('passport');
const app = require('./config/app.js').getApp(path, passport);
const upload = multer({ dest: __dirname+ '/tmp/'});
const fs = require('fs');
var nodemailer = require('nodemailer');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db= require('./mongoinfo.js');
const refresh= require('./refresh.js');
const register= require('./routes/registration.js')(app, path, db);
const login= require('./routes/login.js')(app,path,db);
const google= require('./routes/google.js')(app, passport, db);
const customer= require('./routes/customer.js')(app, path, db);
const email= require('./routes/email.js')(app,path);
//const admin= require('./hidden/admin.js')(app, db, refresh, path);


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/success', function(req, res) {
  const id= req.query.id;
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
  req.session.user= '';
  req.session.projects='';
  res.redirect('/');
});

app.get('/profile', async function(req, res){
  refreshProperties('profile', req, res);
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
  var tmp_path = req.file.path;
  var filename= String(Math.floor(Math.random() * 90000) + 10000);
  var target_path = 'public/images/user' + String(req.session.user._id) + "/" + filename + req.file.originalname;
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  db.updateUserAvatar(target_path, req.session.user);
  res.writeHead(200, {'content-type': 'text/plain'});
  res.end(target_path);
  /*
  var destination= __dirname+ "/public/images/user"+ String(req.session.user._id);

 
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
     var path= files.filepath;

    var new_path=
      destination+filename+path;
    fs.rename(path, new_path, function(err){
    });
});
*/
});


app.get('/.well-known/apple-developer-merchantid-domain-association',function (req,res){
	 res.sendFile(path.join(__dirname, '.well-known/apple-developer-merchantid-domain-association'));
});

app.get('/sitemap.xml', function(req, res){
	res.sendFile(path.join(__dirname, 'public/sitemap.xml'));
});

const {RecaptchaEnterpriseServiceClient} = require('@google-cloud/recaptcha-enterprise');

/**
  * Create an assessment to analyze the risk of a UI action.
  *
  * projectID: Your Google Cloud Project ID.
  * recaptchaSiteKey: The reCAPTCHA key associated with the site/app
  * token: The generated token obtained from the client.
  * recaptchaAction: Action name corresponding to the token.
  */
async function createAssessment({
  // TODO: Replace the token and reCAPTCHA action variables before running the sample.
  projectID = "mdsdc-929a2",
  recaptchaKey = "6Ld1aDEqAAAAAA3dZAIb2L3i4gRfiIHEVB33LlE2",
  token = "action-token",
  recaptchaAction = "action-name",
}) {
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = ({
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  });

  const [ response ] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
    return null;
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis.score;
  } else {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }
}


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Starting Server on port #: " + port)
});

module.exports=app;
//exports.mdsdc = onRequest(app);
