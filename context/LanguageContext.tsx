import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import { getLocalLanguage, getLocalRTL, setLocalLanguage, setLocalRTL } from '@/constants/LocalStorage';
import { LanguageContextType } from '@/src/interfaces/CommonInterfaces';



const defaultValue: LanguageContextType = {
  language: 'en',
  toggleLanguage: () => {},
  isRTL: false
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export const useLanguage = () => {
  return useContext(LanguageContext);
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [isRTL, setIsRTL] = useState<boolean>(false);

  useEffect(() => {
    const fetchLanguage = async () => {
      const storedLanguage = await getLocalLanguage();
      const storedIsRTL = await getLocalRTL();
      console.log('storedLanguage', storedLanguage);
      console.log('ISRTL ', isRTL);
      console.log('storedIsRTL ', storedIsRTL);
      if (storedLanguage) {
       await setLanguage(storedLanguage);
       await setIsRTL(storedIsRTL);
        I18nManager.forceRTL(storedLanguage === 'ar');
      }
    };
    fetchLanguage();
  }, []);

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    const isRTL = newLanguage === 'ar';
    try {
      await setLocalLanguage(newLanguage);
      await setLocalRTL(isRTL);
      setLanguage(newLanguage);
      setIsRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      // Updates.reloadAsync();
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  useEffect(() => {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
