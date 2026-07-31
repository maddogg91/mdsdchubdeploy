const express = require('express');
const db = require('../../mongoinfo.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();

router.post(
  '/:id/read',
  asyncHandler(async (req, res) => {
    if (!req.session.user) {
      return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }
    const updated = await db.updateNotification({ _id: req.params.id }, req.session.user);
    if (!updated) {
      return fail(res, 404, 'Notification not found', 'NOT_FOUND');
    }
    const notifications = await db.loadNotifications(req.session.user);
    return ok(res, { notifications });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!req.session.user) {
      return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }
    const deleted = await db.deleteNotification({ _id: req.params.id }, req.session.user);
    if (!deleted) {
      return fail(res, 404, 'Notification not found', 'NOT_FOUND');
    }
    const notifications = await db.loadNotifications(req.session.user);
    return ok(res, { notifications });
  })
);

module.exports = router;
