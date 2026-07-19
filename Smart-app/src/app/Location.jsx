import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MapView, { Marker } from '../components/Map';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
    } catch (error) {
      setErrorMsg('Failed to fetch location. Make sure location services are enabled.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const copyToClipboard = async () => {
    if (location) {
      const locString = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
      await Clipboard.setStringAsync(locString);
      if (Platform.OS === 'web') {
        window.alert('Success: Location copied to clipboard!');
      } else {
        Alert.alert('Success', 'Location copied to clipboard!');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="map" size={48} color="#2563EB" />
        </View>
        <Text style={styles.title}>Current Location</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.statusText}>Fetching location...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={32} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : location ? (
          <>
            <View style={styles.mapContainer}>
              <MapView 
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <Marker 
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="You are here"
                  description="Current Location"
                />
              </MapView>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Latitude:</Text>
                <Text style={styles.detailValue}>{location.coords.latitude.toFixed(6)}°</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Longitude:</Text>
                <Text style={styles.detailValue}>{location.coords.longitude.toFixed(6)}°</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Altitude:</Text>
                <Text style={styles.detailValue}>{location.coords.altitude ? `${location.coords.altitude.toFixed(2)} m` : 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Accuracy:</Text>
                <Text style={styles.detailValue}>{location.coords.accuracy ? `±${location.coords.accuracy.toFixed(1)} m` : 'N/A'}</Text>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.buttonContainer}>
          <Pressable 
            style={({ pressed }) => [styles.actionButton, styles.refreshButton, pressed && styles.pressed]} 
            onPress={fetchLocation}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color="#2563EB" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.actionButton, 
              styles.copyButton, 
              (!location || loading) && styles.disabledButton,
              pressed && styles.pressed
            ]} 
            onPress={copyToClipboard}
            disabled={!location || loading}
          >
            <Ionicons name="copy" size={20} color="#FFFFFF" />
            <Text style={styles.copyButtonText}>Copy Location</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  statusText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
  },
  errorText: {
    marginTop: 12,
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  refreshButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  copyButton: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  }
});
