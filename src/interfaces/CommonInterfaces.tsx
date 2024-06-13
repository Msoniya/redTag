import { ColorSchemeName } from "react-native";
import Animated, { AnimateStyle } from "react-native-reanimated";
import { Product } from "./types";

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
  handleCartClick: (item : any) => void;
  handleRemoveCartClick: (item : any) => void;
  handleFavoriteClick: (item: Product) => void,
  handleRemoveFavoriteClick: (item: Product) => void,
  bounceAnim: Animated.SharedValue<number>;
  animatedStyle: AnimateStyle<{}>; 
  localProductList : Product[]

}

export interface LanguageContextType {
  language: string;
  toggleLanguage: () => void;
  isRTL : boolean;
}
