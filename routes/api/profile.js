const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../mongoinfo.js');
const { ok, fail, asyncHandler } = require('./_helpers.js');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '..', '..', 'tmp') + path.sep });

router.put(
  '/',
  asyncHandler(async (req, res) => {
    if (!req.session.user) {
      return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }

    await db.updateProfile(req.session.user, req.body);
    const user = await db.loadUser(req.session.user);
    req.session.user = user;

    const { passw, ...safeUser } = user;
    return ok(res, { user: safeUser });
  })
);

router.post(
  '/avatar',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.session.user) {
      return fail(res, 401, 'Not authenticated', 'NOT_AUTHENTICATED');
    }
    if (!req.file) {
      return fail(res, 400, 'No file uploaded', 'MISSING_FILE');
    }

    const filename = String(Math.floor(Math.random() * 90000) + 10000);
    const safeOriginalName = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetPath = `public/images/user${req.session.user._id}/${filename}${safeOriginalName}`;

    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.promises.copyFile(req.file.path, targetPath);
    await fs.promises.unlink(req.file.path);

    await db.updateUserAvatar(targetPath, req.session.user);
    const user = await db.loadUser(req.session.user);
    req.session.user = user;

    return ok(res, { avatarPath: targetPath.replace('public/', '') });
  })
);

module.exports = router;
