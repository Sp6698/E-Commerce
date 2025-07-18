// backEnd/server.js
const express = require('express');
const { sequelize, testConnection } = require('./config/dbConfig');
const User = require('./models/userModel');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Initialization
const initializeDB = async () => {
    await testConnection();

    try {
        await User.sync({ force: false }); // Set force: true only in development to drop and recreate tables
        console.log('User table synchronized');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('E-Commerce Backend API');
});

app.use('/auth', authRouter);

// Start Server
app.listen(PORT, async () => {
    await initializeDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
