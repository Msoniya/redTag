import { getLocalCartCount, setLocalCartCount } from '@/constants/LocalStorage';
import { ANGLE, TIME, EASING, CART_COUNT_KEY } from '@/src/api/API';
import { CartContextType } from '@/src/interfaces/CommonInterfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Animated, { useSharedValue, withTiming, withRepeat, Easing, withSequence, useAnimatedStyle, AnimateStyle } from 'react-native-reanimated';

const defaultValue: CartContextType = {
  cartCount: 0,
  handleCartClick: () => {},
  handleRemoveCartClick: () => {},
  bounceAnim: { value: 0 } as Animated.SharedValue<number>,
  animatedStyle: {},
};

const CartContext = createContext<CartContextType>(defaultValue);

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartClickCount, setCartClickCount] = useState<number>(0);
  const [removeCartClickCount, setRemoveCartClickCount] = useState<number>(0);
  const bounceAnim = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${bounceAnim.value}deg` }],
  }));

  useEffect(() => {
    bounceAnim.value = withTiming(1, { duration: 100, easing: Easing.linear });
  },[]);
  
  useEffect(() => {
    const fetchCartCount = async () => {
      const storedCartCount = await getLocalCartCount();
      console.log('storedCartCount', storedCartCount);
      if (storedCartCount) {
       await setCartCount(storedCartCount);
      }
    };
    fetchCartCount();
  }, []);

  const handleCartClick = async() => {
    try{
    setCartCount(cartCount + 1);
    await setLocalCartCount(cartCount + 1);
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
  } catch(error) {
    console.log('Handle Cart Click : ', error )
  }
  };

  const handleRemoveCartClick = async() => {
    try {
    setCartCount(cartCount > 0 ? cartCount - 1 : 0);
    await setLocalCartCount(cartCount > 0 ? cartCount - 1 : 0);
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
  } catch(error) {
    console.log('handleRemoveCartClick error : ', error);
  }
  };

  return (
    <CartContext.Provider value={{ cartCount, handleCartClick, handleRemoveCartClick,bounceAnim, animatedStyle }}>
      {children}
    </CartContext.Provider>
  );
};
