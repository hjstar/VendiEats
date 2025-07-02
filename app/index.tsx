import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { User, ChefHat, Utensils, Truck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { user } = useAuth();
  const { owner } = useRestaurantAuth();
  const { driver } = useDriverAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    } else if (owner) {
      router.replace('/(restaurant-dashboard)');
    } else if (driver) {
      router.replace('/(driver-dashboard)');
    }
  }, [user, owner, driver]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
          style={styles.heroImage}
        />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <Utensils size={40} color="#fff" />
          </View>
          <Text style={styles.appName}>VendiEats</Text>
          <Text style={styles.tagline}>Delicious food delivered to your door</Text>
        </View>
      </View>

      {/* Welcome Content */}
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>Welcome!</Text>
        <Text style={styles.welcomeSubtitle}>
          Choose how you'd like to continue
        </Text>

        {/* Customer Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.primaryOption}
            onPress={() => router.push('/(auth)/login')}
          >
            <View style={styles.optionIcon}>
              <User size={24} color="#fff" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Customer Login</Text>
              <Text style={styles.optionSubtitle}>Order food from restaurants</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryOption}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.secondaryOptionText}>New Customer? Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Business Options */}
        <View style={styles.businessSection}>
          {/* Restaurant Options */}
          <TouchableOpacity
            style={styles.businessOption}
            onPress={() => router.push('/(restaurant-auth)/login')}
          >
            <View style={styles.businessIconContainer}>
              <ChefHat size={24} color="#FF6B35" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.businessOptionTitle}>Restaurant Portal</Text>
              <Text style={styles.businessOptionSubtitle}>
                Manage your restaurant & orders
              </Text>
            </View>
          </TouchableOpacity>

          {/* Driver Options */}
          <TouchableOpacity
            style={styles.businessOption}
            onPress={() => router.push('/(driver-auth)/login')}
          >
            <View style={styles.driverIconContainer}>
              <Truck size={24} color="#2196F3" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.businessOptionTitle}>Driver Portal</Text>
              <Text style={styles.businessOptionSubtitle}>
                Deliver orders and earn money
              </Text>
            </View>
          </TouchableOpacity>

          {/* Sign up options */}
          <View style={styles.signupOptions}>
            <TouchableOpacity
              style={styles.businessSignupOption}
              onPress={() => router.push('/(restaurant-auth)/register')}
            >
              <Text style={styles.businessSignupText}>
                New Restaurant? Join Our Platform
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.driverSignupOption}
              onPress={() => router.push('/(driver-auth)/register')}
            >
              <Text style={styles.driverSignupText}>
                Become a Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: height * 0.35,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  welcomeContent: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  primaryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.9,
  },
  secondaryOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  secondaryOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#999',
    marginHorizontal: 16,
  },
  businessSection: {
    marginBottom: 20,
  },
  businessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  businessIconContainer: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  driverIconContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  businessOptionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  businessOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  signupOptions: {
    marginTop: 8,
  },
  businessSignupOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  businessSignupText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  driverSignupOption: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  driverSignupText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2196F3',
  },
  footer: {
    padding: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});