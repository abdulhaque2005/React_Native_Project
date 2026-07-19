import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={"/(tabs)" as any} />;
  }

  return <Redirect href={"/Login" as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
});
