import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateSurvey() {
  const [siteName, setSiteName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState('');

  const priorities = ['High', 'Medium', 'Low'];

  const handleSubmit = () => {
    if (!siteName.trim()) {
      Alert.alert('Validation Error', 'Site Name is required');
      return;
    }
    if (!clientName.trim()) {
      Alert.alert('Validation Error', 'Client Name is required');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Validation Error', 'Date is required');
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Survey</Text>
        <Text style={styles.headerSubtitle}>Add new survey details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Site Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter site name"
            placeholderTextColor="#94a3b8"
            value={siteName}
            onChangeText={setSiteName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Name <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter client name"
            placeholderTextColor="#94a3b8"
            value={clientName}
            onChangeText={setClientName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter survey description"
            placeholderTextColor="#94a3b8"
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date (YYYY-MM-DD) <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2026-07-18"
            placeholderTextColor="#94a3b8"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority <Text style={styles.required}>*</Text></Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <Pressable 
                key={p} 
                style={[
                  styles.priorityButton, 
                  priority === p && styles.priorityActive
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p && styles.priorityTextActive
                ]}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Survey</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    height: 100,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  priorityActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  priorityText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
