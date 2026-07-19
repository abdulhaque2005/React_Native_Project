import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
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

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) return user.firstName[0].toUpperCase();
    return 'U';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header / Avatar Section */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || user?.firstName || 'User'}</Text>
          <Text style={styles.userRole}>{user?.emailAddresses?.[0]?.emailAddress || 'Field Inspector'}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active Account</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Total Surveys</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Awards</Text>
          </View>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Ionicons name="mail" size={20} color="#3B82F6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.emailAddresses?.[0]?.emailAddress || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Ionicons name="call" size={20} color="#10B981" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>+91 98765 43210</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Ionicons name="business" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>Quality Assurance</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <Pressable style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}>
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
          
          <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
        </View>

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
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  userRole: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#03543F',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutButtonPressed: {
    opacity: 0.7,
    backgroundColor: '#FEE2E2',
    transform: [{ scale: 0.98 }],
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '700',
  }
});
