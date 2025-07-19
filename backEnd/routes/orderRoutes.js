const express = require('express');
const router = express.Router();
const { getAllOrders, placeOrder } = require('../controllers/orderController');

router.post('/placeOrder', placeOrder);       // + Create new order
router.get('/getOrderList', getAllOrders);       // + Get all orders

module.exports = router;
