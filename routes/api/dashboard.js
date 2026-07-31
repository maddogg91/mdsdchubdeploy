const express = require('express');
const db = require('../../mongoinfo.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    if (!req.session.user) {
      return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }

    const user = await db.loadUser(req.session.user);
    const [projects, notifications] = await Promise.all([
      db.loadRequest(user),
      db.loadNotifications(user)
    ]);

    req.session.user = user;

    const { passw, ...safeUser } = user;
    return ok(res, {
      user: safeUser,
      projects: projects ?? [],
      notifications: notifications ?? []
    });
  })
);

module.exports = router;
