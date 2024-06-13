import { ColorSchemeName } from "react-native";
import Animated, { AnimateStyle } from "react-native-reanimated";

export interface ImageItem {
  id: string;
  url: string;
}
export interface SliderImageProps {
  images: ImageItem[];
}

export interface HeaderIconsProps {
  colorScheme: ColorSchemeName;
  cartCount: number;
  animatedStyle: any;
  toggleLanguage: () => void;
  isRTL: boolean;
  styles: any;
}

export interface InnerLayoutProps {
  colorScheme: ColorSchemeName;
}

export interface CartContextType {
  cartCount: number;
  handleCartClick: () => void;
  handleRemoveCartClick: () => void;
  bounceAnim: Animated.SharedValue<number>;
  animatedStyle: AnimateStyle<{}>; 

}

export interface LanguageContextType {
  language: string;
  toggleLanguage: () => void;
  isRTL : boolean;
}
