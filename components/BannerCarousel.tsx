import React, { useRef, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Image, 
  Dimensions, 
  TouchableOpacity,
  Text
} from 'react-native';
import { Banner } from '@/types';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32;
const DOT_SIZE = 6;

interface BannerCarouselProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

export default function BannerCarousel({ 
  banners = [], // Provide default empty array
  onBannerPress 
}: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / ITEM_WIDTH);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: Banner }) => (
    <TouchableOpacity 
      style={styles.bannerContainer}
      onPress={() => onBannerPress && onBannerPress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners || []} // Add fallback in case banners is null or undefined
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToInterval={ITEM_WIDTH}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.pagination}>
        {Array.isArray(banners) && banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { 
                backgroundColor: index === activeIndex 
                  ? colors.primary 
                  : colors.border,
                width: index === activeIndex ? DOT_SIZE * 2 : DOT_SIZE,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  bannerContainer: {
    width: ITEM_WIDTH,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    padding: 16,
  },
  bannerTitle: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    marginHorizontal: 3,
  },
});