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
import { User, ChefHat, Utensils } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { user } = useAuth();
  const { owner } = useRestaurantAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    } else if (owner) {
      router.replace('/(restaurant-dashboard)');
    }
  }, [user, owner]);

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

        {/* Restaurant Options */}
        <View style={styles.restaurantSection}>
          <TouchableOpacity
            style={styles.restaurantOption}
            onPress={() => router.push('/(restaurant-auth)/login')}
          >
            <View style={styles.restaurantIconContainer}>
              <ChefHat size={24} color="#FF6B35" />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.restaurantOptionTitle}>Restaurant Portal</Text>
              <Text style={styles.restaurantOptionSubtitle}>
                Manage your restaurant & orders
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restaurantSignupOption}
            onPress={() => router.push('/(restaurant-auth)/register')}
          >
            <Text style={styles.restaurantSignupText}>
              New Restaurant? Join Our Platform
            </Text>
          </TouchableOpacity>
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
    height: height * 0.4,
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
    paddingTop: 32,
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
    marginBottom: 32,
  },
  optionsContainer: {
    marginBottom: 24,
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
    marginVertical: 24,
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
  restaurantSection: {
    marginBottom: 24,
  },
  restaurantOption: {
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
  restaurantIconContainer: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  restaurantOptionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  restaurantSignupOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  restaurantSignupText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
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