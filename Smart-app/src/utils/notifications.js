import { Platform, Alert } from 'react-native';

// Expo Go (SDK 53+) no longer supports expo-notifications on Android and crashes on import.
// For the real release (Development Build/EAS), you will re-enable expo-notifications here.
// For now, this acts as a placeholder so the app runs smoothly in Expo Go.

export async function requestNotificationPermissions() {
  console.log("Mocking notification permissions for Expo Go.");
  return true;
}

export async function scheduleLocalNotification(title, body) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n${body}`);
    return;
  }

  // Fallback to standard Alert for Expo Go testing
  Alert.alert(title, body);
}

