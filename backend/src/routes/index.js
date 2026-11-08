const router = require('express').Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Tactyqal Labs API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', require('./auth.routes'));
router.use('/posts', require('./post.routes'));
router.use('/categories', require('./category.routes'));
router.use('/upload', require('./upload.routes'));

module.exports = router;