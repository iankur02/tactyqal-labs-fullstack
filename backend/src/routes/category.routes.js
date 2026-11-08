const router = require('express').Router();
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const {
  createCategorySchema,
  updateCategorySchema,
  idParamSchema,
} = require('../validators/category.validator');
const c = require('../controllers/category.controller');

router.get('/', c.list);

router.use(protect, restrictTo('admin', 'editor'));

router.post('/', validate({ body: createCategorySchema }), c.create);
router.put('/:id', validate({ params: idParamSchema, body: updateCategorySchema }), c.update);
router.delete('/:id', validate({ params: idParamSchema }), c.remove);

module.exports = router;