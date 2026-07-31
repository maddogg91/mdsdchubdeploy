const express = require('express');
const db = require('../../mongoinfo.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();

function sanitizeUser(user) {
  if (!user) return null;
  const { passw, ...safe } = user;
  return safe;
}

router.get(
  '/me',
  asyncHandler(async (req, res) => {
    if (!req.session.user) {
      return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }
    return ok(res, { user: sanitizeUser(req.session.user) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 400, 'Email and password are required', 'MISSING_FIELDS');
    }

    const user = await db.login(email, password);
    if (!user) {
      return fail(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }
    if (!user.verified) {
      return fail(res, 403, 'Account not verified', 'NOT_VERIFIED');
    }

    req.session.user = user;
    return ok(res, { user: sanitizeUser(user) });
  })
);

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, confirmPassword, name, country, bday, phone } = req.body;
    if (!email || !password || !name || !country || !bday) {
      return fail(res, 400, 'Missing required information', 'MISSING_FIELDS');
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return fail(res, 400, 'Passwords do not match', 'PASSWORD_MISMATCH');
    }

    const result = await db.register(email, password, name, country, bday, phone);
    if (result === false) {
      return fail(res, 409, 'An account with that email already exists', 'EMAIL_TAKEN');
    }
    return ok(res, { registered: true }, 201);
  })
);

router.post(
  '/verify',
  asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return fail(res, 400, 'Verification code is required', 'MISSING_CODE');
    }

    const success = await db.verify(String(code).split(''));
    if (!success) {
      return fail(res, 400, 'Invalid or expired verification code', 'INVALID_CODE');
    }
    return ok(res, { verified: true });
  })
);

router.post(
  '/resend',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return fail(res, 400, 'Email is required', 'MISSING_FIELDS');
    }
    await db.resendVerification(email);
    // Always report success, whether or not the email is registered, to avoid
    // leaking which emails have accounts.
    return ok(res, { sent: true });
  })
);

router.post(
  '/forgot',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return fail(res, 400, 'Email is required', 'MISSING_FIELDS');
    }
    await db.createResetToken(email);
    return ok(res, { sent: true });
  })
);

router.post(
  '/reset',
  asyncHandler(async (req, res) => {
    const { code, password, confirm_password: confirmPassword } = req.body;
    if (!code || !password) {
      return fail(res, 400, 'Reset code and new password are required', 'MISSING_FIELDS');
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return fail(res, 400, 'Passwords do not match', 'PASSWORD_MISMATCH');
    }

    const success = await db.resetPassword({ code, password });
    if (!success) {
      return fail(res, 400, 'Request either timed out or email was invalid', 'INVALID_CODE');
    }
    return ok(res, { reset: true });
  })
);

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return fail(res, 500, 'Could not log out', 'LOGOUT_FAILED');
    }
    res.clearCookie('connect.sid');
    return ok(res, { loggedOut: true });
  });
});

module.exports = router;
