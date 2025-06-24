import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { ChartBar as BarChart3, DollarSign, ShoppingBag, Clock, TrendingUp, Eye, EyeOff } from 'lucide-react-native';

export default function RestaurantDashboardScreen() {
  const { owner } = useRestaurantAuth();
  const { restaurants, getRestaurantOrders, getRestaurantEarnings } = useRestaurant();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  const userRestaurants = restaurants.filter(r => r.ownerId === owner?.id);
  const currentRestaurant = userRestaurants[0]; // For demo, using first restaurant

  if (!currentRestaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noRestaurant}>
          <Text style={styles.noRestaurantText}>No restaurant found</Text>
          <Text style={styles.noRestaurantSubtext}>Please add your restaurant first</Text>
        </View>
      </SafeAreaView>
    );
  }

  const orders = getRestaurantOrders(currentRestaurant.id);
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.orderTime);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  
  const earnings = {
    today: getRestaurantEarnings(currentRestaurant.id, 'today'),
    week: getRestaurantEarnings(currentRestaurant.id, 'week'),
    month: getRestaurantEarnings(currentRestaurant.id, 'month'),
  };

  const stats = [
    {
      title: 'Today\'s Orders',
      value: todayOrders.length.toString(),
      icon: <ShoppingBag size={24} color="#FF6B35" />,
      color: '#FF6B35',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: <Clock size={24} color="#FF9800" />,
      color: '#FF9800',
    },
    {
      title: 'Preparing',
      value: preparingOrders.toString(),
      icon: <Clock size={24} color="#2196F3" />,
      color: '#2196F3',
    },
    {
      title: 'Revenue',
      value: `$${earnings[selectedPeriod].toFixed(2)}`,
      icon: <DollarSign size={24} color="#4CAF50" />,
      color: '#4CAF50',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.restaurantName}>{currentRestaurant.name}</Text>
          </View>
          <TouchableOpacity style={styles.statusToggle}>
            {currentRestaurant.isOpen ? (
              <Eye size={24} color="#4CAF50" />
            ) : (
              <EyeOff size={24} color="#ff4444" />
            )}
          </TouchableOpacity>
        </View>

        {/* Restaurant Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: currentRestaurant.isOpen ? '#4CAF50' : '#ff4444' }
            ]} />
            <Text style={styles.statusText}>
              {currentRestaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          <Text style={styles.statusSubtext}>
            {currentRestaurant.isOpen 
              ? 'Accepting orders' 
              : 'Not accepting orders'
            }
          </Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                {stat.icon}
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {orders.slice(0, 5).map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderCustomer}>{order.customerName}</Text>
                <Text style={styles.orderItems}>
                  {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                </Text>
                <Text style={styles.orderTime}>
                  {new Date(order.orderTime).toLocaleTimeString()}
                </Text>
              </View>
              <View style={styles.orderMeta}>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                <View style={[
                  styles.orderStatus,
                  { backgroundColor: getStatusColor(order.status) }
                ]}>
                  <Text style={styles.orderStatusText}>
                    {order.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <BarChart3 size={24} color="#FF6B35" />
              <Text style={styles.actionButtonText}>View Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <TrendingUp size={24} color="#FF6B35" />
              <Text style={styles.actionButtonText}>Promote Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginTop: 4,
  },
  statusToggle: {
    padding: 8,
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  statusSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activePeriodButton: {
    backgroundColor: '#FF6B35',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activePeriodButtonText: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginRight: '2%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  orderCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textTransform: 'capitalize',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
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
    marginBottom: 8,
  },
  noRestaurantSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});