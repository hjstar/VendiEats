// Restaurant service
import { apiClient } from './api';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  ingredients?: string[];
  allergens?: string[];
}

export interface Restaurant {
  _id: string;
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
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantFilters {
  category?: string;
  search?: string;
  minRating?: number;
  maxDeliveryFee?: number;
  isOpen?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
}

export class RestaurantService {
  async getRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'location') {
            queryParams.append('lat', value.latitude.toString());
            queryParams.append('lng', value.longitude.toString());
            queryParams.append('radius', value.radius.toString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const response = await apiClient.get<Restaurant[]>(`/restaurants?${queryParams}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async getRestaurant(id: string): Promise<Restaurant | null> {
    const response = await apiClient.get<Restaurant>(`/restaurants/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  async createRestaurant(data: Omit<Restaurant, '_id' | 'rating' | 'reviewCount' | 'menu' | 'createdAt' | 'updatedAt'>): Promise<Restaurant | null> {
    const response = await apiClient.post<Restaurant>('/restaurants', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create restaurant');
  }

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant | null> {
    const response = await apiClient.put<Restaurant>(`/restaurants/${id}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update restaurant');
  }

  async deleteRestaurant(id: string): Promise<void> {
    const response = await apiClient.delete(`/restaurants/${id}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete restaurant');
    }
  }

  // Menu management
  async addMenuItem(restaurantId: string, item: Omit<MenuItem, '_id'>): Promise<MenuItem | null> {
    const response = await apiClient.post<MenuItem>(`/restaurants/${restaurantId}/menu`, item);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to add menu item');
  }

  async updateMenuItem(restaurantId: string, itemId: string, data: Partial<MenuItem>): Promise<MenuItem | null> {
    const response = await apiClient.put<MenuItem>(`/restaurants/${restaurantId}/menu/${itemId}`, data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update menu item');
  }

  async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    const response = await apiClient.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete menu item');
    }
  }

  async getRestaurantsByOwner(ownerId: string): Promise<Restaurant[]> {
    const response = await apiClient.get<Restaurant[]>(`/restaurants/owner/${ownerId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }
}

export const restaurantService = new RestaurantService();