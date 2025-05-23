import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Rating,
    TextField,
    Button,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Store as StoreIcon,
    Star as StarIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { storeService, ratingService } from '../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StoreDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [store, setStore] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const validationSchema = Yup.object({
        rating: Yup.number()
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating must not exceed 5')
            .required('Rating is required'),
        comment: Yup.string()
            .required('Comment is required')
            .min(10, 'Comment must be at least 10 characters')
            .max(500, 'Comment must not exceed 500 characters'),
    });

    const formik = useFormik({
        initialValues: {
            rating: 0,
            comment: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await ratingService.createRating({
                    storeId: id,
                    rating: values.rating,
                    comment: values.comment,
                });
                setMessage({ type: 'success', text: 'Rating submitted successfully' });
                setOpenSnackbar(true);
                formik.resetForm();
                fetchStoreData();
            } catch (error) {
                setMessage({ type: 'error', text: error.message || 'Failed to submit rating' });
                setOpenSnackbar(true);
            }
        },
    });

    useEffect(() => {
        fetchStoreData();
    }, [id]);

    const fetchStoreData = async () => {
        try {
            const [storeResponse, ratingsResponse] = await Promise.all([
                storeService.getStore(id),
                ratingService.getStoreRatings(id),
            ]);
            setStore(storeResponse.data);
            setRatings(ratingsResponse.data);
            setLoading(false);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch store data' });
            setOpenSnackbar(true);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!store) {
        return (
            <Container>
                <Typography>Store not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={4}>
                    {/* Store Information */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <StoreIcon sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h4" component="h1">
                                        {store.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {store.address}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Rating value={store.averageRating} precision={0.5} readOnly />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    ({store.averageRating}) - {store.totalRatings} ratings
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Rating Form */}
                            <Typography variant="h6" gutterBottom>
                                Submit Your Rating
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography component="legend">Rating</Typography>
                                    <Rating
                                        name="rating"
                                        value={formik.values.rating}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('rating', newValue);
                                        }}
                                    />
                                    {formik.touched.rating && formik.errors.rating && (
                                        <Typography color="error" variant="caption">
                                            {formik.errors.rating}
                                        </Typography>
                                    )}
                                </Box>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="comment"
                                    label="Your Review"
                                    value={formik.values.comment}
                                    onChange={formik.handleChange}
                                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                                    helperText={formik.touched.comment && formik.errors.comment}
                                    sx={{ mb: 2 }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!user}
                                >
                                    {user ? 'Submit Rating' : 'Login to Rate'}
                                </Button>
                            </form>
                        </Paper>
                    </Grid>

                    {/* Recent Ratings */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Ratings
                            </Typography>
                            <List>
                                {ratings.map((rating) => (
                                    <React.Fragment key={rating.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography component="span" variant="subtitle2">
                                                            {rating.user.name}
                                                        </Typography>
                                                        <Rating
                                                            value={rating.rating}
                                                            readOnly
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {new Date(rating.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                            {rating.comment}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
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

export default StoreDetails; 