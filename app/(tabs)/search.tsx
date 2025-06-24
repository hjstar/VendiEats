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
import { Search, Filter, Star, Clock, X } from 'lucide-react-native';

const searchSuggestions = [
  'Pizza',
  'Burgers',
  'Sushi',
  'Italian',
  'Mexican',
  'Chinese',
  'Thai',
  'Indian',
];

const restaurants = [
  {
    id: '1',
    name: 'Bella Italia',
    image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    rating: 4.8,
    deliveryTime: '25-30 min',
    category: 'Italian',
    deliveryFee: 2.99,
    distance: '1.2 km',
    tags: ['pizza', 'pasta', 'italian'],
  },
  {
    id: '2',
    name: 'Burger House',
    image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
    rating: 4.6,
    deliveryTime: '20-25 min',
    category: 'Burgers',
    deliveryFee: 1.99,
    distance: '0.8 km',
    tags: ['burgers', 'fries', 'american'],
  },
  {
    id: '3',
    name: 'Sushi Master',
    image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
    rating: 4.9,
    deliveryTime: '30-35 min',
    category: 'Japanese',
    deliveryFee: 3.99,
    distance: '2.1 km',
    tags: ['sushi', 'ramen', 'japanese'],
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
    rating: 4.5,
    deliveryTime: '15-20 min',
    category: 'Mexican',
    deliveryFee: 1.49,
    distance: '0.5 km',
    tags: ['tacos', 'burritos', 'mexican'],
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Pizza', 'Sushi']);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!searchQuery) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.category.toLowerCase().includes(query) ||
      restaurant.tags.some(tag => tag.includes(query))
    );
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const removeRecentSearch = (searchTerm: string) => {
    setRecentSearches(prev => prev.filter(term => term !== searchTerm));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!searchQuery ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() => handleSearch(search)}
                  >
                    <Search size={16} color="#666" />
                    <Text style={styles.recentSearchText}>{search}</Text>
                    <TouchableOpacity
                      onPress={() => removeRecentSearch(search)}
                      style={styles.removeButton}
                    >
                      <X size={16} color="#999" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Search Suggestions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.suggestionsContainer}>
                {searchSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionChip}
                    onPress={() => handleSearch(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* Search Results */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {filteredRestaurants.length} results for "{searchQuery}"
            </Text>
            {filteredRestaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
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
                    <Text style={styles.metaText}>{restaurant.distance}</Text>
                  </View>
                  <Text style={styles.deliveryFee}>${restaurant.deliveryFee} delivery</Text>
                </View>
              </TouchableOpacity>
            ))}
            {filteredRestaurants.length === 0 && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No restaurants found</Text>
                <Text style={styles.noResultsSubtext}>Try searching for something else</Text>
              </View>
            )}
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
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
  clearButton: {
    padding: 4,
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentSearchText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginLeft: 12,
  },
  removeButton: {
    padding: 4,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  restaurantCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginHorizontal: 4,
  },
  deliveryFee: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4CAF50',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});