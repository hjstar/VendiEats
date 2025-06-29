import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Search, Filter, Star, Clock, X, ArrowLeft } from 'lucide-react-native';

const searchSuggestions = [
  'Pizza',
  'Burgers',
  'Sushi',
  'Italian',
  'Mexican',
  'Chinese',
  'Thai',
  'Indian',
  'Pasta',
  'Salad',
];

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [recentSearches, setRecentSearches] = useState(['Pizza', 'Sushi']);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    minRating: 0,
    maxDeliveryFee: 0,
    openOnly: false,
  });
  const { restaurants } = useRestaurant();

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
    }
  }, [q]);

  const filteredRestaurants = restaurants.filter(restaurant => {
    if (!searchQuery && !selectedFilters.category && !selectedFilters.openOnly) return false;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.category.toLowerCase().includes(query) ||
      restaurant.menu.some(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    );

    const matchesCategory = !selectedFilters.category || 
      restaurant.category === selectedFilters.category;
    
    const matchesRating = !selectedFilters.minRating || 
      restaurant.rating >= selectedFilters.minRating;
    
    const matchesDeliveryFee = !selectedFilters.maxDeliveryFee || 
      restaurant.deliveryFee <= selectedFilters.maxDeliveryFee;
    
    const matchesOpenStatus = !selectedFilters.openOnly || restaurant.isOpen;

    return matchesSearch && matchesCategory && matchesRating && 
           matchesDeliveryFee && matchesOpenStatus;
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

  const clearFilters = () => {
    setSelectedFilters({
      category: '',
      minRating: 0,
      maxDeliveryFee: 0,
      openOnly: false,
    });
  };

  const categories = [...new Set(restaurants.map(r => r.category))];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            autoFocus={!q}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.activeFilterButton]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? "#fff" : "#FF6B35"} />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilter,
                  selectedFilters.category === category && styles.activeCategoryFilter
                ]}
                onPress={() => setSelectedFilters(prev => ({
                  ...prev,
                  category: prev.category === category ? '' : category
                }))}
              >
                <Text style={[
                  styles.categoryFilterText,
                  selectedFilters.category === category && styles.activeCategoryFilterText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, selectedFilters.openOnly && styles.activeFilterOption]}
              onPress={() => setSelectedFilters(prev => ({
                ...prev,
                openOnly: !prev.openOnly
              }))}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilters.openOnly && styles.activeFilterOptionText
              ]}>
                Open Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!searchQuery && !Object.values(selectedFilters).some(Boolean) ? (
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
              {filteredRestaurants.length} result{filteredRestaurants.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </Text>
            {filteredRestaurants.map(restaurant => (
              <TouchableOpacity
                key={restaurant.id}
                style={[styles.restaurantCard, !restaurant.isOpen && styles.closedRestaurant]}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
                    {!restaurant.isOpen && (
                      <View style={styles.closedBadge}>
                        <Text style={styles.closedText}>Closed</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
                  <View style={styles.restaurantMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                      <Text style={styles.reviewCount}>({restaurant.reviewCount})</Text>
                    </View>
                    <Text style={styles.metaText}>•</Text>
                    <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                    <Text style={styles.metaText}>•</Text>
                    <Text style={styles.deliveryFeeText}>${restaurant.deliveryFee} delivery</Text>
                  </View>
                  {!restaurant.isOpen && (
                    <Text style={styles.closedStatus}>Currently Closed</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {filteredRestaurants.length === 0 && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No restaurants found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try adjusting your search terms or filters
                </Text>
                {(searchQuery || Object.values(selectedFilters).some(Boolean)) && (
                  <TouchableOpacity 
                    style={styles.clearAllButton}
                    onPress={() => {
                      setSearchQuery('');
                      clearFilters();
                    }}
                  >
                    <Text style={styles.clearAllButtonText}>Clear Search & Filters</Text>
                  </TouchableOpacity>
                )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 12,
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
  activeFilterButton: {
    backgroundColor: '#FF6B35',
  },
  filtersPanel: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  clearFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
  },
  categoryFilters: {
    paddingLeft: 20,
    marginBottom: 12,
  },
  categoryFilter: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeCategoryFilter: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryFilterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeCategoryFilterText: {
    color: '#fff',
  },
  filterOptions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  filterOption: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterOption: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeFilterOptionText: {
    color: '#fff',
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
  },
  closedBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  closedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
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
  reviewCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginLeft: 2,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginHorizontal: 4,
  },
  deliveryFeeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4CAF50',
  },
  closedStatus: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ff4444',
    marginTop: 4,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  clearAllButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});