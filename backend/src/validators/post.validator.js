const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const basePost = {
  title: z.string().trim().min(3).max(180),
  excerpt: z.string().trim().min(10).max(400),
  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(500_000, 'Content exceeds the 500 KB limit'),
  featuredImage: z
    .object({
      url: z.string().trim().default(''),
      publicId: z.string().trim().default(''),
    })
    .optional(),
  category: objectId,
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
  status: z.enum(['draft', 'published']).optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(300).optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers, and hyphens')
    .optional(),
};

const createPostSchema = z.object(basePost);

// Partial: every field is optional so PUT can accept sparse updates.
const updatePostSchema = z.object({
  title: basePost.title.optional(),
  excerpt: basePost.excerpt.optional(),
  content: basePost.content.optional(),
  featuredImage: basePost.featuredImage,
  category: objectId.optional(),
  tags: basePost.tags,
  status: basePost.status,
  seoTitle: basePost.seoTitle,
  seoDescription: basePost.seoDescription,
  slug: basePost.slug,
});

const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  status: z.enum(['draft', 'published', 'all']).optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
});

const idParamSchema = z.object({ id: objectId });
const slugParamSchema = z.object({ slug: z.string().min(1) });

module.exports = {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  idParamSchema,
  slugParamSchema,
};