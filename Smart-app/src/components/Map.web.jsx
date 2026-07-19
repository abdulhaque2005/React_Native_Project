import React from 'react';
import { View, Text } from 'react-native';

export const Marker = () => null;

export default function MapView({ style }) {
  return (
    <View style={[style, { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: '#64748B', fontWeight: 'bold' }}>Map is not supported on Web</Text>
      <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>Please use the mobile app (Android/iOS) to view maps.</Text>
    </View>
  );
}
