import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useDriverAuth } from '@/contexts/DriverAuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Eye, EyeOff, Truck, ArrowLeft, Phone } from 'lucide-react-native';

export default function DriverRegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useDriverAuth();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    const success = await register(email, password, name, phone);
    setIsLoading(false);

    if (success) {
      router.replace('/(driver-dashboard)');
    } else {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Truck size={40} color="#fff" />
          </View>
          <Text style={styles.title}>Become a Driver</Text>
          <Text style={styles.subtitle}>Join our delivery team</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <User size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color="#666" />
            ) : (
              <Eye size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            After registration, you'll need to complete vehicle verification and background check to start delivering.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(driver-auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 280,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    padding: 24,
    paddingTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1976d2',
    lineHeight: 16,
  },
  registerButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2196F3',
  },
});