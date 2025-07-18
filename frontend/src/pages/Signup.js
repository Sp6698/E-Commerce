import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Button, Container,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchApis } from '../util/commonAPI';
import { useLocation, useNavigate } from "react-router-dom";

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
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userIdAvailable, setUserIdAvailable] = useState(true);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        userId: '',
        password: '',
        confirmPassword: '',
        mobileNo: '',
        email: '',
        gender: ''
    });

    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleTogglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        const newErrors = { ...errors };

        switch (name) {
            case 'firstName':
                if (!formData.firstName) {
                    newErrors.firstName = 'First Name is required';
                }
                break;
            case 'lastName':
                if (!formData.lastName) {
                    newErrors.lastName = 'Last Name is required';
                }
                break;
            case 'userId':
                if (!formData.userId) {
                    newErrors.userId = 'User ID is required';
                }
                break;
            case 'password':
                if (!formData.password) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters long';
                }
                break;
            case 'confirmPassword':
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Password and Confirm Password must match';
                }
                break;
            case 'mobileNo':
                if (!formData.mobileNo || !/^\d{10}$/.test(formData.mobileNo)) {
                    newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
                }
                break;
            case 'email':
                if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Please enter a valid email address';
                }
                break;
            case 'gender':
                if (!formData.gender) {
                    newErrors.gender = 'Please select a Gender';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const handleUserIdBlur = async () => {
        try {

            const checkUserIdRes = await fetchApis('/auth/checkUserId', { userId: formData.userId }, 'post');
            if (checkUserIdRes.hasError) {
                console.log("checkUserIdRes", checkUserIdRes);
                toast[checkUserIdRes.status](checkUserIdRes.message);
                return
            }
            setUserIdAvailable(!checkUserIdRes.data.exists);
        } catch (err) {
            console.error("Error checking userId", err);
            setUserIdAvailable(true);
        }
    };

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.firstName) {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        } else if (!formData.lastName) {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        } else if (!formData.userId) {
            newErrors.userId = 'User ID is required';
            isValid = false;
        } else if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password and Confirm Password must match';
            isValid = false;
        } else if (!formData.mobileNo || !/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        } else if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        } else if (!formData.gender) {
            newErrors.gender = 'Please select a Gender';
            isValid = false;
        }

        if (!userIdAvailable) {
            newErrors.userId = 'User ID already exists';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            let data = {
                userId: formData.userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobileNo: formData.mobileNo,
                address: formData.address,
                gender: formData.gender,
                role: 'customer',
                email: formData.email,
                password: formData.password
            }
            const saveRes = await fetchApis('/auth/signup', data, 'post');
            console.log("saveRes", saveRes);
            toast[saveRes.status](saveRes.message);
            if (saveRes.hasError) {
                return
            }
            handleClear();
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Signup failed');
        }
    };

    // Styles for reduced input height
    const inputStyles = {
        '& .MuiInputBase-root': {
            height: '28px', // Reduced from default ~56px to 28px (50% reduction)
            fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            transform: 'translate(14px, 6px) scale(1)', // Adjusted label position
        },
        '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)', // Adjusted shrunk label position
        },
        '& .MuiOutlinedInput-input': {
            padding: '4px 14px', // Reduced padding
        },
        '& .MuiFormHelperText-root': {
            fontSize: '11px',
            marginTop: '1px',
            marginLeft: '0px',
            color: '#d32f2f', // Error color
        }
    };

    // Special styles for multiline address field
    const addressStyles = {
        '& .MuiInputBase-root': {
            minHeight: '56px', // Keep original height for multiline
            fontSize: '14px',
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
        },
        '& .MuiOutlinedInput-input': {
            padding: '8px 14px',
        },
        '& .MuiFormHelperText-root': {
            fontSize: '11px',
            marginTop: '1px',
            marginLeft: '0px',
            color: '#d32f2f', // Error color
        }
    };
    const handleClear = () => {
        setFormData({
            firstName: '',
            lastName: '',
            userId: '',
            password: '',
            confirmPassword: '',
            mobileNo: '',
            email: '',
            gender: ''
        })
    }
    return (
        <Container maxWidth="sm" className='my-5' sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>
                        <strong>User Information</strong>
                    </Typography>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                            sx={inputStyles}
                        />

                        <TextField
                            label="First Name"
                            name="firstName"
                            fullWidth
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            sx={inputStyles}
                        />

                        <TextField
                            label="Last Name"
                            name="lastName"
                            fullWidth
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            sx={inputStyles}
                        />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                            sx={inputStyles}
                        />

                        <TextField
                            label="Mobile No"
                            name="mobileNo"
                            type="tel"
                            fullWidth
                            required
                            inputProps={{ maxLength: 10 }}
                            value={formData.mobileNo}
                            onChange={handleChange}
                            sx={inputStyles}
                        />

                        <TextField
                            label="Gender"
                            name="gender"
                            select
                            fullWidth
                            required
                            value={formData.gender}
                            onChange={handleChange}
                            sx={inputStyles}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </TextField>

                        <TextField
                            label="Address"
                            name="address"
                            multiline
                            rows={2}
                            fullWidth
                            value={formData.address}
                            onChange={handleChange}
                            sx={addressStyles}
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={inputStyles}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePassword} size="small">
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            sx={inputStyles}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleConfirmPassword} size="small">
                                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '16px' }}>
                        <Button type="submit" variant="contained" sx={{ flex: 1 }}>
                            Register
                        </Button>

                        <Button href="/login" variant="outlined" sx={{ flex: 1 }}>
                            Back to Login
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default Signup;