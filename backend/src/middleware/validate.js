const { fail } = require('../utils/apiResponse');

/**
 * validate({ body, query, params })
 * Each key is an optional Zod schema; on success the parsed values replace req[key].
 */
function validate({ body, query, params } = {}) {
  return (req, res, next) => {
    const run = (schema, source, label) => {
      const result = schema.safeParse(source);
      if (!result.success) {
        fail(res, {
          status: 422,
          message: `Validation failed (${label})`,
          errors: result.error.flatten().fieldErrors,
        });
        return { ok: false };
      }
      return { ok: true, data: result.data };
    };

    if (body) {
      const r = run(body, req.body, 'body');
      if (!r.ok) return;
      req.body = r.data;
    }
    if (query) {
      const r = run(query, req.query, 'query');
      if (!r.ok) return;
      req.query = r.data;
    }
    if (params) {
      const r = run(params, req.params, 'params');
      if (!r.ok) return;
      req.params = r.data;
    }
    next();
  };
}

module.exports = validate;