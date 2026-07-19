import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from '@clerk/clerk-expo';

export default function SurveyPreview() {
  const { user } = useUser();
  const router = useRouter();
  const surveys = useQuery(api.surveys.getSurveys, user ? { userId: user.id } : "skip");
  const surveyData = surveys?.[0] || null;
  const loading = surveys === undefined;

  const handleSubmit = () => {
    Alert.alert("Success", "Survey submitted successfully!");
  };

  const handleEdit = () => {
    router.push('/CreateSurvey');
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color="#64748B" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading survey...</Text>
      </View>
    );
  }

  if (!surveyData) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="document-text-outline" size={64} color="#CBD5E1" style={{ marginBottom: 16 }} />
        <Text style={styles.emptyTitle}>No Surveys Yet</Text>
        <Text style={styles.emptySubtitle}>Create your first survey to preview it here</Text>
        <Pressable 
          style={({ pressed }) => [styles.createButton, pressed && { opacity: 0.8 }]}
          onPress={() => router.push('/CreateSurvey')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Survey</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{surveyData.siteName}</Text>
          <Text style={styles.subtitle}>ID: {surveyData._id}</Text>
        </View>
        <View style={[styles.badge, surveyData.priority === 'Low' && styles.badgeLow, surveyData.priority === 'Medium' && styles.badgeMedium]}>
          <Text style={[styles.badgeText, surveyData.priority === 'Low' && styles.badgeTextLow, surveyData.priority === 'Medium' && styles.badgeTextMedium]}>{surveyData.priority}</Text>
        </View>
      </View>

      {surveyData.photo && (
        <View style={styles.photoContainer}>
          <Image source={{ uri: surveyData.photo }} style={styles.photo} />
          <View style={styles.photoOverlay}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
            <Text style={styles.photoOverlayText}>Site Photo</Text>
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Details</Text>
        <InfoRow icon="business" label="Client Name" value={surveyData.client} />
        <View style={styles.divider} />
        <InfoRow icon="calendar" label="Date" value={surveyData.date} />
        <View style={styles.divider} />
        <InfoRow icon="document-text" label="Description" value={surveyData.description} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Survey Info</Text>
        <InfoRow icon="flag" label="Priority" value={surveyData.priority} />
      </View>

      <View style={styles.actionRow}>
        <Pressable 
          style={({ pressed }) => [styles.actionButton, styles.editButton, pressed && styles.pressed]}
          onPress={handleEdit}
        >
          <Ionicons name="pencil" size={20} color="#3B82F6" />
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [styles.actionButton, styles.submitButton, pressed && styles.pressed]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Survey</Text>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    maxWidth: 250,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 12,
  },
  photoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#E2E8F0',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoOverlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editButtonText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  badgeLow: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  badgeTextLow: {
    color: '#16A34A',
  },
  badgeMedium: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  badgeTextMedium: {
    color: '#D97706',
  },
});
