import { CART_COUNT_KEY, CART_ITEMS_KEY, FAVORITE_ITEM_KEY, IS_RTL_KEY, LANG_STORAGE_KEY } from '@/src/api/API';
import { Product } from '@/src/interfaces/types';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const setLocalLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANG_STORAGE_KEY, language);
  } catch (error) {
    console.error('Error setting language :', error);
  }
};

export const getLocalLanguage = async (): Promise<string | null> => {
  try {
    const language = await AsyncStorage.getItem(LANG_STORAGE_KEY);
    return language;
  } catch (error) {
    console.error('Error getting language :', error);
    return null;
  }
};

export const setLocalRTL = async (isRTL: boolean) => {
  try {
    await AsyncStorage.setItem(IS_RTL_KEY, JSON.stringify(isRTL));
  } catch (error) {
    console.error('Error setting isRTL :', error);
  }
};

export const getLocalRTL = async (): Promise<boolean | false> => {
  try {
    const isRTLString = await AsyncStorage.getItem(IS_RTL_KEY);
    if (isRTLString === null) {
      return false;
    }
    const isRTL = JSON.parse(isRTLString);
    return isRTL;
  } catch (error) {
    console.error('Error getting isRTL :', error);
    return false;
  }
};

export const setLocalCartCount = async (count: number) => {
  try {
    await AsyncStorage.setItem(CART_COUNT_KEY, JSON.stringify(count));
  } catch (error) {
    console.error('Error setting cart count :', error);
  }
};

export const getLocalCartCount = async (): Promise<number | 0> => {
  try {
    const count = await AsyncStorage.getItem(CART_COUNT_KEY);
    if (count === null) {
      return 0;
    }
    const cartCount = JSON.parse(count);
    return cartCount;
  } catch (error) {
    console.error('Error getting cart count :', error);
    return 0;
  }
};

export const setLocalCartItem = async (items: Product[]) => {
  try {
    await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error setting cart Item :', error);
  }
};

export const getLocalCartItem = async (): Promise<Product[] | null> => {
  try {
    const cartItemStr = await AsyncStorage.getItem(CART_ITEMS_KEY);
    if (cartItemStr === null) {
      return null;
    }
    const cartItem = JSON.parse(cartItemStr);
    return cartItem;
  } catch (error) {
    console.error('Error getting Item :', error);
    return null;
  }
};

export const setLocalFavorite = async (items: Product[]) => {
  try {
    await AsyncStorage.setItem(FAVORITE_ITEM_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error setting Favorite Item :', error);
  }
};

export const getLocalFavorite = async (): Promise<Product[] | null> => {
  try {
    const cartItemStr = await AsyncStorage.getItem(FAVORITE_ITEM_KEY);
    if (cartItemStr === null) {
      return null;
    }
    const cartItem = JSON.parse(cartItemStr);
    return cartItem;
  } catch (error) {
    console.error('Error getting Item :', error);
    return null;
  }
};
