import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert, Platform, KeyboardAvoidingView, StyleSheet, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { scheduleLocalNotification } from '../../utils/notifications';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from '@clerk/clerk-expo';
import AnimatedInput from '../../components/AnimatedInput';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateSurvey() {
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`);
    }
  };
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [contact, setContact] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
      if (Platform.OS === 'web') {
        setLocation({ latitude: 23.223693, longitude: 72.506940 });
        Alert.alert('Location Fetched', 'Mock location attached for web demo.');
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Allow location access to attach GPS coordinates.');
          return;
        }
        let currentLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation({
          latitude: currentLoc.coords.latitude,
          longitude: currentLoc.coords.longitude,
        });
        Alert.alert('Location Attached', 'GPS coordinates successfully linked to survey.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const fetchContact = async () => {
    try {
      if (Platform.OS === 'web') {
        setContact({ name: 'Akka Khan', phoneNumber: '+91 70762 83508' });
        Alert.alert('Contact Attached', 'Mock contact attached for web demo.');
      } else {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Allow contacts access to attach a client.');
          return;
        }
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          pageSize: 1,
        });
        if (data.length > 0) {
          const selected = data[0];
          const phone = selected.phoneNumbers?.[0]?.number || 'No Number';
          setContact({ name: selected.name, phoneNumber: phone });
          Alert.alert('Contact Attached', `${selected.name} has been linked.`);
        } else {
          Alert.alert('No Contacts', 'No contacts found on this device.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch contact.');
    }
  };

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const priorities = ['High', 'Medium', 'Low'];
  const { user } = useUser();
  const createSurvey = useMutation(api.surveys.createSurvey);

  useEffect(() => {
    if (params.photoUri) {
      setCapturedPhoto(params.photoUri);
    }
  }, [params.photoUri]);

  const isFormValid = siteName.trim() && clientName.trim() && description.trim() && date.trim();

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Validation Error', 'Please fill all the required fields marked with *');
      return;
    }
    
    try {
      await createSurvey({
        userId: user?.id || "unknown",
        siteName: siteName.trim(),
        client: clientName.trim(),
        description: description.trim(),
        priority: priority,
        date: date.trim(),
        photo: capturedPhoto || undefined,
        location: location || undefined,
        contact: contact || undefined,
      });
      
      await scheduleLocalNotification(
        'Survey Scheduled',
        `Inspection at ${siteName} for ${clientName} has been recorded.`
      );
      
      Alert.alert('Success', 'Survey has been saved successfully!');
      setSiteName('');
      setClientName('');
      setDescription('');
      setPriority('Medium');
      setDate('');
      setCapturedPhoto(null);
      setLocation(null);
      setContact(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save survey. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top }]}>
        <Text style={styles.headerTitle}>Create Survey</Text>
        <Text style={styles.headerSubtitle}>Fill in the details for a new inspection</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.formCard}>
          
          <AnimatedInput
            label="Site Name"
            value={siteName}
            onChangeText={setSiteName}
            icon="business-outline"
            placeholder="Enter site name"
            required={true}
          />

          <AnimatedInput
            label="Client Name"
            value={clientName}
            onChangeText={setClientName}
            icon="person-outline"
            placeholder="Enter client name"
            required={true}
          />

          <AnimatedInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            placeholder="Enter survey description"
            required={true}
          />

          {Platform.OS === 'web' ? (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8, marginLeft: 4 }}>Date <Text style={{ color: '#EF4444' }}>*</Text></Text>
              {React.createElement('input', {
                type: 'date',
                value: date,
                onChange: (e) => setDate(e.target.value),
                style: {
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }
              })}
            </View>
          ) : (
            <>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <AnimatedInput
                    label="Date (YYYY-MM-DD)"
                    value={date}
                    onChangeText={() => {}}
                    icon="calendar-outline"
                    placeholder="Select Date"
                    required={true}
                  />
                </View>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date(date)}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </>
          )}

          <View style={styles.photoSection}>
            <Text style={styles.label}>Site Photo</Text>
            {capturedPhoto ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: capturedPhoto }} style={styles.photoThumbnail} />
                <Pressable style={styles.retakePhotoButton} onPress={() => router.push('/Camera')}>
                  <Ionicons name="camera-reverse" size={20} color="#FFFFFF" />
                  <Text style={styles.retakePhotoText}>Retake Photo</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.takePhotoButton} onPress={() => router.push('/Camera')}>
                <Ionicons name="camera" size={24} color="#3B82F6" />
                <Text style={styles.takePhotoButtonText}>Take Site Photo</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.label}>Survey Attachments</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Pressable 
                style={[styles.attachmentButton, { marginRight: 12 }, location && styles.attachmentButtonActive]} 
                onPress={fetchLocation}
                disabled={isFetchingLocation}
              >
                <Ionicons name="location" size={20} color={location ? "#10B981" : "#64748B"} style={{ marginRight: 8 }} />
                <Text style={[styles.attachmentText, location && {color: '#10B981'}]}>
                  {isFetchingLocation ? 'Fetching...' : location ? 'Location Added' : 'Attach Location'}
                </Text>
              </Pressable>

              <Pressable 
                style={[styles.attachmentButton, contact && styles.attachmentButtonActive]} 
                onPress={fetchContact}
              >
                <Ionicons name="person" size={20} color={contact ? "#10B981" : "#64748B"} style={{ marginRight: 8 }} />
                <Text style={[styles.attachmentText, contact && {color: '#10B981'}]}>
                  {contact ? 'Contact Added' : 'Attach Contact'}
                </Text>
              </Pressable>
            </View>
            
            {location && (
              <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>
                📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            )}
            {contact && (
              <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
                👤 {contact.name} ({contact.phoneNumber})
              </Text>
            )}
          </View>

          <View style={styles.prioritySection}>
            <Text style={styles.label}>Priority <Text style={styles.required}>*</Text></Text>
            <View style={styles.priorityContainer}>
              {priorities.map((p) => {
                const isActive = priority === p;
                return (
                  <Pressable 
                    key={p} 
                    onPress={() => setPriority(p)}
                    style={[styles.priorityButton, isActive && styles.priorityButtonActive]}
                  >
                    <Text style={[styles.priorityText, isActive && styles.priorityTextActive]}>{p}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <PrimaryButton
            title="Submit Survey"
            icon="checkmark-circle"
            onPress={handleSubmit}
            disabled={!isFormValid}
          />

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#0F172A',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 6,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  photoSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  photoPreviewContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  retakePhotoButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  retakePhotoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  takePhotoButton: {
    height: 120,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  takePhotoButtonText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
  },
  prioritySection: {
    marginBottom: 32,
  },
  required: {
    color: '#EF4444',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  priorityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  priorityTextActive: {
    color: '#6366F1',
  }
});