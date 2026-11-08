const router = require('express').Router();
const upload = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadImage } = require('../controllers/upload.controller');

router.post(
  '/',
  protect,
  restrictTo('admin', 'editor'),
  upload.single('image'),
  uploadImage
);

module.exports = router;