const express = require('express');
const db = require('../../mongoinfo.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();
const CONTRACTOR_EMAIL_DOMAIN = '@maddoggsoftware.com';

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
  }
  if (req.session.user.usertype !== 'Admin') {
    return fail(res, 403, 'Admin access required', 'FORBIDDEN');
  }
  next();
}

router.post(
  '/contractors',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
      return fail(res, 400, 'Name and email are required', 'MISSING_FIELDS');
    }
    if (!email.toLowerCase().endsWith(CONTRACTOR_EMAIL_DOMAIN)) {
      return fail(
        res,
        400,
        `Contractor email must end with ${CONTRACTOR_EMAIL_DOMAIN}`,
        'INVALID_DOMAIN'
      );
    }

    const created = await db.createContractor(email, name);
    if (!created) {
      return fail(res, 409, 'An account with that email already exists', 'EMAIL_TAKEN');
    }
    return ok(res, { created: true }, 201);
  })
);

module.exports = router;
