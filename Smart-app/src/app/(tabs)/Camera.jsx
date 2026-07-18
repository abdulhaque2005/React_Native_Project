import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Pressable, Image, Alert, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState(Platform.OS === 'web' ? true : null);
  
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState('back');
  
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function checkGallery() {
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.getPermissionsAsync();
        setGalleryPermission(status === 'granted');
      }
    }
    checkGallery();
  }, []);

  useEffect(() => {
    if (cameraPermission?.granted && (Platform.OS === 'web' || galleryPermission)) {
      if (!photo) {
        setIsReady(false);
        const timer = setTimeout(() => setIsReady(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [cameraPermission?.granted, galleryPermission, photo]);

  const requestAllPermissions = async () => {
    await requestCameraPermission();
    if (Platform.OS !== 'web') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setGalleryPermission(status === 'granted');
    }
  };

  if (!cameraPermission || (Platform.OS !== 'web' && galleryPermission === null)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || (Platform.OS !== 'web' && !galleryPermission)) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color="#64748B" style={{ marginBottom: 20 }} />
        <Text style={styles.permissionText}>We need camera {Platform.OS !== 'web' ? 'and gallery ' : ''}permissions for field surveys.</Text>
        <Pressable 
          style={({ pressed }) => [styles.permissionButton, pressed && { opacity: 0.8 }]}
          onPress={requestAllPermissions}
        >
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
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
        
        if (Platform.OS !== 'web') {
          await MediaLibrary.saveToLibraryAsync(photoData.uri);
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
      if (window.confirm("Are you sure you want to delete this photo?")) {
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

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
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
          <Pressable 
            style={({ pressed }) => [styles.actionButton, styles.retakeButton, pressed && { opacity: 0.8 }]} 
            onPress={handleRetake}
          >
            <Ionicons name="refresh-circle" size={24} color="#3B82F6" />
            <Text style={styles.retakeText}>Retake</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && { opacity: 0.8 }]} 
            onPress={confirmDelete}
          >
            <Ionicons name="trash" size={24} color="#EF4444" />
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.flexContainer, { backgroundColor: '#000' }]}>
      {!isReady ? (
        <View style={styles.centerContainerDark}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingTextDark}>Opening Camera...</Text>
        </View>
      ) : (
        <CameraView 
          ref={cameraRef} 
          style={styles.flexContainer}
          facing={facing}
        >
          <View style={styles.cameraOverlay}>
            <View style={[styles.cameraHeader, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top }]}>
              <Text style={styles.cameraTitle}>Site Inspection Camera</Text>
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
        </CameraView>
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
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#334155',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
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
    padding: 20,
    backgroundColor: '#0F172A',
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  retakeButton: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  retakeText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 14,
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
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
