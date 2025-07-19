// backEnd/config/dbConfig.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,        // 'railway'
    process.env.DB_USER,        // 'root'
    process.env.DB_PASSWORD,    // your password
    {
        host: process.env.DB_HOST,     // 'yamabiko.proxy.rlwy.net'
        port: process.env.DB_PORT,     // '17948'
        dialect: 'mysql',
        logging: false
    }
);


// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to database:', error);
        process.exit(1); // Exit if connection fails
    }
};

module.exports = { sequelize, testConnection };
