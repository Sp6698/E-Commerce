// src/components/Login.js
import React, { useState } from 'react';
import {
    TextField, Button, Typography, Container, Paper, InputAdornment
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import axios from 'axios';

const Login = () => {
    const [form, setForm] = useState({ userId: '', password: '' });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', form);
            alert(res.data.message);
            localStorage.setItem('token', res.data.token);
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3, boxShadow: '0 0 12px #00e5ff' }}>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="User Id"
                        name="userId"
                        required
                        type="text"
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><Email /></InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        required
                        type="password"
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><Lock /></InputAdornment>
                            )
                        }}
                    />
                    <div className="d-flex justify-content-center">
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Login
                        </Button>
                    </div>
                </form>
                <Typography align="center" sx={{ mt: 2 }}>
                    Don’t have an account yet? <a href="/signup">Sign Up</a>
                </Typography>
                <Typography align="center" sx={{ mt: 1 }}>
                    <a href="/forgot-password" style={{ color: 'blue' }}>Forgot Password?</a>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login;
