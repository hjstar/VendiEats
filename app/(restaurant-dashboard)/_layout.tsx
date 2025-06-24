import { Tabs } from 'expo-router';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Redirect } from 'expo-router';
import { ChartBar as BarChart3, ShoppingBag, Store, Settings, Plus } from 'lucide-react-native';

export default function RestaurantDashboardLayout() {
  const { owner } = useRestaurantAuth();

  if (!owner) {
    return <Redirect href="/(restaurant-auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ size, color }) => (
            <ShoppingBag size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ size, color }) => (
            <Store size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurant"
        options={{
          title: 'Restaurant',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}