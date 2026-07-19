import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Pressable, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet, Platform, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState('back');
  const [zoom, setZoom] = useState(0); // Zoom level from 0 to 1
  const [isTorchOn, setIsTorchOn] = useState(false);
  
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (cameraPermission?.granted) {
      if (!photo) {
        setIsReady(false);
        const timer = setTimeout(() => setIsReady(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [cameraPermission?.granted, photo]);

  const requestAllPermissions = async () => {
    if (cameraPermission?.status === 'denied' && !cameraPermission?.canAskAgain) {
      if (Platform.OS === 'web') {
        window.alert("Camera permission is disabled. Please enable it in your browser settings.");
      } else {
        Alert.alert(
          "Permission Required",
          "Camera permission is disabled. Please enable it in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        );
      }
      return;
    }
    await requestCameraPermission();
  };

  if (!cameraPermission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={80} color="#64748B" style={{ marginBottom: 20 }} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>We need camera permissions to capture field survey photos.</Text>
        <Pressable 
          style={styles.permissionButtonFixed}
          onPress={requestAllPermissions}
        >
          <Text style={styles.permissionButtonTextFixed}>
            {(cameraPermission?.status === 'denied' && !cameraPermission?.canAskAgain) 
              ? "Open Device Settings" 
              : "Grant Camera Permission"}
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        setPhoto(photoData.uri);
        
        // Save to gallery
        try {
          if (Platform.OS !== 'web') {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
              await MediaLibrary.saveToLibraryAsync(photoData.uri);
            }
          }
        } catch (err) {
          console.warn("MediaLibrary save error:", err);
        }
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString();
        setCaptureTime(`${dateString} at ${timeString}`);
      } catch (error) {
        if (Platform.OS === 'web') {
          window.alert("Failed to capture photo.");
        } else {
          Alert.alert("Error", "Failed to capture photo.");
        }
      }
    }
  };

  const confirmDelete = () => {
    if (Platform.OS === 'web') {
      const confirmDel = window.confirm("Are you sure you want to delete this photo?");
      if (confirmDel) {
        setPhoto(null);
      }
    } else {
      Alert.alert(
        "Delete Photo",
        "Are you sure you want to delete this photo?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => setPhoto(null) }
        ]
      );
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleSavePhoto = () => {
    router.navigate({
      pathname: '/CreateSurvey',
      params: { photoUri: photo }
    });
    // Reset camera state for next time
    setPhoto(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    setZoom(0); // Reset zoom when switching cameras
    setIsTorchOn(false); // Turn off torch when switching
  };

  const toggleTorch = () => {
    setIsTorchOn(current => !current);
  };

  const handleZoomIn = () => {
    setZoom(current => Math.min(current + 0.1, 1));
  };

  const handleZoomOut = () => {
    setZoom(current => Math.max(current - 0.1, 0));
  };

  if (photo) {
    return (
      <View style={styles.flexContainer}>
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top }]}>
          <Text style={styles.headerTitle}>Photo Preview</Text>
        </View>
        
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.flexContainer} resizeMode="contain" />
          
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={16} color="#FFFFFF" />
            <Text style={styles.timeText}>{captureTime}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.retakeButton]} 
            activeOpacity={0.8}
            onPress={handleRetake}
          >
            <Ionicons name="refresh-outline" size={28} color="#E0F2FE" />
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            activeOpacity={0.8}
            onPress={confirmDelete}
          >
            <Ionicons name="trash-outline" size={28} color="#FEE2E2" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]} 
            activeOpacity={0.8}
            onPress={handleSavePhoto}
          >
            <Ionicons name="checkmark-outline" size={28} color="#D1FAE5" />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flexContainer, { backgroundColor: '#000' }]}>
      {(!isReady || !isFocused) ? (
        <View style={styles.centerContainerDark}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingTextDark}>Opening Camera...</Text>
        </View>
      ) : (
        <View style={styles.flexContainer}>
          <CameraView 
            ref={cameraRef} 
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            zoom={zoom}
            enableTorch={isTorchOn}
          />
          <View style={[StyleSheet.absoluteFillObject, styles.cameraOverlay]}>
            <View style={[styles.cameraHeader, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top }]}>
              <Text style={styles.cameraTitle}>Site Inspection Camera</Text>
              {facing === 'back' && (
                <Pressable onPress={toggleTorch} style={styles.torchButton}>
                  <Ionicons name={isTorchOn ? "flash" : "flash-off"} size={22} color={isTorchOn ? "#FDE047" : "#FFFFFF"} />
                </Pressable>
              )}
            </View>
            
            {/* Zoom Controls */}
            <View style={styles.zoomControlsContainer}>
              <Pressable style={styles.zoomButton} onPress={handleZoomIn}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </Pressable>
              
              <View style={styles.zoomIndicator}>
                <Text style={styles.zoomText}>{(zoom * 10 + 1).toFixed(1)}x</Text>
              </View>
              
              <Pressable style={styles.zoomButton} onPress={handleZoomOut}>
                <Ionicons name="remove" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
            
            <View style={styles.cameraControls}>
              <View style={styles.spacer} />
              
              <Pressable 
                style={({ pressed }) => [styles.captureButtonOuter, pressed && { opacity: 0.7 }]} 
                onPress={handleCapture}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.flipButton, pressed && { opacity: 0.7 }]} 
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  centerContainerDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingTextDark: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  permissionButtonFixed: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  permissionButtonTextFixed: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#0F172A',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#0F172A',
    gap: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retakeButton: {
    backgroundColor: '#1E3A8A',
    shadowColor: '#3B82F6',
  },
  retakeText: {
    color: '#E0F2FE',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#7F1D1D',
    shadowColor: '#EF4444',
  },
  deleteText: {
    color: '#FEE2E2',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#064E3B',
    shadowColor: '#10B981',
  },
  saveText: {
    color: '#D1FAE5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  torchButton: {
    position: 'absolute',
    right: 20,
    top: 16,
    padding: 4,
  },
  zoomControlsContainer: {
    position: 'absolute',
    right: 20,
    top: '40%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomIndicator: {
    paddingVertical: 8,
  },
  zoomText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    backgroundColor: 'transparent',
  },
  spacer: {
    width: 48,
  },
  captureButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
