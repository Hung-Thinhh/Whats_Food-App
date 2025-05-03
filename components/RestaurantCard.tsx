import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, MapPin, Heart, ChevronRight } from 'lucide-react-native';
import { Restaurant } from '@/types';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress?: (restaurant: Restaurant) => void;
  listView?: boolean;
}

export default function RestaurantCard({ 
  restaurant, 
  onPress,
  listView = false
}: RestaurantCardProps) {
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(restaurant.id);

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(restaurant.id);
  };

  if (listView) {
    return (
      <TouchableOpacity 
        style={styles.listContainer}
        onPress={() => onPress && onPress(restaurant)}
        activeOpacity={0.9}
      >
        <View style={styles.listImageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.listImage} />
          {restaurant.preferred && (
            <View style={styles.preferredBadge}>
              <Text style={styles.preferredText}>Preferred</Text>
            </View>
          )}
        </View>
        
        <View style={styles.listContent}>
          <Text style={styles.listName} numberOfLines={2}>
            {restaurant.emoji} {restaurant.name}
          </Text>
          
          <View style={styles.listInfoRow}>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFC107" fill="#FFC107" />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
            
            <Text style={styles.dot}>•</Text>
            
            <View style={styles.distanceContainer}>
              <Text style={styles.distance}>{restaurant.distance}km</Text>
            </View>
            
            <Text style={styles.dot}>•</Text>
            
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{restaurant.deliveryTime}min</Text>
            </View>
          </View>
          
          {restaurant.isClosed && (
            <View style={styles.closingContainer}>
              <Text style={styles.closingText}>
                Closing soon
              </Text>
              <Text style={styles.closingTimeText}>
                Closing at {restaurant.closingTime}
              </Text>
            </View>
          )}
          
          {restaurant.discount && (
            <View style={styles.listDiscountRow}>
              {restaurant.discount.menuValue && (
                <View style={[styles.discountTag, styles.menuDiscountTag]}>
                  <Text style={styles.discountTagText}>{restaurant.discount.menuValue}</Text>
                </View>
              )}
              
              <View style={[styles.discountTag, styles.codeDiscountTag]}>
                <Text style={styles.discountTagText}>{restaurant.discount.value}</Text>
              </View>
            </View>
          )}
          
          {restaurant.outlets && restaurant.outlets > 1 && (
            <TouchableOpacity style={styles.outletsButton}>
              <Text style={styles.outletsText}>
                View {restaurant.outlets} Outlets
              </Text>
              <ChevronRight size={12} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(restaurant)}
      activeOpacity={0.9}
    >
      {restaurant.preferred && (
        <View style={styles.preferredBadge}>
          <Text style={styles.preferredText}>Preferred</Text>
        </View>
      )}
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        
        {restaurant.isClosed && (
          <View style={styles.closingOverlay}>
            <Text style={styles.closingText}>
              Closing soon
            </Text>
            <Text style={styles.closingTimeText}>
              Closing at {restaurant.closingTime}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Heart 
            size={20} 
            color={isFavorite ? colors.primary : colors.background} 
            fill={isFavorite ? colors.primary : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>
            {restaurant.emoji} {restaurant.name}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
          
          <View style={styles.distanceContainer}>
            <MapPin size={14} color={colors.lightText} />
            <Text style={styles.distance}>{restaurant.distance}km</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.lightText} />
            <Text style={styles.time}>{restaurant.deliveryTime}min</Text>
          </View>
        </View>
        
        {restaurant.discount && (
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>
              {restaurant.discount.value}
            </Text>
          </View>
        )}
        
        {restaurant.outlets && restaurant.outlets > 1 && (
          <TouchableOpacity style={styles.outletsButton}>
            <Text style={styles.outletsText}>
              View {restaurant.outlets} Outlets
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  preferredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.preferred,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  preferredText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  listImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  closingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  closingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  closingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.error,
    marginRight: 4,
  },
  closingTimeText: {
    fontSize: 10,
    color: colors.lightText,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  listContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameRow: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  listName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  dot: {
    fontSize: 14,
    color: colors.lightText,
    marginHorizontal: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  distance: {
    fontSize: 14,
    color: colors.lightText,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: colors.lightText,
  },
  discountContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
  listDiscountRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  discountTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  menuDiscountTag: {
    backgroundColor: colors.warning,
  },
  codeDiscountTag: {
    backgroundColor: colors.primary,
  },
  discountTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  outletsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  outletsText: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 4,
  },
});