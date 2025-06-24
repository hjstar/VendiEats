import React, { createContext, useContext, useState, useEffect } from 'react';

interface RestaurantOwner {
  id: string;
  email: string;
  name: string;
  phone?: string;
  restaurantIds: string[];
}

interface RestaurantAuthContextType {
  owner: RestaurantOwner | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const RestaurantAuthContext = createContext<RestaurantAuthContextType | undefined>(undefined);

export function RestaurantAuthProvider({ children }: { children: React.ReactNode }) {
  const [owner, setOwner] = useState<RestaurantOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password) {
      setOwner({
        id: 'owner1',
        email,
        name: 'Restaurant Owner',
        phone: '+1 (555) 123-4567',
        restaurantIds: ['1'],
      });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password && name) {
      setOwner({
        id: Date.now().toString(),
        email,
        name,
        phone,
        restaurantIds: [],
      });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setOwner(null);
  };

  return (
    <RestaurantAuthContext.Provider value={{ owner, login, register, logout, isLoading }}>
      {children}
    </RestaurantAuthContext.Provider>
  );
}

export function useRestaurantAuth() {
  const context = useContext(RestaurantAuthContext);
  if (context === undefined) {
    throw new Error('useRestaurantAuth must be used within a RestaurantAuthProvider');
  }
  return context;
}