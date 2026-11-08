const slugifyLib = require('slugify');

const baseSlug = (input) =>
  slugifyLib(String(input || ''), { lower: true, strict: true, trim: true });

/**
 * Generate a unique slug for a model (e.g. Post, Category).
 * Appends -1, -2, ... until free. Excludes `excludeId` from the check.
 */
const MAX_ATTEMPTS = 100;

async function uniqueSlug(Model, value, excludeId = null) {
  const base = baseSlug(value) || `item-${Date.now()}`;
  let candidate = base;
  let counter = 0;

  while (counter < MAX_ATTEMPTS) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const clash = await Model.exists(query);
    if (!clash) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }

  // Deterministic fallback if the base name is pathologically contended
  return `${base}-${Date.now().toString(36)}`;
}

module.exports = { baseSlug, uniqueSlug };