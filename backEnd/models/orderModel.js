const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const User = require('./userModel');
const Product = require('./productModel');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.STRING, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    address: { type: DataTypes.STRING, allowNull: false },
    paymentMode: { type: DataTypes.ENUM('online', 'cod'), allowNull: false },
    orderDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

// Associations
Order.belongsTo(User, { foreignKey: 'id' });
Order.belongsTo(Product, { foreignKey: 'id' });

module.exports = Order;
