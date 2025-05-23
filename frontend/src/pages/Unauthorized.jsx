import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <ErrorIcon color="error" sx={{ fontSize: 64 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" paragraph>
                    You don't have permission to access this page. Please contact your administrator
                    if you believe this is a mistake.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/')}
                    >
                        Go to Dashboard
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Unauthorized; 