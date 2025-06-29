import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tags?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  menu: MenuItem[];
  ownerId: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  restaurantId: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  orderTime: string;
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addMenuItem: (restaurantId: string, item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (restaurantId: string, itemId: string) => void;
  getRestaurantOrders: (restaurantId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getRestaurantEarnings: (restaurantId: string, period: 'today' | 'week' | 'month') => number;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Mock data
const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations.',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    coverImage: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg',
    category: 'Italian',
    address: '123 Main St, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'info@bellaitalia.com',
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: '25-30 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    isOpen: true,
    openingHours: {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false },
    },
    ownerId: 'owner1',
    menu: [
      {
        id: 'item1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
        price: 16.99,
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        category: 'Pizza',
        isAvailable: true,
        preparationTime: 15,
        ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
        allergens: ['Gluten', 'Dairy'],
        nutritionalInfo: {
          calories: 280,
          protein: 12,
          carbs: 36,
          fat: 10,
        },
      },
      {
        id: 'item2',
        name: 'Spaghetti Carbonara',
        description: 'Traditional Roman pasta with eggs, cheese, pancetta, and black pepper',
        price: 18.99,
        image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
        category: 'Pasta',
        isAvailable: true,
        preparationTime: 20,
        ingredients: ['Spaghetti', 'Eggs', 'Pecorino Romano', 'Pancetta', 'Black Pepper'],
        allergens: ['Gluten', 'Eggs', 'Dairy'],
        nutritionalInfo: {
          calories: 420,
          protein: 18,
          carbs: 45,
          fat: 18,
        },
      },
      {
        id: 'item3',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with parmesan, croutons, and Caesar dressing',
        price: 12.99,
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
        category: 'Salads',
        isAvailable: true,
        preparationTime: 10,
        ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        nutritionalInfo: {
          calories: 180,
          protein: 8,
          carbs: 12,
          fat: 12,
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Burger House',
    description: 'Gourmet burgers made with premium beef and fresh toppings.',
    image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
    coverImage: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    category: 'Burgers',
    address: '456 Oak Ave, Midtown',
    phone: '+1 (555) 234-5678',
    email: 'hello@burgerhouse.com',
    rating: 4.6,
    reviewCount: 189,
    deliveryTime: '20-25 min',
    deliveryFee: 1.99,
    minimumOrder: 12,
    isOpen: true,
    openingHours: {
      monday: { open: '11:00', close: '23:00', closed: false },
      tuesday: { open: '11:00', close: '23:00', closed: false },
      wednesday: { open: '11:00', close: '23:00', closed: false },
      thursday: { open: '11:00', close: '23:00', closed: false },
      friday: { open: '11:00', close: '24:00', closed: false },
      saturday: { open: '11:00', close: '24:00', closed: false },
      sunday: { open: '12:00', close: '22:00', closed: false },
    },
    ownerId: 'owner2',
    menu: [
      {
        id: 'item4',
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, onion, and special sauce',
        price: 14.99,
        image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
        category: 'Burgers',
        isAvailable: true,
        preparationTime: 12,
        ingredients: ['Beef Patty', 'Lettuce', 'Tomato', 'Onion', 'Special Sauce', 'Brioche Bun'],
        allergens: ['Gluten', 'Eggs'],
        nutritionalInfo: {
          calories: 520,
          protein: 28,
          carbs: 35,
          fat: 28,
        },
      },
      {
        id: 'item5',
        name: 'Crispy Fries',
        description: 'Golden crispy fries seasoned with sea salt',
        price: 6.99,
        image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
        category: 'Sides',
        isAvailable: true,
        preparationTime: 8,
        ingredients: ['Potatoes', 'Sea Salt', 'Vegetable Oil'],
        allergens: [],
        nutritionalInfo: {
          calories: 320,
          protein: 4,
          carbs: 45,
          fat: 14,
        },
      },
    ],
  },
  {
    id: '3',
    name: 'Sushi Master',
    description: 'Fresh sushi and Japanese cuisine prepared by master chefs.',
    image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
    coverImage: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
    category: 'Japanese',
    address: '789 Pine St, Uptown',
    phone: '+1 (555) 345-6789',
    email: 'orders@sushimaster.com',
    rating: 4.9,
    reviewCount: 412,
    deliveryTime: '30-35 min',
    deliveryFee: 3.99,
    minimumOrder: 20,
    isOpen: true,
    openingHours: {
      monday: { open: '17:00', close: '22:00', closed: false },
      tuesday: { open: '17:00', close: '22:00', closed: false },
      wednesday: { open: '17:00', close: '22:00', closed: false },
      thursday: { open: '17:00', close: '22:00', closed: false },
      friday: { open: '17:00', close: '23:00', closed: false },
      saturday: { open: '17:00', close: '23:00', closed: false },
      sunday: { open: '17:00', close: '21:00', closed: false },
    },
    ownerId: 'owner3',
    menu: [
      {
        id: 'item6',
        name: 'Salmon Roll',
        description: 'Fresh salmon with avocado and cucumber',
        price: 12.99,
        image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
        category: 'Sushi',
        isAvailable: true,
        preparationTime: 15,
        ingredients: ['Fresh Salmon', 'Avocado', 'Cucumber', 'Sushi Rice', 'Nori'],
        allergens: ['Fish'],
        nutritionalInfo: {
          calories: 220,
          protein: 15,
          carbs: 25,
          fat: 8,
        },
      },
      {
        id: 'item7',
        name: 'Chicken Teriyaki',
        description: 'Grilled chicken with teriyaki sauce and steamed rice',
        price: 16.99,
        image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
        category: 'Main Dishes',
        isAvailable: true,
        preparationTime: 20,
        ingredients: ['Chicken Breast', 'Teriyaki Sauce', 'Steamed Rice', 'Vegetables'],
        allergens: ['Soy'],
        nutritionalInfo: {
          calories: 380,
          protein: 32,
          carbs: 42,
          fat: 8,
        },
      },
    ],
  },
];

const initialOrders: Order[] = [
  {
    id: 'order1',
    customerId: 'customer1',
    customerName: 'John Doe',
    customerPhone: '+1 (555) 123-4567',
    customerAddress: '123 Customer St, City',
    restaurantId: '1',
    items: [
      { id: 'item1', name: 'Margherita Pizza', price: 16.99, quantity: 1 },
      { id: 'item3', name: 'Caesar Salad', price: 12.99, quantity: 1 },
    ],
    total: 29.98,
    status: 'preparing',
    orderTime: new Date().toISOString(),
  },
  {
    id: 'order2',
    customerId: 'customer2',
    customerName: 'Jane Smith',
    customerPhone: '+1 (555) 234-5678',
    customerAddress: '456 Customer Ave, City',
    restaurantId: '2',
    items: [
      { id: 'item4', name: 'Classic Burger', price: 14.99, quantity: 2 },
      { id: 'item5', name: 'Crispy Fries', price: 6.99, quantity: 1 },
    ],
    total: 36.97,
    status: 'pending',
    orderTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addRestaurant = (restaurant: Omit<Restaurant, 'id'>) => {
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: Date.now().toString(),
    };
    setRestaurants(prev => [...prev, newRestaurant]);
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === id ? { ...restaurant, ...updates } : restaurant
      )
    );
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
  };

  const addMenuItem = (restaurantId: string, item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? { ...restaurant, menu: [...restaurant.menu, newItem] }
          : restaurant
      )
    );
  };

  const updateMenuItem = (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              menu: restaurant.menu.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : restaurant
      )
    );
  };

  const deleteMenuItem = (restaurantId: string, itemId: string) => {
    setRestaurants(prev =>
      prev.map(restaurant =>
        restaurant.id === restaurantId
          ? {
              ...restaurant,
              menu: restaurant.menu.filter(item => item.id !== itemId),
            }
          : restaurant
      )
    );
  };

  const getRestaurantOrders = (restaurantId: string): Order[] => {
    return orders.filter(order => order.restaurantId === restaurantId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getRestaurantEarnings = (restaurantId: string, period: 'today' | 'week' | 'month'): number => {
    const restaurantOrders = orders.filter(
      order => order.restaurantId === restaurantId && order.status === 'delivered'
    );

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    return restaurantOrders
      .filter(order => new Date(order.orderTime) >= startDate)
      .reduce((total, order) => total + order.total, 0);
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getRestaurantOrders,
        updateOrderStatus,
        getRestaurantEarnings,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}