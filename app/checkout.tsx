import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Clock, CreditCard, Check } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import colors from '@/constants/colors';

export default function CheckoutScreen() {
  const router = useRouter();
  const {
    cart,
    getCartTotal,
    clearCart,
    userLocation
  } = useAppStore();

  const [deliveryFee] = useState(15000);
  const [platformFee] = useState(5000);
  const [promoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee + platformFee - promoDiscount;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      Alert.alert("Giỏ hàng trống", "Vui lòng thêm sản phẩm trước khi thanh toán.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Đặt hàng thành công",
        "Đơn hàng của bạn đã được đặt và sẽ giao trong thời gian sớm nhất.",
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push('/');
            }
          }
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: "Thanh toán",
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollContainer}>
        {/* Thông tin giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

          <View style={styles.deliveryInfoItem}>
            <MapPin size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
              <Text style={styles.infoValue}>{userLocation?.address || 'Chưa có địa chỉ'}</Text>
            </View>
          </View>

          <View style={styles.deliveryInfoItem}>
            <Clock size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Thời gian giao hàng dự kiến</Text>
              <Text style={styles.infoValue}>30 - 45 phút</Text>
            </View>
          </View>
        </View>

        {/* Tóm tắt đơn hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemQuantity}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
              </View>

              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                {item.options?.length > 0 && (
                  <Text style={styles.orderItemOptions}>
                    {item.options.map(opt => `${opt.name}: ${opt.value}`).join(', ')}
                  </Text>
                )}
              </View>

              <Text style={styles.orderItemPrice}>
                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <TouchableOpacity style={styles.paymentMethod}>
            <CreditCard size={20} color={colors.text} />
            <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng</Text>
            <View style={styles.selectedIndicator}>
              <Check size={12} color={colors.background} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Chi tiết giá */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính</Text>
            <Text style={styles.priceValue}>{subtotal.toLocaleString('vi-VN')}đ</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí giao hàng</Text>
            <Text style={styles.priceValue}>{deliveryFee.toLocaleString('vi-VN')}đ</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí nền tảng</Text>
            <Text style={styles.priceValue}>{platformFee.toLocaleString('vi-VN')}đ</Text>
          </View>

          {promoDiscount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Giảm giá</Text>
              <Text style={[styles.priceValue, styles.discountText]}>
                -{promoDiscount.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{total.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Tổng cộng</Text>
          <Text style={styles.footerTotalValue}>{total.toLocaleString('vi-VN')}đ</Text>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.placeOrderButtonText}>Đặt hàng</Text>
          )}
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
  scrollContainer: {
    flex: 1,
  },
  section: {
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
  deliveryInfoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  orderItemQuantity: {
    width: 30,
    marginRight: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  orderItemOptions: {
    fontSize: 12,
    color: colors.lightText,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: colors.lightText,
  },
  priceValue: {
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
  footer: {
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
  footerTotalLabel: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 4,
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
});