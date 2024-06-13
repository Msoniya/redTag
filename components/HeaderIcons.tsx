import React from 'react';
import { View, TouchableOpacity, Text, ColorSchemeName } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { HeaderIconsProps } from '@/src/interfaces/CommonInterfaces';


const HeaderIcons: React.FC<HeaderIconsProps> = ({ 
  colorScheme, 
  cartCount, 
  animatedStyle, 
  toggleLanguage, 
  isRTL, 
  styles 
}) => {
  const renderLanguageToggle = () => (
    <TouchableOpacity onPress={toggleLanguage} style={styles.iconsSpace}>
      <Text style={styles.langToolbarText}>{isRTL ? 'EN' : 'AR'}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.headerIcon}>
      {isRTL && renderLanguageToggle()}
      <TouchableOpacity onPress={() => {}} style={styles.iconsSpace}>
        <Ionicons name="bag-outline" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
        {cartCount > 0 && (
          <Animated.View style={[styles.badge, animatedStyle]}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
      {!isRTL && renderLanguageToggle()}
    </View>
  );
};

export default HeaderIcons;
