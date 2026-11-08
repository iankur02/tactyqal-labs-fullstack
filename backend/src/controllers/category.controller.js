const Category = require('../models/Category');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');
const { uniqueSlug } = require('../utils/slugify');
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const list = catchAsync(async (_req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    return success(res, { data: categories });
});

const create = catchAsync(async (req, res, next) => {
    const exists = await Category.findOne({
        name: { $regex: new RegExp(`^${escapeRegex(req.body.name)}$`, 'i') },
    });
    if (exists) return next(new AppError('Category with this name already exists', 409));

    const slug = await uniqueSlug(Category, req.body.name);
    const category = await Category.create({ ...req.body, slug });
    return success(res, { status: 201, message: 'Category created', data: category });
});

const update = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    if (req.body.name && req.body.name.toLowerCase() !== category.name.toLowerCase()) {
  const clash = await Category.findOne({
    _id: { $ne: category._id },
    name: { $regex: new RegExp(`^${escapeRegex(req.body.name)}$`, 'i') },
  });
  if (clash) return next(new AppError('Category with this name already exists', 409));
  req.body.slug = await uniqueSlug(Category, req.body.name, category._id);
}

    Object.assign(category, req.body);
    await category.save();
    return success(res, { message: 'Category updated', data: category });
});

const remove = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    const postCount = await Post.countDocuments({ category: category._id });
    if (postCount > 0) {
        return next(
            new AppError(
                `Cannot delete: ${postCount} post(s) still reference this category. Reassign or delete them first.`,
                409
            )
        );
    }

    await category.deleteOne();
    return success(res, { message: 'Category deleted' });
});

module.exports = { list, create, update, remove };