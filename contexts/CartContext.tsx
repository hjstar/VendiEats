import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderService, CreateOrderData } from '@/lib/orders';

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  customizations?: string[];
  specialInstructions?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  restaurantId: string | null;
  canAddItem: (restaurantId: string) => boolean;
  createOrder: (orderData: Omit<CreateOrderData, 'items'>) => Promise<boolean>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Save cart to storage whenever items change
  useEffect(() => {
    saveCartToStorage();
  }, [items]);

  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const restaurantId = items.length > 0 ? items[0].restaurantId : null;

  const canAddItem = (newRestaurantId: string): boolean => {
    return items.length === 0 || restaurantId === newRestaurantId;
  };

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    if (!canAddItem(newItem.restaurantId)) {
      throw new Error('Cannot add items from different restaurants');
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(item => 
        item.menuItemId === newItem.menuItemId &&
        JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...currentItems, { 
        ...newItem, 
        id: `${newItem.menuItemId}_${Date.now()}`,
        quantity: 1 
      }];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const createOrder = async (orderData: Omit<CreateOrderData, 'items'>): Promise<boolean> => {
    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      setIsLoading(true);
      
      const orderItems = items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
        specialInstructions: item.specialInstructions,
      }));

      const order = await orderService.createOrder({
        ...orderData,
        items: orderItems,
      });

      if (order) {
        clearCart();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItem,
      clearCart,
      totalItems,
      totalPrice,
      restaurantId,
      canAddItem,
      createOrder,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}