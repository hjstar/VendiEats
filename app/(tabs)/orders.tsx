import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Plus, Minus, Trash2, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

const orderHistory = [
  {
    id: '1',
    restaurantName: 'Bella Italia',
    restaurantImage: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    items: ['Margherita Pizza', 'Caesar Salad'],
    total: 24.99,
    status: 'delivered',
    date: '2024-01-15',
    time: '2:30 PM',
  },
  {
    id: '2',
    restaurantName: 'Burger House',
    restaurantImage: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
    items: ['Classic Burger', 'Fries'],
    total: 18.50,
    status: 'delivered',
    date: '2024-01-12',
    time: '7:45 PM',
  },
];

export default function OrdersScreen() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'preparing':
        return '#FF9800';
      case 'on_the_way':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'preparing':
        return <Clock size={16} color="#FF9800" />;
      case 'on_the_way':
        return <Clock size={16} color="#2196F3" />;
      default:
        return <Clock size={16} color="#666" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
            onPress={() => setActiveTab('cart')}
          >
            <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
              Cart ({items.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {activeTab === 'cart' ? (
          <>
            {items.length === 0 ? (
              <View style={styles.emptyCart}>
                <ShoppingBag size={64} color="#ccc" />
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
                <Text style={styles.emptyCartSubtext}>Add some delicious items to get started</Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/(tabs)')}
                >
                  <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {items.map(item => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.restaurantName}>{item.restaurantName}</Text>
                      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} color="#FF6B35" />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} color="#FF6B35" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                ))}

                <View style={styles.cartSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery Fee</Text>
                    <Text style={styles.summaryValue}>$2.99</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>${(totalPrice * 0.08).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      ${(totalPrice + 2.99 + totalPrice * 0.08).toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {orderHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Clock size={64} color="#ccc" />
                <Text style={styles.emptyHistoryText}>No orders yet</Text>
                <Text style={styles.emptyHistorySubtext}>Your order history will appear here</Text>
              </View>
            ) : (
              orderHistory.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <Image source={{ uri: order.restaurantImage }} style={styles.orderImage} />
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderRestaurant}>{order.restaurantName}</Text>
                    <Text style={styles.orderItems}>{order.items.join(', ')}</Text>
                    <View style={styles.orderMeta}>
                      <Text style={styles.orderDate}>{order.date} • {order.time}</Text>
                      <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={styles.orderStatus}>
                    {getStatusIcon(order.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyCartText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  restaurantName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  cartSummary: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B35',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  emptyHistory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyHistoryText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderRestaurant: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  orderTotal: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  orderStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
    textTransform: 'capitalize',
  },
});