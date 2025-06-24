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
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  menu: MenuItem[];
  ownerId: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    customizations?: string[];
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: string;
  orderTime: string;
  estimatedDeliveryTime: string;
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  orders: Order[];
  currentRestaurant: Restaurant | null;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'rating' | 'menu'>) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  addMenuItem: (restaurantId: string, item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (restaurantId: string, itemId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getRestaurantOrders: (restaurantId: string) => Order[];
  getRestaurantEarnings: (restaurantId: string, period: 'today' | 'week' | 'month') => number;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Bella Italia',
      description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.',
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      coverImage: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg',
      category: 'Italian',
      address: '123 Main St, Downtown',
      phone: '+1 (555) 123-4567',
      email: 'info@bellaitalia.com',
      rating: 4.8,
      deliveryTime: '25-30 min',
      deliveryFee: 2.99,
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
      menu: [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Fresh mozzarella, tomato sauce, basil',
          price: 16.99,
          image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
          category: 'Pizza',
          isAvailable: true,
          preparationTime: 15,
        },
        {
          id: '2',
          name: 'Spaghetti Carbonara',
          description: 'Eggs, pecorino cheese, pancetta, black pepper',
          price: 18.99,
          image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
          category: 'Pasta',
          isAvailable: true,
          preparationTime: 12,
        },
      ],
      ownerId: 'owner1',
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      restaurantId: '1',
      customerName: 'John Doe',
      customerPhone: '+1 (555) 987-6543',
      customerAddress: '456 Oak Ave, Midtown',
      items: [
        { id: '1', name: 'Margherita Pizza', quantity: 2, price: 16.99 },
        { id: '2', name: 'Spaghetti Carbonara', quantity: 1, price: 18.99 },
      ],
      subtotal: 52.97,
      deliveryFee: 2.99,
      tax: 4.24,
      total: 60.20,
      status: 'pending',
      paymentMethod: 'card',
      orderTime: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
    },
  ]);

  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

  const addRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'rating' | 'menu'>) => {
    const newRestaurant: Restaurant = {
      ...restaurantData,
      id: Date.now().toString(),
      rating: 0,
      menu: [],
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

  const addMenuItem = (restaurantId: string, itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
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

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getRestaurantOrders = (restaurantId: string) => {
    return orders.filter(order => order.restaurantId === restaurantId);
  };

  const getRestaurantEarnings = (restaurantId: string, period: 'today' | 'week' | 'month') => {
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
      .reduce((total, order) => total + order.subtotal, 0);
  };

  return (
    <RestaurantContext.Provider value={{
      restaurants,
      orders,
      currentRestaurant,
      addRestaurant,
      updateRestaurant,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateOrderStatus,
      getRestaurantOrders,
      getRestaurantEarnings,
      setCurrentRestaurant,
    }}>
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