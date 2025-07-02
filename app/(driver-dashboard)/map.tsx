import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Locate } from 'lucide-react-native';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <TouchableOpacity style={styles.locateButton}>
          <Locate size={20} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={64} color="#ccc" />
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Interactive map will be displayed here
          </Text>
        </View>
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Navigation size={20} color="#2196F3" />
          <Text style={styles.controlButtonText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MapPin size={20} color="#4CAF50" />
          <Text style={styles.controlButtonText}>Hotspots</Text>
        </TouchableOpacity>
      </View>

      {/* Current Location Info */}
      <View style={styles.locationInfo}>
        <Text style={styles.locationTitle}>Current Location</Text>
        <Text style={styles.locationAddress}>Downtown Area, City Center</Text>
        <Text style={styles.locationSubtext}>
          You're in a high-demand area for deliveries
        </Text>
      </View>
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
  locateButton: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e8f5e8',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
  },
  mapControls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  locationSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4CAF50',
  },
});