import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/types';
import colors from '@/constants/colors';

// Add a new interface for the API response format
interface ApiRestaurant {
  _id: string;
  name: string;
  address: string | object;
  rating: number | object;
  avt?: string;
}

interface RestaurantListProps {
  title?: string;
  restaurants: Restaurant[] | ApiRestaurant[];
  onSeeAllPress?: () => void;
  onRestaurantPress?: (restaurant: Restaurant | ApiRestaurant) => void;
  listView?: boolean;
  filter?: (restaurant: Restaurant | ApiRestaurant) => boolean;
}

export default function RestaurantList({ 
  title, 
  restaurants = [], // Default empty array
  onSeeAllPress,
  onRestaurantPress,
  listView = false,
  filter
}: RestaurantListProps) {
  // Apply filter only if it exists and restaurants is defined
  const displayedRestaurants = restaurants && filter 
    ? restaurants.filter(filter) 
    : restaurants;

  // Function to check if a restaurant is in the API format
  const isApiRestaurant = (restaurant: any): restaurant is ApiRestaurant => {
    return restaurant && '_id' in restaurant;
  };

  // Function to map API restaurant to the format expected by RestaurantCard
  const mapApiRestaurantToCardProps = (restaurant: ApiRestaurant): Restaurant => {
    return {
      id: restaurant._id,
      name: restaurant.name,
      image: restaurant.avt || 'https://via.placeholder.com/150',
      rating: typeof restaurant.rating === 'number' ? restaurant.rating : 0,
      distance: 0, // Default values since these aren't in the API data
      deliveryTime: 30,
      tags: [],
      priceRange: '$',
    };
  };

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={onSeeAllPress}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={colors.lightText} />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.listContainer}>
        {displayedRestaurants && displayedRestaurants.length > 0 ? (
          displayedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={isApiRestaurant(restaurant) ? restaurant._id : restaurant.id}
              restaurant={isApiRestaurant(restaurant) ? mapApiRestaurantToCardProps(restaurant) : restaurant}
              onPress={() => onRestaurantPress && onRestaurantPress(restaurant)}
              listView={listView}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No restaurants available</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 12,
    color: colors.lightText,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.lightText,
    padding: 16,
  }
});