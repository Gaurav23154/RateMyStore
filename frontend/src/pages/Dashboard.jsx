import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Store as StoreIcon, Star as StarIcon } from '@mui/icons-material';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleViewStores = () => {
        navigate('/stores');
    };

    const handleViewRatings = () => {
        navigate('/my-ratings');
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Welcome, {user?.name}!
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Ratings
                            </Typography>
                            {/* Recent ratings content */}
                        </Paper>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Favorite Stores
                            </Typography>
                            {/* Favorite stores content */}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard; 