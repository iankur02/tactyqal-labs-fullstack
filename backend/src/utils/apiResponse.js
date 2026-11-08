function success(res, { status = 200, message = 'OK', data = null, meta = null } = {}) {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(status).json(payload);
}

function fail(res, { status = 400, message = 'Bad Request', errors = null } = {}) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
}

module.exports = { success, fail };