import React from 'react';
import { Text, View, ScrollView, Pressable, StatusBar, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dashboard() {
  const insets = useSafeAreaInsets();

  const ActionCard = ({ icon, title, color, bgColor }) => (
    <Pressable style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}>
      <View style={[styles.actionIconContainer, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text style={styles.actionCardTitle}>{title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top }]}>
        <View>
          <Text style={styles.headerGreeting}>Hello, Abdul 👋</Text>
          <Text style={styles.headerSubtitle}>Smart Field Survey</Text>
        </View>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>AH</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.idCardContainer}>
          <View style={styles.idCardHeader}>
            <View>
              <Text style={styles.idCardName}>Abdul Haque</Text>
              <Text style={styles.idCardId}>STD-2026</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          
          <View style={styles.idCardDivider} />
          
          <View style={styles.idCardDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="school" size={18} color="#93C5FD" />
              <Text style={styles.detailText}>React Native Assignment</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="card" size={18} color="#93C5FD" />
              <Text style={styles.detailText}>SUK250054CE012</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="today" size={22} color="#3B82F6" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Today</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="checkmark-done-circle" size={22} color="#10B981" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Surveys</Text>
              <Text style={styles.statValue}>48</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <ActionCard icon="add" title="New Survey" color="#3B82F6" bgColor="#EFF6FF" />
          <ActionCard icon="time" title="History" color="#8B5CF6" bgColor="#F5F3FF" />
          <ActionCard icon="location" title="Locations" color="#10B981" bgColor="#F0FDF4" />
          <ActionCard icon="people" title="Contacts" color="#F59E0B" bgColor="#FFFBEB" />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentActivityContainer}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="business" size={20} color="#64748B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>City Mall Inspection</Text>
              <Text style={styles.activityTime}>Today, 10:30 AM</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>
          
          <View style={[styles.activityItem, styles.activityItemNoBorder]}>
            <View style={styles.activityIcon}>
              <Ionicons name="leaf" size={20} color="#64748B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Green Park Survey</Text>
              <Text style={styles.activityTime}>Yesterday, 02:15 PM</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  headerGreeting: {
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
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  idCardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  idCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  idCardName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  idCardId: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    letterSpacing: 1,
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  idCardDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 18,
  },
  idCardDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 30,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  actionCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  recentActivityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityItemNoBorder: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  }
});