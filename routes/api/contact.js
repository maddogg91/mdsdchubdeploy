const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'temp') + path.sep,
  filename: function (req, file, cb) {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

const OAuth2 = google.auth.OAuth2;
async function createTransporter() {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADEMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
}

router.post(
  '/',
  upload.single('proposal'),
  asyncHandler(async (req, res) => {
    const gcaptcha = req.body['g-recaptcha-response'];
    if (!gcaptcha) {
      return fail(res, 400, 'reCAPTCHA response is required', 'MISSING_RECAPTCHA');
    }

    const verify = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: { secret: process.env['RECAPTCHA_SECRET'], response: gcaptcha }
    });
    if (!verify.data.success) {
      return fail(res, 400, 'reCAPTCHA validation failed', 'RECAPTCHA_FAILED');
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return fail(res, 400, 'Name and email are required', 'MISSING_FIELDS');
    }

    let transporter;
    try {
      transporter = await createTransporter();
    } catch (err) {
      return fail(res, 502, 'Could not send email at this time', 'MAIL_TRANSPORT_FAILED');
    }

    const body = req.body;
    const flavor =
      `Thank you ${body.name} for requesting a consultation with Maddogg Software, \n\n` +
      `Someone from our staff will be reaching out to you as soon as possible. \n\n` +
      `Best Regards,\nMaddogg Software Dev Team`;
    const request = `You have received a request from ${body.name}. \n\n${JSON.stringify(body, null, 2)}`;

    transporter.sendMail(
      { from: process.env.ADEMAIL, to: body.email, subject: 'NO REPLY: Consultation Request', text: flavor },
      (error) => {
        if (error) console.log(error);
      }
    );
    transporter.sendMail(
      {
        from: process.env.ADEMAIL,
        to: process.env.ADEMAIL,
        subject: 'New Consultation request',
        text: request,
        attachments: req.file ? [req.file] : []
      },
      (error) => {
        if (error) console.log(error);
      }
    );

    return ok(res, { sent: true });
  })
);

module.exports = router;
