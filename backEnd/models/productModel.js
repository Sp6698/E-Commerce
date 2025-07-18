const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    },
    company: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    imageFileName: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Product;
