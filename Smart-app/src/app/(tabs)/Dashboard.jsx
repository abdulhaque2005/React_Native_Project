
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Welcome Back!</Text>
          <Text style={styles.headerSubtitle}>Smart Field Survey</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>AH</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Student Details</Text>
        <View style={styles.studentCard}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>Abdul Haque</Text>
            <Text style={styles.studentDetail}>ID: STD-2026</Text>
            <Text style={styles.studentDetail}>Course: React Native Assignment</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={24} color="#0066ff" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Today's Surveys</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Total Completed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="add" size={24} color="#0284c7" />
            </View>
            <Text style={styles.actionText}>New Survey</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="time" size={24} color="#9333ea" />
            </View>
            <Text style={styles.actionText}>History</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="location" size={24} color="#16a34a" />
            </View>
            <Text style={styles.actionText}>Locations</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#ffedd5' }]}>
              <Ionicons name="people" size={24} color="#ea580c" />
            </View>
            <Text style={styles.actionText}>Contacts</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Recent Surveys</Text>
        <View style={styles.recentList}>
          <View style={styles.recentItem}>
            <View style={styles.recentIcon}>
              <Ionicons name="business" size={20} color="#64748b" />
            </View>
            <View style={styles.recentDetails}>
              <Text style={styles.recentTitle}>City Mall Inspection</Text>
              <Text style={styles.recentDate}>Today, 10:30 AM</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: '#fee2e2' }]}>
              <Text style={[styles.priorityText, { color: '#ef4444' }]}>High</Text>
            </View>
          </View>

          <View style={[styles.recentItem, { borderBottomWidth: 0 }]}>
            <View style={styles.recentIcon}>
              <Ionicons name="business" size={20} color="#64748b" />
            </View>
            <View style={styles.recentDetails}>
              <Text style={styles.recentTitle}>Green Park Survey</Text>
              <Text style={styles.recentDate}>Yesterday, 02:15 PM</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: '#fef3c7' }]}>
              <Text style={[styles.priorityText, { color: '#f59e0b' }]}>Medium</Text>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  studentCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  studentDetail: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  recentList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentDetails: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 13,
    color: '#64748b',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});