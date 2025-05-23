import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login({
                email: formData.email.trim(),
                password: formData.password
            });
            toast.success('Login successful!');
            
            // Navigate based on user role
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'store_owner') {
                navigate('/store-owner');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.error || 'Login failed';
            toast.error(errorMessage);
        }
    };

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
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Please sign in to continue
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Link component={RouterLink} to="/register" variant="body2">
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 