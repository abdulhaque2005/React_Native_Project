import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@smart_app_auth';

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load user', e);
    return null;
  }
};

export const saveUser = async (userData) => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    return true;
  } catch (e) {
    console.error('Failed to save user', e);
    return false;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
    return true;
  } catch (e) {
    console.error('Failed to logout', e);
    return false;
  }
};
