'use strict';

/**
 * Ocean Professional response helpers
 * Colors (for docs/semantic reference):
 * - primary: #2563EB
 * - secondary/success: #F59E0B
 * - error: #EF4444
 */
function ok(res, data = {}, meta = {}) {
  return res.status(200).json({
    status: 'ok',
    theme: 'Ocean Professional',
    color: '#2563EB',
    data,
    meta,
  });
}

function created(res, data = {}, meta = {}) {
  return res.status(201).json({
    status: 'created',
    theme: 'Ocean Professional',
    color: '#2563EB',
    data,
    meta,
  });
}

function error(res, httpStatus = 400, code = 'bad_request', message = 'Request invalid', details = null) {
  return res.status(httpStatus).json({
    status: 'error',
    theme: 'Ocean Professional',
    color: '#EF4444',
    code,
    message,
    details,
  });
}

module.exports = {
  ok,
  created,
  error,
};
