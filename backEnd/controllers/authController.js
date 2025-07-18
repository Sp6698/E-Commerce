// backend/controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup API
const signup = async (req, res) => {
    const {
        userId,
        firstName,
        lastName,
        mobileNo,
        address,
        gender,
        role,
        email,
        password
    } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            userId,
            firstName,
            lastName,
            mobileNo,
            address,
            gender,
            role,
            email,
            password: hashedPassword
        });
        res.json({ data: user, hasError: false, message: "User created successfully" });
    } catch (error) {
        console.error(error)
        res.json({ data: {}, hasError: true, message: error.message });
    }
};

// Login API
const login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ where: { userId } });

        if (user && await bcrypt.compare(password, user.password)) {
            let token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ data: { user: user, token }, hasError: false, message: "Login successful", token });
        } else {
            res.json({ data: {}, hasError: true, message: "Invalid userId or password" });
        }
    } catch (error) {
        console.error(error)
        res.json({ data: {}, hasError: true, message: error.message });
    }
};

// Check if userId exists
const checkUserId = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOne({ where: { userId } });
        if (user) {
            res.json({ data: { exists: true }, hasError: false, message: "User ID already exist please Use different ID" });
        } else {
            res.json({ data: { exists: false }, hasError: false, message: "User ID does not exist" });
        }
    } catch (error) {
        console.error(error)
        res.json({ data: {}, hasError: true, message: error.message });
    }
};

module.exports = {
    signup,
    login,
    checkUserId
};
