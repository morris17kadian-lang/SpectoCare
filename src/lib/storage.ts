import { Platform } from 'react-native';
// For native use SecureStore / AsyncStorage, for web use localStorage

const isWeb = Platform.OS === 'web';

export async function setItem(key: string, value: string) {
  if (isWeb) {
    localStorage.setItem(key, value);
    return;
  }
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  return AsyncStorage.setItem(key, value);
}

export async function getItem(key: string) {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  return AsyncStorage.getItem(key);
}

export async function removeItem(key: string) {
  if (isWeb) {
    localStorage.removeItem(key);
    return;
  }
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  return AsyncStorage.removeItem(key);
}
