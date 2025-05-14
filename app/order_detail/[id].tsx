import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Pressable 
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  MapPin, 
  User, 
  Copy, 
  Info, 
  ShoppingBag 
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { getAccessToken } from '@/storange/auth.storage';
import orderApiRequest from '@/api/order.api';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = await getAccessToken();
        const { payload } = await orderApiRequest.getOneOrder(token, id);
        if (payload.EC === "0") {
          setOrder(payload.DT);
          console.log('myorder', JSON.stringify(payload.DT, null, 2));
        } else {
          setError('Không tìm thấy đơn hàng');
        }
      } catch (err) {
        setError('Lỗi khi tải đơn hàng: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerTitle: "Chi tiết đơn hàng",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerTitle: "Chi tiết đơn hàng",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>{error || 'Không tìm thấy đơn hàng'}</Text>
        </View>
      </View>
    );
  }

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Ánh xạ trạng thái đơn hàng
  const statusTranslations = {
    goingToRestaurant: 'Đang đến nhà hàng',
    arrivedAtRestaurant: 'Đã đến nhà hàng',
    pickedUp: 'Đã lấy hàng',
    delivering: 'Đang giao hàng',
    arrivedAtCustomer: 'Đã đến nơi khách hàng',
    delivered: 'Đã giao hàng',
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Chi tiết đơn hàng",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <MoreHorizontal size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>
            {statusTranslations[order.orderStatus.toLowerCase()] || 'Không xác định'}
          </Text>
          <Text style={styles.statusDescription}>
            Nếu cần hỗ trợ thêm, bạn vui lòng truy cập Trung tâm Trợ giúp nhé.
          </Text>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFja2FnZXxlbnwwfHwwfHx8MA%3D%3D' }} 
            style={styles.deliveryImage}
          />
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLine}>
              <View style={styles.progressLineInner} />
            </View>
            
            <View style={styles.progressSteps}>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.activeDot]}>
                  <ShoppingBag size={12} color="#fff" />
                </View>
              </View>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.activeDot]}>
                  <ShoppingBag size={12} color="#fff" />
                </View>
              </View>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.activeDot]}>
                  <ShoppingBag size={12} color="#fff" />
                </View>
              </View>
              <View style={styles.progressStep}>
                <View style={[styles.progressDot, styles.activeDot]}>
                  <ShoppingBag size={12} color="#fff" />
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, { backgroundColor: colors.error }]} />
            <Text style={styles.locationLabel}>Từ</Text>
            <TouchableOpacity style={styles.locationContent}>
              <Text style={styles.locationTitle}>{order.restaurant.name}</Text>
              <Text style={styles.locationAddress}>{order.restaurant.address.fullAddress}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationItem}>
            <View style={[styles.locationDot, { backgroundColor: colors.success }]} />
            <Text style={styles.locationLabel}>Đến</Text>
            <View style={styles.locationContent}>
              <Text style={styles.locationTitle}>{order.address.address}</Text>
              <Text style={styles.locationSubtitle}>
                {order.address.name} - {order.address.phoneNumber}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết đơn hàng</Text>
          
          <View style={styles.userInfo}>
            <User size={16} color={colors.lightText} />
            <Text style={styles.userName}>{order.user.username}</Text>
            {/* Không có isGroupLeader trong dữ liệu API, nên bỏ phần này */}
          </View>
          
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Image source={{ uri: item.food.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.food.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currentPrice}>{item.price.toLocaleString()}đ</Text>
                    {/* Không có originalPrice trong dữ liệu API */}
                  </View>
                </View>
                
                {/* Không có isFlashSale trong dữ liệu API */}
                <Text style={styles.itemQuantity}>x {item.quantity}</Text>
                {item.toppings.length > 0 && (
                  <Text style={styles.toppingText}>
                    Toppings: {item.toppings.map(t => t.item.map(i => i.price).join(', ')).join(', ')}đ
                  </Text>
                )}
              </View>
            </View>
          ))}
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng giá món ({order.items.reduce((sum, item) => sum + item.quantity, 0)} món)</Text>
              <Text style={styles.summaryValue}>{order.totalPrice.toLocaleString()}đ</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí giao hàng</Text>
              <Text style={styles.summaryValue}>{order.shippingFee.toLocaleString()}đ</Text>
            </View>
            
            {/* Không có platformFee trong dữ liệu API, bỏ phần này hoặc hiển thị 0 */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabelWithInfo}>
                <Text style={styles.summaryLabel}>Phí áp dụng</Text>
                <TouchableOpacity>
                  <Info size={14} color={colors.lightText} />
                </TouchableOpacity>
              </View>
              <Text style={styles.summaryValue}>0đ</Text>
            </View>
            
            {order.discount?.amount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Giảm giá</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>-{order.discount.amount.toLocaleString()}đ</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <View style={styles.totalLeft}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFkZ2V8ZW58MHx8MHx8fDA%3D' }} 
                  style={styles.totalStamp}
                />
              </View>
              <Text style={styles.totalValue}>{order.finalAmount.toLocaleString()}đ</Text>
            </View>
          </View>
          
          <View style={styles.additionalInfoContainer}>
            {/* Không có includeCutlery trong dữ liệu API, bỏ phần này hoặc mặc định là "Không lấy" */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dụng cụ ăn uống</Text>
              <Text style={styles.infoValue}>Không lấy</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghi chú</Text>
              <Text style={styles.infoValue}>{order.note || "Không có"}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã đơn hàng</Text>
              <View style={styles.orderIdContainer}>
                <Text style={styles.infoValue}>{order._id}</Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Text style={styles.copyText}>Sao chép</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thời gian đặt hàng</Text>
              <Text style={styles.infoValue}>{formatDateTime(order.createdAt)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thanh toán</Text>
              <Text style={styles.infoValue}>{order.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {order.isRated ? (
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonText}>Đã đánh giá</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: colors.background,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 16,
  },
  deliveryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
    position: 'relative',
  },
  progressLine: {
    height: 2,
    backgroundColor: colors.border,
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    top: 12,
  },
  progressLineInner: {
    height: 2,
    backgroundColor: colors.primary,
    width: '100%',
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  locationContainer: {
    backgroundColor: colors.background,
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 5,
  },
  locationLabel: {
    width: 30,
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.lightText,
  },
  locationSubtitle: {
    fontSize: 14,
    color: colors.lightText,
  },
  section: {
    backgroundColor: colors.background,
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 14,
    color: colors.lightText,
    marginLeft: 8,
  },
  leaderBadge: {
    backgroundColor: 'rgba(255, 75, 58, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  leaderText: {
    fontSize: 12,
    color: colors.primary,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.lightText,
    textDecorationLine: 'line-through',
  },
  toppingText: {
    fontSize: 12,
    color: colors.lightText,
    marginTop: 4,
  },
  flashSaleTag: {
    backgroundColor: colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  flashSaleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.background,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.lightText,
    marginTop: 4,
  },
  summaryContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.lightText,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
  },
  discountValue: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalStamp: {
    width: 40,
    height: 40,
    opacity: 0.5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  additionalInfoContainer: {
    marginTop: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.lightText,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    marginLeft: 8,
  },
  copyText: {
    fontSize: 14,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  rateButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  rateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  reorderButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
});