const express = require('express');
const router = express.Router();
const { 
    createStore, 
    getStores, 
    getStoreById, 
    updateStore, 
    deleteStore,
    getStoreRatings 
} = require('../controllers/storeController');
const { auth, authorize } = require('../middleware/auth');
const { storeValidation } = require('../middleware/validators');

// Public routes
router.get('/', getStores);
router.get('/:id', getStoreById);

// Protected routes
router.post('/', auth, authorize('admin', 'store_owner'), storeValidation, createStore);
router.put('/:id', auth, authorize('admin', 'store_owner'), storeValidation, updateStore);
router.delete('/:id', auth, authorize('admin', 'store_owner'), deleteStore);
router.get('/:id/ratings', auth, authorize('admin', 'store_owner'), getStoreRatings);

module.exports = router; 