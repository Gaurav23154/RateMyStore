import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Rating,
} from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';

const Stores = () => {
    // This is a placeholder for the stores data
    const stores = [
        {
            id: 1,
            name: 'Sample Store 1',
            description: 'A great store with amazing products',
            rating: 4.5,
            address: '123 Main St, City',
        },
        {
            id: 2,
            name: 'Sample Store 2',
            description: 'Another fantastic store',
            rating: 4.0,
            address: '456 Oak Ave, Town',
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Stores
                </Typography>
                <Grid container spacing={3}>
                    {stores.map((store) => (
                        <Grid item xs={12} md={6} key={store.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <StoreIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6" component="div">
                                            {store.name}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {store.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        <strong>Address:</strong> {store.address}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating value={store.rating} precision={0.5} readOnly />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({store.rating})
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        View Details
                                    </Button>
                                    <Button size="small" color="primary">
                                        Rate Store
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Stores; 