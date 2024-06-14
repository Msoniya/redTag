import { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Animated, useColorScheme } from "react-native";
import { Product } from '@/interfaces/types';
import axios from "axios";
import { BASE_URL } from "@/src/api/API";
import { Ionicons } from "@expo/vector-icons";
import SliderImage from "@/components/SliderImage";
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from "@/context/CartContext";
import useDynamicStyles from '@/constants/GlobalStyle';

const numColumns = 2;
const initialLoadCount = 8;
const loadMoreCount = 4;

const ProductScreen = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [mainLoading, setMainLoading] = useState<boolean>(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language, isRTL } = useLanguage();
  const { handleCartClick, handleRemoveCartClick, localProductList, handleFavoriteClick, handleRemoveFavoriteClick } = useCart();
  const styles = useDynamicStyles(isRTL);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchData();
  }, [language]);

  useEffect(() => {
    syncProductStates();
  }, [localProductList, productList]); 

  const fetchData = async () => {
    try {
      setMainLoading(true);
      const response = await axios.get(BASE_URL + language);
      if (response.status === 200) {
        const productData = response.data?.data?.products;
        const updatedProductList: Product[] = productData.map((product: any, index: number) => {
          const imageArray = Object.keys(product.images).map(key => ({ id: key, url: product.images[key] }));
          return {
            ...product,
            images: imageArray,
            favorited: localProductList.some((item) => item.localID == index && item.favorited),
            addCart: localProductList.some((item) => item.localID == index && item.addCart),
            localID: index,
          };
        });
        setProductList(updatedProductList);
        setDisplayedProducts(updatedProductList.slice(0, initialLoadCount));
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setMainLoading(false);
    }
  };

  const syncProductStates = () => {
    const updatedProductList = productList.map(product => {
      const localProduct = localProductList.find(item => item.localID === product.localID);
      if (localProduct) {
        return {
          ...product,
          favorited: localProduct.favorited,
          addCart: localProduct.addCart,
        };
      }
      return product;
    });

    if (JSON.stringify(productList) !== JSON.stringify(updatedProductList)) {
      setProductList(updatedProductList);
    }

    const updatedDisplayedProducts = displayedProducts.map(product => {
      const localProduct = localProductList.find(item => item.localID === product.localID);
      if (localProduct) {
        return {
          ...product,
          favorited: localProduct.favorited,
          addCart: localProduct.addCart,
        };
      }
      return product;
    });
    if (JSON.stringify(displayedProducts) !== JSON.stringify(updatedDisplayedProducts)) {
      setDisplayedProducts(updatedDisplayedProducts);
    }
  };

  const loadMoreData = () => {
    const currentLength = displayedProducts.length;
    const endIndex = currentLength + loadMoreCount;
    if (endIndex <= productList.length) {
      const nextChunk = productList.slice(currentLength, endIndex);
      setIsLoading(true);
      setTimeout(() => {
        setDisplayedProducts(prevProducts => [...prevProducts, ...nextChunk]);
        setIsLoading(false);
      }, 1500);
    }
  };
  const heartAnimations = useRef(new Map()).current;
  const toggleFavorite = (productId: number) => {
    const updatedDisplayedProducts = displayedProducts.map(product => {
      if (product.localID === productId) {
        const updatedProduct = { ...product, favorited: !product.favorited };
        if (updatedProduct.favorited) {
          handleFavoriteClick(updatedProduct);
        } else {
          handleRemoveFavoriteClick(updatedProduct);
        }
        const animationValue = heartAnimations.get(productId);
        if (animationValue) {
          Animated.sequence([
            Animated.timing(animationValue, { toValue: 1.5, duration: 200, useNativeDriver: true }),
            Animated.spring(animationValue, { toValue: 1, useNativeDriver: true }),
          ]).start();
        }
        return updatedProduct;
      }
      return product;
    });
    setDisplayedProducts(updatedDisplayedProducts);
  };

  const toggleAddCart = (productId: number) => {
    const updatedDisplayedProducts = displayedProducts.map(product => {
      if (product.localID === productId) {
        const updatedProduct = { ...product, addCart: !product.addCart };
        if (updatedProduct.addCart) {
          handleCartClick(updatedProduct);
        } else {
          handleRemoveCartClick(updatedProduct);
        }
        return updatedProduct;
      }
      return product;
    });
    setDisplayedProducts(updatedDisplayedProducts);
  };
  
  const renderItem = ({ item, index }: { item: Product, index: number }) => {
    const { localID, favorited, addCart, images, tags, title, currency, price_min, compare_at_price_min, 'offer-message': offerMessage } = item;
    const offerText = offerMessage ? offerMessage.substring(6, offerMessage.indexOf(',')).trim() : '';
    if (!heartAnimations.has(localID)) {
      heartAnimations.set(localID, new Animated.Value(1));
    }
    return (
      <View style={styles.card}>
        <View>
          <TouchableOpacity onPress={() => toggleFavorite(localID)}
            style={styles.iconContainer}>
              <Animated.View style={{ transform: [{ scale: heartAnimations.get(localID) }] }}>
              <Ionicons name={favorited ? "heart" : "heart-outline"} size={24} color={'red'}
              style={styles.icon} />
              </Animated.View>
          </TouchableOpacity>
          <SliderImage images={images} />
          <Text style={styles.tagContainer}>
            {tags}
          </Text>
          <TouchableOpacity onPress={() => toggleAddCart(localID)}
            style={styles.cartContainer}>
            <Ionicons name={addCart ? "bag-add" : "bag-add-outline"} size={24} color={addCart ? '#FFA500' : colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.currencyContainer}>
          <Text style={styles.currentPrice}>
            {currency} {price_min}{' '}
            <Text style={styles.minPrice}>{compare_at_price_min}</Text>
          </Text>
          <Text style={styles.offerContainer}>{offerText}</Text>
        </View>
      </View>
    )
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  };

  const handleEndReached = () => {
    if (!isLoading) {
      loadMoreData();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {mainLoading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="small" color="red" />
        </View>
      ) : (
        <FlatList
          data={displayedProducts}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            const uniqueKey = `${index}-${new Date().getTime()}`;
            return uniqueKey;
          }}
          numColumns={numColumns}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  )
}

export default ProductScreen;