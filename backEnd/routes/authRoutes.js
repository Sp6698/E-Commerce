// backend/routes/authRoutes.js
const express = require('express');
const { signup, login, checkUserId } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/checkUserId', checkUserId);

module.exports = router;
