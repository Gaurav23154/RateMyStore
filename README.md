# RateMyStore

RateMyStore is a web application that allows users to rate and review stores, helping others make informed decisions about where to shop. Built with modern web technologies, it provides a seamless experience for both store owners and customers.

## Features

- User authentication (login/register)
- Store ratings and reviews
- Store search and filtering
- User profiles
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- Vite
- Axios for API calls
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- PostgreSQL database
- JWT for authentication
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RateMyStore.git
cd RateMyStore
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
DB_DATABASE=ratemystore
JWT_SECRET=your_jwt_secret
```

5. Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the production server:
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile

### Stores
- GET `/api/stores` - Get all stores
- GET `/api/stores/:id` - Get store by ID
- POST `/api/stores` - Create new store
- PUT `/api/stores/:id` - Update store
- DELETE `/api/stores/:id` - Delete store

### Ratings
- GET `/api/ratings` - Get all ratings
- POST `/api/ratings` - Create new rating
- PUT `/api/ratings/:id` - Update rating
- DELETE `/api/ratings/:id` - Delete rating

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
Project Link: [https://github.com/yourusername/RateMyStore](https://github.com/yourusername/RateMyStore) 