import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import RestaurantCard from '@/components/RestaurantCard';
import { useAppStore } from '@/store/useAppStore';
import { restaurants } from '@/mocks/data';
import colors from '@/constants/colors';

export default function LikesScreen() {
  const router = useRouter();
  const { favorites } = useAppStore();
  
  const favoriteRestaurants = restaurants.filter((restaurant) => 
    favorites.includes(restaurant.id)
  );

  const handleRestaurantPress = (restaurant: any) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Restaurants</Text>
      </View>
      
      <FlatList
        data={favoriteRestaurants}
        renderItem={({ item }) => (
          <RestaurantCard 
            restaurant={item} 
            onPress={handleRestaurantPress} 
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart size={60} color={colors.lightText} />
            <Text style={styles.emptyText}>
              You haven't added any restaurants to your favorites yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.lightText,
    marginTop: 16,
    textAlign: 'center',
  },
});