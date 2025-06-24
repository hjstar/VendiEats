import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Store, MapPin, Phone, Mail, Clock, CreditCard as Edit, Camera, Eye, EyeOff, LogOut, X, Plus } from 'lucide-react-native';

export default function RestaurantSettingsScreen() {
  const { owner, logout } = useRestaurantAuth();
  const { restaurants, updateRestaurant, addRestaurant } = useRestaurant();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    image: '',
    coverImage: '',
    deliveryFee: '',
    deliveryTime: '',
  });

  const userRestaurants = restaurants.filter(r => r.ownerId === owner?.id);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      address: '',
      phone: '',
      email: '',
      image: '',
      coverImage: '',
      deliveryFee: '',
      deliveryTime: '',
    });
    setEditingRestaurant(null);
  };

  const handleEditRestaurant = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      category: restaurant.category,
      address: restaurant.address,
      phone: restaurant.phone,
      email: restaurant.email,
      image: restaurant.image,
      coverImage: restaurant.coverImage,
      deliveryFee: restaurant.deliveryFee.toString(),
      deliveryTime: restaurant.deliveryTime,
    });
    setShowEditModal(true);
  };

  const handleAddRestaurant = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleSaveRestaurant = () => {
    if (!formData.name || !formData.category || !formData.address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const restaurantData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      image: formData.image || 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      coverImage: formData.coverImage || 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg',
      deliveryFee: parseFloat(formData.deliveryFee) || 2.99,
      deliveryTime: formData.deliveryTime || '25-30 min',
      isOpen: true,
      openingHours: {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '11:00', close: '23:00', closed: false },
        sunday: { open: '12:00', close: '21:00', closed: false },
      },
      ownerId: owner?.id || '',
    };

    if (editingRestaurant) {
      updateRestaurant(editingRestaurant.id, restaurantData);
      setShowEditModal(false);
    } else {
      addRestaurant(restaurantData);
      setShowAddModal(false);
    }

    resetForm();
  };

  const toggleRestaurantStatus = (restaurant: any) => {
    updateRestaurant(restaurant.id, { isOpen: !restaurant.isOpen });
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const renderRestaurantCard = (restaurant: any) => (
    <View key={restaurant.id} style={styles.restaurantCard}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <TouchableOpacity
            style={styles.statusToggle}
            onPress={() => toggleRestaurantStatus(restaurant)}
          >
            {restaurant.isOpen ? (
              <Eye size={20} color="#4CAF50" />
            ) : (
              <EyeOff size={20} color="#ff4444" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.metaItem}>
            <MapPin size={14} color="#666" />
            <Text style={styles.metaText}>{restaurant.address}</Text>
          </View>
          <View style={styles.metaItem}>
            <Phone size={14} color="#666" />
            <Text style={styles.metaText}>{restaurant.phone}</Text>
          </View>
        </View>
        <View style={styles.restaurantActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditRestaurant(restaurant)}
          >
            <Edit size={16} color="#FF6B35" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <View style={[
            styles.statusBadge,
            { backgroundColor: restaurant.isOpen ? '#4CAF50' : '#ff4444' }
          ]}>
            <Text style={styles.statusBadgeText}>
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderForm = () => (
    <ScrollView style={styles.modalContent}>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Restaurant Name *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          placeholder="Enter restaurant name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Description</Text>
        <TextInput
          style={[styles.formInput, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
          placeholder="Describe your restaurant"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>Category *</Text>
          <TextInput
            style={styles.formInput}
            value={formData.category}
            onChangeText={(text) => setFormData({...formData, category: text})}
            placeholder="e.g., Italian, Chinese"
            placeholderTextColor="#999"
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.formLabel}>Delivery Time</Text>
          <TextInput
            style={styles.formInput}
            value={formData.deliveryTime}
            onChangeText={(text) => setFormData({...formData, deliveryTime: text})}
            placeholder="25-30 min"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Address *</Text>
        <TextInput
          style={styles.formInput}
          value={formData.address}
          onChangeText={(text) => setFormData({...formData, address: text})}
          placeholder="Enter full address"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.formLabel}>Phone</Text>
          <TextInput
            style={styles.formInput}
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.formLabel}>Delivery Fee</Text>
          <TextInput
            style={styles.formInput}
            value={formData.deliveryFee}
            onChangeText={(text) => setFormData({...formData, deliveryFee: text})}
            placeholder="2.99"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Email</Text>
        <TextInput
          style={styles.formInput}
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          placeholder="restaurant@example.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Restaurant Image URL</Text>
        <TextInput
          style={styles.formInput}
          value={formData.image}
          onChangeText={(text) => setFormData({...formData, image: text})}
          placeholder="https://images.pexels.com/..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Cover Image URL</Text>
        <TextInput
          style={styles.formInput}
          value={formData.coverImage}
          onChangeText={(text) => setFormData({...formData, coverImage: text})}
          placeholder="https://images.pexels.com/..."
          placeholderTextColor="#999"
        />
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Restaurant Settings</Text>
          <Text style={styles.subtitle}>{owner?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {userRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Store size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No restaurants added</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first restaurant to start managing orders
            </Text>
            <TouchableOpacity style={styles.addRestaurantButton} onPress={handleAddRestaurant}>
              <Plus size={20} color="#fff" />
              <Text style={styles.addRestaurantButtonText}>Add Restaurant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {userRestaurants.map(renderRestaurantCard)}
            <TouchableOpacity style={styles.addMoreButton} onPress={handleAddRestaurant}>
              <Plus size={20} color="#FF6B35" />
              <Text style={styles.addMoreButtonText}>Add Another Restaurant</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Owner Profile Section */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Owner Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{owner?.name}</Text>
              <Text style={styles.profileEmail}>{owner?.email}</Text>
              {owner?.phone && (
                <Text style={styles.profilePhone}>{owner.phone}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Restaurant Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Restaurant</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {renderForm()}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveRestaurant}
            >
              <Text style={styles.saveButtonText}>Update Restaurant</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Restaurant Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Restaurant</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {renderForm()}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveRestaurant}
            >
              <Text style={styles.saveButtonText}>Add Restaurant</Text>
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
  logoutButton: {
    padding: 8,
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
    paddingHorizontal: 40,
  },
  addRestaurantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addRestaurantButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
  },
  statusToggle: {
    padding: 4,
  },
  restaurantCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  restaurantMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 6,
  },
  restaurantActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  addMoreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B35',
    marginLeft: 8,
  },
  profileSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
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
});