module.exports= function(app, path){
const {google} = require('googleapis');
var nodemailer = require('nodemailer');
var aiemail= process.env['ADEMAIL'];
var aipass= process.env['ADPASS'];
const multer = require("multer");


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
});
const upload = multer({
    storage: storage
});


const OAuth2 = google.auth.OAuth2;
const createTransporter = async () => {
	const oauth2Client = new OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	"https://developers.google.com/oauthplayground");

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });
  
  console.log(process.env.CLIENT_ID);
  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
	console.log("No tokens");
	
	reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.ADEMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
   });

	return transporter;
};




app.post('/contact', upload.single('proposal'), async function(req, res, next){
//var emailTransporter= ''
if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
  console.log('Object missing');
	res.sendFile(path.join(__dirname, '../templates/index.html'));
}
try{  
 emailTransporter = await createTransporter();

} catch(err){
	console.log(err);
	next(err)
}

const body= req.body;

const flavor= `Thank you ${body.name} for requesting a consultation with Maddogg Software, 
 \n\nSomeone from our staff will be reaching out to you as soon as possible. \n\nBest Regards,\nMaddogg Software Dev Team`
 
 const request= `You have received a request from ${body.name}. \n\n${JSON.stringify(body, null, 2)}`

  var mailOptions = {
    from: process.env.ADEMAIL,
    to: req.body.email,
    subject: 'NO REPLY: Consultation Request',
    text: flavor
  };
  
  var reqOptions = {
	  from: process.env.ADEMAIL,
	  to: process.env.ADEMAIL,
	  subject: 'New Consultation request',
	  text: request,
	  attachments: req.file
	  
  }
emailTransporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  
  emailTransporter.sendMail(reqOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
		res.sendFile(path.join(__dirname, '../templates/index.html'));
  });

}
