import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm("Are you sure you want to log out of your account?");
      if (confirmLogout) {
        await signOut();
        router.replace('/Login');
      }
    } else {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out of your account?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log Out", style: "destructive", onPress: async () => {
            await signOut();
            router.replace('/Login');
          }}
        ]
      );
    }
  };

  const SectionTitle = ({ title }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const SettingItem = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullName || user?.firstName || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.emailAddresses?.[0]?.emailAddress || ''}</Text>
          </View>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>{user?.firstName?.[0]?.toUpperCase() || 'U'}{user?.lastName?.[0]?.toUpperCase() || ''}</Text>
          </View>
        </View>

        <SectionTitle title="Account" />
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.card}>
          <SettingItem icon="person-outline" title="Edit Profile" color="#3B82F6" onPress={() => router.push('/EditProfile')} />
          <View style={styles.divider} />
          <SettingItem icon="shield-checkmark-outline" title="Security" subtitle="Password & Authentication" color="#10B981" onPress={() => router.push('/Security')} />
        </Animated.View>

        <SectionTitle title="Support" />
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.card}>
          <SettingItem icon="help-buoy-outline" title="Help Center" color="#3B82F6" onPress={() => Alert.alert('Help Center', 'Redirecting to Help Center...')} />
          <View style={styles.divider} />
          <SettingItem icon="document-text-outline" title="Terms of Service" color="#64748B" onPress={() => Alert.alert('Terms', 'Redirecting to Terms of Service...')} />
          <View style={styles.divider} />
          <SettingItem icon="shield-half-outline" title="Privacy Policy" color="#64748B" onPress={() => Alert.alert('Privacy Policy', 'Redirecting to Privacy Policy...')} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(250)}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerText}>Made with ❤️ for Field Operations</Text>
        
      </ScrollView>
    </View>
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
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingItemPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 24,
    gap: 8,
  },
  logoutButtonPressed: {
    backgroundColor: '#FEE2E2',
    transform: [{ scale: 0.98 }],
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  }
});
