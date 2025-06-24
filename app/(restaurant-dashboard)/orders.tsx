import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Truck, Package } from 'lucide-react-native';

export default function RestaurantOrdersScreen() {
  const { owner } = useRestaurantAuth();
  const { restaurants, getRestaurantOrders, updateOrderStatus } = useRestaurant();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const userRestaurants = restaurants.filter(r => r.ownerId === owner?.id);
  const currentRestaurant = userRestaurants[0];

  if (!currentRestaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noRestaurant}>
          <Text style={styles.noRestaurantText}>No restaurant found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const allOrders = getRestaurantOrders(currentRestaurant.id);
  const filteredOrders = selectedStatus === 'all' 
    ? allOrders 
    : allOrders.filter(order => order.status === selectedStatus);

  const statusFilters = [
    { key: 'all', label: 'All', count: allOrders.length },
    { key: 'pending', label: 'Pending', count: allOrders.filter(o => o.status === 'pending').length },
    { key: 'preparing', label: 'Preparing', count: allOrders.filter(o => o.status === 'preparing').length },
    { key: 'ready', label: 'Ready', count: allOrders.filter(o => o.status === 'ready').length },
  ];

  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    Alert.alert(
      'Update Order Status',
      `Change status to ${newStatus.replace('_', ' ')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => updateOrderStatus(orderId, newStatus)
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} color="#FF9800" />;
      case 'confirmed': return <CheckCircle size={16} color="#2196F3" />;
      case 'preparing': return <Package size={16} color="#9C27B0" />;
      case 'ready': return <CheckCircle size={16} color="#4CAF50" />;
      case 'out_for_delivery': return <Truck size={16} color="#00BCD4" />;
      case 'delivered': return <CheckCircle size={16} color="#4CAF50" />;
      case 'cancelled': return <XCircle size={16} color="#f44336" />;
      default: return <Clock size={16} color="#666" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9800';
      case 'confirmed': return '#2196F3';
      case 'preparing': return '#9C27B0';
      case 'ready': return '#4CAF50';
      case 'out_for_delivery': return '#00BCD4';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'out_for_delivery';
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>{currentRestaurant.name}</Text>
      </View>

      {/* Status Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {statusFilters.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedStatus === filter.key && styles.activeFilterChip
            ]}
            onPress={() => setSelectedStatus(filter.key)}
          >
            <Text style={[
              styles.filterText,
              selectedStatus === filter.key && styles.activeFilterText
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No orders found</Text>
            <Text style={styles.emptyStateSubtext}>
              {selectedStatus === 'all' 
                ? 'Orders will appear here when customers place them'
                : `No ${selectedStatus} orders at the moment`
              }
            </Text>
          </View>
        ) : (
          filteredOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>Order #{order.id}</Text>
                  <Text style={styles.orderTime}>
                    {new Date(order.orderTime).toLocaleString()}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) }
                ]}>
                  {getStatusIcon(order.status)}
                  <Text style={styles.statusText}>
                    {order.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <Text style={styles.customerPhone}>{order.customerPhone}</Text>
                <Text style={styles.customerAddress}>{order.customerAddress}</Text>
              </View>

              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderFooter}>
                <View style={styles.orderTotal}>
                  <Text style={styles.totalLabel}>Total: </Text>
                  <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
                </View>
                
                {getNextStatus(order.status) && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                  >
                    <Text style={styles.actionButtonText}>
                      Mark as {getNextStatus(order.status)?.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  filtersContainer: {
    paddingVertical: 16,
    paddingLeft: 20,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  customerInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  customerAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  noRestaurant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noRestaurantText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
});