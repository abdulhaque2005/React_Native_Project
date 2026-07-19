import React, { useState, useCallback } from 'react';
import { Text, View, ScrollView, Pressable, StatusBar, Platform, StyleSheet, RefreshControl, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from '@clerk/clerk-expo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - CARD_GAP) / 2; // 24px padding each side

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  
  // Convex query automatically updates when data changes, so no manual loading is required
  const statsData = useQuery(api.surveys.getSurveyStats, user ? { userId: user.id } : "skip");
  
  const MOCK_SURVEYS = [
    { _id: '1', siteName: 'Downtown Tower', client: 'Acme Corp', priority: 'High', date: new Date().toISOString().split('T')[0], _creationTime: Date.now() },
    { _id: '2', siteName: 'Riverside Mall', client: 'Retail Group', priority: 'Medium', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], _creationTime: Date.now() - 86400000 },
    { _id: '3', siteName: 'Tech Park', client: 'IT Solutions', priority: 'Low', date: '2023-10-15', _creationTime: Date.now() - 172800000 },
  ];

  const stats = statsData && statsData.total > 0 ? statsData : { 
    total: MOCK_SURVEYS.length, 
    today: 1, 
    recent: MOCK_SURVEYS 
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Since Convex is reactive, pull-to-refresh can just act as a UI feedback
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' };
      case 'Medium': return { bg: '#FFFBEB', text: '#D97706', dot: '#F59E0B' };
      case 'Low': return { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' };
      default: return { bg: '#F1F5F9', text: '#64748B', dot: '#94A3B8' };
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    const diff = Math.floor((new Date(today) - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return dateStr;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={['#60A5FA']}
            tintColor="#60A5FA"
            progressBackgroundColor="#1E293B"
          />
        }
      >
        {/* Premium Gradient Header */}
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#0F172A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: Platform.OS === 'android' ? insets.top + 16 : insets.top + 10 }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerGreeting}>Hello, {user?.firstName || 'User'}</Text>
              <Text style={styles.headerSubtitle}>Welcome back to your workspace</Text>
            </View>
            <Pressable style={styles.profileAvatar}>
              <LinearGradient
                colors={['#3B82F6', '#6366F1']}
                style={styles.avatarGradient}
              >
                <Text style={styles.profileInitials}>{user?.firstName?.[0]?.toUpperCase() || 'U'}{user?.lastName?.[0]?.toUpperCase() || ''}</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* ID Card inside header */}
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.idCard}>
            <View style={styles.idCardLeft}>
              <View style={styles.idBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                <Text style={styles.idBadgeText}>Verified</Text>
              </View>
              <Text style={styles.idName}>{user?.fullName || user?.firstName || 'User'}</Text>
              <Text style={styles.idCode}>SUK250054CE012</Text>
            </View>
            <View style={styles.idCardRight}>
              <Text style={styles.idLabel}>Student ID</Text>
              <Text style={styles.idValue}>STD-2026</Text>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.statsContainer}>
          <Pressable style={styles.statCard}>
            <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.statGradient}>
              <Ionicons name="today" size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{stats.today}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable style={styles.statCard}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.statGradient}>
              <Ionicons name="checkmark-done-circle" size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.statCard} onPress={() => router.push('/History')}>
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.statGradient}>
              <Ionicons name="trending-up" size={24} color="#FFFFFF" />
              <Text style={styles.statNumber}>{stats.recent.length}</Text>
              <Text style={styles.statLabel}>Recent</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionGrid}>
            <View style={styles.actionGridRow}>
              <Pressable 
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
                onPress={() => router.push('/CreateSurvey')}
              >
                <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.actionIconWrap}>
                  <Ionicons name="add-circle" size={28} color="#3B82F6" />
                </LinearGradient>
                <Text style={styles.actionTitle}>New Survey</Text>
                <Text style={styles.actionDesc}>Create inspection</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
                onPress={() => router.push('/History')}
              >
                <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.actionIconWrap}>
                  <Ionicons name="time" size={28} color="#8B5CF6" />
                </LinearGradient>
                <Text style={styles.actionTitle}>History</Text>
                <Text style={styles.actionDesc}>Past surveys</Text>
              </Pressable>
            </View>

            <View style={styles.actionGridRow}>
              <Pressable 
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
                onPress={() => router.push('/Location')}
              >
                <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.actionIconWrap}>
                  <Ionicons name="navigate" size={28} color="#10B981" />
                </LinearGradient>
                <Text style={styles.actionTitle}>Location</Text>
                <Text style={styles.actionDesc}>GPS tracking</Text>
              </Pressable>

              <Pressable 
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
                onPress={() => router.push('/Contacts')}
              >
                <LinearGradient colors={['#FFFBEB', '#FEF3C7']} style={styles.actionIconWrap}>
                  <Ionicons name="people" size={28} color="#F59E0B" />
                </LinearGradient>
                <Text style={styles.actionTitle}>Contacts</Text>
                <Text style={styles.actionDesc}>Team members</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {stats.recent.length > 0 && (
              <Pressable onPress={() => router.push('/History')}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            )}
          </View>
          
          <View style={styles.recentContainer}>
            {stats.recent.length > 0 ? (
              stats.recent.map((survey, index) => {
                const priorityStyle = getPriorityColor(survey.priority);
                return (
                  <Animated.View 
                    key={survey._id || survey.id || `survey-${index}`} 
                    entering={FadeInUp.duration(400).delay(450 + index * 80)}
                  >
                    <Pressable 
                      style={({ pressed }) => [
                        styles.activityItem, 
                        pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] }
                      ]}
                    >
                      <View style={styles.activityLeft}>
                        {survey.photo ? (
                          <Image source={{ uri: survey.photo }} style={styles.activityThumb} />
                        ) : (
                          <View style={[styles.activityIconWrap, { backgroundColor: priorityStyle.bg }]}>
                            <Ionicons name="business" size={20} color={priorityStyle.text} />
                          </View>
                        )}
                      </View>
                      <View style={styles.activityCenter}>
                        <Text style={styles.activityTitle} numberOfLines={1}>{survey.siteName}</Text>
                        <View style={styles.activityMeta}>
                          <Text style={styles.activityClient} numberOfLines={1}>{survey.client}</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.activityDate}>{getTimeAgo(survey.date)}</Text>
                        </View>
                      </View>
                      <View style={[styles.priorityPill, { backgroundColor: priorityStyle.bg }]}>
                        <View style={[styles.priorityDot, { backgroundColor: priorityStyle.dot }]} />
                        <Text style={[styles.priorityText, { color: priorityStyle.text }]}>{survey.priority}</Text>
                      </View>
                    </Pressable>
                  </Animated.View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="document-text-outline" size={40} color="#CBD5E1" />
                </View>
                <Text style={styles.emptyTitle}>No surveys yet</Text>
                <Text style={styles.emptyDesc}>Create your first field survey to get started</Text>
                <Pressable 
                  style={({ pressed }) => [styles.emptyButton, pressed && { opacity: 0.8 }]}
                  onPress={() => router.push('/CreateSurvey')}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.emptyButtonText}>Create Survey</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  

  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {},
  headerGreeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  

  idCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  idCardLeft: {},
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  idBadgeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  idName: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  idCode: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  idCardRight: {
    alignItems: 'flex-end',
  },
  idLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  idValue: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },


  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: -1,
    marginBottom: 28,
    paddingTop: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },


  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  actionGrid: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  actionGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  actionCardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },


  recentContainer: {
    marginHorizontal: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 12,
  },
  activityLeft: {
    marginRight: 14,
  },
  activityThumb: {
    width: 46,
    height: 46,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  activityIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCenter: {
    flex: 1,
    marginRight: 10,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityClient: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    maxWidth: 100,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 6,
  },
  activityDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },


  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});