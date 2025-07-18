const express = require('express');
const cors = require('cors'); // ✅ Add this
const { sequelize, testConnection } = require('./config/dbConfig');
const User = require('./models/userModel');
require('dotenv').config();
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes'); 


const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for frontend on port 3000
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
}));

// Middleware
app.use(express.json());

// Database Initialization
const initializeDB = async () => {
    await testConnection();

    try {
        await User.sync({ force: false });
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('E-Commerce Backend API');
});

app.use('/auth', authRouter);
app.use('/product', productRouter); 


// Start Server
app.listen(PORT, async () => {
    await initializeDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
