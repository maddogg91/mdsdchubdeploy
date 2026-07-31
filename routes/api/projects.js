const express = require('express');
const db = require('../../mongoinfo.js');
const payment = require('../../payment.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();
const VALID_TYPES = ['website', 'webapp', 'mobile'];

function requireSession(req, res) {
  if (!req.session.user) {
    fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    return false;
  }
  return true;
}

router.post(
  '/',
  asyncHandler(async (req, res) => {
    if (!requireSession(req, res)) return;

    const { projectType, ...body } = req.body;
    if (!VALID_TYPES.includes(projectType)) {
      return fail(res, 400, 'Invalid project type', 'INVALID_TYPE');
    }

    await db.createWebSiteRequest(req.session.user, body, projectType);
    const projects = await db.loadRequest(req.session.user);
    return ok(res, { projects }, 201);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!requireSession(req, res)) return;

    const updated = await db.updateRequest(
      { _id: req.params.id, request: req.body.request },
      req.session.user
    );
    if (!updated) {
      return fail(res, 404, 'Project not found', 'NOT_FOUND');
    }
    const projects = await db.loadRequest(req.session.user);
    return ok(res, { projects });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!requireSession(req, res)) return;

    const deleted = await db.deleteProject({ _id: req.params.id }, req.session.user);
    if (!deleted) {
      return fail(res, 404, 'Project not found', 'NOT_FOUND');
    }
    const projects = await db.loadRequest(req.session.user);
    return ok(res, { projects });
  })
);

router.post(
  '/:id/pay',
  asyncHandler(async (req, res) => {
    if (!requireSession(req, res)) return;

    const project = await db.getRequestForPayment(req.params.id, req.session.user);
    if (!project) {
      return fail(res, 404, 'Project not found', 'NOT_FOUND');
    }

    const url = `${req.protocol}://${req.get('host')}`;
    const amount = project.balance * 100;
    const checkoutUrl = await payment.payment(amount, url, res, req.params.id);
    return ok(res, { checkoutUrl });
  })
);

router.post(
  '/:id/request-update',
  asyncHandler(async (req, res) => {
    if (!requireSession(req, res)) return;

    const project = await db.getRequestForPayment(req.params.id, req.session.user);
    if (!project) {
      return fail(res, 404, 'Project not found', 'NOT_FOUND');
    }

    await db.notifyUpdate('Request for Project Update', 'Admin', {
      request: project,
      update: req.body.message ?? ''
    });
    return ok(res, { sent: true });
  })
);

module.exports = router;
