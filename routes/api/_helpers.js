function ok(res, data, status = 200) {
  res.status(status).json({ data });
}

function fail(res, status, message, code) {
  res.status(status).json({ error: { message, code } });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { ok, fail, asyncHandler };
