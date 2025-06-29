import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Plus, Minus, Trash2, Clock, CircleCheck as CheckCircle, ShoppingCart } from 'lucide-react-native';

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
  {
    id: '3',
    restaurantName: 'Sushi Master',
    restaurantImage: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
    items: ['Salmon Roll', 'Chicken Teriyaki'],
    total: 29.98,
    status: 'delivered',
    date: '2024-01-10',
    time: '6:15 PM',
  },
];

export default function OrdersScreen() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    } else {
      Alert.alert('Empty Cart', 'Please add some items to your cart first.');
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
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
            <ShoppingCart size={16} color={activeTab === 'cart' ? '#fff' : '#666'} />
            <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
              Cart ({items.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Clock size={16} color={activeTab === 'history' ? '#fff' : '#666'} />
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
                  onPress={() => router.push('/(tabs)/home')}
                >
                  <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.cartHeader}>
                  <Text style={styles.cartTitle}>
                    {items.length} item{items.length !== 1 ? 's' : ''} in cart
                  </Text>
                  <TouchableOpacity onPress={handleClearCart} style={styles.clearCartButton}>
                    <Text style={styles.clearCartText}>Clear All</Text>
                  </TouchableOpacity>
                </View>

                {items.map(item => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.restaurantName} numberOfLines={1}>{item.restaurantName}</Text>
                      <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
                      {item.customizations && item.customizations.length > 0 && (
                        <Text style={styles.customizations}>
                          {item.customizations.join(', ')}
                        </Text>
                      )}
                    </View>
                    <View style={styles.itemActions}>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={[styles.quantityButton, item.quantity <= 1 && styles.disabledButton]}
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} color={item.quantity <= 1 ? "#ccc" : "#FF6B35"} />
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
                    <Text style={styles.summaryLabel}>Tax (8%)</Text>
                    <Text style={styles.summaryValue}>${(totalPrice * 0.08).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      ${(totalPrice + 2.99 + totalPrice * 0.08).toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.checkoutButton, items.length === 0 && styles.disabledButton]} 
                    onPress={handleCheckout}
                    disabled={items.length === 0}
                  >
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
              <>
                <Text style={styles.historyTitle}>Past Orders</Text>
                {orderHistory.map(order => (
                  <TouchableOpacity 
                    key={order.id} 
                    style={styles.orderCard}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: order.restaurantImage }} style={styles.orderImage} />
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderRestaurant} numberOfLines={1}>{order.restaurantName}</Text>
                      <Text style={styles.orderItems} numberOfLines={2}>
                        {order.items.join(', ')}
                      </Text>
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
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.reorderButton}>
                  <Text style={styles.reorderButtonText}>View All Orders</Text>
                </TouchableOpacity>
              </>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cartTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  clearCartButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  clearCartText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ff4444',
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
    marginBottom: 2,
  },
  customizations: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    fontStyle: 'italic',
  },
  itemActions: {
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  disabledButton: {
    opacity: 0.5,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
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
    marginBottom: 8,
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
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  reorderButton: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reorderButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
});