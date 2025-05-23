const { pool } = require('../config/db');

class Store {
    static async create({ name, email, address, owner_id }) {
        const query = `
            INSERT INTO stores (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, address, owner_id
        `;
        const values = [name, email, address, owner_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.id = $1
            GROUP BY s.id
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
        `;

        const values = [];
        const conditions = [];

        if (filters.name) {
            values.push(`%${filters.name}%`);
            conditions.push(`s.name ILIKE $${values.length}`);
        }

        if (filters.email) {
            values.push(`%${filters.email}%`);
            conditions.push(`s.email ILIKE $${values.length}`);
        }

        if (filters.address) {
            values.push(`%${filters.address}%`);
            conditions.push(`s.address ILIKE $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY s.id';

        if (filters.sortBy) {
            const validColumns = ['name', 'email', 'address', 'average_rating'];
            const sortColumn = validColumns.includes(filters.sortBy) ? filters.sortBy : 'name';
            const sortOrder = filters.sortOrder === 'desc' ? 'DESC' : 'ASC';
            query += ` ORDER BY ${sortColumn} ${sortOrder}`;
        }

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findByOwnerId(owner_id) {
        const query = `
            SELECT s.*, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.id) as total_ratings
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = $1
            GROUP BY s.id
        `;
        const result = await pool.query(query, [owner_id]);
        return result.rows;
    }

    static async update(id, { name, email, address }) {
        const query = `
            UPDATE stores
            SET name = COALESCE($1, name),
                email = COALESCE($2, email),
                address = COALESCE($3, address),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, name, email, address, owner_id
        `;
        const values = [name, email, address, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM stores WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
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
}

module.exports = Store; 