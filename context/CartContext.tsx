import { getLocalCartCount, getLocalCartItem, setLocalCartCount, setLocalCartItem } from '@/constants/LocalStorage';
import { ANGLE, TIME, EASING } from '@/src/api/API';
import { CartContextType } from '@/src/interfaces/CommonInterfaces';
import { Product } from '@/src/interfaces/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Animated, { useSharedValue, withTiming, withRepeat, Easing, withSequence, useAnimatedStyle, AnimateStyle } from 'react-native-reanimated';
import { useLanguage } from './LanguageContext';

const defaultValue: CartContextType = {
  cartCount: 0,
  handleCartClick: (item : Product) => {},
  handleRemoveCartClick: (item: Product) => {},
  handleFavoriteClick: (item: Product) => {},
  handleRemoveFavoriteClick: (item: Product) => {},
  bounceAnim: { value: 0 } as Animated.SharedValue<number>,
  animatedStyle: {},
  localProductList: []
};

const CartContext = createContext<CartContextType>(defaultValue);

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [localProductList, setLocalProductList] = useState<Product[]>([]);
  const bounceAnim = useSharedValue(0);
  const {language} = useLanguage();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${bounceAnim.value}deg` }],
  }));

  useEffect(() => {
    bounceAnim.value = withTiming(1, { duration: 100, easing: Easing.linear });
  },[]);

  useEffect(() => {
    const fetchLocalProductList = async () => {
      try {
        const storedLocalProducts = await getLocalCartItem();
        if (storedLocalProducts !== null) {
          setLocalProductList(storedLocalProducts);
          setCartCount(storedLocalProducts?.length)
        }
        console.log('local PR', storedLocalProducts);
      } catch (error) {
        console.error('Error fetching local product list from local storage:', error);
      }
    };
    fetchLocalProductList();
  }, []);
  

  const updateLocalProductList = async (updatedList: Product[]) => {
    setLocalProductList(updatedList);
    await setLocalCartItem(updatedList);
  };

  const handleCartClick = async(item: Product) => {
    try{
    bounceAnim.value = withSequence(
      withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        7,
        true
      ),
      withTiming(0, { duration: TIME / 2, easing: EASING })
    );

    const existingCartItems = await getLocalCartItem();
    let updatedCartItems: Product[] = existingCartItems ? [...existingCartItems] : [];
    updatedCartItems.push(item);
    await updateLocalProductList(updatedCartItems);
    const count = updatedCartItems.length;
    setCartCount(count); 
  } catch(error) {
    console.log('Handle Cart Click : ', error )
  }
  };

  const handleRemoveCartClick = async(item : Product) => {
    try {
    bounceAnim.value = withSequence(
      withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
      withRepeat(
        withTiming(ANGLE, {
          duration: TIME,
          easing: EASING,
        }),
        7,
        true
      ),
      withTiming(0, { duration: TIME / 2, easing: EASING })
    );
    const existingCartItems = await getLocalCartItem();
    if (existingCartItems) {
      const indexToRemove = existingCartItems.findIndex((cartItem) => cartItem.localID === item.localID);
      if (indexToRemove !== -1) {
        existingCartItems.splice(indexToRemove, 1);
        await updateLocalProductList(existingCartItems);
        setCartCount(existingCartItems.length); 
      } else {
        console.log(`Item with localID ${item.localID} not found in cart.`);
      }
    } else {
      console.log('No existing cart items found.');
    }
  } catch(error) {
    console.log('handleRemoveCartClick error : ', error);
  }
  };
  
  const handleFavoriteClick = async (item: Product) => {
    try {
      const updatedLocalProductList = localProductList.map((product) =>
        product.localID === item.localID ? { ...product, favorited: true } : product
      );
      await updateLocalProductList(updatedLocalProductList);
    } catch (error) {
      console.log('Handle Favorite Click : ', error);
    }
  };

  const handleRemoveFavoriteClick = async (item: Product) => {
    try {
      const updatedLocalProductList = localProductList.map((product) =>
        product.localID === item.localID ? { ...product, favorited: false } : product
      );
      await updateLocalProductList(updatedLocalProductList);
    } catch (error) {
      console.log('Handle Remove Favorite Click : ', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      handleCartClick, 
      handleRemoveCartClick,
      bounceAnim, 
      animatedStyle, 
      localProductList,
      handleFavoriteClick,
      handleRemoveFavoriteClick }}>
      {children}
    </CartContext.Provider>
  );
};
