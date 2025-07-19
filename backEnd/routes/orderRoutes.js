const express = require('express');
const router = express.Router();
const { getAllOrders, createOrder } = require('../controllers/orderController');

router.post('/createOrder', createOrder);       // + Create new order
router.get('/getAllOrders', getAllOrders);       // + Get all orders

module.exports = router;
