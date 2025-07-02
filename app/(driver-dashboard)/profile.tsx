import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { User, Car, Star, DollarSign, Settings, LogOut, ChevronRight } from 'lucide-react-native';

export default function DriverProfileScreen() {
  const { driver, logout } = useDriverAuth();

  if (!driver) return null;

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      id: '1',
      title: 'Vehicle Information',
      icon: <Car size={20} color="#666" />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: '2',
      title: 'Earnings History',
      icon: <DollarSign size={20} color="#666" />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: '3',
      title: 'Ratings & Reviews',
      icon: <Star size={20} color="#666" />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: '4',
      title: 'Settings',
      icon: <Settings size={20} color="#666" />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: '5',
      title: 'Logout',
      icon: <LogOut size={20} color="#ff4444" />,
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Driver Info */}
        <View style={styles.driverSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#2196F3" />
          </View>
          <Text style={styles.driverName}>{driver.name}</Text>
          <Text style={styles.driverEmail}>{driver.email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{driver.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{driver.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{driver.isOnline ? 'Online' : 'Offline'}</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info */}
        {driver.vehicleInfo && (
          <View style={styles.vehicleSection}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            <View style={styles.vehicleCard}>
              <Car size={24} color="#2196F3" />
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleText}>
                  {driver.vehicleInfo.year} {driver.vehicleInfo.make} {driver.vehicleInfo.model}
                </Text>
                <Text style={styles.vehicleSubtext}>
                  {driver.vehicleInfo.color} • {driver.vehicleInfo.licensePlate}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={[
                  styles.menuItemText,
                  item.danger && styles.dangerText
                ]}>
                  {item.title}
                </Text>
              </View>
              {!item.danger && (
                <ChevronRight size={20} color="#ccc" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Driver App v1.0.0</Text>
          <Text style={styles.appName}>VendiEats Driver</Text>
        </View>
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
  },
  driverSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  driverEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  vehicleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleDetails: {
    marginLeft: 12,
    flex: 1,
  },
  vehicleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  vehicleSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 16,
  },
  dangerText: {
    color: '#ff4444',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 24,
  },
  appVersion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginBottom: 4,
  },
  appName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
});