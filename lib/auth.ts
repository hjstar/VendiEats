// Authentication service
import { apiClient } from './api';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'restaurant_owner';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'customer' | 'restaurant_owner';
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.error || 'Login failed');
  }

  async register(data: RegisterData): Promise<AuthResponse | null> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      ...data,
      role: data.role || 'customer',
    });
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error(response.error || 'Registration failed');
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearToken();
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await apiClient.get<User>('/auth/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  async updateProfile(data: Partial<User>): Promise<User | null> {
    const response = await apiClient.put<User>('/auth/profile', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Profile update failed');
  }
}

export const authService = new AuthService();