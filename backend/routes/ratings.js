const express = require('express');
const router = express.Router();
const {
    submitRating,
    getUserRatings,
    getStoreRatings,
    deleteRating,
    getAverageRating
} = require('../controllers/ratingController');
const { auth } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validators');

// Protected routes
router.post('/', auth, ratingValidation, submitRating);
router.get('/user', auth, getUserRatings);
router.get('/store/:store_id', auth, getStoreRatings);
router.delete('/:store_id', auth, deleteRating);
router.get('/store/:store_id/average', auth, getAverageRating);

module.exports = router; 