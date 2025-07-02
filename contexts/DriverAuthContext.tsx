import React, { createContext, useContext, useState, useEffect } from 'react';

interface Driver {
  id: string;
  email: string;
  name: string;
  phone?: string;
  licenseNumber?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    color: string;
  };
  isActive: boolean;
  isOnline: boolean;
  rating: number;
  totalDeliveries: number;
}

interface DriverAuthContextType {
  driver: Driver | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Driver>) => Promise<boolean>;
  toggleOnlineStatus: () => void;
  isLoading: boolean;
}

const DriverAuthContext = createContext<DriverAuthContextType | undefined>(undefined);

export function DriverAuthProvider({ children }: { children: React.ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null);
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
      setDriver({
        id: 'driver1',
        email,
        name: 'John Driver',
        phone: '+1 (555) 123-4567',
        licenseNumber: 'DL123456789',
        vehicleInfo: {
          make: 'Honda',
          model: 'Civic',
          year: '2020',
          licensePlate: 'ABC-1234',
          color: 'Blue',
        },
        isActive: true,
        isOnline: false,
        rating: 4.8,
        totalDeliveries: 342,
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
      setDriver({
        id: Date.now().toString(),
        email,
        name,
        phone,
        isActive: true,
        isOnline: false,
        rating: 0,
        totalDeliveries: 0,
      });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setDriver(null);
  };

  const updateProfile = async (data: Partial<Driver>): Promise<boolean> => {
    if (driver) {
      setDriver({ ...driver, ...data });
      return true;
    }
    return false;
  };

  const toggleOnlineStatus = () => {
    if (driver) {
      setDriver({ ...driver, isOnline: !driver.isOnline });
    }
  };

  return (
    <DriverAuthContext.Provider value={{
      driver,
      login,
      register,
      logout,
      updateProfile,
      toggleOnlineStatus,
      isLoading,
    }}>
      {children}
    </DriverAuthContext.Provider>
  );
}

export function useDriverAuth() {
  const context = useContext(DriverAuthContext);
  if (context === undefined) {
    throw new Error('useDriverAuth must be used within a DriverAuthProvider');
  }
  return context;
}