const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getUserCart } = require('../controllers/cartController');

router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/getUserCart', getUserCart); // 👈 Get user's cart

module.exports = router;
