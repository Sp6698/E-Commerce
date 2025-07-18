const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Cart = sequelize.define('Cart', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
});

module.exports = Cart;
