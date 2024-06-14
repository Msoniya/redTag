import GlobalStyle from '@/constants/GlobalStyle';
import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import useDynamicStyles from '@/constants/GlobalStyle';
import { useLanguage } from '@/context/LanguageContext';
import { SliderImageProps } from '@/src/interfaces/CommonInterfaces';


const SliderImage: React.FC<SliderImageProps> = ({ images }) => {
  const { isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const styles = useDynamicStyles(isRTL);

  const handlePress = () => {
    if (currentIndex < images.length) {
      selectImage(currentIndex + 1)
    } else {
      selectImage(0);
    }
  }

  const selectImage = (index: number) => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <View style={styles.sliderContainer}>
      <TouchableHighlight
        onPress={handlePress}
        style={styles.touhableView}>
        <Image
          source={{ uri: images[currentIndex].url }}
          style={styles.image}
        />
      </TouchableHighlight>
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
