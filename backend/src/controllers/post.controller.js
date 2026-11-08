// backend/src/controllers/post.controller.js â€” top of file, after requires
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');
const { uniqueSlug } = require('../utils/slugify');
const { verifyAccessToken } = require('../utils/jwt');

const POPULATE = [
  { path: 'category', select: 'name slug' },
  { path: 'author', select: 'name' },
];

/** GET /api/posts â€” public (published only) */
const listPublic = catchAsync(async (req, res) => {
  const { page, limit, search, category, tag, sort } = req.query;

  const filter = { status: 'published' };
  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };
  if (tag) filter.tags = tag;
  if (category) {
    const cat = await Category.findOne({ slug: category }).select('_id');
    if (!cat) return success(res, { data: [], meta: { page, limit, total: 0, totalPages: 0 } });
    filter.category = cat._id;
  }

  const sortSpec = sort === 'oldest' ? { publishedAt: 1 } : { publishedAt: -1 };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Post.find(filter)
      .populate(POPULATE)
      .select('-content')
      .sort(sortSpec)
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter),
  ]);

  return success(res, {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

/** GET /api/posts/admin â€” admin (all statuses) */
const listAdmin = catchAsync(async (req, res) => {
  const { page, limit, search, category, tag, status = 'all', sort } = req.query;

  const filter = {};
  if (status !== 'all') filter.status = status;
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (tag) filter.tags = tag;
  if (category) {
    const cat = await Category.findOne({ slug: category }).select('_id');
    if (!cat) return success(res, { data: [], meta: { page, limit, total: 0, totalPages: 0 } });
    filter.category = cat._id;
  }

  const sortSpec = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Post.find(filter)
      .populate(POPULATE)
      .select('-content')
      .sort(sortSpec)
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter),
  ]);

  return success(res, {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
});

/** GET /api/posts/:id â€” admin */
const getById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(POPULATE);
  if (!post) return next(new AppError('Post not found', 404));
  return success(res, { data: post });
});

/** GET /api/posts/slug/:slug â€” public (published only unless admin passes Authorization) */
const getBySlug = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(POPULATE);
  if (!post) return next(new AppError('Post not found', 404));

  if (post.status !== 'published') {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next(new AppError('Post not found', 404));
    try {
      const decoded = verifyAccessToken(token);
      if (!['admin', 'editor'].includes(decoded.role)) {
        return next(new AppError('Post not found', 404));
      }
    } catch {
      return next(new AppError('Post not found', 404));
    }
  }

  return success(res, { data: post });
});

/** POST /api/posts â€” admin */
const create = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return next(new AppError('Category not found', 400));

  const slug = await uniqueSlug(Post, req.body.slug || req.body.title);

  const post = await Post.create({
    ...req.body,
    slug,
    author: req.user._id,
    publishedAt: req.body.status === 'published' ? new Date() : null,
  });

  await post.populate(POPULATE);
  return success(res, { status: 201, message: 'Post created', data: post });
});

/** PUT /api/posts/:id â€” admin */
const update = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));

  if (req.body.category) {
    const cat = await Category.findById(req.body.category);
    if (!cat) return next(new AppError('Category not found', 400));
  }

  if (req.body.slug && req.body.slug !== post.slug) {
    req.body.slug = await uniqueSlug(Post, req.body.slug, post._id);
  }

  // Only allow the author or an admin to modify
  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return next(new AppError('You can only edit your own posts', 403));
  }

  Object.assign(post, req.body);
  await post.save();
  await post.populate(POPULATE);

  return success(res, { message: 'Post updated', data: post });
});

/** DELETE /api/posts/:id â€” admin */
const remove = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own posts', 403));
  }

  await post.deleteOne();
  return success(res, { message: 'Post deleted' });
});

/** GET /api/posts/stats â€” admin dashboard overview */
const stats = catchAsync(async (_req, res) => {
  const [total, published, draft, categories, recent] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'draft' }),
    Category.countDocuments(),
    Post.find()
      .populate(POPULATE)
      .select('-content')
      .sort({ updatedAt: -1 })
      .limit(5),
  ]);

  return success(res, {
    data: { total, published, draft, categories, recent },
  });
});

module.exports = { listPublic, listAdmin, getById, getBySlug, create, update, remove, stats };
