const express = require('express');
const db = require('../../mongoinfo.js');
const payment = require('../../payment.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();

router.get(
  '/verify',
  asyncHandler(async (req, res) => {
    const { id, session_id: sessionId } = req.query;
    if (!id || !sessionId) {
      return fail(res, 400, 'Missing id or session_id', 'MISSING_FIELDS');
    }

    const verified = await payment.verifyPayment(sessionId, id);
    if (!verified) {
      return ok(res, { verified: false });
    }

    db.makeFullPayment(id);
    return ok(res, { verified: true });
  })
);

module.exports = router;
