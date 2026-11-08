// Wrap async route handlers so thrown errors flow to the centralized handler.
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);