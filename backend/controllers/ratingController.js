const Rating = require('../models/rating');
const { validationResult } = require('express-validator');

const submitRating = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { store_id, rating } = req.body;
        const user_id = req.user.id;

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const newRating = await Rating.create({
            user_id,
            store_id,
            rating
        });

        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserRatings = async (req, res) => {
    try {
        const ratings = await Rating.getUserRatings(req.user.id);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getStoreRatings = async (req, res) => {
    try {
        const ratings = await Rating.getStoreRatings(req.params.store_id);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { store_id } = req.params;
        const user_id = req.user.id;

        const rating = await Rating.findByUserAndStore(user_id, store_id);
        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        await Rating.delete(user_id, store_id);
        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getAverageRating = async (req, res) => {
    try {
        const { store_id } = req.params;
        const ratingStats = await Rating.getAverageRating(store_id);
        res.json(ratingStats);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    submitRating,
    getUserRatings,
    getStoreRatings,
    deleteRating,
    getAverageRating
}; 