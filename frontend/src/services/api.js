import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    register: (userData) => {
        console.log('API register call with:', userData);
        return api.post('/auth/register', userData);
    },
    login: (credentials) => {
        console.log('API login call with:', credentials);
        return api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
        });
    },
    updatePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Store services
export const storeService = {
    getAll: () => api.get('/stores'),
    getById: (id) => api.get(`/stores/${id}`),
    create: (storeData) => api.post('/stores', storeData),
    update: (id, storeData) => api.put(`/stores/${id}`, storeData),
    delete: (id) => api.delete(`/stores/${id}`),
    getOwnerStores: () => api.get('/stores/owner'),
    getStoreRatings: (id) => api.get(`/stores/${id}/ratings`),
};

// Rating services
export const ratingService = {
    create: (ratingData) => api.post('/ratings', ratingData),
    getByStore: (storeId) => api.get(`/ratings/store/${storeId}`),
    getByUser: () => api.get('/ratings/user'),
    delete: (id) => api.delete(`/ratings/${id}`),
    getAverageRating: (storeId) => api.get(`/ratings/store/${storeId}/average`),
};

export default api; 