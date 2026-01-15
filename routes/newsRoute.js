const express = require('express');
const router = express.Router();

const { auth: verifyToken } = require('../middleware/auth');
router.get('/', verifyToken, (_req, res) => {
  res.status(200).json({ news: [] });
});

module.exports = router;