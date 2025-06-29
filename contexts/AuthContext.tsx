import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'restaurant_owner';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
      setUser({
        id: 'user1',
        email,
        name: 'John Doe',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        role: 'customer',
      });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password && name) {
      setUser({
        id: Date.now().toString(),
        email,
        name,
        role: 'customer',
      });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (user) {
      setUser({ ...user, ...data });
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}