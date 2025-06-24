import { Stack } from 'expo-router';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Redirect } from 'expo-router';

export default function RestaurantAuthLayout() {
  const { owner } = useRestaurantAuth();

  if (owner) {
    return <Redirect href="/(restaurant-dashboard)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}