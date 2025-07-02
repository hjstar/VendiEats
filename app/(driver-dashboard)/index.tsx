import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { Package, DollarSign, Clock, Star, Power, PowerOff } from 'lucide-react-native';

export default function DriverDashboardScreen() {
  const { driver, toggleOnlineStatus } = useDriverAuth();

  if (!driver) return null;

  const stats = [
    {
      title: 'Today\'s Earnings',
      value: '$127.50',
      icon: <DollarSign size={24} color="#4CAF50" />,
      color: '#4CAF50',
    },
    {
      title: 'Deliveries Today',
      value: '8',
      icon: <Package size={24} color="#2196F3" />,
      color: '#2196F3',
    },
    {
      title: 'Hours Online',
      value: '6.5h',
      icon: <Clock size={24} color="#FF9800" />,
      color: '#FF9800',
    },
    {
      title: 'Rating',
      value: driver.rating.toFixed(1),
      icon: <Star size={24} color="#FFD700" />,
      color: '#FFD700',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {driver.name}!</Text>
            <Text style={styles.subtitle}>Ready to start delivering?</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.onlineToggle,
              { backgroundColor: driver.isOnline ? '#4CAF50' : '#ff4444' }
            ]}
            onPress={toggleOnlineStatus}
          >
            {driver.isOnline ? (
              <Power size={20} color="#fff" />
            ) : (
              <PowerOff size={20} color="#fff" />
            )}
            <Text style={styles.onlineToggleText}>
              {driver.isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: driver.isOnline ? '#4CAF50' : '#ff4444' }
            ]} />
            <Text style={styles.statusText}>
              {driver.isOnline ? 'You\'re online and ready for deliveries' : 'You\'re offline'}
            </Text>
          </View>
          {!driver.isOnline && (
            <Text style={styles.statusSubtext}>
              Go online to start receiving delivery requests
            </Text>
          )}
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Package size={24} color="#2196F3" />
              <Text style={styles.actionButtonText}>View Active Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <DollarSign size={24} color="#4CAF50" />
              <Text style={styles.actionButtonText}>Earnings Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Deliveries</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryRestaurant}>Bella Italia</Text>
              <Text style={styles.deliveryAddress}>123 Main St → 456 Oak Ave</Text>
              <Text style={styles.deliveryTime}>Completed 2 hours ago</Text>
            </View>
            <View style={styles.deliveryMeta}>
              <Text style={styles.deliveryEarning}>$12.50</Text>
              <View style={styles.deliveryStatus}>
                <Text style={styles.deliveryStatusText}>Completed</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryRestaurant}>Burger House</Text>
              <Text style={styles.deliveryAddress}>789 Pine St → 321 Elm St</Text>
              <Text style={styles.deliveryTime}>Completed 3 hours ago</Text>
            </View>
            <View style={styles.deliveryMeta}>
              <Text style={styles.deliveryEarning}>$8.75</Text>
              <View style={styles.deliveryStatus}>
                <Text style={styles.deliveryStatusText}>Completed</Text>
              </View>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  onlineToggleText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
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
  deliveryCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryRestaurant: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  deliveryMeta: {
    alignItems: 'flex-end',
  },
  deliveryEarning: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  deliveryStatus: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});