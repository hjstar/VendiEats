import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { ArrowLeft, Star, Clock, MapPin, Plus, Heart, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const { restaurants } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  const categories = [...new Set(restaurant.menu.map(item => item.category))];
  const filteredMenu = selectedCategory
    ? restaurant.menu.filter(item => item.category === selectedCategory)
    : restaurant.menu;

  const availableItems = filteredMenu.filter(item => item.isAvailable);
  const unavailableItems = filteredMenu.filter(item => !item.isAvailable);

  const handleAddToCart = (item: any) => {
    if (!restaurant.isOpen) {
      Alert.alert('Restaurant Closed', 'This restaurant is currently closed and not accepting orders.');
      return;
    }

    if (!item.isAvailable) {
      Alert.alert('Item Unavailable', 'This item is currently not available.');
      return;
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: restaurant.coverImage || restaurant.image }} style={styles.headerImage} />
          <View style={styles.headerOverlay} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={24}
              color={isFavorite ? '#ff4444' : '#fff'}
              fill={isFavorite ? '#ff4444' : 'none'}
            />
          </TouchableOpacity>
          {!restaurant.isOpen && (
            <View style={styles.closedOverlay}>
              <Text style={styles.closedOverlayText}>Currently Closed</Text>
            </View>
          )}
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {!restaurant.isOpen && (
              <View style={styles.closedBadge}>
                <AlertCircle size={16} color="#ff4444" />
                <Text style={styles.closedBadgeText}>Closed</Text>
              </View>
            )}
          </View>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.metaText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#666" />
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={16} color="#666" />
              <Text style={styles.metaText}>${restaurant.deliveryFee} delivery</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <MapPin size={16} color="#FF6B35" />
            <Text style={styles.addressText}>{restaurant.address}</Text>
          </View>

          {!restaurant.isOpen && (
            <View style={styles.closedNotice}>
              <AlertCircle size={16} color="#ff4444" />
              <Text style={styles.closedNoticeText}>
                This restaurant is currently closed and not accepting orders.
              </Text>
            </View>
          )}
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  !selectedCategory && styles.activeCategoryChip
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[
                  styles.categoryText,
                  !selectedCategory && styles.activeCategoryText
                ]}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.activeCategoryChip
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.activeCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* Available Items */}
          {availableItems.map(item => (
            <View key={item.id} style={styles.menuItem}>
              <Image source={{ uri: item.image }} style={styles.menuItemImage} />
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <View style={styles.menuItemFooter}>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.prepTime}>{item.preparationTime} min</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  (!restaurant.isOpen || !item.isAvailable) && styles.disabledButton
                ]}
                onPress={() => handleAddToCart(item)}
                disabled={!restaurant.isOpen || !item.isAvailable}
              >
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Unavailable Items */}
          {unavailableItems.length > 0 && (
            <>
              <View style={styles.unavailableSection}>
                <Text style={styles.unavailableSectionTitle}>Currently Unavailable</Text>
              </View>
              {unavailableItems.map(item => (
                <View key={item.id} style={[styles.menuItem, styles.unavailableItem]}>
                  <Image source={{ uri: item.image }} style={[styles.menuItemImage, styles.unavailableImage]} />
                  <View style={styles.menuItemInfo}>
                    <Text style={[styles.menuItemName, styles.unavailableText]}>{item.name}</Text>
                    <Text style={[styles.menuItemDescription, styles.unavailableText]}>{item.description}</Text>
                    <View style={styles.menuItemFooter}>
                      <Text style={[styles.menuItemPrice, styles.unavailableText]}>${item.price.toFixed(2)}</Text>
                      <Text style={[styles.prepTime, styles.unavailableText]}>{item.preparationTime} min</Text>
                    </View>
                  </View>
                  <View style={styles.unavailableBadge}>
                    <Text style={styles.unavailableBadgeText}>Not Available</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {filteredMenu.length === 0 && (
            <View style={styles.emptyMenu}>
              <Text style={styles.emptyMenuText}>No items in this category</Text>
            </View>
          )}
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
  headerContainer: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  closedOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    padding: 12,
    alignItems: 'center',
  },
  closedOverlayText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    flex: 1,
  },
  closedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  closedBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ff4444',
    marginLeft: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
  },
  closedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  closedNoticeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ff4444',
    marginLeft: 8,
    flex: 1,
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryChip: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  menuContainer: {
    padding: 20,
  },
  unavailableSection: {
    marginTop: 20,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unavailableSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#999',
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unavailableItem: {
    opacity: 0.6,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  unavailableImage: {
    opacity: 0.5,
  },
  menuItemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF6B35',
  },
  prepTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  unavailableText: {
    color: '#999',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  unavailableBadge: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  unavailableBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  emptyMenu: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMenuText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});