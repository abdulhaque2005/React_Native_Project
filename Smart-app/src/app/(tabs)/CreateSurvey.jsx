import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, Pressable, Alert, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CreateSurvey() {
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState('');

  const insets = useSafeAreaInsets();
  const priorities = ['High', 'Medium', 'Low'];

  const handleSubmit = () => {
    if (!siteName.trim() || !clientName.trim() || !description.trim() || !date.trim()) {
      Alert.alert('Validation Error', 'Please fill all the required fields marked with *');
      return;
    }
    
    Alert.alert('Success', 'Survey has been created successfully!');
    setSiteName('');
    setClientName('');
    setDescription('');
    setPriority('Medium');
    setDate('');
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
        <View style={styles.formCard}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter site name"
                placeholderTextColor="#94A3B8"
                value={siteName}
                onChangeText={setSiteName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter client name"
                placeholderTextColor="#94A3B8"
                value={clientName}
                onChangeText={setClientName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter survey description"
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date (YYYY-MM-DD) <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 2026-07-18"
                placeholderTextColor="#94A3B8"
                value={date}
                onChangeText={setDate}
              />
            </View>
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

          <Pressable 
            style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Survey</Text>
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  textArea: {
    height: 100,
    paddingVertical: 0,
  },
  prioritySection: {
    marginBottom: 32,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  priorityTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
