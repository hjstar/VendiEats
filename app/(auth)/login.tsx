import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_WEB_CLIENT_ID', // Used for web, Android & iOS (unified)
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: 'YOUR_FACEBOOK_APP_ID',
  });

  useEffect(() => {
    const fetchGoogleUser = async (token: string) => {
      try {
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await res.json();
        console.log('Google User:', user);
        // Handle login with user info
      } catch (err) {
        console.error('Google user fetch error:', err);
      }
    };

    const fetchFacebookUser = async (token: string) => {
      try {
        const res = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.type(large)`
        );
        const user = await res.json();
        console.log('Facebook User:', user);
        // Handle login with user info
      } catch (err) {
        console.error('Facebook user fetch error:', err);
      }
    };

    if (response?.type === 'success' && response.authentication) {
      const { accessToken } = response.authentication;
      if (accessToken) {
        fetchGoogleUser(accessToken);
      }
    }

    if (fbResponse?.type === 'success' && fbResponse.authentication) {
      const { accessToken } = fbResponse.authentication;
      if (accessToken) {
        fetchFacebookUser(accessToken);
      }
    }
  }, [response, fbResponse]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('Apple credential:', credential);
      // Handle Apple login with credential info
    } catch (error) {
      console.log('Apple login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
              }}
              style={styles.headerImage}
            />
            <View style={styles.overlay} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue ordering</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#444" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#444" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
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
                  <EyeOff size={20} color="#444" />
                ) : (
                  <Eye size={20} color="#444" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.socialLoginContainer}>
              <Text style={styles.socialLoginText}>Or sign in with</Text>
              <View style={styles.socialIcons}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => promptAsync()}
                >
                  <Image
                    source={{
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
                    }}
                    style={styles.iconImage}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => fbPromptAsync()}
                >
                  <Image
                    source={{
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
                    }}
                    style={styles.iconImage}
                  />
                </TouchableOpacity>

                {AppleAuthentication.isAvailableAsync() && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleAppleLogin}
                  >
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
                      }}
                      style={styles.iconImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.restaurantLink}>
              <Text style={styles.restaurantLinkText}>
                Are you a restaurant owner?{' '}
              </Text>
              <Link href="/(restaurant-auth)/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Restaurant Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: { height: 300, position: 'relative' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    opacity: 0.9,
  },
  form: { flex: 1, padding: 24, paddingTop: 40 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#222' },
  eyeIcon: { padding: 4 },
  loginButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledButton: { opacity: 0.7 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  socialLoginContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  socialLoginText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  restaurantLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  restaurantLinkText: {
    fontSize: 14,
    color: '#666',
  },
});
