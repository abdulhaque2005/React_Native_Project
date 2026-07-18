import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  
  const [photo, setPhoto] = useState(null);
  const [captureTime, setCaptureTime] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState('back');
  const [isSaving, setIsSaving] = useState(false);
  
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission?.granted && !photo) {
      setIsReady(false);
      const timer = setTimeout(() => setIsReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [permission?.granted, photo]);

  if (!permission || !mediaPermission) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted || !mediaPermission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color="#64748b" style={{marginBottom: 20}} />
        <Text style={styles.permissionText}>We need camera and gallery permissions for field surveys.</Text>
        <Pressable 
          style={styles.permissionButton} 
          onPress={async () => {
            await requestPermission();
            await requestMediaPermission();
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.7,
        });
        setPhoto(photoData.uri);
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString();
        setCaptureTime(`${dateString} at ${timeString}`);
      } catch (error) {
        Alert.alert("Error", "Failed to capture photo.");
      }
    }
  };

  const handleSaveToGallery = async () => {
    if (photo) {
      setIsSaving(true);
      try {
        await MediaLibrary.saveToLibraryAsync(photo);
        Alert.alert("Success", "Photo saved to gallery successfully!");
        setPhoto(null);
      } catch (error) {
        Alert.alert("Error", "Failed to save photo to gallery.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => setPhoto(null) }
      ]
    );
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Photo Preview</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          
          <View style={styles.timeOverlay}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.timeText}>{captureTime}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Pressable style={[styles.actionButton, styles.retakeButton]} onPress={handleRetake}>
            <Ionicons name="refresh-circle" size={24} color="#3b82f6" />
            <Text style={[styles.actionText, {color: '#3b82f6'}]}>Retake</Text>
          </Pressable>
          
          <Pressable style={[styles.actionButton, styles.saveButton]} onPress={handleSaveToGallery} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <Ionicons name="download" size={24} color="#10b981" />
            )}
            <Text style={[styles.actionText, {color: '#10b981'}]}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </Pressable>

          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={confirmDelete}>
            <Ionicons name="trash" size={24} color="#ef4444" />
            <Text style={[styles.actionText, {color: '#ef4444'}]}>Delete</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isReady ? (
        <View style={styles.loadingCameraContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Opening Camera...</Text>
        </View>
      ) : (
        <CameraView 
          ref={cameraRef} 
          style={styles.camera} 
          facing={facing}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraHeaderText}>Site Inspection Camera</Text>
            </View>
            
            <View style={styles.captureContainer}>
              <View style={styles.sideButtonPlaceholder} />
              
              <Pressable style={styles.captureButton} onPress={handleCapture}>
                <View style={styles.captureInnerCircle} />
              </Pressable>

              <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={32} color="#fff" />
              </Pressable>
            </View>
          </View>
        </CameraView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#334155',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  camera: {
    flex: 1,
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
  cameraHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  captureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  sideButtonPlaceholder: {
    width: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 16,
  },
  previewHeader: {
    backgroundColor: '#0f172a',
    padding: 16,
    alignItems: 'center',
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  timeOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#0f172a',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  retakeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  saveButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});
