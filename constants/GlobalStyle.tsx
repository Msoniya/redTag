import { useMemo } from 'react';
import { StyleSheet, I18nManager } from 'react-native';

const useDynamicStyles = (isRTL : boolean) => {
  return useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        flexDirection: 'row',
        ...(isRTL && { flexDirection: 'row-reverse' }),
      },
      langToolbarText:{
          fontSize: 18,
          justifyContent:'center',
          alignItems:'center',
          fontWeight:'bold',
      },
      sliderContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      spinner: {
        justifyContent: 'center',
        flex: 1,
      },
      card: {
        backgroundColor: '#ffffff',
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginVertical: 8,
        marginHorizontal: 5,
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 10,
      },
      iconContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
        zIndex: 1,
        ...(isRTL && { right: 'auto', left: 5 }),
      },
      tagContainer: {
        position: 'absolute',
        bottom: 35,
        right: 0,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 11,
        padding: 3,
        borderRadius: 3,
        color: 'red',
        ...(isRTL && { right: 'auto', left: 0 }),
      },
      cartContainer: {
        position: 'absolute',
        width: 30,
        height: 30,
        bottom: 0,
        right: isRTL ? 'auto' : 5,
        left: isRTL ? 5 : 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        elevation: 10,
        ...(isRTL && { right: 'auto', left: 5 }),
      },
      icon: {
        zIndex: 1,
      },
      title: {
        fontSize: 12,
        color: '#333',
        marginVertical: 5,
        marginTop: 10,
        marginHorizontal: 5,
        textAlign: 'left',
        ...(isRTL && { textAlign: 'right' }),
      },
      slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
      image: {
        width: '100%',
        height: 250,
        resizeMode: 'stretch',
        borderRadius: 5,
      },
      headerIcon: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      itemTitle: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 5,
        marginVertical: 5,
      },
      iconsSpace: {
        marginLeft: 10,
        marginRight: 10,
        justifyContent:'center',
        alignItems:'center'
      },
      loading: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#CED0CE',
      },
      currentPrice: {
        fontSize: 12,
        color: 'red',
      },
      offerContainer: {
        backgroundColor: '#FFEEEE80',
        textAlign: 'center',
        fontSize: 11,
        padding: 3,
        borderRadius: 3,
        color: 'red',
      },
      minPrice: {
        fontSize: 12,
        padding: 3,
        borderRadius: 3,
        color: 'black',
        textDecorationLine: 'line-through',
      },
      currencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginVertical: 5,
        ...(isRTL && { flexDirection: 'row-reverse' }),
      },
      dotContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 5,
      },
      activeDot: {
        backgroundColor: 'orange',
      },
      badge: {
        position: 'absolute',
        top: 2,
        right: 0,
        backgroundColor: 'red',
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        justifyContent:'center',
        textAlign:'center'
      },
    });
  }, [isRTL]);
};

export default useDynamicStyles;
