const express = require('express');
const router = express.Router();
const { addProduct } = require('../controllers/productController');

// POST /product/add
router.post('/add', addProduct);

module.exports = router;
