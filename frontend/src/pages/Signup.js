import { Visibility, VisibilityOff, InfoOutlined } from '@mui/icons-material';
import {
    Button, Container,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Tooltip
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchApis } from '../util/commonAPI';
import { useLocation, useNavigate } from "react-router-dom";
import ShoppingLoader from '../components/ShoppingLoader';

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
    const [loading, setLoading] = useState(false);
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
        gender: '',
        address: ''
    });

    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For mobile number, only allow digits and max 10 characters
        if (name === 'mobileNo') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

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
                } else if (formData.firstName.length < 2) {
                    newErrors.firstName = 'First Name must be at least 2 characters long';
                }
                break;
            case 'lastName':
                if (!formData.lastName) {
                    newErrors.lastName = 'Last Name is required';
                } else if (formData.lastName.length < 2) {
                    newErrors.lastName = 'Last Name must be at least 2 characters long';
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
                } else {
                    const passwordValidation = validatePassword(formData.password);
                    if (!passwordValidation.isValid) {
                        newErrors.password = passwordValidation.message;
                    }
                }
                break;
            case 'confirmPassword':
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Password and Confirm Password must match';
                }
                break;
            case 'mobileNo':
                if (!formData.mobileNo) {
                    newErrors.mobileNo = 'Mobile number is required';
                } else if (formData.mobileNo.length !== 10) {
                    newErrors.mobileNo = 'Mobile number must be exactly 10 digits';
                } else if (!/^\d{10}$/.test(formData.mobileNo)) {
                    newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
                }
                break;
            case 'email':
                if (!formData.email) {
                    newErrors.email = 'Email is required';
                } else {
                    const emailValidation = validateEmail(formData.email);
                    if (!emailValidation.isValid) {
                        newErrors.email = emailValidation.message;
                    }
                }
                break;
            case 'gender':
                if (!formData.gender) {
                    newErrors.gender = 'Please select a Gender';
                }
                break;
            case 'address':
                if (!formData.address) {
                    newErrors.address = 'Address is required';
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        if (password.length > 10) {
            return { isValid: false, message: 'Password must not exceed 10 characters' };
        }
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least 1 uppercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least 1 number' };
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least 1 special character' };
        }
        return { isValid: true, message: '' };
    };

    const validateEmail = (email) => {
        // Check if email contains @
        if (!email.includes('@')) {
            return { isValid: false, message: 'Email must contain @' };
        }

        const parts = email.split('@');
        if (parts.length !== 2) {
            return { isValid: false, message: 'Email format is invalid' };
        }

        const [localPart, domainPart] = parts;

        // Check if local part exists
        if (!localPart) {
            return { isValid: false, message: 'Email must have a username before @' };
        }

        // Check if domain part contains dot
        if (!domainPart.includes('.')) {
            return { isValid: false, message: 'Email domain must contain a dot (.)' };
        }

        const domainParts = domainPart.split('.');
        if (domainParts.length < 2) {
            return { isValid: false, message: 'Email domain format is invalid' };
        }

        // Check if domain name and extension exist
        const domainName = domainParts[0];
        const extension = domainParts[domainParts.length - 1];

        if (!domainName) {
            return { isValid: false, message: 'Email must have a domain name' };
        }

        if (!extension || extension.length < 2) {
            return { isValid: false, message: 'Email must have a valid extension (e.g., .com, .org)' };
        }

        // Basic email regex for additional validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }

        return { isValid: true, message: '' };
    };

    const handleUserIdBlur = async () => {
        try {
            setLoading(true);
            const checkUserIdRes = await fetchApis('/auth/checkUserId', { userId: formData.userId }, 'post');
            if (checkUserIdRes.hasError) {
                console.log("checkUserIdRes", checkUserIdRes);
                setLoading(false);
                toast[checkUserIdRes.status](checkUserIdRes.message);
                return
            }
            setUserIdAvailable(!checkUserIdRes.data.exists);
            setLoading(false);
        } catch (err) {
            console.error("Error checking userId", err);
            setUserIdAvailable(true);
        }
    };

    const validate = () => {
        let isValid = true;
        const newErrors = {};

        // First Name validation
        if (!formData.firstName) {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First Name must be at least 2 characters long';
            isValid = false;
        }

        // Last Name validation
        if (!formData.lastName) {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last Name must be at least 2 characters long';
            isValid = false;
        }

        // User ID validation
        if (!formData.userId) {
            newErrors.userId = 'User ID is required';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.message;
                isValid = false;
            }
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Password and Confirm Password must match';
            isValid = false;
        }

        // Mobile Number validation
        if (!formData.mobileNo) {
            newErrors.mobileNo = 'Mobile number is required';
            isValid = false;
        } else if (formData.mobileNo.length !== 10) {
            newErrors.mobileNo = 'Mobile number must be exactly 10 digits';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else {
            const emailValidation = validateEmail(formData.email);
            if (!emailValidation.isValid) {
                newErrors.email = emailValidation.message;
                isValid = false;
            }
        }

        // Gender validation
        if (!formData.gender) {
            newErrors.gender = 'Please select a Gender';
            isValid = false;
        }

        // Address validation
        if (!formData.address) {
            newErrors.address = 'Address is required';
            isValid = false;
        }

        // User ID availability check
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
            setLoading(true);
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
                setLoading(false);
                return
            }
            handleClear();
            setLoading(false);
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Signup failed');
        }
    };

    // Enhanced responsive styles with better colors
    const inputStyles = {
        '& .MuiInputBase-root': {
            height: '35px',
            fontSize: '14px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: '#f5f5f5',
            },
            '&.Mui-focused': {
                backgroundColor: '#ffffff',
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
            }
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            color: '#666',
            transform: 'translate(14px, 8px) scale(1)',
            '&.Mui-focused': {
                color: '#1976d2',
            }
        },
        '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
                borderColor: '#bdbdbd',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
                borderColor: '#d32f2f',
            }
        },
        '& .MuiOutlinedInput-input': {
            padding: '6px 14px',
        },
        '& .MuiFormHelperText-root': {
            fontSize: '11px',
            marginTop: '2px',
            marginLeft: '2px',
            color: '#d32f2f',
            fontWeight: '500',
        }
    };

    // Special styles for multiline address field
    const addressStyles = {
        '& .MuiInputBase-root': {
            minHeight: '60px',
            fontSize: '14px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: '#f5f5f5',
            },
            '&.Mui-focused': {
                backgroundColor: '#ffffff',
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
            }
        },
        '& .MuiInputLabel-root': {
            fontSize: '14px',
            color: '#666',
            '&.Mui-focused': {
                color: '#1976d2',
            }
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
                borderColor: '#bdbdbd',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
                borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
                borderColor: '#d32f2f',
            }
        },
        '& .MuiOutlinedInput-input': {
            padding: '8px 14px',
        },
        '& .MuiFormHelperText-root': {
            fontSize: '11px',
            marginTop: '2px',
            marginLeft: '2px',
            color: '#d32f2f',
            fontWeight: '500',
        }
    };

    const handleClear = () => {
        setFormData({
            userId: '',
            firstName: '',
            lastName: '',
            mobileNo: '',
            address: '',
            gender: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
        setErrors({
            firstName: '',
            lastName: '',
            userId: '',
            password: '',
            confirmPassword: '',
            mobileNo: '',
            email: '',
            gender: '',
            address: ''
        });
    }

    return (
        <Container
            maxWidth="sm"
            className='my-5'
            sx={{
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 4 }
            }}
        >
            {loading && (<ShoppingLoader />)}
            <Paper
                elevation={6}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    width: '100%',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 3,
                            textAlign: 'center',
                            color: '#1976d2',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.5rem', sm: '1.75rem' }
                        }}
                    >
                        Create Account
                    </Typography>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                            label="User ID"
                            name="userId"
                            fullWidth
                            required
                            value={formData.userId}
                            onChange={handleChange}
                            onBlur={handleUserIdBlur}
                            error={!userIdAvailable || !!errors.userId}
                            helperText={!userIdAvailable ? 'User ID already exists' : errors.userId}
                            sx={inputStyles}
                        />

                        <div style={{ display: 'flex', gap: '15px', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                fullWidth
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                sx={inputStyles}
                            />

                            <TextField
                                label="Last Name"
                                name="lastName"
                                fullWidth
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                sx={inputStyles}
                            />
                        </div>

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={inputStyles}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Email must contain @ symbol, domain name, and valid extension (e.g., user@domain.com)" arrow>
                                            <InfoOutlined
                                                fontSize="small"
                                                sx={{ color: '#999', cursor: 'help' }}
                                            />
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label="Mobile Number"
                            name="mobileNo"
                            type="tel"
                            fullWidth
                            required
                            inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                            value={formData.mobileNo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.mobileNo}
                            helperText={errors.mobileNo}
                            sx={inputStyles}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Mobile number must be exactly 10 digits (0-9)" arrow>
                                            <InfoOutlined
                                                fontSize="small"
                                                sx={{ color: '#999', cursor: 'help' }}
                                            />
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label="Gender"
                            name="gender"
                            select
                            fullWidth
                            required
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.gender}
                            helperText={errors.gender}
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
                            required
                            value={formData.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.address}
                            helperText={errors.address}
                            sx={addressStyles}
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            required
                            inputProps={{ maxLength: 10 }}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={inputStyles}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip
                                            title={
                                                <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                                    <strong>Password Requirements:</strong><br />
                                                    • 8-10 characters<br />
                                                    • At least 1 uppercase letter (A-Z)<br />
                                                    • At least 1 number (0-9)<br />
                                                    • At least 1 special character (!@#$%^&*(),.?":{ }|&lt;&gt;)
                                                </div>
                                            }
                                            arrow
                                        >
                                            <InfoOutlined
                                                fontSize="small"
                                                sx={{ color: '#999', cursor: 'help', mr: 0.5 }}
                                            />
                                        </Tooltip>
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

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginTop: '24px',
                        flexDirection: window.innerWidth < 600 ? 'column' : 'row'
                    }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                flex: 1,
                                py: 1.5,
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    boxShadow: '0 6px 10px 4px rgba(25, 118, 210, .3)',
                                }
                            }}
                        >
                            Register
                        </Button>

                        <Button
                            href="/login"
                            variant="outlined"
                            sx={{
                                flex: 1,
                                py: 1.5,
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                borderWidth: '2px',
                                '&:hover': {
                                    borderColor: '#1565c0',
                                    color: '#1565c0',
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    borderWidth: '2px',
                                }
                            }}
                        >
                            Back to Login
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default Signup;