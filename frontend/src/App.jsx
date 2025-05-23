import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StoreDetails from './pages/StoreDetails';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Unauthorized from './pages/Unauthorized';
import { AuthProvider } from './contexts/AuthContext';
import Stores from './pages/Stores';
import MyRatings from './pages/MyRatings';
import UserProfile from './pages/UserProfile';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 500,
            textAlign: 'center',
        },
        h2: {
            fontWeight: 500,
            textAlign: 'center',
        },
        h3: {
            fontWeight: 500,
            textAlign: 'center',
        },
        h4: {
            fontWeight: 500,
            textAlign: 'center',
        },
        h5: {
            fontWeight: 500,
            textAlign: 'center',
        },
        h6: {
            fontWeight: 500,
            textAlign: 'center',
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                },
            },
        },
        MuiGrid: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    justifyContent: 'center',
                },
            },
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stores/:id"
                            element={
                                <ProtectedRoute>
                                    <StoreDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/store-owner"
                            element={
                                <ProtectedRoute roles={['store_owner']}>
                                    <StoreOwnerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stores"
                            element={
                                <ProtectedRoute>
                                    <Stores />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-ratings"
                            element={
                                <ProtectedRoute>
                                    <MyRatings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
