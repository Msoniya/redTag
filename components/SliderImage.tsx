import GlobalStyle from '@/constants/GlobalStyle';
import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import useDynamicStyles from '@/constants/GlobalStyle';
import { useLanguage } from '@/context/LanguageContext';
import { SliderImageProps } from '@/src/interfaces/CommonInterfaces';


const SliderImage : React.FC<SliderImageProps> = ({ images }) => {
  const {isRTL} = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);
  const styles = useDynamicStyles(isRTL); 

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    };
  }, []);

  const startAutoplay = () => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); 
    setAutoplayInterval(interval);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  };

  const selectImage = (index: number) => {
    stopAutoplay();
    setCurrentIndex(index);
  };

  return (
    <View style={styles.sliderContainer}>
    <Image
      source={{ uri: images[currentIndex].url }}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.dotContainer}>
      {images.map((image, index) => (
        <TouchableOpacity
          key={image.id}
          style={[
            styles.dot,
            currentIndex === index ? styles.activeDot : null,
          ]}
          onPress={() => selectImage(index)}
        />
      ))}
    </View>
  </View>
  );
};

export default SliderImage;
