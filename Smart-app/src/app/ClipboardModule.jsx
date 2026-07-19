import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from '@clerk/clerk-expo';

export default function ClipboardScreen() {
  const [pastedNotes, setPastedNotes] = useState('');
  const { user } = useUser();
  const surveys = useQuery(api.surveys.getSurveys, user ? { userId: user.id } : "skip");
  const latestSurvey = surveys?.[0] || null;

  const copyToClipboard = async (text, label) => {
    await Clipboard.setStringAsync(text);
    if (Platform.OS === 'web') {
      window.alert(`Success: ${label} copied to clipboard!`);
    } else {
      Alert.alert('Copied', `${label} has been copied to clipboard.`);
    }
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      setPastedNotes(prev => prev ? `${prev}\n${text}` : text);
    } else {
      if (Platform.OS === 'web') {
        window.alert('Clipboard is empty!');
      } else {
        Alert.alert('Empty', 'Clipboard is empty.');
      }
    }
  };

  const clearClipboard = async () => {
    await Clipboard.setStringAsync('');
    if (Platform.OS === 'web') {
      window.alert('Success: Clipboard cleared!');
    } else {
      Alert.alert('Cleared', 'Clipboard data has been cleared.');
    }
  };

  const ActionCard = ({ title, value, icon, onCopy, index }) => (
    <Animated.View entering={FadeInUp.duration(400).delay(100 + (index * 100))} style={styles.actionCard}>
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon} size={24} color="#3B82F6" />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionValue}>{value}</Text>
      </View>
      <Pressable 
        style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}
        onPress={() => onCopy(value, title)}
      >
        <Ionicons name="copy" size={20} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <Ionicons name="clipboard" size={40} color="#2563EB" />
        <Text style={styles.headerTitle}>Clipboard Manager</Text>
        <Text style={styles.headerSubtitle}>Manage your survey data efficiently</Text>
      </Animated.View>

      <Animated.Text entering={FadeInDown.duration(500).delay(100)} style={styles.sectionTitle}>Quick Copy Data</Animated.Text>
      
      {latestSurvey ? (
        <>
          <ActionCard 
            title="Survey ID" 
            value={latestSurvey._id} 
            icon="document-text" 
            onCopy={copyToClipboard}
            index={0}
          />
          <ActionCard 
            title="Client Name" 
            value={latestSurvey.client} 
            icon="person" 
            onCopy={copyToClipboard}
            index={1}
          />
          <ActionCard 
            title="Site Name" 
            value={latestSurvey.siteName} 
            icon="business" 
            onCopy={copyToClipboard}
            index={2}
          />
        </>
      ) : (
        <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
          <Text style={styles.emptyText}>No survey data available.</Text>
          <Text style={styles.emptySubText}>Create a survey first to quick copy its data.</Text>
        </Animated.View>
      )}

      <View style={styles.divider} />

      <Animated.Text entering={FadeInUp.duration(500).delay(400)} style={styles.sectionTitle}>Paste Notes</Animated.Text>
      
      <Animated.View entering={FadeInUp.duration(500).delay(500)} style={styles.notesContainer}>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Pasted content will appear here..."
          placeholderTextColor="#94A3B8"
          value={pastedNotes}
          onChangeText={setPastedNotes}
          textAlignVertical="top"
        />
        
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.pasteButton]}
            activeOpacity={0.8}
            onPress={pasteFromClipboard}
          >
            <Ionicons name="clipboard-outline" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Paste</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.copyNotesButton]}
            activeOpacity={0.8}
            onPress={async () => {
              if (!pastedNotes.trim()) {
                Alert.alert('Empty', 'Nothing to copy!');
                return;
              }
              await Clipboard.setStringAsync(pastedNotes);
              Alert.alert('Copied', 'Notes copied to clipboard!');
            }}
          >
            <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, styles.clearNotesButton]}
            activeOpacity={0.8}
            onPress={() => setPastedNotes('')}
          >
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  actionValue: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 24,
  },
  notesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  notesInput: {
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  pasteButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  copyNotesButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
  },
  clearNotesButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  systemClearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    gap: 10,
  },
  systemClearText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 15,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  }
});
