const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/dbConfig');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');
const Order = require('./models/orderModel');

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ✅ CORS setup for both local and deployed frontend
app.use(cors({
    origin: ['http://localhost:3000', 'https://e-commerce-spapps.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ MySQL session store config
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// ✅ Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production' // true for HTTPS only
    }
}));

// Express middleware
app.use(express.json());

// DB Initialization
const initializeDB = async () => {
    await testConnection();
    try {
        await User.sync({ force: false });
        await Product.sync({ force: false });
        await Cart.sync({ force: false });
        await Order.sync({ force: false });
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
app.use('/cart', cartRoutes);
app.use('/order', orderRouter);

// Start Server
app.listen(PORT, async () => {
    await initializeDB();
    console.log(`Server running on http://localhost:${PORT}`);
});
