import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Rating,
    Chip,
} from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';

const MyRatings = () => {
    // This is a placeholder for the ratings data
    const ratings = [
        {
            id: 1,
            storeName: 'Sample Store 1',
            rating: 4.5,
            comment: 'Great store with excellent service!',
            date: '2024-03-15',
        },
        {
            id: 2,
            storeName: 'Sample Store 2',
            rating: 3.5,
            comment: 'Good products but could improve customer service.',
            date: '2024-03-10',
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Ratings
                </Typography>
                <Grid container spacing={3}>
                    {ratings.map((rating) => (
                        <Grid item xs={12} key={rating.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <StoreIcon sx={{ mr: 1 }} />
                                        <Typography variant="h6" component="div">
                                            {rating.storeName}
                                        </Typography>
                                        <Chip
                                            label={rating.date}
                                            size="small"
                                            sx={{ ml: 'auto' }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Rating value={rating.rating} precision={0.5} readOnly />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({rating.rating})
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.secondary">
                                        {rating.comment}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default MyRatings; 