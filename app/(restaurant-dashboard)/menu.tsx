import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff, X } from 'lucide-react-native';

export default function RestaurantMenuScreen() {
  const { owner } = useRestaurantAuth();
  const { restaurants, addMenuItem, updateMenuItem, deleteMenuItem } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    preparationTime: '',
    isAvailable: true,
  });

  const userRestaurants = restaurants.filter(r => r.ownerId === owner?.id);
  const currentRestaurant = userRestaurants[0];

  if (!currentRestaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noRestaurant}>
          <Text style={styles.noRestaurantText}>No restaurant found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categories = ['all', ...new Set(currentRestaurant.menu.map(item => item.category))];
  const filteredMenu = selectedCategory === 'all' 
    ? currentRestaurant.menu 
    : currentRestaurant.menu.filter(item => item.category === selectedCategory);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      preparationTime: '',
      isAvailable: true,
    });
    setEditingItem(null);
  };

  const handleAddItem = () => {
    setShowAddModal(true);
    resetForm();
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      preparationTime: item.preparationTime.toString(),
      isAvailable: item.isAvailable,
    });
    setShowAddModal(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.price || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      preparationTime: parseInt(formData.preparationTime) || 15,
      isAvailable: formData.isAvailable,
    };

    if (editingItem) {
      updateMenuItem(currentRestaurant.id, editingItem.id, itemData);
    } else {
      addMenuItem(currentRestaurant.id, itemData);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteMenuItem(currentRestaurant.id, itemId)
        },
      ]
    );
  };

  const toggleItemAvailability = (item: any) => {
    updateMenuItem(currentRestaurant.id, item.id, { isAvailable: !item.isAvailable });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Menu Management</Text>
          <Text style={styles.subtitle}>{currentRestaurant.name}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
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
              {category === 'all' ? 'All Items' : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {filteredMenu.length === 0 ? (
          <View style={styles.emptyState}>
            <Plus size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No menu items</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first menu item to get started
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddItem}>
              <Text style={styles.emptyStateButtonText}>Add Menu Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredMenu.map(item => (
            <View key={item.id} style={[
              styles.menuItemCard,
              !item.isAvailable && styles.unavailableItem
            ]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => toggleItemAvailability(item)}
                    >
                      {item.isAvailable ? (
                        <Eye size={16} color="#4CAF50" />
                      ) : (
                        <EyeOff size={16} color="#ff4444" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditItem(item)}
                    >
                      <Edit size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 size={16} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemTime}>{item.preparationTime} min</Text>
                </View>
                {!item.isAvailable && (
                  <View style={styles.unavailableBadge}>
                    <Text style={styles.unavailableText}>Not Available</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Item Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter item name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Enter item description"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Price *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.price}
                  onChangeText={(text) => setFormData({...formData, price: text})}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.formLabel}>Prep Time (min)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.preparationTime}
                  onChangeText={(text) => setFormData({...formData, preparationTime: text})}
                  placeholder="15"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.category}
                onChangeText={(text) => setFormData({...formData, category: text})}
                placeholder="e.g., Pizza, Pasta, Desserts"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Image URL</Text>
              <TextInput
                style={styles.formInput}
                value={formData.image}
                onChangeText={(text) => setFormData({...formData, image: text})}
                placeholder="https://images.pexels.com/..."
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
              <TouchableOpacity
                style={styles.availabilityToggle}
                onPress={() => setFormData({...formData, isAvailable: !formData.isAvailable})}
              >
                <Text style={styles.formLabel}>Available for orders</Text>
                <View style={[
                  styles.toggle,
                  formData.isAvailable && styles.toggleActive
                ]}>
                  <View style={[
                    styles.toggleThumb,
                    formData.isAvailable && styles.toggleThumbActive
                  ]} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveItem}
            >
              <Text style={styles.saveButtonText}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingLeft: 20,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeCategoryChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unavailableItem: {
    opacity: 0.6,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B35',
    marginRight: 12,
  },
  itemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  itemTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unavailableText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  availabilityToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  noRestaurant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noRestaurantText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
});