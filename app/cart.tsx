import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Minus,
  Plus,
  Trash2,
  MapPin,
  CreditCard,
} from 'lucide-react-native';

import { useAppStore } from '@/store/useAppStore';
import colors from '@/constants/colors';

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    userLocation,
  } = useAppStore();

  const [deliveryFee] = useState(15000);
  const [platformFee] = useState(5000);
  const [promoDiscount] = useState(0);

  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee + platformFee - promoDiscount;

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateCartItemQuantity(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItemQuantity(itemId, currentQuantity - 1);
    } else {
      handleRemoveItem(itemId);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert('Xóa món', 'Bạn có chắc muốn xóa món này khỏi giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', onPress: () => removeFromCart(itemId), style: 'destructive' },
    ]);
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    Alert.alert('Xóa giỏ hàng', 'Bạn có chắc muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa tất cả', onPress: clearCart, style: 'destructive' },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Bạn cần thêm món trước khi đặt hàng.');
      return;
    }
    router.push('/checkout');
  };

  const renderEmptyCart = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Giỏ hàng',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.emptyCartContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1586999768265-24af89630739?w=800&auto=format&fit=crop&q=60',
          }}
          style={styles.emptyCartImage}
        />
        <Text style={styles.emptyCartTitle}>Giỏ hàng trống</Text>
        <Text style={styles.emptyCartText}>
          Hãy chọn món từ nhà hàng để bắt đầu đặt hàng
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.browseButtonText}>Xem nhà hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (cart.length === 0) return renderEmptyCart();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Giỏ hàng',
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
              <Text style={styles.clearButtonText}>Xóa tất</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollContainer}>
        {/* Nhà hàng */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>
            {cart[0]?.restaurantName || 'Nhà hàng'}
          </Text>
        </View>

        {/* Địa chỉ giao hàng */}
        <View style={styles.deliveryAddressContainer}>
          <MapPin size={18} color={colors.primary} style={styles.addressIcon} />
          <View style={styles.addressContent}>
            <Text style={styles.deliveryLabel}>Địa chỉ giao hàng</Text>
            <Text style={styles.deliveryAddress}>{userLocation?.address}</Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => router.push('/location')}
          >
            <Text style={styles.changeButtonText}>Đổi</Text>
          </TouchableOpacity>
        </View>

        {/* Món ăn trong giỏ */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Món đã chọn</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.options?.length > 0 && (
                  <View style={styles.optionsContainer}>
                    {item.options.map((option, index) => (
                      <Text key={index} style={styles.optionText}>
                        {option.name}: {option.value}
                        {option.price
                          ? ` (+${option.price.toLocaleString('vi-VN')}đ)`
                          : ''}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPrice}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecreaseQuantity(item.id, item.quantity)}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 size={16} color={colors.error} />
                      ) : (
                        <Minus size={16} color={colors.text} />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncreaseQuantity(item.id, item.quantity)}
                    >
                      <Plus size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <TouchableOpacity style={styles.paymentMethod}>
            <CreditCard size={20} color={colors.text} />
            <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng</Text>
            <View style={styles.selectedIndicator} />
          </TouchableOpacity>
        </View>

        {/* Tổng kết đơn hàng */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{subtotal.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao hàng</Text>
            <Text style={styles.summaryValue}>
              {deliveryFee.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí nền tảng</Text>
            <Text style={styles.summaryValue}>
              {platformFee.toLocaleString('vi-VN')}đ
            </Text>
          </View>
          {promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giảm giá</Text>
              <Text style={[styles.summaryValue, styles.discountText]}>
                -{promoDiscount.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng</Text>
            <Text style={styles.totalValue}>{total.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút đặt hàng */}
      <View style={styles.checkoutContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.checkoutTotalLabel}>Tổng</Text>
          <Text style={styles.checkoutTotalValue}>{total.toLocaleString('vi-VN')}đ</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  deliveryAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressIcon: {
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: colors.text,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 75, 58, 0.1)',
    borderRadius: 4,
  },
  changeButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  itemsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 2,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    width: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  paymentMethodContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 75, 58, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  selectedIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.lightText,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
  },
  discountText: {
    color: colors.success,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  totalContainer: {
    flex: 1,
  },
  checkoutTotalLabel: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 4,
  },
  checkoutTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
});