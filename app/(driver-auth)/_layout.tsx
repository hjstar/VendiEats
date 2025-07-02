import { Stack } from 'expo-router';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { Redirect } from 'expo-router';

export default function DriverAuthLayout() {
  const { driver } = useDriverAuth();

  if (driver) {
    return <Redirect href="/(driver-dashboard)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}