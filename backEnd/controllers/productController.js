const Product = require('../models/productModel');

// @desc Add new product
// @route POST /product/add
const addProduct = async (req, res) => {
    try {
        const { name, qty, description, rate, rating, company, imageFileName } = req.body;

        const newProduct = await Product.create({
            name,
            qty,
            description,
            rate,
            rating,
            company,
            imageFileName: imageFileName || ''
        });

        res.json({ hasError: false, message: 'Product added successfully', data: newProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.json({ hasError: true, message: 'Server error' });
    }
};


module.exports = {
    addProduct
};