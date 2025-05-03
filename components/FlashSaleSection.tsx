import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';
import { FlashSaleItem } from '@/types';
import colors from '@/constants/colors';

interface FlashSaleSectionProps {
  items: FlashSaleItem[];
  onSeeAllPress?: () => void;
  onItemPress?: (item: FlashSaleItem) => void;
}

export default function FlashSaleSection({ 
  items, 
  onSeeAllPress,
  onItemPress 
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 29,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const renderItem = ({ item }: { item: FlashSaleItem }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => onItemPress && onItemPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        </View>
        
        {item.sellingFast && (
          <View style={styles.sellingFastContainer}>
            <Text style={styles.sellingFastText}>SELLING FAST</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : `${value}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Flash Sale</Text>
          <View style={styles.timerContainer}>
            <Clock size={16} color={colors.error} />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashSaleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clockIcon: {
    marginRight: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 12,
    color: colors.lightText,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: 120,
    marginRight: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 0,
    backgroundColor: colors.discount,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  itemContent: {
    padding: 8,
  },
  itemName: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.lightText,
    textDecorationLine: 'line-through',
  },
  sellingFastContainer: {
    backgroundColor: colors.sellingFast,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  sellingFastText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.background,
  },
});