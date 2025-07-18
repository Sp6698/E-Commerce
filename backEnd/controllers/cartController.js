const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

// Add to Cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const existingItem = await Cart.findOne({ where: { userId, productId } });

        if (existingItem) {
            existingItem.quantity += quantity || 1;
            await existingItem.save();
            return res.json({ hasError: false, message: 'Cart updated', data: existingItem });
        }

        const cart = await Cart.create({ userId, productId, quantity: quantity || 1 });
        res.json({ hasError: false, message: 'Added to cart', data: cart });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const result = await Cart.destroy({ where: { userId, productId } });

        if (result === 0) return res.json({ hasError: false, message: 'Item not found in cart', data: null });

        res.json({ hasError: false, message: 'Removed from cart', data: null });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};


// Get all cart items for a user
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;

        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{
                model: Product,
                attributes: ['name', 'image', 'rate']
            }]
        });

        const formattedCart = cartItems.map(item => {
            const product = item.Product;
            const totalRate = product.rate * item.quantity;

            return {
                productId: item.productId,
                productName: product.name,
                image: product.image,
                rate: product.rate,
                quantity: item.quantity,
                totalRate
            };
        });

        res.json({ hasError: false, message: 'Cart items fetched', data: formattedCart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getUserCart
};
