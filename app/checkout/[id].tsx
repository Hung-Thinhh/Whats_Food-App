import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Switch,
} from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  MapPin,
  Clock,
  CreditCard,
  Check,
  ChevronRight,
  Edit,
  Ticket,
  Truck,
  Info,
  Utensils,
  FileText,
  AlertCircle,
} from "lucide-react-native";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Voucher, TipOption, DeliveryOption } from "@/types";
import { tipOptions, deliveryOptions } from "@/mocks/data";
import colors from "@/constants/colors";
import CheckoutApiRequest from "@/api/checkout.api";
import { getAccessToken } from "@/storange/auth.storage";
import orderApiRequest from "@/api/order.api";
import WebView from "react-native-webview";

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const {
    cart,
    getCartTotal,
    userLocation,
    clearCart,
    checkoutPreferences,
    setSelectedVoucher,
    setTipAmount,
    setDeliveryOption,
    setIncludeCutlery,
    setNote,
    setSelectedPaymentMethod,
    setSelectedAddress,
    clearItemCart,
    getAvailableVouchers,
    getCartItemCount,
    getUnavailableVouchers,
    getAppliedDiscount,
    savedAddresses,
  } = useAppStore();

  const { isAuthenticated, user } = useAuthStore();
  const {
    selectedAddress,
    selectedPaymentMethod,
    includeCutlery,
    tipAmount,
    deliveryOption,
    note,
    selectedVoucher,
  } = checkoutPreferences;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalLast, setTotalLast] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [shipping, setShipping] = useState();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const cartItemOfRes = getCartItemCount(id);

  useEffect(() => {
    async function fetchFee() {
      try {
        const token = await getAccessToken();
        const { payload } = await CheckoutApiRequest.getFee(
          userLocation.longitude,
          userLocation.latitude,
          id,
          token
        );
        setShipping(payload.DT);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFee();
  }, [userLocation]);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to checkout.", [
        { text: "Cancel", onPress: () => router.back(), style: "cancel" },
        { text: "Login", onPress: () => router.replace("/auth/login") },
      ]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let voucherPrice = 0;
    if (checkoutPreferences.selectedVoucher?.type === "fixed") {
      voucherPrice = checkoutPreferences.selectedVoucher.value;
    } else if (checkoutPreferences.selectedVoucher?.type === "percent") {
      const discountAmount =
        (cartItemOfRes.totalPrice * checkoutPreferences.selectedVoucher.value) /
        100;
      voucherPrice = Math.min(
        discountAmount,
        checkoutPreferences.selectedVoucher?.maxDiscount || Infinity
      );
    }
    const shippingPrice = shipping?.fee || 0;
    const totalPrice =
      getCartTotalPrice(cartItemOfRes.items) + shippingPrice - voucherPrice;
    setTotalLast(totalPrice);
  }, [checkoutPreferences.selectedVoucher, cartItemOfRes, shipping]);

  const subtotal = getCartTotal();
  const selectedDeliveryOption =
    deliveryOptions.find((option) => option.id === checkoutPreferences.deliveryOption) ||
    deliveryOptions[0];
  const deliveryFee = selectedDeliveryOption.price;
  const platformFee = 3000;
  const discount = getAppliedDiscount();
  const total = subtotal + deliveryFee + platformFee - discount;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderItems =
      cartItemOfRes?.items?.map((item) => ({
        food: item.foodId._id,
        quantity: item.quantity,
        price: item.foodId.price,
        toppings:
          item.topping?.map((group) => ({
            topping: group._id,
            item: group.item.map((choice) => ({
              id: choice._id,
              price: choice.price || 0,
            })),
          })) || [],
      })) || [];

    const orderData = {
      user: user.id,
      restaurantId: id,
      items: orderItems,
      totalPrice: totalLast,
      shippingFee: shipping?.fee || 0,
      discount: {
        voucherId: checkoutPreferences.selectedVoucher?._id || null,
        amount:
          checkoutPreferences.selectedVoucher?.type === "fixed"
            ? checkoutPreferences.selectedVoucher.value
            : (cartItemOfRes.totalPrice * checkoutPreferences.selectedVoucher?.value) /
                100 <=
              checkoutPreferences.selectedVoucher?.maxDiscount
            ? (cartItemOfRes.totalPrice * checkoutPreferences.selectedVoucher.value) /
              100
            : checkoutPreferences.selectedVoucher?.maxDiscount || 0,
      },
      finalAmount: totalLast,
      address: userLocation,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      note: checkoutPreferences.note || "",
    };

    if (selectedPaymentMethod === "online") {
      try {
        const token = await getAccessToken();
        const currentOrderId = `ORDER_${Date.now()}`;
        setOrderId(currentOrderId);
        const currentCreateDate = new Date()
          .toISOString()
          .replace(/[-:T.]/g, "")
          .slice(0, 14);
        setCreateDate(currentCreateDate);

        const response = await fetch("http://10.0.2.2:8000/api/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: totalLast / 100,
            orderId: currentOrderId,
            returnUrl: "http://10.0.2.2:8000/api/payment-return", // Thay bằng URL ngrok
            orderData,
            createDate: currentCreateDate,
          }),
        });
        if (!response.ok) {
          const text = await response.text();
          console.log("Response error:", text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.paymentUrl) {
          setPaymentUrl(data.paymentUrl);
          setPaymentModalVisible(true);
        } else {
          Alert.alert("Lỗi", "Không thể tạo giao dịch thanh toán.");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        Alert.alert("Lỗi", "Có lỗi xảy ra: " + error.message);
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        const token = await getAccessToken();
        const { payload } = await orderApiRequest.add(orderData, token);
        if (payload.EC === "0") {
          clearItemCart(id);
          router.back();
          Alert.alert("Đặt hàng thành công", "Đơn hàng đã được đặt thành công.");
        } else {
          Alert.alert("Lỗi", "Không thể đặt hàng. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Có lỗi xảy ra: " + error.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePaymentNavigationStateChange = async (navState) => {
    const { url } = navState;
    console.log("Nav state URL:", url); // Debug URL

    if (url.includes("payment-return")) {
      setPaymentModalVisible(false);
      setIsProcessing(true);

      try {
        const token = await getAccessToken();
        const response = await fetch(
          "https://3db2-2001-ee0-5367-99e0-ddc9-187c-7f45-7d6a.ngrok-free.app/api/check-payment-status", // Thay bằng URL ngrok
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId, createDate }),
          }
        );
        if (!response.ok) {
          const text = await response.text();
          console.log("Response error:", text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Check payment status response:", data);

        if (data.success) {
          clearItemCart(id);
          router.back();
          Alert.alert("Thành công", "Thanh toán thành công!");
        } else {
          Alert.alert("Thất bại", "Thanh toán không thành công.");
        }
      } catch (error) {
        console.error("Check payment error:", error.message);
        Alert.alert("Lỗi", "Không thể kiểm tra trạng thái thanh toán: " + error.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setAddressModalVisible(false);
  };

  const handleSelectDeliveryOption = (option) => {
    setDeliveryOption(option.id);
    setDeliveryModalVisible(false);
  };

  const handleSelectTip = (option) => {
    if (option.id === "other") {
      setShowCustomTip(true);
    } else {
      setTipAmount(option.value);
      setShowCustomTip(false);
    }
  };

  const handleCustomTipChange = (text) => {
    setCustomTipAmount(text.replace(/[^0-9]/g, ""));
  };

  const handleCustomTipApply = () => {
    const amount = parseInt(customTipAmount, 10) || 0;
    setTipAmount(amount);
    setShowCustomTip(false);
  };

  const handleSaveNote = () => {
    setNoteModalVisible(false);
  };

  const getCartTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const basePrice = item.foodId.price;
      const toppingPrice =
        item.topping?.reduce((sum, option) => sum + option.item.reduce((s, choice) => s + (choice.price || 0), 0), 0) || 0;
      return total + (basePrice + toppingPrice) * item.quantity;
    }, 0);
  };

  if (!isAuthenticated) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          title: "Confirm Order",
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView ref={scrollViewRef} style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <MapPin size={18} color={colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressText}>{userLocation.address}</Text>
              <Text style={styles.phoneText}>Nguyễn Hưng Thịnh | 0944034769</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => router.push("/location")}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items Section */}
        <View style={styles.orderItemsSection}>
          <Text style={styles.restaurantName}>Đơn hàng của bạn</Text>
          {cartItemOfRes.items?.map((selectedItem, index) => (
            <View key={index} style={styles.modalCartItem}>
              <Image source={{ uri: selectedItem.foodId.image || "ok" }} style={styles.modalItemImage} />
              <View style={styles.modalItemDetails}>
                <Text style={styles.modalCartName}>x{selectedItem.quantity} {selectedItem.foodId.name}</Text>
                {selectedItem.topping?.length > 0 && (
                  <View style={styles.modalOptionsContainer}>
                    {selectedItem.topping.map((option, index) => (
                      <Text key={index} style={styles.modalOptionGroup}>
                        {option.item.map((choice) => choice.name).join(", ")}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.modalItemPriceRow}>
                <Text style={styles.modalCartPrice}>
                  {(selectedItem.foodId.price +
                    (selectedItem.topping?.reduce((total, option) => total + option.item.reduce((sum, choice) => sum + (choice.price || 0), 0), 0) || 0))
                    .toLocaleString("vi-VN")}
                  đ
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Payment Details Section */}
        <View style={styles.paymentDetailsSection}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Tổng giá món ({cartItemOfRes.items.length} món)</Text>
            <Text style={styles.paymentValue}>{getCartTotalPrice(cartItemOfRes.items).toLocaleString("vi-VN")}đ</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Phí giao hàng ({Number(shipping?.distance?.toFixed(1))} km)</Text>
            <Text style={styles.paymentValue}>{shipping?.fee?.toLocaleString("vi-VN") || 0}đ</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Mã giảm giá</Text>
            <Text style={styles.paymentValue}>
              {checkoutPreferences.selectedVoucher?.type === "fixed"
                ? checkoutPreferences.selectedVoucher?.value?.toLocaleString("vi-VN") || "0"
                : checkoutPreferences.selectedVoucher?.value && checkoutPreferences.selectedVoucher?.maxDiscount
                ? Math.min(
                    (cartItemOfRes.totalPrice * checkoutPreferences.selectedVoucher.value) / 100,
                    checkoutPreferences.selectedVoucher.maxDiscount
                  ).toLocaleString("vi-VN")
                : "0"}
              đ
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Voucher Discount</Text>
              <Text style={[styles.paymentValue, styles.discountText]}>-{discount.toLocaleString("vi-VN")}đ</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.totalValue}>{totalLast.toLocaleString("vi-VN")}đ</Text>
              <Text style={styles.taxNote}>Đã bao gồm thuế</Text>
            </View>
          </View>
        </View>

        {/* Voucher Section */}
        <TouchableOpacity style={styles.voucherSection} onPress={() => router.push("/vouchers")}>
          <View style={styles.voucherLeft}>
            <Ticket size={20} color={colors.primary} style={styles.voucherIcon} />
            <Text style={styles.voucherText}>
              {checkoutPreferences.selectedVoucher?.description || "Thêm Voucher"}
            </Text>
          </View>
          <View style={styles.voucherRight}>
            <Text style={styles.selectVoucherText}>Chọn voucher</Text>
            <ChevronRight size={18} color={colors.lightText} />
          </View>
        </TouchableOpacity>

        {/* Additional Options Section */}
        <View style={styles.additionalOptionsSection}>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Truck size={20} color={colors.text} />
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Giao hàng nhanh chóng</Text>
              </View>
            </View>
          </View>
          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Utensils size={20} color={colors.text} />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Lấy dụng cụ ăn uống</Text>
                <Text style={styles.optionDescription}>Quán sẽ cung cấp dụng cụ ăn uống</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.noteRow} onPress={() => setNoteModalVisible(true)}>
            <FileText size={20} color={colors.text} />
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteTitle}>Ghi chú</Text>
              <Text style={styles.noteText}>{checkoutPreferences.note || ""}</Text>
            </View>
            <ChevronRight size={18} color={colors.lightText} />
          </TouchableOpacity>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentMethodSection}>
          <View style={styles.paymentMethodHeader}>
            <Text style={styles.paymentMethodTitle}>Phương thức thanh toán</Text>
          </View>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                checkoutPreferences.selectedPaymentMethod === "online" && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPaymentMethod("online")}
            >
              <Text style={styles.paymentMethodText}>Thanh toán ngân hàng</Text>
              {checkoutPreferences.selectedPaymentMethod === "online" && (
                <View style={styles.selectedIndicator}>
                  <Check size={12} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethod,
                checkoutPreferences.selectedPaymentMethod === "cash" && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPaymentMethod("cash")}
            >
              <Text style={styles.paymentMethodText}>Trả tiền khi nhận hàng</Text>
              {checkoutPreferences.selectedPaymentMethod === "cash" && (
                <View style={styles.selectedIndicator}>
                  <Check size={12} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.otherPaymentMethodsButton}>
            <Text style={styles.otherPaymentMethodsText}>Other payment methods</Text>
          </TouchableOpacity>
        </View>

        {/* Terms Section */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By clicking "Place Order", you agree to ShopeeFood{" "}
            <Text style={styles.termsLink}>Term of service</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, isProcessing && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Thanh toán · {totalLast.toLocaleString("vi-VN")}đ
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setAddressModalVisible(false)}
              style={styles.modalBackButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
          </View>
          <ScrollView style={styles.modalContent}>
            {savedAddresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={styles.addressItem}
                onPress={() => handleSelectAddress(address)}
              >
                <View style={styles.addressItemContent}>
                  <View style={styles.addressItemHeader}>
                    <Text style={styles.addressItemLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressItemText}>{address.address}</Text>
                  <Text style={styles.addressItemPhone}>Nguyễn Hưng Thịnh | 0944034769</Text>
                </View>
                <View style={styles.addressItemRadio}>
                  <View style={styles.radioOuter}>
                    {checkoutPreferences.selectedAddress.id === address.id && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => {
                setAddressModalVisible(false);
                router.push("/location");
              }}
            >
              <Text style={styles.addAddressButtonText}>+ Add New Address</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.modalConfirmButton}
            onPress={() => setAddressModalVisible(false)}
          >
            <Text style={styles.modalConfirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Delivery Options Modal */}
      <Modal
        visible={deliveryModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setDeliveryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setDeliveryModalVisible(false)}
              style={styles.modalBackButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Delivery Options</Text>
          </View>
          <ScrollView style={styles.modalContent}>
            {deliveryOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.deliveryOptionItem}
                onPress={() => handleSelectDeliveryOption(option)}
                disabled={!option.isAvailable}
              >
                <View style={styles.deliveryOptionContent}>
                  <Text style={styles.deliveryOptionName}>{option.name}</Text>
                  <Text style={styles.deliveryOptionDescription}>{option.description}</Text>
                  <Text style={styles.deliveryOptionPrice}>{option.price.toLocaleString("vi-VN")}đ</Text>
                </View>
                <View style={styles.deliveryOptionRadio}>
                  <View style={styles.radioOuter}>
                    {checkoutPreferences.deliveryOption === option.id && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalConfirmButton}
            onPress={() => setDeliveryModalVisible(false)}
          >
            <Text style={styles.modalConfirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Note Modal */}
      <Modal
        visible={noteModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setNoteModalVisible(false)}
              style={styles.modalBackButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Note</Text>
          </View>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note for your order (optional)"
              value={checkoutPreferences.note}
              onChangeText={setNote}
              multiline
              maxLength={200}
            />
            <Text style={styles.noteCharCount}>{checkoutPreferences.note.length}/200</Text>
          </View>
          <TouchableOpacity style={styles.modalConfirmButton} onPress={handleSaveNote}>
            <Text style={styles.modalConfirmButtonText}>Save</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Payment Modal (WebView for VNPay) */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setPaymentModalVisible(false)}
              style={styles.modalBackButton}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Thanh toán qua VNPay</Text>
          </View>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handlePaymentNavigationStateChange}
            style={{ flex: 1 }}
          />
        </SafeAreaView>
      </Modal>
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
    backgroundColor: "#f5f5f5",
  },
  addressSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  phoneText: {
    fontSize: 14,
    color: colors.lightText,
  },
  editButton: {
    marginLeft: 8,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  orderItemsSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  paymentDetailsSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.lightText,
  },
  paymentValue: {
    fontSize: 14,
    color: colors.text,
  },
  discountText: {
    color: colors.success,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  totalValueContainer: {
    alignItems: "flex-end",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  taxNote: {
    fontSize: 12,
    color: colors.lightText,
    fontStyle: "italic",
  },
  voucherSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  voucherIcon: {
    marginRight: 12,
  },
  voucherText: {
    fontSize: 14,
    color: colors.text,
  },
  voucherRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectVoucherText: {
    fontSize: 14,
    color: colors.lightText,
    marginRight: 4,
  },
  additionalOptionsSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: colors.lightText,
    lineHeight: 16,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  noteTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  noteTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: colors.lightText,
  },
  paymentMethodSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  paymentMethodHeader: {
    marginBottom: 16,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  otherPaymentMethodsButton: {
    alignItems: "center",
  },
  otherPaymentMethodsText: {
    fontSize: 14,
    color: colors.primary,
  },
  termsSection: {
    padding: 16,
    marginBottom: 80,
  },
  termsText: {
    fontSize: 12,
    color: colors.lightText,
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.background,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalBackButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalConfirmButton: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: "center",
  },
  modalConfirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.background,
  },
  addressItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  addressItemContent: {
    flex: 1,
  },
  addressItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addressItemLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: colors.primary,
  },
  addressItemText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  addressItemPhone: {
    fontSize: 14,
    color: colors.lightText,
  },
  addressItemRadio: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addAddressButton: {
    padding: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addAddressButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  deliveryOptionItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  deliveryOptionContent: {
    flex: 1,
  },
  deliveryOptionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  deliveryOptionDescription: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 4,
  },
  deliveryOptionPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  deliveryOptionRadio: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  noteInputContainer: {
    flex: 1,
    padding: 16,
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
  },
  noteCharCount: {
    fontSize: 12,
    color: colors.lightText,
    alignSelf: "flex-end",
    marginTop: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  modalCartItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  modalItemDetails: {
    flex: 1,
  },
  modalCartName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  modalOptionsContainer: {
    marginBottom: 5,
  },
  modalOptionGroup: {
    color: "#8c8c8c",
  },
  modalItemPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalCartPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
});
