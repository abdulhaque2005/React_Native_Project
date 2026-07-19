import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import PrimaryButton from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Security() {
  const router = useRouter();
  const { user } = useUser();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsSaving(true);
      await user.updatePassword({
        currentPassword,
        newPassword
      });
      
      if (Platform.OS === 'web') {
        window.alert('Success: Password updated successfully!');
        router.back();
      } else {
        Alert.alert('Success', 'Password updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Update password error:', error);
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to update password. Make sure your current password is correct.');
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
        <Text style={styles.headerTitle}>Security Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.iconHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed-outline" size={40} color="#10B981" />
            </View>
            <Text style={styles.iconTitle}>Update Password</Text>
            <Text style={styles.iconSubtitle}>Ensure your account stays secure</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.formGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showCurrent}
              />
              <Ionicons 
                name={showCurrent ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#94A3B8" 
                onPress={() => setShowCurrent(!showCurrent)}
                style={styles.eyeIcon}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.formGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showNew}
              />
              <Ionicons 
                name={showNew ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#94A3B8" 
                onPress={() => setShowNew(!showNew)}
                style={styles.eyeIcon}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.formGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirm}
              />
              <Ionicons 
                name={showConfirm ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#94A3B8" 
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeIcon}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.buttonContainer}>
            <PrimaryButton 
              title={isSaving ? "Updating..." : "Update Password"}
              onPress={handleSave}
              disabled={isSaving}
              icon={isSaving ? null : "shield-checkmark"}
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
  iconHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  iconSubtitle: {
    fontSize: 14,
    color: '#64748B',
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  buttonContainer: {
    marginTop: 12,
  }
});
