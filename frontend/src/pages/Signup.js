import React, { useState } from 'react';
import {
    TextField, Button, Container, Paper, Typography, Grid, InputAdornment, IconButton, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        address: '',
        gender: '',
        role: 'customer',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [userIdAvailable, setUserIdAvailable] = useState(true);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleUserIdBlur = async () => {
        try {
            // You can add your API call here to check if userId is taken
            // Example endpoint: `/api/check-userid/${formData.userId}`
            const res = await axios.get(`/api/check-userid/${formData.userId}`);
            setUserIdAvailable(!res.data.exists);
        } catch (err) {
            console.error("Error checking userId", err);
            setUserIdAvailable(true);
        }
    };

    const validate = () => {
        const { userId, email, password, confirmPassword, mobileNo, gender, firstName, lastName } = formData;
        if (!userId || !email || !password || !confirmPassword || !mobileNo || !gender || !firstName || !lastName) return false;
        if (!/^\S+@\S+\.\S+$/.test(email)) return false;
        if (!/^\d{10}$/.test(mobileNo)) return false;
        if (password !== confirmPassword) return false;
        if (!userIdAvailable) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            alert("Please enter valid details.");
            return;
        }

        try {
            const res = await axios.post('/api/signup', formData);
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h5" align="center" sx={{ my: 3 }}>
                Welcome to <strong>Rojnishi</strong>!
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        <strong>User Information</strong>
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="User ID"
                                name="userId"
                                fullWidth
                                required
                                value={formData.userId}
                                onChange={handleChange}
                                onBlur={handleUserIdBlur}
                                error={!userIdAvailable}
                                helperText={!userIdAvailable ? 'User ID already exists' : ''}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                fullWidth
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Last Name"
                                name="lastName"
                                fullWidth
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Mobile No"
                                name="mobileNo"
                                type="tel"
                                fullWidth
                                required
                                inputProps={{ maxLength: 10 }}
                                value={formData.mobileNo}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Gender"
                                name="gender"
                                select
                                fullWidth
                                required
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="address"
                                multiline
                                rows={2}
                                fullWidth
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                required
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleTogglePassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
                        Register
                    </Button>

                    <Button href="/login" variant="outlined" sx={{ mt: 2 }} fullWidth>
                        Back to Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Signup;
