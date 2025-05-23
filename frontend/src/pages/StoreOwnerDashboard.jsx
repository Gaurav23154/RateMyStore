import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Rating,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    IconButton,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputAdornment,
    Chip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Store as StoreIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { storeService, ratingService } from '../services/api';
import { toast } from 'react-toastify';

const StoreOwnerDashboard = () => {
    const { user } = useAuth();
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storeRatings, setStoreRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openStoreDialog, setOpenStoreDialog] = useState(false);
    const [storeForm, setStoreForm] = useState({
        name: '',
        address: '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await storeService.getOwnerStores();
            setStores(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch stores');
            setLoading(false);
        }
    };

    const fetchStoreRatings = async (storeId) => {
        try {
            const response = await ratingService.getStoreRatings(storeId);
            setStoreRatings(response.data);
        } catch (error) {
            toast.error('Failed to fetch ratings');
        }
    };

    const handleStoreClick = async (store) => {
        setSelectedStore(store);
        await fetchStoreRatings(store.id);
    };

    const handleStoreDialogOpen = (store = null) => {
        if (store) {
            setStoreForm({
                name: store.name,
                address: store.address,
            });
        } else {
            setStoreForm({
                name: '',
                address: '',
            });
        }
        setOpenStoreDialog(true);
    };

    const handleStoreDialogClose = () => {
        setOpenStoreDialog(false);
        setStoreForm({
            name: '',
            address: '',
        });
    };

    const handleStoreSubmit = async () => {
        try {
            if (selectedStore) {
                await storeService.updateStore(selectedStore.id, storeForm);
                toast.success('Store updated successfully');
            } else {
                await storeService.createStore({
                    ...storeForm,
                    ownerId: user.id,
                });
                toast.success('Store created successfully');
            }
            handleStoreDialogClose();
            fetchStores();
        } catch (error) {
            toast.error(error.error || 'Failed to save store');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Store Owner Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome, {user?.name}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Your Stores</Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleStoreDialogOpen()}
                            >
                                Add Store
                            </Button>
                        </Box>
                        <List>
                            {stores.map((store) => (
                                <React.Fragment key={store.id}>
                                    <ListItem
                                        button
                                        selected={selectedStore?.id === store.id}
                                        onClick={() => handleStoreClick(store)}
                                    >
                                        <ListItemText
                                            primary={store.name}
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rating
                                                        value={store.averageRating || 0}
                                                        readOnly
                                                        size="small"
                                                    />
                                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                                        ({store.totalRatings || 0})
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStoreDialogOpen(store);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    {selectedStore ? (
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedStore.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {selectedStore.address}
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Recent Ratings
                                </Typography>
                                <List>
                                    {storeRatings.map((rating) => (
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
                            </Box>
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Select a store to view details
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <Dialog open={openStoreDialog} onClose={handleStoreDialogClose}>
                <DialogTitle>
                    {selectedStore ? 'Edit Store' : 'Add New Store'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Store Name"
                        value={storeForm.name}
                        onChange={(e) =>
                            setStoreForm({ ...storeForm, name: e.target.value })
                        }
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        value={storeForm.address}
                        onChange={(e) =>
                            setStoreForm({ ...storeForm, address: e.target.value })
                        }
                        margin="normal"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStoreDialogClose}>Cancel</Button>
                    <Button onClick={handleStoreSubmit} variant="contained">
                        {selectedStore ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Store Overview
                </Typography>

                {/* Store Overview */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <StoreIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">
                                        {selectedStore ? selectedStore.name : 'No store selected'}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" paragraph>
                                    <strong>Address:</strong> {selectedStore ? selectedStore.address : 'No address available'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Rating value={selectedStore ? selectedStore.averageRating : 0} precision={0.5} readOnly />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({selectedStore ? selectedStore.averageRating : 0})
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Total Ratings: {selectedStore ? selectedStore.totalRatings : 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Ratings List */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                <StarIcon sx={{ mr: 1 }} />
                                Customer Ratings
                            </Typography>
                            <TextField
                                placeholder="Search ratings..."
                                value={searchQuery}
                                onChange={handleSearch}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Comment</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {storeRatings.map((rating) => (
                                        <TableRow key={rating.id}>
                                            <TableCell>{rating.user.name}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rating value={rating.rating} readOnly size="small" />
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                        ({rating.rating})
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{rating.comment}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={new Date(rating.createdAt).toLocaleDateString()}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default StoreOwnerDashboard; 