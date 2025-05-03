import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Search, ChevronRight, FileText, Utensils } from 'lucide-react-native';
import { restaurants } from '@/mocks/data';
import colors from '@/constants/colors';

type OrderTab = 'Ongoing' | 'ShopeeFood Deals' | 'History' | 'To Rate' | 'Cart';

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderTab>('Ongoing');
  
  const handleTabPress = (tab: OrderTab) => {
    setActiveTab(tab);
  };

  const renderEmptyOngoing = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5vdGVwYWR8ZW58MHx8MHx8fDA%3D' }} 
        style={[styles.emptyIcon, { tintColor: '#FF6E40' }]}
      />
      <Text style={styles.emptyTitle}>Have you ordered?</Text>
      <Text style={styles.emptyText}>
        Confirmed items which are currently being prepared and delivered will show up here so you can track your delivery!
      </Text>
      
      <View style={styles.recommendedSection}>
        <Text style={styles.recommendedTitle}>You May Also Like</Text>
        
        {restaurants && restaurants.length > 0 ? (
          // Safely use slice only if restaurants exists and has items
          restaurants.slice(0, 3).map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id}
              style={styles.recommendedItem}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            >
              <Image source={{ uri: restaurant.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedName}>
                  {restaurant.emoji} {restaurant.name}
                </Text>
                <View style={styles.recommendedStats}>
                  <Text style={styles.recommendedRating}>★ {restaurant.rating}</Text>
                  <Text style={styles.recommendedDot}>•</Text>
                  <Text style={styles.recommendedDistance}>{restaurant.distance}km</Text>
                  <Text style={styles.recommendedDot}>•</Text>
                  <Text style={styles.recommendedTime}>{restaurant.deliveryTime}min</Text>
                </View>
                
                {restaurant.discount && (
                  <View style={styles.discountContainer}>
                    {restaurant.discount.menuValue && (
                      <View style={styles.menuDiscountTag}>
                        <Text style={styles.discountTagText}>
                          {restaurant.discount.menuValue}
                        </Text>
                      </View>
                    )}
                    <View style={styles.codeDiscountTag}>
                      <Text style={styles.discountTagText}>
                        {restaurant.discount.value}
                      </Text>
                    </View>
                  </View>
                )}
                
                {restaurant.isClosed && (
                  <Text style={styles.closingText}>
                    Closing soon Closing at {restaurant.closingTime}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRestaurantsText}>No recommended restaurants available</Text>
        )}
      </View>
    </View>
  );

  // Similar fix for the cart section
  const renderCart = () => (
    <View style={styles.cartContainer}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>All Services</Text>
          <ChevronRight size={16} color={colors.lightText} style={{ transform: [{ rotate: '90deg' }] }} />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cartItemsContainer}>
        <Text style={styles.categoryLabel}>Food</Text>
        
        {restaurants && restaurants.length > 0 ? (
          restaurants.slice(0, 2).map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id}
              style={styles.cartItem}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            >
              <View style={styles.cartItemPreferredBadge}>
                <Text style={styles.cartItemPreferredText}>Preferred</Text>
              </View>
              <Image source={{ uri: restaurant.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>
                  {restaurant.emoji} {restaurant.name}
                </Text>
                <Text style={styles.cartItemAddress} numberOfLines={1}>
                  {restaurant.id === '1' ? 
                    '192D đường 30/4, P. An Phú, Quận Ninh Kiều, Cần...' : 
                    'Số 401 Đường Nguyễn Văn Cừ, P. An Hòa, Quận N...'}
                </Text>
                <Text style={styles.cartItemPrice}>
                  {restaurant.id === '1' ? '87.000đ (3 items)' : '306.000đ (2 items)'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRestaurantsText}>No items in cart</Text>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Ongoing':
        return renderEmptyOngoing();
      case 'ShopeeFood Deals':
        return renderEmptyDeals();
      case 'History':
        return renderEmptyHistory();
      case 'To Rate':
        return renderEmptyToRate();
      case 'Cart':
        return renderCart();
      default:
        return renderEmptyOngoing();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity>
          <Search size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {(['Ongoing', 'ShopeeFood Deals', 'History', 'To Rate', 'Cart'] as OrderTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {activeTab === 'History' && (
        <View style={styles.rewardBanner}>
          <View style={styles.coinIcon}>
            <Text style={styles.coinText}>$</Text>
          </View>
          <Text style={styles.rewardText}>Rate shops to get 500 coins</Text>
          <ChevronRight size={16} color={colors.text} />
        </View>
      )}
      
      {activeTab === 'To Rate' && (
        <View style={styles.rewardBanner}>
          <View style={styles.coinIcon}>
            <Text style={styles.coinText}>$</Text>
          </View>
          <Text style={styles.rewardText}>Rate shops to get 500 coins</Text>
          <ChevronRight size={16} color={colors.text} />
        </View>
      )}
      
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.lightText,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 24,
  },
  recommendedSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  recommendedItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
  },
  recommendedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  recommendedStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendedRating: {
    fontSize: 12,
    color: colors.text,
  },
  recommendedDot: {
    fontSize: 12,
    color: colors.lightText,
    marginHorizontal: 4,
  },
  recommendedDistance: {
    fontSize: 12,
    color: colors.lightText,
  },
  recommendedTime: {
    fontSize: 12,
    color: colors.lightText,
  },
  discountContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  menuDiscountTag: {
    backgroundColor: colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginRight: 8,
  },
  codeDiscountTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  discountTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  closingText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  coinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  coinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
  rewardText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  cartContainer: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 4,
  },
  clearText: {
    fontSize: 14,
    color: colors.lightText,
  },
  cartItemsContainer: {
    padding: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  cartItemPreferredBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  cartItemPreferredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cartItemAddress: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  noRestaurantsText: {
    textAlign: 'center',
    color: colors.lightText,
    padding: 16,
    fontSize: 14,
  },
});