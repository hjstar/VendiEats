// Order service
import { apiClient } from './api';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  customerId: string;
  restaurantId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'cash' | 'digital_wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: [number, number];
  };
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  restaurantInfo: {
    name: string;
    phone: string;
    address: string;
  };
  orderTime: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  restaurantId: string;
  items: OrderItem[];
  deliveryAddress: Order['deliveryAddress'];
  paymentMethod: Order['paymentMethod'];
  specialInstructions?: string;
}

export interface OrderFilters {
  customerId?: string;
  restaurantId?: string;
  status?: Order['status'];
  startDate?: string;
  endDate?: string;
}

export class OrderService {
  async createOrder(data: CreateOrderData): Promise<Order | null> {
    const response = await apiClient.post<Order>('/orders', data);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create order');
  }

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get<Order[]>(`/orders?${queryParams}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }

  async getOrder(id: string): Promise<Order | null> {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return null;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const response = await apiClient.put<Order>(`/orders/${id}/status`, { status });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update order status');
  }

  async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    const response = await apiClient.put<Order>(`/orders/${id}/cancel`, { reason });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to cancel order');
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    return this.getOrders({ customerId });
  }

  async getRestaurantOrders(restaurantId: string): Promise<Order[]> {
    return this.getOrders({ restaurantId });
  }

  async getOrderHistory(customerId: string, limit: number = 10): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(`/orders/customer/${customerId}/history?limit=${limit}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    return [];
  }
}

export const orderService = new OrderService();