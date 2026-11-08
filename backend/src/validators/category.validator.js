const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
});

const updateCategorySchema = createCategorySchema.partial();

const idParamSchema = z.object({ id: objectId });

module.exports = { createCategorySchema, updateCategorySchema, idParamSchema };