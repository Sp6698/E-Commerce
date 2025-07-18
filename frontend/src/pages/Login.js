// src/components/Login.js
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Button,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { fetchApis } from '../util/commonAPI';
import { jwtDecode } from "jwt-decode";
import { setAuth } from '../store/authStore'; // ✅ added line

const Login = () => {
    const [form, setForm] = useState({ userId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginRes = await fetchApis('/auth/login', {
                userId: form.userId,
                password: form.password
            }, 'post');
            console.log("loginRes", loginRes);
            toast[loginRes.status](loginRes.message);
            if (loginRes.hasError) {
                return;
            }

            if (loginRes.data?.token) {
                const { token } = loginRes.data;
                const { userId, role, firstName, lastName } = loginRes.data.user;

                let expiresTime = jwtDecode(token).exp * 1000;
                let currwenTime = new Date().getTime();
                let expiresIn = expiresTime - currwenTime - 15 * 60 * 1000;

                // Save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('role', role);
                localStorage.setItem('userNm', `${firstName} ${lastName}`);

                // ✅ update the global store (reactive)
                setAuth(role, token);

                // Auto-remove token before expiry
                setTimeout(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("role");
                    localStorage.removeItem("userNm");
                }, expiresIn);

                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
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
                        value={form.userId}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        margin="normal"
                        value={form.password}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
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
