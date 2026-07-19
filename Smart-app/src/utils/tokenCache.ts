import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo';

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        if (Platform.OS === 'web') {
          return null;
        }
        const item = await SecureStore.getItemAsync(key);
        return item;
      } catch (e) {
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        if (Platform.OS === 'web') {
          return;
        }
        await SecureStore.setItemAsync(key, token);
      } catch (e) {
        console.error('Failed to save token', e);
      }
    },
  };
};

export const tokenCache = createTokenCache();
