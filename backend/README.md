# VendiEats Backend API

A comprehensive Node.js backend for the VendiEats food delivery application.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Restaurant Management**: CRUD operations for restaurants and menus
- **Order Management**: Complete order lifecycle management
- **File Upload**: Image upload with Cloudinary integration
- **Real-time Updates**: Socket.io for live order tracking
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and setup:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update password

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (owner only)
- `PUT /api/restaurants/:id` - Update restaurant (owner only)
- `DELETE /api/restaurants/:id` - Delete restaurant (owner only)
- `GET /api/restaurants/owner/:ownerId` - Get restaurants by owner

### Menu Management
- `POST /api/restaurants/:id/menu` - Add menu item
- `PUT /api/restaurants/:id/menu/:itemId` - Update menu item
- `DELETE /api/restaurants/:id/menu/:itemId` - Delete menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get orders (with filters)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/customer/:customerId/history` - Get customer order history

### File Upload
- `POST /api/upload/image` - Upload image to Cloudinary

## Database Schema

### Users
- Authentication and profile information
- Role-based access (customer, restaurant_owner, admin)
- Address and preferences

### Restaurants
- Restaurant details and settings
- Location with geospatial indexing
- Opening hours and delivery info
- Embedded menu items

### Orders
- Complete order information
- Status tracking and timestamps
- Payment and delivery details
- Customer and restaurant info

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Prevent API abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **MongoDB Injection Protection**: Mongoose sanitization

## Development

### Project Structure
```
backend/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # Express routes
├── utils/          # Utility functions
├── uploads/        # File upload directory
└── server.js       # Main server file
```

### Testing
```bash
npm test
```

### Environment Variables
See `.env.example` for all required environment variables.

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure Cloudinary for image uploads
5. Set up SSL/HTTPS
6. Configure reverse proxy (nginx)

### Docker Deployment
```bash
# Build image
docker build -t vendieats-backend .

# Run container
docker run -p 3000:3000 --env-file .env vendieats-backend
```

## API Documentation

For detailed API documentation with request/response examples, visit:
`http://localhost:3000/api/docs` (when running locally)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.