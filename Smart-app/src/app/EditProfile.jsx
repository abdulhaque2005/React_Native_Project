import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import PrimaryButton from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function EditProfile() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [enrollment, setEnrollment] = useState(user?.unsafeMetadata?.enrollmentNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return;
    }
    
    // Enrollment Number Validation (Format: SUK250054CE012 - 3 Letters, 6 Digits, 2 Letters, 3 Digits)
    const enrollmentVal = enrollment.trim();
    if (enrollmentVal) {
      const enrollmentRegex = /^[A-Z]{3}\d{6}[A-Z]{2}\d{3}$/;
      if (!enrollmentRegex.test(enrollmentVal.toUpperCase())) {
        Alert.alert(
          'Invalid Enrollment Number', 
          'Enrollment number must be exactly like "SUK250054CE012" (3 Letters + 6 Digits + 2 Letters + 3 Digits)'
        );
        return;
      }
    }

    try {
      setIsSaving(true);
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          enrollmentNumber: enrollmentVal.toUpperCase()
        }
      });
      
      if (Platform.OS === 'web') {
        window.alert('Success: Profile updated successfully!');
        router.back();
      } else {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back" 
          size={28} 
          color="#0F172A" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstName?.[0]?.toUpperCase() || 'U'}{lastName?.[0]?.toUpperCase() || ''}</Text>
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.formGroup}>
            <Text style={styles.label}>Enrollment Number (Optional)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="id-card-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={enrollment}
                onChangeText={(text) => setEnrollment(text.toUpperCase())}
                placeholder="e.g. SUK250054CE012"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
            </View>
            <Text style={styles.hintText}>Format: 3 Letters, 6 Digits, 2 Letters, 3 Digits.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: '#64748B' }]}
                value={user?.emailAddresses?.[0]?.emailAddress || ''}
                editable={false}
              />
            </View>
            <Text style={styles.hintText}>To change your email, please contact support.</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(350)} style={styles.buttonContainer}>
            <PrimaryButton 
              title={isSaving ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={isSaving}
              icon={isSaving ? null : "save-outline"}
            />
          </Animated.View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  backButton: {
    padding: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0F172A',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    height: '100%',
  },
  hintText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 12,
  }
});
