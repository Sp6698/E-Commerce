const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Product = require('./productModel');

const Cart = sequelize.define('Cart', {
    userId: { type: DataTypes.STRING, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

Cart.belongsTo(Product, { foreignKey: 'productId' }); // 👈 JOIN setup

module.exports = Cart;
