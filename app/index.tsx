import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
            <Text style={styles.welcomeSubtitle}>Choose how you'd like to continue</Text>

            {/* Customer Login */}
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

            {/* Restaurant Login */}
            <TouchableOpacity
              style={styles.businessOption}
              onPress={() => router.push('/(restaurant-auth)/login')}
            >
              <View style={styles.businessIconContainer}>
                <ChefHat size={24} color="#FF6B35" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.businessOptionTitle}>Restaurant Portal</Text>
                <Text style={styles.businessOptionSubtitle}>Manage your restaurant & orders</Text>
              </View>
            </TouchableOpacity>

            {/* Driver Login */}
            <TouchableOpacity
              style={styles.businessOption}
              onPress={() => router.push('/(driver-auth)/login')}
            >
              <View style={styles.driverIconContainer}>
                <Truck size={24} color="#2196F3" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.businessOptionTitle}>Driver Portal</Text>
                <Text style={styles.businessOptionSubtitle}>Deliver orders and earn money</Text>
              </View>
            </TouchableOpacity>

            {/* Signup Links */}
            <View style={styles.signupOptions}>
              <TouchableOpacity
                style={styles.businessSignupOption}
                onPress={() => router.push('/(restaurant-auth)/register')}
              >
                <Text style={styles.businessSignupText}>New Restaurant? Join Our Platform</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.driverSignupOption}
                onPress={() => router.push('/(driver-auth)/register')}
              >
                <Text style={styles.driverSignupText}>Become a Driver</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    height: height * 0.3,
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
    bottom: 20,
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
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  welcomeContent: {
    flex: 1,
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  primaryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  optionIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  optionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#fff',
  },
  secondaryOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  secondaryOptionText: {
    color: '#FF6B35',
    fontFamily: 'Inter-SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#888',
    fontFamily: 'Inter-Medium',
  },
  businessOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    marginBottom: 12,
  },
  businessIconContainer: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverIconContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  businessOptionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  businessOptionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  signupOptions: {
    marginTop: 10,
  },
  businessSignupOption: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  driverSignupOption: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  businessSignupText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  driverSignupText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#2196F3',
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
});
