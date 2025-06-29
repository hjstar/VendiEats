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
import { ArrowLeft, Plus, Minus, Star, Clock } from 'lucide-react-native';

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const { restaurants } = useRestaurant();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Find the menu item across all restaurants
  let menuItem: any = null;
  let restaurant: any = null;

  for (const rest of restaurants) {
    const item = rest.menu.find((item: any) => item.id === id);
    if (item) {
      menuItem = item;
      restaurant = rest;
      break;
    }
  }

  if (!menuItem || !restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    if (!restaurant.isOpen) {
      Alert.alert('Restaurant Closed', 'This restaurant is currently closed and not accepting orders.');
      return;
    }

    if (!menuItem.isAvailable) {
      Alert.alert('Item Unavailable', 'This item is currently not available.');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${menuItem.id}_${Date.now()}_${i}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        customizations: selectedCustomizations,
        specialInstructions,
      });
    }

    Alert.alert(
      'Added to Cart',
      `${quantity}x ${menuItem.name} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/orders') },
      ]
    );
  };

  const totalPrice = menuItem.price * quantity;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
        </View>

        {/* Item Image */}
        <Image source={{ uri: menuItem.image }} style={styles.itemImage} />

        {/* Item Info */}
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{menuItem.name}</Text>
            {!menuItem.isAvailable && (
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>Not Available</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.restaurantName}>from {restaurant.name}</Text>
          <Text style={styles.itemDescription}>{menuItem.description}</Text>
          
          <View style={styles.itemMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.itemPrice}>${menuItem.price.toFixed(2)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={16} color="#666" />
              <Text style={styles.metaText}>{menuItem.preparationTime} min</Text>
            </View>
          </View>

          {/* Restaurant Info */}
          <View style={styles.restaurantInfo}>
            <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantNameLarge}>{restaurant.name}</Text>
              <View style={styles.restaurantMeta}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
                <Text style={styles.metaText}>• {restaurant.deliveryTime}</Text>
              </View>
            </View>
          </View>

          {/* Ingredients */}
          {menuItem.ingredients && menuItem.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <Text style={styles.ingredientsText}>
                {menuItem.ingredients.join(', ')}
              </Text>
            </View>
          )}

          {/* Allergens */}
          {menuItem.allergens && menuItem.allergens.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Allergens</Text>
              <Text style={styles.allergensText}>
                Contains: {menuItem.allergens.join(', ')}
              </Text>
            </View>
          )}

          {/* Nutritional Info */}
          {menuItem.nutritionalInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutritional Information</Text>
              <View style={styles.nutritionGrid}>
                {menuItem.nutritionalInfo.calories && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{menuItem.nutritionalInfo.calories}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                )}
                {menuItem.nutritionalInfo.protein && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{menuItem.nutritionalInfo.protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                )}
                {menuItem.nutritionalInfo.carbs && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{menuItem.nutritionalInfo.carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                )}
                {menuItem.nutritionalInfo.fat && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{menuItem.nutritionalInfo.fat}g</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus size={20} color={quantity <= 1 ? "#ccc" : "#FF6B35"} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Plus size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (!restaurant.isOpen || !menuItem.isAvailable) && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={!restaurant.isOpen || !menuItem.isAvailable}
        >
          <Text style={styles.addToCartButtonText}>
            Add to Cart • ${totalPrice.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginLeft: 16,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
  },
  itemImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    flex: 1,
  },
  unavailableBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unavailableText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  restaurantName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FF6B35',
    marginBottom: 12,
  },
  itemDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  itemPrice: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B35',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
  },
  restaurantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantNameLarge: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  ingredientsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  allergensText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ff6b35',
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 20,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
});