// backend/src/routes/health.js
router.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
