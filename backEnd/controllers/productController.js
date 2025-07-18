const Product = require('../models/productModel');

// @desc Add new product
// @route POST /product/add
const addProduct = async (req, res) => {
    try {
        const { name, qty, description, rate, rating, company, base64Image } = req.body;

        // Decode base64 to buffer (if provided)
        const imageBuffer = base64Image ? Buffer.from(base64Image, 'base64') : null;

        const newProduct = await Product.create({
            name,
            qty,
            description,
            rate,
            rating,
            company,
            image: imageBuffer
        });

        res.json({ hasError: false, message: 'Product added successfully', data: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};


module.exports = {
    addProduct
};