const { sequelize } = require('../config/dbConfig');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const { Op, Sequelize } = require('sequelize');

// Get all orders with user and product details
// const getAllOrders = async (req, res) => {
//     try {
//         const orders = await sequelize.transaction(async (t) => {
//             const result = await Order.findAll({
//                 include: [
//                     {
//                         model: User,
//                         attributes: [
//                             [Sequelize.fn('CONCAT', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), 'userName'],
//                             'mobileNo'
//                         ]
//                     },
//                     {
//                         model: Product,
//                         attributes: ['name', 'rate']
//                     }
//                 ],
//                 attributes: ['address', 'orderDate', 'qty', 'paymentMode'],
//                 transaction: t
//             });


//             // Format the result to a clean response
//             const formattedOrders = result.map(order => ({
//                 userName: order.User?.dataValues?.userName || 'Unknown User',
//                 mobile: order.User?.mobileNo || 'N/A',
//                 productName: order.Product?.name || 'Unknown Product',
//                 address: order.address,
//                 orderDate: order.orderDate,
//                 qty: order.qty,
//                 rate: order.Product?.rate || 0,
//                 paymentMode: order.paymentMode
//             }));


//             return formattedOrders;
//         });

//         res.json({ hasError: false, data: orders, message: 'Orders fetched successfully' });
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.json({ hasError: true, message: error.message, data: null });
//     }
// };
const getAllOrders = async (req, res) => {
    try {
        const orders = await sequelize.transaction(async (t) => {
            const result = await Order.findAll({
                include: [
                    {
                        model: User,
                        attributes: [
                            [Sequelize.fn('CONCAT', Sequelize.col('User.firstName'), ' ', Sequelize.col('User.lastName')), 'userName'],
                            'mobileNo'
                        ],
                        required: true,
                        on: {
                            '$Order.userId$': { [Sequelize.Op.col]: 'User.userId' }
                        }
                    },
                    {
                        model: Product,
                        attributes: ['name', 'rate'],
                        required: true,
                        on: {
                            '$Order.productId$': { [Sequelize.Op.col]: 'Product.id' }
                        }
                    }
                ],
                attributes: ['address', 'orderDate', 'qty', 'paymentMode'],
                transaction: t
            });

            const formattedOrders = result.map(order => ({
                userName: order.User?.dataValues?.userName || 'Unknown User',
                mobile: order.User?.mobileNo || 'N/A',
                productName: order.Product?.name || 'Unknown Product',
                address: order.address,
                orderDate: order.orderDate,
                qty: order.qty,
                rate: order.Product?.rate || 0,
                paymentMode: order.paymentMode
            }));

            return formattedOrders;
        });

        res.json({ hasError: false, data: orders, message: 'Orders fetched successfully' });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};

// Create a new order
const placeOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, productId, qty, address, paymentMode } = req.body;

        // 1. Fetch product
        const product = await Product.findByPk(productId, { transaction: t });
        console.log('Fetched Product:', product?.toJSON());

        if (!product || product.qty < qty) {
            throw new Error('Product not available or insufficient stock');
        }

        // 2. Create order
        const newOrder = await Order.create({
            userId,
            productId,
            qty,
            address,
            paymentMode,
            orderDate: new Date()
        }, { transaction: t });

        console.log('New Order Created:', newOrder.toJSON());

        // 3. Update product stock
        product.qty -= qty;
        await product.save({ transaction: t });

        console.log('Updated Product Stock:', product.qty);

        // 4. Remove from cart if exists
        const cartDeleteCount = await Cart.destroy({
            where: { userId, productId },
            transaction: t
        });

        console.log(`Cart items removed: ${cartDeleteCount}`);

        // Commit transaction
        await t.commit();
        res.json({ hasError: false, data: newOrder, message: 'Product Ordered successfully' });

    } catch (error) {
        await t.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ hasError: true, message: error.message, data: null });
    }
};

// Export all at end
module.exports = {
    getAllOrders,
    placeOrder
};
