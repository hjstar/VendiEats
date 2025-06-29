import React, { createContext, useContext, useState, useEffect } from 'react';
import { restaurantService, Restaurant, MenuItem } from '@/lib/restaurants';
import { orderService, Order } from '@/lib/orders';

interface RestaurantContextType {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  // Restaurant management
  fetchRestaurants: (filters?: any) => Promise<void>;
  fetchRestaurant: (id: string) => Promise<Restaurant | null>;
  createRestaurant: (data: any) => Promise<Restaurant | null>;
  updateRestaurant: (id: string, data: any) => Promise<Restaurant | null>;
  deleteRestaurant: (id: string) => Promise<void>;
  
  // Menu management
  addMenuItem: (restaurantId: string, item: any) => Promise<MenuItem | null>;
  updateMenuItem: (restaurantId: string, itemId: string, data: any) => Promise<MenuItem | null>;
  deleteMenuItem: (restaurantId: string, itemId: string) => Promise<void>;
  
  // Order management
  fetchOrders: (filters?: any) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getRestaurantOrders: (restaurantId: string) => Order[];
  getRestaurantEarnings: (restaurantId: string, period: 'today' | 'week' | 'month') => number;
  
  // Utility
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  clearError: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any, defaultMessage: string) => {
    const message = error instanceof Error ? error.message : defaultMessage;
    setError(message);
    console.error(message, error);
  };

  const fetchRestaurants = async (filters?: any) => {
    try {
      setIsLoading(true);
      clearError();
      const data = await restaurantService.getRestaurants(filters);
      setRestaurants(data);
    } catch (error) {
      handleError(error, 'Failed to fetch restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRestaurant = async (id: string): Promise<Restaurant | null> => {
    try {
      clearError();
      const restaurant = await restaurantService.getRestaurant(id);
      if (restaurant) {
        // Update the restaurant in the list if it exists
        setRestaurants(prev => 
          prev.map(r => r._id === id ? restaurant : r)
        );
      }
      return restaurant;
    } catch (error) {
      handleError(error, 'Failed to fetch restaurant');
      return null;
    }
  };

  const createRestaurant = async (data: any): Promise<Restaurant | null> => {
    try {
      setIsLoading(true);
      clearError();
      const restaurant = await restaurantService.createRestaurant(data);
      if (restaurant) {
        setRestaurants(prev => [...prev, restaurant]);
      }
      return restaurant;
    } catch (error) {
      handleError(error, 'Failed to create restaurant');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRestaurant = async (id: string, data: any): Promise<Restaurant | null> => {
    try {
      clearError();
      const restaurant = await restaurantService.updateRestaurant(id, data);
      if (restaurant) {
        setRestaurants(prev => 
          prev.map(r => r._id === id ? restaurant : r)
        );
        if (currentRestaurant?._id === id) {
          setCurrentRestaurant(restaurant);
        }
      }
      return restaurant;
    } catch (error) {
      handleError(error, 'Failed to update restaurant');
      return null;
    }
  };

  const deleteRestaurant = async (id: string): Promise<void> => {
    try {
      clearError();
      await restaurantService.deleteRestaurant(id);
      setRestaurants(prev => prev.filter(r => r._id !== id));
      if (currentRestaurant?._id === id) {
        setCurrentRestaurant(null);
      }
    } catch (error) {
      handleError(error, 'Failed to delete restaurant');
    }
  };

  const addMenuItem = async (restaurantId: string, item: any): Promise<MenuItem | null> => {
    try {
      clearError();
      const menuItem = await restaurantService.addMenuItem(restaurantId, item);
      if (menuItem) {
        // Update the restaurant's menu in the local state
        setRestaurants(prev => 
          prev.map(r => 
            r._id === restaurantId 
              ? { ...r, menu: [...r.menu, menuItem] }
              : r
          )
        );
        if (currentRestaurant?._id === restaurantId) {
          setCurrentRestaurant(prev => 
            prev ? { ...prev, menu: [...prev.menu, menuItem] } : prev
          );
        }
      }
      return menuItem;
    } catch (error) {
      handleError(error, 'Failed to add menu item');
      return null;
    }
  };

  const updateMenuItem = async (restaurantId: string, itemId: string, data: any): Promise<MenuItem | null> => {
    try {
      clearError();
      const menuItem = await restaurantService.updateMenuItem(restaurantId, itemId, data);
      if (menuItem) {
        // Update the restaurant's menu in the local state
        setRestaurants(prev => 
          prev.map(r => 
            r._id === restaurantId 
              ? { 
                  ...r, 
                  menu: r.menu.map(item => 
                    item._id === itemId ? menuItem : item
                  )
                }
              : r
          )
        );
        if (currentRestaurant?._id === restaurantId) {
          setCurrentRestaurant(prev => 
            prev ? {
              ...prev,
              menu: prev.menu.map(item => 
                item._id === itemId ? menuItem : item
              )
            } : prev
          );
        }
      }
      return menuItem;
    } catch (error) {
      handleError(error, 'Failed to update menu item');
      return null;
    }
  };

  const deleteMenuItem = async (restaurantId: string, itemId: string): Promise<void> => {
    try {
      clearError();
      await restaurantService.deleteMenuItem(restaurantId, itemId);
      // Update the restaurant's menu in the local state
      setRestaurants(prev => 
        prev.map(r => 
          r._id === restaurantId 
            ? { ...r, menu: r.menu.filter(item => item._id !== itemId) }
            : r
        )
      );
      if (currentRestaurant?._id === restaurantId) {
        setCurrentRestaurant(prev => 
          prev ? {
            ...prev,
            menu: prev.menu.filter(item => item._id !== itemId)
          } : prev
        );
      }
    } catch (error) {
      handleError(error, 'Failed to delete menu item');
    }
  };

  const fetchOrders = async (filters?: any) => {
    try {
      setIsLoading(true);
      clearError();
      const data = await orderService.getOrders(filters);
      setOrders(data);
    } catch (error) {
      handleError(error, 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      clearError();
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      if (updatedOrder) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? updatedOrder : order
          )
        );
      }
    } catch (error) {
      handleError(error, 'Failed to update order status');
    }
  };

  const getRestaurantOrders = (restaurantId: string): Order[] => {
    return orders.filter(order => order.restaurantId === restaurantId);
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
      .filter(order => new Date(order.createdAt) >= startDate)
      .reduce((total, order) => total + order.subtotal, 0);
  };

  // Load initial data
  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <RestaurantContext.Provider value={{
      restaurants,
      currentRestaurant,
      orders,
      isLoading,
      error,
      fetchRestaurants,
      fetchRestaurant,
      createRestaurant,
      updateRestaurant,
      deleteRestaurant,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      fetchOrders,
      updateOrderStatus,
      getRestaurantOrders,
      getRestaurantEarnings,
      setCurrentRestaurant,
      clearError,
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