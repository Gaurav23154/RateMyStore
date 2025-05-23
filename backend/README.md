# RateMyStore Backend

This is the backend implementation for the RateMyStore application, built with Express.js and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a PostgreSQL database:
```sql
CREATE DATABASE ratemystore;
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ratemystore
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
```

4. Initialize the database by running the SQL script:
```bash
psql -U postgres -d ratemystore -f db/init.sql
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- PUT /api/auth/password - Update password (requires authentication)

### Stores
- GET /api/stores - Get all stores
- GET /api/stores/:id - Get store by ID
- POST /api/stores - Create new store (requires admin/store_owner role)
- PUT /api/stores/:id - Update store (requires admin/store_owner role)
- DELETE /api/stores/:id - Delete store (requires admin/store_owner role)
- GET /api/stores/:id/ratings - Get store ratings (requires admin/store_owner role)

### Ratings
- POST /api/ratings - Submit a rating (requires authentication)
- GET /api/ratings/user - Get user's ratings (requires authentication)
- GET /api/ratings/store/:store_id - Get store ratings (requires authentication)
- DELETE /api/ratings/:store_id - Delete rating (requires authentication)
- GET /api/ratings/store/:store_id/average - Get store average rating (requires authentication)

## Validation Rules

- Name: 20-60 characters
- Address: Maximum 400 characters
- Password: 8-16 characters, must include at least one uppercase letter and one special character
- Email: Must follow standard email validation rules
- Rating: Must be between 1 and 5 