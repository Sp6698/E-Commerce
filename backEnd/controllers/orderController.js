const { sequelize } = require('../config/dbConfig');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const { Op, Sequelize } = require('sequelize');

// Get all orders with user and product details
const getAllOrders = async (req, res) => {
    try {
        const orders = await sequelize.transaction(async (t) => {
            const result = await Order.findAll({
                include: [
                    {
                        model: User,
                        attributes: [
                            [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'userName'],
                            'mobile'
                        ]
                    },
                    {
                        model: Product,
                        attributes: ['name', 'rate']
                    }
                ],
                attributes: ['address', 'orderDate', 'qty', 'paymentMode'],
                transaction: t
            });

            // Format the result to a clean response
            const formattedOrders = result.map(order => ({
                userName: order.User.dataValues.userName,
                mobile: order.User.mobile,
                productName: order.Product.name,
                address: order.address,
                orderDate: order.orderDate,
                qty: order.qty,
                rate: order.Product.rate,
                paymentMode: order.paymentMode
            }));

            return formattedOrders;
        });

        res.json({ hasError: false, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ hasError: true, message: error.message });
    }
};

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userId, productId, qty, address, paymentMode } = req.body;

        const newOrder = await Order.create({
            userId,
            productId,
            qty,
            address,
            paymentMode,
            orderDate: new Date()
        });

        res.status(201).json({ hasError: false, data: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ hasError: true, message: error.message });
    }
};

// Export all at end
module.exports = {
    getAllOrders,
    createOrder
};
