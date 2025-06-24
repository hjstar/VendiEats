import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MapPin, Search, Star, Clock, ChevronRight, ChefHat } from 'lucide-react-native';

const categories = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burgers', icon: '🍔' },
  { id: '3', name: 'Sushi', icon: '🍣' },
  { id: '4', name: 'Italian', icon: '🍝' },
  { id: '5', name: 'Mexican', icon: '🌮' },
  { id: '6', name: 'Desserts', icon: '🍰' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { restaurants } = useRestaurant();

  const featuredRestaurants = restaurants.filter(r => r.rating >= 4.7);
  const allRestaurants = restaurants.filter(r => 
    selectedCategory ? r.category === selectedCategory : true
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#FF6B35" />
            <Text style={styles.locationText}>123 Main St, City</Text>
            <ChevronRight size={16} color="#666" />
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.greeting}>What would you like to eat?</Text>
            <TouchableOpacity 
              style={styles.restaurantPortalButton}
              onPress={() => router.push('/(restaurant-auth)/login')}
            >
              <ChefHat size={16} color="#FF6B35" />
              <Text style={styles.restaurantPortalText}>Restaurant Portal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.name && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.name && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredRestaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.featuredCard}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <Image source={{ uri: restaurant.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                  </View>
                  {!restaurant.isOpen && (
                    <View style={styles.closedBadge}>
                      <Text style={styles.closedText}>Closed</Text>
                    </View>
                  )}
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantMeta}>
                    <Clock size={12} color="#666" />
                    <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                    <Text style={styles.metaText}>• ${restaurant.deliveryFee} delivery</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? selectedCategory : 'All Restaurants'}
          </Text>
          {allRestaurants.map(restaurant => (
            <TouchableOpacity
              key={restaurant.id}
              style={[
                styles.restaurantCard,
                !restaurant.isOpen && styles.closedRestaurant
              ]}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            >
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                  </View>
                  <Text style={styles.metaText}>•</Text>
                  <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                  <Text style={styles.metaText}>•</Text>
                  <Text style={styles.metaText}>${restaurant.deliveryFee} delivery</Text>
                </View>
                {!restaurant.isOpen && (
                  <Text style={styles.closedStatus}>Currently Closed</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 6,
    marginRight: 4,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    flex: 1,
  },
  restaurantPortalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  restaurantPortalText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: '#FF6B35',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  featuredCard: {
    width: 280,
    marginLeft: 20,
    marginRight: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  closedBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 4,
  },
  featuredInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginRight: 8,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closedRestaurant: {
    opacity: 0.7,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  restaurantCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closedStatus: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ff4444',
    marginTop: 4,
  },
});