import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme, } from '@/hooks/useColorScheme';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { CartProvider, useCart } from '@/context/CartContext';
import useDynamicStyles from '@/constants/GlobalStyle';
import HeaderIcons from '@/components/HeaderIcons';
import { InnerLayoutProps } from '@/src/interfaces/CommonInterfaces';


SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <CartProvider>
      <InnerLayout
          colorScheme={colorScheme}
        />
      </CartProvider>
    </LanguageProvider>
  );
}

function InnerLayout({ colorScheme }: InnerLayoutProps) {
  const { toggleLanguage, isRTL } = useLanguage();
  const {cartCount, animatedStyle} = useCart();
  const styles = useDynamicStyles(isRTL); 
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(products)/index"
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            title: isRTL? 'علامة حمراء' : 'RedTag',
            headerRight: isRTL ? undefined : () => (
              <HeaderIcons
                colorScheme={colorScheme}
                cartCount={cartCount}
                animatedStyle={animatedStyle}
                toggleLanguage={toggleLanguage}
                isRTL={isRTL}
                styles={styles}
              />
            ),
            headerLeft: isRTL ? () => (
              <HeaderIcons
                colorScheme={colorScheme}
                cartCount={cartCount}
                animatedStyle={animatedStyle}
                toggleLanguage={toggleLanguage}
                isRTL={isRTL}
                styles={styles}
              />
            ) : undefined,
          }} 
          />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
