import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert, Animated as RNAnimated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from '@clerk/clerk-expo';

export default function History() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const priorities = ['All', 'High', 'Medium', 'Low'];
  const { user } = useUser();
  
  const surveysData = useQuery(api.surveys.getSurveys, user ? { userId: user.id } : "skip");
  
  const MOCK_SURVEYS = [
    { _id: '1', siteName: 'Downtown Tower', client: 'Acme Corp', priority: 'High', date: new Date().toISOString().split('T')[0], _creationTime: Date.now() },
    { _id: '2', siteName: 'Riverside Mall', client: 'Retail Group', priority: 'Medium', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], _creationTime: Date.now() - 86400000 },
    { _id: '3', siteName: 'Tech Park', client: 'IT Solutions', priority: 'Low', date: '2023-10-15', _creationTime: Date.now() - 172800000 },
    { _id: '4', siteName: 'City Hospital', client: 'HealthCare Inc', priority: 'High', date: new Date().toISOString().split('T')[0], _creationTime: Date.now() - 3600000 },
  ];

  const surveys = surveysData && surveysData.length > 0 ? surveysData : MOCK_SURVEYS;
  const deleteSurvey = useMutation(api.surveys.deleteSurvey);

  const handleDelete = async (id) => {
    if (Platform.OS === 'web') {
      const confirmDel = window.confirm("Are you sure you want to delete this survey?");
      if (confirmDel) {
        await deleteSurvey({ id });
      }
    } else {
      Alert.alert(
        "Delete Survey",
        "Are you sure you want to delete this survey?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive", 
            onPress: async () => {
              await deleteSurvey({ id });
            } 
          }
        ]
      );
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.siteName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || survey.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#64748B';
    }
  };

  const renderRightActions = (progress, dragX, id) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Pressable onPress={() => handleDelete(id)} style={styles.deleteAction}>
        <RNAnimated.View style={[styles.deleteActionIcon, { transform: [{ scale }] }]}>
          <Ionicons name="trash" size={24} color="#FFFFFF" />
        </RNAnimated.View>
      </Pressable>
    );
  };

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 100)}>
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item._id)}
        rightThreshold={40}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.siteInfo}>
              <Text style={styles.siteName}>{item.siteName}</Text>
              <Text style={styles.clientName}>{item.client}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '15' }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority}</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Ionicons name="chevron-back" size={16} color="#CBD5E1" style={styles.swipeHintIcon} />
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Survey History</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search site name..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterContainer}>
          {priorities.map(p => (
            <Pressable 
              key={p} 
              onPress={() => setFilter(p)}
              style={[styles.filterChip, filter === p && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filter === p && styles.filterTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredSurveys}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No surveys found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  siteInfo: {
    flex: 1,
    marginRight: 12,
  },
  siteName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  swipeHintIcon: {
    opacity: 0.5,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 16,
    borderRadius: 16,
    marginLeft: 12,
  },
  deleteActionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  }
});
