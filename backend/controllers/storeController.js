const Store = require('../models/store');
const { validationResult } = require('express-validator');

const createStore = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, address } = req.body;
        const store = await Store.create({
            name,
            email,
            address,
            owner_id: req.user.id
        });

        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getStores = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            email: req.query.email,
            address: req.query.address,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const stores = await Store.findAll(filters);
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateStore = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Check if user is store owner or admin
        if (store.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updatedStore = await Store.update(req.params.id, req.body);
        res.json(updatedStore);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteStore = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Only admin or store owner can delete
        if (store.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Store.delete(req.params.id);
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getStoreRatings = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        // Only store owner or admin can view ratings
        if (store.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const ratings = await Store.getStoreRatings(req.params.id);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createStore,
    getStores,
    getStoreById,
    updateStore,
    deleteStore,
    getStoreRatings
}; 