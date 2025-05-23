import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
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
    Tabs,
    Tab,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    CardActions,
    Chip,
    Tooltip,
    CircularProgress,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Store as StoreIcon,
    Group as GroupIcon,
    Add as AddIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { storeService } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openStoreDialog, setOpenStoreDialog] = useState(false);
    const [storeForm, setStoreForm] = useState({
        name: '',
        address: '',
        ownerId: '',
    });
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [storesResponse, usersResponse] = await Promise.all([
                storeService.getAllStores(),
                storeService.getAllUsers(),
            ]);
            setStores(storesResponse.data);
            setUsers(usersResponse.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleStoreDialogOpen = (store = null) => {
        if (store) {
            setStoreForm({
                name: store.name,
                address: store.address,
                ownerId: store.ownerId,
            });
            setSelectedStore(store);
        } else {
            setStoreForm({
                name: '',
                address: '',
                ownerId: '',
            });
            setSelectedStore(null);
        }
        setOpenStoreDialog(true);
    };

    const handleStoreDialogClose = () => {
        setOpenStoreDialog(false);
        setStoreForm({
            name: '',
            address: '',
            ownerId: '',
        });
        setSelectedStore(null);
    };

    const handleStoreSubmit = async () => {
        try {
            if (selectedStore) {
                await storeService.updateStore(selectedStore.id, storeForm);
                toast.success('Store updated successfully');
            } else {
                await storeService.createStore(storeForm);
                toast.success('Store created successfully');
            }
            handleStoreDialogClose();
            fetchData();
        } catch (error) {
            toast.error(error.error || 'Failed to save store');
        }
    };

    const handleDeleteStore = async (storeId) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            try {
                await storeService.deleteStore(storeId);
                toast.success('Store deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete store');
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    const renderStats = () => (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total Users
                        </Typography>
                        <Typography variant="h3">
                            {users.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total Stores
                        </Typography>
                        <Typography variant="h3">
                            {stores.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Total Ratings
                        </Typography>
                        <Typography variant="h3">
                            {/* Calculate total ratings */}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const renderUsersTable = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('user')}
                >
                    Add User
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const renderStoresTable = () => (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    placeholder="Search stores..."
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('store')}
                >
                    Add Store
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell>{store.name}</TableCell>
                                <TableCell>{store.email}</TableCell>
                                <TableCell>{store.address}</TableCell>
                                <TableCell>{store.rating}</TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 4,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                    color: 'white',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Admin Dashboard
                </Typography>
                <Typography variant="body1">
                    Welcome, {user?.name}
                </Typography>
            </Paper>

            <Paper
                elevation={2}
                sx={{
                    mb: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant={isMobile ? "fullWidth" : "standard"}
                >
                    <Tab
                        icon={<StoreIcon />}
                        label={isMobile ? "" : "Stores"}
                        iconPosition="start"
                    />
                    <Tab
                        icon={<GroupIcon />}
                        label={isMobile ? "" : "Users"}
                        iconPosition="start"
                    />
                </Tabs>
            </Paper>

            <Box sx={{ mt: 4 }}>
                {activeTab === 0 ? renderStoresTable() : renderUsersTable()}
            </Box>

            <Dialog
                open={openStoreDialog}
                onClose={handleStoreDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                    },
                }}
            >
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
                        variant="outlined"
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
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        select
                        label="Store Owner"
                        value={storeForm.ownerId}
                        onChange={(e) =>
                            setStoreForm({ ...storeForm, ownerId: e.target.value })
                        }
                        margin="normal"
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                    >
                        <option value="">Select Owner</option>
                        {users
                            .filter((user) => user.role === 'store_owner')
                            .map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleStoreDialogClose}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStoreSubmit}
                        variant="contained"
                        startIcon={selectedStore ? <EditIcon /> : <AddIcon />}
                    >
                        {selectedStore ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {dialogType === 'user' ? 'Add New User' : 'Add New Store'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Address"
                            fullWidth
                            required
                        />
                        {dialogType === 'user' && (
                            <>
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    required
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Role</InputLabel>
                                    <Select label="Role">
                                        <MenuItem value="user">Normal User</MenuItem>
                                        <MenuItem value="store_owner">Store Owner</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCloseDialog}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard; 