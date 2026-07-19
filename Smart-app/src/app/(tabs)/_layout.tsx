import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="CreateSurvey"
        options={{
          title: "New Survey",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.middleButton, focused && styles.middleButtonActive]}>
              <Ionicons name={focused ? "add" : "add-outline"} size={32} color={focused ? "#FFFFFF" : "#2563EB"} />
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={24} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    height: Platform.OS === 'ios' ? 95 : 75,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: 4,
  },
  tabBarIcon: {
    marginTop: -2,
  },
  middleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? -15 : -5,
  },
  middleButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }
});