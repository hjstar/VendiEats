import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, Phone, Heart, CreditCard, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

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
      title: 'Edit Profile',
      icon: <Edit size={20} color="#666" />,
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      },
    },
    {
      id: '2',
      title: 'Delivery Address',
      icon: <MapPin size={20} color="#666" />,
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      },
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: <CreditCard size={20} color="#666" />,
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      },
    },
    {
      id: '4',
      title: 'Favorites',
      icon: <Heart size={20} color="#666" />,
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      },
    },
    {
      id: '5',
      title: 'Settings',
      icon: <Settings size={20} color="#666" />,
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      },
    },
    {
      id: '6',
      title: 'Help & Support',
      icon: <HelpCircle size={20} color="#666" />,
      onPress: () => {
        Alert.alert('Coming Soon', 'This feature is coming soon!');
      },
    },
    {
      id: '7',
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

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.userDetails}>
            {user?.phone && (
              <View style={styles.detailItem}>
                <Phone size={16} color="#666" />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
            )}
            {user?.address && (
              <View style={styles.detailItem}>
                <MapPin size={16} color="#666" />
                <Text style={styles.detailText}>{user.address}</Text>
              </View>
            )}
          </View>
        </View>

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
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appName}>Food Delivery App</Text>
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
  userSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  userDetails: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginLeft: 12,
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