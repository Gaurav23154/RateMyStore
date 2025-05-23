import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Link,
    Paper,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(60, 'Name must not exceed 60 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must not exceed 32 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Password must contain at least one uppercase letter and one special character')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    address: Yup.string()
        .max(400, 'Address must not exceed 400 characters')
        .required('Address is required'),
    role: Yup.string()
        .oneOf(['user', 'store_owner', 'admin'], 'Please select a valid role')
        .required('Role is required'),
});

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            role: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const { confirmPassword, ...registrationData } = values;
                console.log('Registration data being sent:', registrationData);
                const user = await register(registrationData);
                console.log('Registration response:', user);
                toast.success('Registration successful!');
                
                // Navigate based on user role
                if (user.role === 'admin') {
                    navigate('/admin');
                } else if (user.role === 'store_owner') {
                    navigate('/store-owner');
                } else {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Registration error:', error);
                const errorMessage = error.errors?.[0]?.msg || error.error || 'Registration failed';
                toast.error(errorMessage);
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h4" gutterBottom>
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Join RateMyStore today
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            fullWidth
                            id="name"
                            name="name"
                            label="Full Name"
                            autoComplete="name"
                            autoFocus
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="address"
                            name="address"
                            label="Address"
                            multiline
                            rows={2}
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                        <FormControl
                            fullWidth
                            margin="normal"
                            error={formik.touched.role && Boolean(formik.errors.role)}
                        >
                            <InputLabel>Role</InputLabel>
                            <Select
                                id="role"
                                name="role"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                label="Role"
                            >
                                <MenuItem value="user">Normal User</MenuItem>
                                <MenuItem value="store_owner">Store Owner</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                            {formik.touched.role && formik.errors.role && (
                                <Typography color="error" variant="caption">
                                    {formik.errors.role}
                                </Typography>
                            )}
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Link component={RouterLink} to="/login" variant="body2">
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 