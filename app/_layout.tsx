import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { RestaurantProvider } from '@/contexts/RestaurantContext';
import { RestaurantAuthProvider } from '@/contexts/RestaurantAuthContext';
import { DriverAuthProvider } from '@/contexts/DriverAuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <DriverAuthProvider>
      <RestaurantAuthProvider>
        <RestaurantProvider>
          <AuthProvider>
            <CartProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(restaurant-auth)" />
                <Stack.Screen name="(restaurant-dashboard)" />
                <Stack.Screen name="(driver-auth)" />
                <Stack.Screen name="(driver-dashboard)" />
                <Stack.Screen name="restaurant/[id]" />
                <Stack.Screen name="item/[id]" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </CartProvider>
          </AuthProvider>
        </RestaurantProvider>
      </RestaurantAuthProvider>
    </DriverAuthProvider>
  );
}