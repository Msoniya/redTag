import { CART_COUNT_KEY, IS_RTL, LANG_STORAGE_KEY } from '@/src/api/API';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const setLocalLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANG_STORAGE_KEY, language);
  } catch (error) {
    console.error('Error setting language:', error);
  }
};

export const getLocalLanguage = async (): Promise<string | null> => {
  try {
    const language = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    return language;
  } catch (error) {
    console.error('Error getting language:', error);
    return null;
  }
};

export const setLocalRTL = async (isRTL: boolean) => {
  try {
    await AsyncStorage.setItem(IS_RTL, JSON.stringify(isRTL));
  } catch (error) {
    console.error('Error setting isRTL:', error);
  }
};

export const getLocalRTL = async (): Promise<boolean | false> => {
  try {
    const isRTLString = await AsyncStorage.getItem(IS_RTL);
    if (isRTLString === null) {
      return false;
    }
    const isRTL = JSON.parse(isRTLString);
    return isRTL;
  } catch (error) {
    console.error('Error getting isRTL:', error);
    return false;
  }
};

export const setLocalCartCount = async (count: number) => {
  try {
    await AsyncStorage.setItem(CART_COUNT_KEY, JSON.stringify(count));
  } catch (error) {
    console.error('Error setting cart count:', error);
  }
};

export const getLocalCartCount = async (): Promise<number | null> => {
  try {
    const count = await AsyncStorage.getItem(CART_COUNT_KEY);
    if (count === null) {
      return 0;
    }
    const cartCount = JSON.parse(count);
    return cartCount;
  } catch (error) {
    console.error('Error getting language:', error);
    return 0;
  }
};
