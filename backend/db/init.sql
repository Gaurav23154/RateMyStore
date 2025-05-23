-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create stores table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(400) NOT NULL,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    store_id INTEGER REFERENCES stores(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_stores_email ON stores(email);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id); 