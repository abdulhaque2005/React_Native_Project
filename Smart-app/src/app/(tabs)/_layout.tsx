
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="CreateSurvey"
        options={{
          title: "New Survey",
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}