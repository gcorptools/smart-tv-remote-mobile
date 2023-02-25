import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeKey = async (key: string, value: string) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error while saving data into storage', error);
  }
};

export const readStoredKey = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error while retrieving data from storage', error);
  }
};
