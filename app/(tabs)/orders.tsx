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
import { Search, ChevronRight, FileText, Utensils, ChevronDown, Filter } from 'lucide-react-native';
import { restaurants } from '@/mocks/data';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

type OrderTab = 'Ongoing' | 'History' | 'To Rate' | 'Cart';

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderTab>('Ongoing');
  const { getOrders } = useAppStore();
  const orders = getOrders();
  
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
        
        {restaurants.slice(0, 3).map((restaurant) => (
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
        ))}
      </View>
    </View>
  );

  const renderEmptyDeals = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzaHxlbnwwfHwwfHx8MA%3D' }} 
        style={[styles.emptyIcon, { tintColor: '#FF6E40' }]}
      />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyText}>
        Don't miss out! Shop the ShopeeFood Deals and save big today!
      </Text>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      {/* <View style={styles.historyHeader}>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Dịch vụ</Text>
            <ChevronDown size={16} color={colors.lightText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Trạng thái</Text>
            <ChevronDown size={16} color={colors.lightText} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton}>
            <Text style={[styles.filterText, styles.dateFilterText]}>01/04/24 - 26/09/24</Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View> */}
      
      {orders.map((order) => (
        <TouchableOpacity 
          key={order.id}
          style={styles.orderItem}
          onPress={() => router.push(`/order_detail/${order.id}`)}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Đồ ăn #{order.id}</Text>
            <Text style={styles.orderDate}>{order.orderTime.split(' ')[0]}</Text>
          </View>
          
          <View style={styles.orderContent}>
            <View style={styles.restaurantRow}>
              <Image source={{ uri: order.restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
                {order.items.map((item, index) => (
                  <Text key={index} style={styles.orderItemName}>
                    {item.name}
                  </Text>
                ))}
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.orderPrice}>{order.total.toLocaleString()}đ</Text>
                <Text style={styles.itemCount}>{order.items.reduce((sum, item) => sum + item.quantity, 0)} món</Text>
              </View>
            </View>
            
            <View style={styles.orderStatus}>
              <Text style={styles.statusText}>Hoàn thành</Text>
              
              <View style={styles.orderActions}>
                {order.isRated ? (
                  <TouchableOpacity style={styles.ratedButton}>
                    <Text style={styles.ratedButtonText}>Đã đánh giá</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.rateButton}>
                    <Text style={styles.rateButtonText}>Đánh giá</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={styles.reorderButton}
                  onPress={() => {
                    // Handle reorder logic
                  }}
                >
                  <Text style={styles.reorderButtonText}>Đặt lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyToRate = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzaHxlbnwwfHwwfHx8MA%3D' }} 
        style={[styles.emptyIcon, { tintColor: '#FF6E40' }]}
      />
      <Text style={styles.emptyTitle}>No order to rate</Text>
      <Text style={styles.emptyText}>
        Wow, good job! All orders have been rated
      </Text>
    </View>
  );

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
        
        {restaurants.slice(0, 2).map((restaurant) => (
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
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Ongoing':
        return renderEmptyOngoing();
      case 'History':
        return renderHistory();
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
        <Text style={styles.headerTitle}>Đơn hàng</Text>
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
          {(['Ongoing', 'History', 'To Rate', 'Cart'] as OrderTab[]).map((tab) => (
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
                {tab === 'History' ? 'Lịch sử' : 
                 tab === 'To Rate' ? 'Đánh giá' : 
                 tab === 'Ongoing' ? 'Đang đến' :  
                 'Đơn nhập'}
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
          <Text style={styles.rewardText}>Đánh giá quán, nhận ngay 500 xu</Text>
          <ChevronRight size={16} color={colors.text} />
        </View>
      )}
      
      {activeTab === 'To Rate' && (
        <View style={styles.rewardBanner}>
          <View style={styles.coinIcon}>
            <Text style={styles.coinText}>$</Text>
          </View>
          <Text style={styles.rewardText}>Đánh giá quán, nhận ngay 500 xu</Text>
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
    marginRight: 30,
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
  dateFilterText: {
    color: colors.primary,
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
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    backgroundColor: colors.background,
  },
  orderItem: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.lightText,
  },
  orderContent: {
    
  },
  restaurantRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  orderItemName: {
    fontSize: 12,
    color: colors.lightText,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: colors.lightText,
  },
  orderStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: colors.text,
  },
  orderActions: {
    flexDirection: 'row',
  },
  rateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 8,
  },
  rateButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  ratedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 8,
  },
  ratedButtonText: {
    fontSize: 12,
    color: colors.lightText,
  },
  reorderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  reorderButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
});