import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, FlatList, Image, ActivityIndicator, TouchableOpacity, I18nManager } from "react-native";
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

function ProductScreen() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [mainLoading, setMainLoading] = useState<boolean>(false);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language, isRTL } = useLanguage();
  const { handleCartClick, handleRemoveCartClick } = useCart();
  const styles = useDynamicStyles(isRTL);

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    try {
      setMainLoading(true);
      console.log('URL:', BASE_URL + language);
      const response = await axios.get(BASE_URL + language);
      if (response.status === 200) {
        const productData = response.data?.data?.products;
        const updatedProductList: Product[] = productData.map((product: any, index: number) => {
          const imageArray = Object.keys(product.images).map(key => ({ id: key, url: product.images[key] }));
          return {
            ...product,
            images: imageArray,
            favorited: false,
            localID: index,
            addCart: false,
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

  const loadMoreData = () => {
    const currentLength = displayedProducts.length;
    console.log("CurrentLength", currentLength);
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

  const toggleFavorite = (productId: string) => {
    setDisplayedProducts(prevProducts =>
      prevProducts.map(product =>
        product.localID === productId ? { ...product, favorited: !product.favorited } : product
      )
    );
  };

  const toggleAddCart = (productId: string) => {
    setDisplayedProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.localID === productId) {
          const updatedProduct = { ...product, addCart: !product.addCart };
          if (updatedProduct.addCart) {
            handleCartClick();
          } else {
            handleRemoveCartClick();
          }
          return updatedProduct;
        }
        return product;
      })
    );
  };
  

  const renderItem = ({ item, index }: { item: Product, index: number }) => {
    const { localID, favorited, addCart, images, tags, title, currency, price_min, compare_at_price_min, 'offer-message': offerMessage } = item;
    const offerText = offerMessage ? offerMessage.substring(6, offerMessage.indexOf(',')).trim() : '';
    return (
      <View style={styles.card}>
        <View>
          <TouchableOpacity onPress={() => toggleFavorite(localID)}
            style={styles.iconContainer}>
            <Ionicons name={favorited ? "heart" : "heart-outline"} size={24} color={'red'}
              style={styles.icon} />
          </TouchableOpacity>
          <SliderImage images={images} />
          <Text style={styles.tagContainer}>
            {tags}
          </Text>
          <TouchableOpacity onPress={() => toggleAddCart(localID)}
            style={styles.cartContainer}>
            <Ionicons name={addCart ? "bag-add" : "bag-add-outline"} size={24} color={addCart ? '#FFA500' : 'black'} />
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