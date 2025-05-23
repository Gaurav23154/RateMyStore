import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Divider,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Store as StoreIcon,
    Star as StarIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Group as GroupIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const getMenuItems = () => {
        const commonItems = [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
            { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
        ];

        if (user?.role === 'admin') {
            return [
                ...commonItems,
                { text: 'Admin Dashboard', icon: <DashboardIcon />, path: '/admin' },
                { text: 'Manage Users', icon: <GroupIcon />, path: '/admin?tab=users' },
                { text: 'Manage Stores', icon: <StoreIcon />, path: '/admin?tab=stores' },
            ];
        } else if (user?.role === 'store_owner') {
            return [
                ...commonItems,
                { text: 'Store Dashboard', icon: <DashboardIcon />, path: '/store-owner' },
                { text: 'My Stores', icon: <StoreIcon />, path: '/store-owner' },
            ];
        } else {
            return [
                ...commonItems,
                { text: 'View Stores', icon: <StoreIcon />, path: '/stores' },
                { text: 'My Ratings', icon: <StarIcon />, path: '/my-ratings' },
            ];
        }
    };

    const drawer = (
        <div>
            <Toolbar sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                py: 2
            }}>
                <Avatar 
                    sx={{ 
                        width: 64, 
                        height: 64, 
                        bgcolor: 'primary.main',
                        mb: 1
                    }}
                >
                    {getInitials(user?.name || '')}
                </Avatar>
                <Typography variant="subtitle1" noWrap>
                    {user?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {user?.email}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    {user?.role === 'admin' ? 'Administrator' : 
                     user?.role === 'store_owner' ? 'Store Owner' : 
                     'Normal User'}
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {getMenuItems().map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {user?.name}
                        </Typography>
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls="user-menu"
                            aria-haspopup="true"
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>
                                {user?.name?.charAt(0)}
                            </Avatar>
                        </IconButton>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleProfileClick}>
                                <ListItemIcon>
                                    <PersonIcon fontSize="small" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 