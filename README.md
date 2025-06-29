# VendiEats - Food Delivery App

A comprehensive food delivery application built with React Native, Expo, and MongoDB backend integration.

## Features

### Customer Features
- User authentication (login/register)
- Browse restaurants by category
- Search restaurants and dishes
- View restaurant details and menus
- Add items to cart with customizations
- Place orders with delivery tracking
- Order history and favorites
- Real-time order status updates

### Restaurant Owner Features
- Restaurant owner authentication
- Restaurant profile management
- Menu management (add/edit/delete items)
- Order management and status updates
- Sales analytics and earnings tracking
- Opening hours and availability management

## Tech Stack

### Frontend
- **React Native** with Expo
- **Expo Router** for navigation
- **TypeScript** for type safety
- **Lucide React Native** for icons
- **AsyncStorage** for local data persistence

### Backend Integration
- **MongoDB** database
- **RESTful API** architecture
- **JWT** authentication
- **Real-time** order updates

## Project Structure

```
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Customer authentication
│   ├── (restaurant-auth)/        # Restaurant owner authentication
│   ├── (tabs)/                   # Customer main app tabs
│   ├── (restaurant-dashboard)/   # Restaurant owner dashboard
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable UI components
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx          # Customer authentication
│   ├── RestaurantAuthContext.tsx # Restaurant authentication
│   ├── CartContext.tsx          # Shopping cart management
│   └── RestaurantContext.tsx    # Restaurant data management
├── lib/                         # API services and utilities
│   ├── api.ts                   # Base API client
│   ├── auth.ts                  # Authentication service
│   ├── restaurants.ts           # Restaurant service
│   └── orders.ts                # Order service
├── types/                       # TypeScript type definitions
└── hooks/                       # Custom React hooks
```

## Environment Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env` file with your API configuration:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_ENVIRONMENT=development
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Backend Requirements

Your MongoDB backend should implement the following API endpoints:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Restaurant Endpoints
- `GET /api/restaurants` - Get restaurants with filters
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (owner only)
- `PUT /api/restaurants/:id` - Update restaurant (owner only)
- `DELETE /api/restaurants/:id` - Delete restaurant (owner only)
- `GET /api/restaurants/owner/:ownerId` - Get restaurants by owner

### Menu Endpoints
- `POST /api/restaurants/:id/menu` - Add menu item
- `PUT /api/restaurants/:id/menu/:itemId` - Update menu item
- `DELETE /api/restaurants/:id/menu/:itemId` - Delete menu item

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders with filters
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/customer/:customerId/history` - Get customer order history

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // hashed
  name: String,
  phone: String,
  address: String,
  role: 'customer' | 'restaurant_owner',
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurants Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  image: String,
  coverImage: String,
  category: String,
  address: String,
  phone: String,
  email: String,
  rating: Number,
  reviewCount: Number,
  deliveryTime: String,
  deliveryFee: Number,
  minimumOrder: Number,
  isOpen: Boolean,
  openingHours: Object,
  menu: [MenuItem],
  ownerId: ObjectId,
  location: {
    type: 'Point',
    coordinates: [Number, Number]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  customerId: ObjectId,
  restaurantId: ObjectId,
  items: [OrderItem],
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  status: String,
  paymentMethod: String,
  paymentStatus: String,
  deliveryAddress: Object,
  customerInfo: Object,
  restaurantInfo: Object,
  orderTime: Date,
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  specialInstructions: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Implementation

### Authentication Flow
- JWT-based authentication with token storage
- Automatic token refresh and validation
- Separate authentication flows for customers and restaurant owners

### Real-time Updates
- Order status updates
- Restaurant availability changes
- Menu item availability

### Offline Support
- Cart persistence with AsyncStorage
- Cached restaurant data
- Offline order queue

### Location Services
- Restaurant discovery by location
- Delivery radius calculation
- Address validation

## Development Guidelines

1. **API Integration**: All API calls go through the centralized API client in `lib/api.ts`
2. **State Management**: Use React Context for global state, local state for component-specific data
3. **Error Handling**: Implement proper error boundaries and user-friendly error messages
4. **Performance**: Implement lazy loading, image optimization, and efficient list rendering
5. **Testing**: Write unit tests for services and integration tests for critical user flows

## Deployment

### Frontend (Expo)
```bash
# Build for production
expo build:web

# Deploy to Expo hosting
expo publish
```

### Backend Requirements
- Node.js server with Express.js
- MongoDB database
- JWT authentication middleware
- File upload handling for images
- Real-time WebSocket support (optional)

## Contributing

1. Follow the existing code structure and naming conventions
2. Add TypeScript types for all new features
3. Update documentation for API changes
4. Test on both iOS and Android platforms
5. Ensure responsive design for all screen sizes

## License

This project is licensed under the MIT License.