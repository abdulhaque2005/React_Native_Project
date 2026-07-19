import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, Pressable, Alert, Platform, RefreshControl } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const loadContacts = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setErrorMsg(null);
    
    // expo-contacts is not supported on web, so we provide mock data for web demo
    if (Platform.OS === 'web') {
      setTimeout(() => {
        setContacts([
          { id: '1', name: 'John Doe', phoneNumbers: [{ number: '+1 234 567 8900' }] },
          { id: '2', name: 'Jane Smith', phoneNumbers: [{ number: '+1 987 654 3210' }] },
          { id: '3', name: 'Web Demo Contact', phoneNumbers: [{ number: '+91 99999 88888' }] },
          { id: '4', name: 'Alice Johnson', phoneNumbers: [{ number: '+44 7700 900077' }] },
        ]);
        setLoading(false);
        setRefreshing(false);
      }, 500);
      return;
    }

    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access contacts was denied');
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      
      if (data.length > 0) {
        // Sort contacts alphabetically
        const sortedData = data.sort((a, b) => {
          const nameA = a.name ? a.name.toLowerCase() : '';
          const nameB = b.name ? b.name.toLowerCase() : '';
          return nameA.localeCompare(nameB);
        });
        setContacts(sortedData);
      }
    } catch (error) {
      setErrorMsg('Failed to fetch contacts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadContacts(true);
  };

  const copyNumber = async (number, name) => {
    if (!number) return;
    await Clipboard.setStringAsync(number);
    if (Platform.OS === 'web') {
      window.alert(`Success: Copied ${name}'s number (${number})!`);
    } else {
      Alert.alert('Success', `Copied ${name}'s number (${number})!`);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const nameMatch = contact.name ? contact.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const phoneMatch = contact.phoneNumbers && contact.phoneNumbers.some(p => p.number && p.number.includes(searchQuery));
    return nameMatch || phoneMatch;
  });

  const renderContact = ({ item, index }) => {
    const name = item.name || 'Unknown Contact';
    const initial = name.charAt(0).toUpperCase();
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : null;

    return (
      <Animated.View entering={FadeInUp.duration(400).delay(Math.min(index * 50, 500))} style={styles.contactCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>{name}</Text>
          {phoneNumber ? (
            <Text style={styles.contactPhone}>{phoneNumber}</Text>
          ) : (
            <Text style={styles.noNumber}>No Number</Text>
          )}
        </View>
        
        <Pressable 
          style={({ pressed }) => [
            styles.copyButton, 
            !phoneNumber && styles.copyButtonDisabled,
            pressed && phoneNumber && styles.pressed
          ]} 
          onPress={() => copyNumber(phoneNumber, name)}
          disabled={!phoneNumber}
        >
          <Ionicons name="copy-outline" size={18} color={phoneNumber ? "#2563EB" : "#94A3B8"} />
        </Pressable>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.statusText}>Loading contacts...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Pressable style={styles.retryButton} onPress={() => loadContacts()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Contacts</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{filteredContacts.length}</Text>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or number..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </Animated.View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#2563EB']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#CBD5E1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No Contacts Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  statusText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  counterBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  counterText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  clearIcon: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  noNumber: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  copyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
  }
});
