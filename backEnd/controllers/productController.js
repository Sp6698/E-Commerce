const Product = require('../models/productModel');

// @desc Add new product
// @route POST /product/add
const addProduct = async (req, res) => {
    try {
        const { name, qty, description, rate, rating, company, base64Image } = req.body;

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

// @desc Get all products
// @route GET /product/all
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        // Convert image buffer to base64
        const result = products.map(p => ({
            ...p.toJSON(),
            base64Image: p.image ? p.image.toString('base64') : null,
            image: undefined // hide raw image buffer
        }));

        res.json({ hasError: false, data: result, message: 'Products fetched successfully' });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};

// @desc Get product by ID
// @route GET /product/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ hasError: true, message: 'Product not found' });
        }

        const result = {
            ...product.toJSON(),
            base64Image: product.image ? product.image.toString('base64') : null,
            image: undefined
        };

        res.json({ hasError: false, data: result, message: 'Product fetched successfully' });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.json({ hasError: true, message: error.message, data: null });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById
};
