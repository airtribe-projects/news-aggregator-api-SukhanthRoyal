const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const { auth: verifyToken } = require('../middleware/auth');

// POST /users/signup
router.post('/signup', async (req, res) => {
  try {
    const { user, token } = await usersController.registerUser(req.body);
    // Tests expect 200 on signup success
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const { user, token } = await usersController.loginUser(email, password);
    res.status(200).json({ user, token }); // tests look for token property
  } catch (err) {
    if (err.message.includes('Wrong password')) {
      res.status(401).json({ message: err.message });
    } else if (err.message.includes('User not found')) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

// GET /users/preferences
router.get('/preferences', verifyToken, async (req, res) => {
  try {
    const prefs = await usersController.getPreferences(req.user.id);
    res.status(200).json({ preferences: prefs });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// PUT /users/preferences
router.put('/preferences', verifyToken, async (req, res) => {
  try {
    const prefs = await usersController.updatePreferences(req.user.id, req.body.preferences);
    res.status(200).json({ preferences: prefs });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;