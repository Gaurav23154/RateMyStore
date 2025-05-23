const { pool } = require('../config/db');

class Rating {
    static async create({ user_id, store_id, rating }) {
        const query = `
            INSERT INTO ratings (user_id, store_id, rating)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, store_id) 
            DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
            RETURNING id, user_id, store_id, rating
        `;
        const values = [user_id, store_id, rating];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByUserAndStore(user_id, store_id) {
        const query = 'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2';
        const result = await pool.query(query, [user_id, store_id]);
        return result.rows[0];
    }

    static async getUserRatings(user_id) {
        const query = `
            SELECT r.*, s.name as store_name, s.address as store_address
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC
        `;
        const result = await pool.query(query, [user_id]);
        return result.rows;
    }

    static async getStoreRatings(store_id) {
        const query = `
            SELECT r.*, u.name as user_name, u.email as user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC
        `;
        const result = await pool.query(query, [store_id]);
        return result.rows;
    }

    static async delete(user_id, store_id) {
        const query = 'DELETE FROM ratings WHERE user_id = $1 AND store_id = $2 RETURNING id';
        const result = await pool.query(query, [user_id, store_id]);
        return result.rows[0];
    }

    static async getAverageRating(store_id) {
        const query = `
            SELECT COALESCE(AVG(rating), 0) as average_rating,
                   COUNT(*) as total_ratings
            FROM ratings
            WHERE store_id = $1
        `;
        const result = await pool.query(query, [store_id]);
        return result.rows[0];
    }
}

module.exports = Rating; 