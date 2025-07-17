<<<<<<< HEAD
# E-Commerce Bidding & Bartering Platform

A full-stack e-commerce platform that allows users to buy, sell, bid on, and barter items. Built with React, TypeScript, Node.js, and MongoDB.

## Features

- **User Authentication**: Secure login and registration system
- **Product Listings**: Create and manage product listings
- **Bidding System**: Place bids on items with real-time updates
- **Bartering System**: Offer items in exchange for other items
- **Search & Filter**: Find products by category and keywords
- **User Profiles**: Manage personal information and listings
- **Newsletter**: Subscribe to updates and notifications

## Tech Stack

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Context** for state management

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd project
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory
   - Add the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/search` - Search products
- `GET /api/products/user/:userId` - Get user's products
- `POST /api/products/:id/bid` - Place a bid
- `POST /api/products/:id/offer` - Make a barter offer

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

## Project Structure

```
project/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   └── ...
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── index.js           # Server entry point
├── public/                # Static files
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/Shivay7666/ecommerce-bidding-platform](https://github.com/Shivay7666/ecommerce-bidding-platform)
