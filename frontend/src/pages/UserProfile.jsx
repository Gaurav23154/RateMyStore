import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [message, setMessage] = useState({ type: '', text: '' });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(20, 'Name must be at least 20 characters')
            .max(60, 'Name must not exceed 60 characters')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        address: Yup.string()
            .required('Address is required'),
        currentPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(16, 'Password must not exceed 16 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
            .when('newPassword', {
                is: (val) => val && val.length > 0,
                then: Yup.string().required('Current password is required'),
            }),
        newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(16, 'Password must not exceed 16 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .when('newPassword', {
                is: (val) => val && val.length > 0,
                then: Yup.string().required('Please confirm your password'),
            }),
    });

    const formik = useFormik({
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
            address: user?.address || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const updateData = {
                    name: values.name,
                    email: values.email,
                    address: values.address,
                };

                if (values.newPassword) {
                    updateData.currentPassword = values.currentPassword;
                    updateData.newPassword = values.newPassword;
                }

                await updateUser(updateData);
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setOpenSnackbar(true);
                formik.resetForm({
                    values: {
                        ...values,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    },
                });
            } catch (error) {
                setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
                setOpenSnackbar(true);
            }
        },
    });

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Profile Settings
                </Typography>

                <Paper sx={{ p: 3 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="address"
                                    name="address"
                                    label="Address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Change Password
                                </Typography>
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="currentPassword"
                                    name="currentPassword"
                                    label="Current Password"
                                    type="password"
                                    value={formik.values.currentPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="newPassword"
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <TextField
                                    fullWidth
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>

                            <Grid xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                >
                                    Update Profile
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={message.type}
                    sx={{ width: '100%' }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserProfile; 