const express = require('express');
const router = express.Router();
const {
    addProduct,
    getAllProducts,
    getProductById
} = require('../controllers/productController');

router.post('/add', addProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;
