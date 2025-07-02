import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, MapPin, Clock, Phone } from 'lucide-react-native';

export default function DeliveriesScreen() {
  const activeDeliveries = [
    {
      id: '1',
      restaurant: 'Bella Italia',
      customer: 'John Smith',
      customerPhone: '+1 (555) 123-4567',
      pickupAddress: '123 Main St',
      deliveryAddress: '456 Oak Ave',
      orderTotal: '$24.99',
      estimatedTime: '15 min',
      status: 'picked_up',
    },
  ];

  const availableOrders = [
    {
      id: '2',
      restaurant: 'Burger House',
      pickupAddress: '789 Pine St',
      deliveryAddress: '321 Elm St',
      orderTotal: '$18.50',
      estimatedTime: '20 min',
      distance: '2.3 miles',
      earning: '$8.75',
    },
    {
      id: '3',
      restaurant: 'Sushi Master',
      pickupAddress: '555 Cedar Ave',
      deliveryAddress: '777 Maple Dr',
      orderTotal: '$32.99',
      estimatedTime: '25 min',
      distance: '3.1 miles',
      earning: '$12.50',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deliveries</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Active Deliveries */}
        {activeDeliveries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Delivery</Text>
            {activeDeliveries.map(delivery => (
              <View key={delivery.id} style={styles.activeDeliveryCard}>
                <View style={styles.deliveryHeader}>
                  <Text style={styles.restaurantName}>{delivery.restaurant}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>In Progress</Text>
                  </View>
                </View>
                
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>Customer: {delivery.customer}</Text>
                  <TouchableOpacity style={styles.phoneButton}>
                    <Phone size={16} color="#2196F3" />
                    <Text style={styles.phoneText}>{delivery.customerPhone}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.addressInfo}>
                  <View style={styles.addressItem}>
                    <MapPin size={16} color="#FF6B35" />
                    <Text style={styles.addressText}>Pickup: {delivery.pickupAddress}</Text>
                  </View>
                  <View style={styles.addressItem}>
                    <MapPin size={16} color="#4CAF50" />
                    <Text style={styles.addressText}>Delivery: {delivery.deliveryAddress}</Text>
                  </View>
                </View>

                <View style={styles.deliveryActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Navigate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Mark Delivered</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Available Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Orders</Text>
          {availableOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <Text style={styles.earning}>{order.earning}</Text>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.detailText}>{order.distance}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={14} color="#666" />
                  <Text style={styles.detailText}>{order.estimatedTime}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Package size={14} color="#666" />
                  <Text style={styles.detailText}>{order.orderTotal}</Text>
                </View>
              </View>

              <View style={styles.addressInfo}>
                <View style={styles.addressItem}>
                  <MapPin size={16} color="#FF6B35" />
                  <Text style={styles.addressText}>Pickup: {order.pickupAddress}</Text>
                </View>
                <View style={styles.addressItem}>
                  <MapPin size={16} color="#4CAF50" />
                  <Text style={styles.addressText}>Delivery: {order.deliveryAddress}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept Order</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {availableOrders.length === 0 && activeDeliveries.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No deliveries available</Text>
            <Text style={styles.emptyStateSubtext}>
              Make sure you're online to receive delivery requests
            </Text>
          </View>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  activeDeliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  earning: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#4CAF50',
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
    marginBottom: 8,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2196F3',
    marginLeft: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  addressInfo: {
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  deliveryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2196F3',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  completeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  acceptButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
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
});