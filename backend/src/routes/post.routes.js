const router = require('express').Router();
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  idParamSchema,
  slugParamSchema,
} = require('../validators/post.validator');
const c = require('../controllers/post.controller');

// Public
router.get('/', validate({ query: listPostsQuerySchema }), c.listPublic);
router.get('/slug/:slug', validate({ params: slugParamSchema }), c.getBySlug);

// Admin-only
router.use(protect, restrictTo('admin', 'editor'));

router.get('/stats', c.stats);
router.get('/admin', validate({ query: listPostsQuerySchema }), c.listAdmin);
router.get('/:id', validate({ params: idParamSchema }), c.getById);
router.post('/', validate({ body: createPostSchema }), c.create);
router.put('/:id', validate({ params: idParamSchema, body: updatePostSchema }), c.update);
router.delete('/:id', validate({ params: idParamSchema }), c.remove);

module.exports = router;