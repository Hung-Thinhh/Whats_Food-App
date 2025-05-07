import React, { useState, useRef, useEffect } from 'react';
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

  Switch
} from 'react-native';
import {
  useRouter, Stack
} from 'expo-router';
import { SafeAreaView } from
  'react-native-safe-area-context';
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
  AlertCircle
} from 'lucide-react-native';
import {
  useAppStore
} from '@/store/useAppStore';
import { useAuthStore } from
  '@/store/useAuthStore';
import {
  Voucher,
  TipOption, DeliveryOption
} from '@/types';
import { tipOptions, deliveryOptions }
  from '@/mocks/data';
import colors from
  '@/constants/colors';

export default function CheckoutScreen() {
  const router = useRouter();
  const
    scrollViewRef = useRef(null);

  const {
    cart,

    getCartTotal,

    clearCart,
    checkoutPreferences,
    setSelectedVoucher,

    setTipAmount,
    setDeliveryOption,

    setIncludeCutlery,
    setNote,
    setSelectedPaymentMethod,
    setSelectedAddress,

    getAvailableVouchers,

    getUnavailableVouchers,
    getAppliedDiscount,
    savedAddresses
  } = useAppStore();

  const { isAuthenticated } = useAuthStore();

  const [isProcessing,
    setIsProcessing] = useState(false);
  const [addressModalVisible, setAddressModalVisible]
    = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible]
    = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const
    [customTipAmount,
      setCustomTipAmount] = useState('');
  const [showCustomTip, setShowCustomTip] = useState(false);


  // Redirect if not authenticated

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "Please login to checkout.",
        [
          {
            text: "Cancel",
            onPress: () =>
              router.back(),
            style: "cancel"
          },
          {
            text: "Login",
            onPress: () => router.replace('/auth/login')
          }
        ]
      );

    }
  }, [isAuthenticated]);

  const subtotal = getCartTotal();


  // Get the selected delivery option
  const selectedDeliveryOption
    = deliveryOptions.find(
      option => option.id ===
        checkoutPreferences.deliveryOption
    ) || deliveryOptions[0];


  const deliveryFee = selectedDeliveryOption.price;

  const platformFee =
    3000;
  const discount = getAppliedDiscount();

  const tipAmount = checkoutPreferences.tipAmount;


  const total = subtotal + deliveryFee + platformFee + tipAmount -
    discount;

  const handlePlaceOrder = () => {
    setIsProcessing(true);


    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);


// Show success message and clear cart
      Alert.alert(
        "Order Placed Successfully",
        "Your order has been placed and will be delivered soon.",
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

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);

    setAddressModalVisible(false);
  };

  const handleSelectDeliveryOption =
    (option: DeliveryOption) => {
      setDeliveryOption(option.id);

      setDeliveryModalVisible(false);
    };

  const handleSelectTip = (option:
    TipOption) => {
    if (option.id === 'other') {

      setShowCustomTip(true);
    } else {
      setTipAmount(option.value);

      setShowCustomTip(false);
    }
  };

  const handleCustomTipChange = (text:
    string) => {

    setCustomTipAmount(text.replace(/[^0-9]/g, ''));
  };

  const handleCustomTipApply = () => {
    const amount =
      parseInt(customTipAmount, 10) || 0;
    setTipAmount(amount);
    setShowCustomTip(false);
  };


  const handleSaveNote = () => {

    setNoteModalVisible(false);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect

  }

  return (
    <SafeAreaView style={styles.container}
      edges={['top']}>
      <Stack.Screen
        options={{
          title: "Confirm Order",
          headerLeft: () => (
      <TouchableOpacity

        style={styles.backButton}
        onPress={() => router.back()}
      >

        <ChevronLeft
          size={24} color={colors.text} />
      </TouchableOpacity>
      ),
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}

        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Section */}

        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>

            <MapPin size={18} color={colors.primary} />
            <View
              style={styles.addressInfo}>
              <Text style={styles.addressText}>

                {checkoutPreferences.selectedAddress.address}
              </Text>
              <Text
                style={styles.phoneText}>
                Nguyễn Hưng Thịnh
                | 0944034769
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setAddressModalVisible(true)}

            >
              <Text style={styles.editButtonText}>Edit</Text>

            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Time Section 
*/}
        <View style={styles.deliveryTimeSection}>
          <View
            style={styles.deliveryTimeHeader}>
            <Clock size={18} color={colors.primary} />
            <Text
              style={styles.deliveryTimeLabel}>Deliver Now</Text>

            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => setDeliveryModalVisible(true)}

            >
              <Text style={styles.scheduleButtonText}>Change to Schedule</Text>

            </TouchableOpacity>
          </View>

          <TouchableOpacity

            style={styles.deliveryOptionButton}
            onPress={() =>
              setDeliveryModalVisible(true)}
          >
            <Text style={styles.deliveryOptionText}>

              {selectedDeliveryOption.name} -
              {selectedDeliveryOption.estimatedTime}
            </Text>
            <ChevronRight size={18}
              color={colors.lightText} />
          </TouchableOpacity>
        </View>


        {/* Order Items Section */}
        <View style={styles.orderItemsSection}>
          <Text style={styles.restaurantName}>

            {cart[0]?.restaurantName ||
              'Restaurant'}
          </Text>

          {cart.map((item) =>
          (
            <View key={item.id} style={styles.orderItem}>
              <Text
                style={styles.itemQuantity}>{item.quantity}
                x</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>

                {item.options && item.options.length > 0 &&
                  (
                    <Text style={styles.itemOptions}>
                      {item.options.map(opt => `${opt.name}: 
${opt.value}`).join(', ')}
                    </Text>
                  )}
              </View>
              <Text
                style={styles.itemPrice}>

                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.viewLessButton}>
            <Text
              style={styles.viewLessText}>View Less</Text>
          </TouchableOpacity>
        </View>


        {/* Recommended Items Section */}
        <View style={styles.recommendedSection}>
          <Text
            style={styles.sectionTitle}>People also ordered</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}

            style={styles.recommendedItems}

          >
            <View style={styles.recommendedItem}>
              <Image
                source={{
                  uri:
                    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsayUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D'
                }}
                style={styles.recommendedItemImage}
              />
              <Text
                style={styles.recommendedItemName}>Trà Xanh
                Chanh</Text>

              <Text style={styles.recommendedItemPrice}>24.000đ</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>


            <View style={styles.recommendedItem}>
              <Image
                source={{
                  uri:
                    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnViYmxlJTIwdGVhfGVufDB8fDB8fHww'
                }}
                style={styles.recommendedItemImage}
              />
              <Text
                style={styles.recommendedItemName}>Trà Sữa Trân Châu</Text>
              <Text
                style={styles.recommendedItemPrice}>32.000đ</Text>
              <TouchableOpacity
                style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>

              </TouchableOpacity>
            </View>

            <View style={styles.recommendedItem}>
              <Image

                source={{
                  uri:
                    'https://images.unsplash.com/photo-1558857563-c0c6ee6ff6e4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1YmJsZSUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D'
                }}
                style={styles.recommendedItemImage}
              />
              <Text
                style={styles.recommendedItemName}>Hồng Trà Đào</Text>
              <Text
                style={styles.recommendedItemPrice}>28.000đ</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text
                  style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>

        {/* Payment Details Section */}
        <View
          style={styles.paymentDetailsSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>


          <View style={styles.paymentRow}>
            <Text
              style={styles.paymentLabel}>Subtotal ({cart.length} items)</Text>
            <Text
              style={styles.paymentValue}>{subtotal.toLocaleString('vi-VN')}đ</Text>
          </View>


          <View style={styles.paymentRow}>
            <Text
              style={styles.paymentLabel}>Shipping Fee ({selectedDeliveryOption.name})</Text>
            <Text
              style={styles.paymentValue}>{deliveryFee.toLocaleString('vi-VN')}đ</Text>
          </View>


          <View style={styles.paymentRow}>
            <View
              style={styles.paymentLabelWithInfo}>
              <Text
                style={styles.paymentLabel}>Platform
                Fee</Text>
              <TouchableOpacity>
                <Info size={14} color={colors.lightText} style={styles.infoIcon} />
              </TouchableOpacity>
            </View>

            <Text style={styles.paymentValue}>{platformFee.toLocaleString('vi-VN')}đ</Text>

          </View>

          {tipAmount > 0 && (
            <View
              style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Driver Tip</Text>
              <Text
                style={styles.paymentValue}>{tipAmount.toLocaleString('vi-VN')}đ</Text>

            </View>
          )}

          {discount > 0 && (
            <View
              style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Voucher Discount</Text>

              <Text style={[styles.paymentValue, styles.discountText]}>

                -{discount.toLocaleString('vi-VN')}đ
              </Text>

            </View>
          )}

          <View style={styles.totalRow}>
            <Text
              style={styles.totalLabel}>Total Payment</Text>
            <View style={styles.totalValueContainer}>
              <Text
                style={styles.totalValue}>{total.toLocaleString('vi-VN')}đ</Text>

              <Text style={styles.taxNote}>Tax
                included, where applicable.</Text>
            </View>
          </View>

        </View>

        {/* Voucher Section */}
        <TouchableOpacity

          style={styles.voucherSection}
          onPress={() => router.push('/vouchers')}
        >

          <View style={styles.voucherLeft}>
            <Ticket
              size={20} color={colors.primary} style={styles.voucherIcon} />
            <Text
              style={styles.voucherText}>
              {checkoutPreferences.selectedVoucher

                ? checkoutPreferences.selectedVoucher.title
                : 'Add Voucher'}
            </Text>
          </View>
          <View
            style={styles.voucherRight}>
            <Text
              style={styles.selectVoucherText}>Select voucher</Text>
            <ChevronRight size={18} color={colors.lightText} />
          </View>

        </TouchableOpacity>

        {/* Driver Tip Section */}

        <View
          style={styles.tipSection}>
          <View style={styles.tipHeader}>
            <Text
              style={styles.tipTitle}>Tips for Driver</Text>
          </View>

          <View style={styles.tipOptions}>

            {tipOptions.map((option) => (
              <TouchableOpacity
                key={option.id}

                style={[
                  styles.tipOption,
                  checkoutPreferences.tipAmount
                  === option.value && option.id !== 'other' && styles.selectedTipOption
                ]}

                onPress={() => handleSelectTip(option)}
              >
                <Text

                  style={[
                    styles.tipOptionText,
                    checkoutPreferences.tipAmount === option.value && option.id !==
                    'other' && styles.selectedTipOptionText
                  ]}
                >

                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}

          </View>

          {showCustomTip && (
            <View
              style={styles.customTipContainer}>
              <TextInput
                style={styles.customTipInput}

                placeholder="Enter tip amount"
                keyboardType="number-pad"
                value={customTipAmount}

                onChangeText={handleCustomTipChange}
              />
              <TouchableOpacity

                style={styles.customTipButton}
                onPress={handleCustomTipApply}
              >
                <Text
                  style={styles.customTipButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>

          )}
        </View>

        {/* Additional Options Section */}
        <View style={styles.additionalOptionsSection}>

          <View style={styles.optionRow}>
            <View style={styles.optionLeft}>

              <CreditCard size={20}
                color={colors.text} />
              <View style={styles.optionInfo}>
                <Text
                  style={styles.optionTitle}>Insufficient Shopee
                  Coins</Text>
                <TouchableOpacity>
                  <Info size={14} color={colors.lightText}
                    style={styles.infoIcon} />
                </TouchableOpacity>
              </View>
            </View>

            <Switch

              value={false}
              disabled={true}
              trackColor={{
                false:
                  '#f4f4f4', true: `${colors.primary}50`
              }}
              thumbColor={false ?
                colors.primary : '#f4f4f4'}
            />
          </View>

          <View
            style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Truck size={20}
                color={colors.text} />
              <View style={styles.optionInfo}>

                <Text style={styles.optionTitle}>Delivery to Door</Text>
                <TouchableOpacity>

                  <Info size={14} color={colors.lightText} style={styles.infoIcon} />

                </TouchableOpacity>

              </View>
            </View>
            <Text style={styles.optionPrice}>[5.000đ]</Text>
          </View>

          <View style={styles.optionRow}>

            <View style={styles.optionLeft}>
              <Utensils size={20} color={colors.text} />
              <View
                style={styles.optionTextContainer}>

                <Text style={styles.optionTitle}>Take Cutlery</Text>
                <Text
                  style={styles.optionDescription}>
                  Cutlery will be provided.

                  Let's reduce waste on your
                  next order!
                </Text>
              </View>
            </View>
            <Switch

              value={checkoutPreferences.includeCutlery}
              onValueChange={(value) =>
                setIncludeCutlery(value)}
              trackColor={{
                false: '#f4f4f4', true:
                  `${colors.primary}50`
              }}
              thumbColor={checkoutPreferences.includeCutlery ? colors.primary :
                '#f4f4f4'}
            />
          </View>

          <TouchableOpacity

            style={styles.noteRow}
            onPress={() =>
              setNoteModalVisible(true)}
          >
            <FileText size={20} color={colors.text} />

            <View style={styles.noteTextContainer}>
              <Text
                style={styles.noteTitle}>Note</Text>
              <Text
                style={styles.noteText}>
                {checkoutPreferences.note || 'None'}
              </Text>

            </View>
            <ChevronRight size={18} color={colors.lightText} />

          </TouchableOpacity>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentMethodSection}>

          <View style={styles.paymentMethodHeader}>
            <Text
              style={styles.paymentMethodTitle}>Payment Method</Text>
          </View>

          <View
            style={styles.paymentMethods}>
            <TouchableOpacity
              style={[

                styles.paymentMethod,
                checkoutPreferences.selectedPaymentMethod === 'shopeepay' &&
                styles.selectedPaymentMethod
              ]}
              onPress={() =>
                setSelectedPaymentMethod('shopeepay')}
            >
              <Text style={styles.paymentMethodText}>ShopeePay
                *4071</Text>

              {checkoutPreferences.selectedPaymentMethod === 'shopeepay' && (
                <View
                  style={styles.selectedIndicator}>

                  <Check size={12} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[

                styles.paymentMethod,
                checkoutPreferences.selectedPaymentMethod === 'cash' && styles.selectedPaymentMethod

              ]}
              onPress={() => setSelectedPaymentMethod('cash')}
            >
              <Text
                style={styles.paymentMethodText}>Cash</Text>
              {checkoutPreferences.selectedPaymentMethod
                === 'cash' && (
                  <View style={styles.selectedIndicator}>
                    <Check size={12}
                      color={colors.background} />
                  </View>
                )}

            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.otherPaymentMethodsButton}>
            <Text style={styles.otherPaymentMethodsText}>Other payment
              methods</Text>
          </TouchableOpacity>
        </View>


        {/* Terms Section */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By
            clicking "Place Order", you agree to ShopeeFood{' '}
            <Text
              style={styles.termsLink}>Term of
              service</Text>
          </Text>
        </View>
      </ScrollView>

      {/* 
Place Order Button */}
      <View style={styles.footer}>

        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            isProcessing &&
            styles.disabledButton
          ]}

          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.background}
              size="small" />
          ) : (
            <Text style={styles.placeOrderButtonText}>
              Place Order · {total.toLocaleString('vi-VN')}đ
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
              <ChevronLeft
                size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select
              Delivery Address</Text>
          </View>

          <ScrollView
            style={styles.modalContent}>
            {savedAddresses.map((address) => (
              <TouchableOpacity

                key={address.id}
                style={styles.addressItem}
                onPress={() =>
                  handleSelectAddress(address)}
              >
                <View style={styles.addressItemContent}>
                  <View
                    style={styles.addressItemHeader}>
                    <Text
                      style={styles.addressItemLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View
                        style={styles.defaultBadge}>
                        <Text
                          style={styles.defaultBadgeText}>Default</Text>

                      </View>
                    )}
                  </View>

                  <Text style={styles.addressItemText}>{address.address}</Text>
                  <Text style={styles.addressItemPhone}>Nguyễn Hưng Thịnh |
                    0944034769</Text>
                </View>


                <View style={styles.addressItemRadio}>
                  <View
                    style={styles.radioOuter}>

                    {checkoutPreferences.selectedAddress.id === address.id && (
                      <View style={styles.radioInner} />

                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}


            <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => {

                setAddressModalVisible(false);
                router.push('/location');

              }}
            >
              <Text style={styles.addAddressButtonText}>+ Add New
                Address</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity

            style={styles.modalConfirmButton}
            onPress={() =>
              setAddressModalVisible(false)}
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
        <SafeAreaView
          style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() =>
                setDeliveryModalVisible(false)}
              style={styles.modalBackButton}
            >

              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text
              style={styles.modalTitle}>Delivery Options</Text>
          </View>

          <ScrollView
            style={styles.modalContent}>
            {deliveryOptions.map((option) => (
              <TouchableOpacity
                key={option.id}

                style={styles.deliveryOptionItem}
                onPress={() => handleSelectDeliveryOption(option)}

                disabled={!option.isAvailable}
              >
                <View
                  style={styles.deliveryOptionContent}>
                  <Text
                    style={styles.deliveryOptionName}>{option.name}</Text>
                  <Text
                    style={styles.deliveryOptionDescription}>
                    {option.description}
                  </Text>
                  <Text
                    style={styles.deliveryOptionPrice}>

                    {option.price.toLocaleString('vi-VN')}đ

                  </Text>
                </View>

                <View style={styles.deliveryOptionRadio}>
                  <View style={styles.radioOuter}>
                    {checkoutPreferences.deliveryOption === option.id && (
                      <View style={styles.radioInner}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.modalConfirmButton}

            onPress={() => setDeliveryModalVisible(false)}
          >
            <Text
              style={styles.modalConfirmButtonText}>Confirm</Text>
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
              <ChevronLeft size={24}
                color={colors.text} />
            </TouchableOpacity>
            <Text
              style={styles.modalTitle}>Add Note</Text>
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
            <Text style={styles.noteCharCount}>

              {checkoutPreferences.note.length}/200
            </Text>
          </View>


          <TouchableOpacity
            style={styles.modalConfirmButton}
            onPress={handleSaveNote}
          >

            <Text style={styles.modalConfirmButtonText}>Save</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </Modal>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },
  backButton: {
    padding: 8,

  },
  scrollContainer: {
    flex:
      1,
    backgroundColor: '#f5f5f5',
  },


  // Address Section
  addressSection: {
    backgroundColor: colors.background,

    padding: 16,
    marginBottom: 8,
  },
  addressHeader: {
    flexDirection:
      'row',
    alignItems: 'flex-start',
  },
  addressInfo: {

    flex: 1,
    marginLeft: 12,

  },
  addressText: {

    fontSize:
      14,
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

  // Delivery Time Section

  deliveryTimeSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom:
      8,
  },
  deliveryTimeHeader: {
    flexDirection: 'row',
    alignItems:
      'center',
    marginBottom: 12,
  },
  deliveryTimeLabel: {
    fontSize:
      14,
    color: colors.text,
    fontWeight: '500',
    marginLeft:
      12,
    flex: 1,
  },
  scheduleButton: {

    marginLeft: 8,
  },
  scheduleButtonText: {
    color: colors.primary,

    fontSize: 14,
  },
  deliveryOptionButton: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    backgroundColor:
      '#f9f9f9',

    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',

  },
  deliveryOptionText: {
    fontSize: 14,
    color: colors.text,
  },


  // Order Items Section
  orderItemsSection: {
    backgroundColor: colors.background,
    padding:
      16,
    marginBottom: 8,

  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom:
      16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom:
      12,
  },

  itemQuantity: {
    width: 30,
    fontSize: 14,
    color:
      colors.primary,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex:
      1,
  },
  itemName:
  {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  itemOptions: {
    fontSize: 12,

    color: colors.lightText,
  },
  itemPrice: {
    fontSize: 14,

    color: colors.text,
    fontWeight: '500',

  },
  viewLessButton: {

    alignItems: 'center',
    marginTop: 8,
  },
  viewLessText: {
    fontSize: 14,
    color:
      colors.primary,
  },


  // Recommended Section
  recommendedSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,

  },
  recommendedItems: {
    marginHorizontal: -16,

    paddingHorizontal: 16,
  },
  recommendedItem: {

    width: 120,
    marginRight: 12,
    position:
      'relative',

  },

  recommendedItemImage: {
    width: 120,
    height:
      120,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendedItemName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  recommendedItemPrice: {
    fontSize:
      14,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    position:
      'absolute',
    right: 8,
    bottom: 8,
    width:
      24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent:
      'center',
    alignItems: 'center',
  },
  addButtonText:
  {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },


  // Payment Details Section
  paymentDetailsSection: {
    backgroundColor: colors.background,
    padding:
      16,
    marginBottom: 8,
  },
  paymentRow: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,

  },
  paymentLabelWithInfo: {
    flexDirection: 'row',
    alignItems:
      'center',
  },
  paymentLabel: {
    fontSize: 14,
    color:
      colors.lightText,
  },
  infoIcon: {
    marginLeft: 4,
  },

  paymentValue: {
    fontSize: 14,
    color: colors.text,
  },
  discountText: {
    color: colors.success,

  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor:
      colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',

    color: colors.text,
  },
  totalValueContainer: {
    alignItems: 'flex-end',

  },
  totalValue: {
    fontSize:
      16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,

  },
  taxNote: {
    fontSize: 12,
    color: colors.lightText,
    fontStyle:
      'italic',
  },

  // Voucher Section
  voucherSection: {
    backgroundColor:
      colors.background,
    padding: 16,
    marginBottom:
      8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:
      'center',
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems:
      'center',
  },
  voucherIcon: {
    marginRight: 12,
  },
  voucherText: {
    fontSize: 14,
    color: colors.text,
  },
  voucherRight: {
    flexDirection: 'row',
    alignItems:
      'center',
  },
  selectVoucherText: {
    fontSize: 14,
    color:
      colors.lightText,
    marginRight: 4,
  },


  // Tip Section
  tipSection: {
    backgroundColor: colors.background,
    padding:
      16,
    marginBottom: 8,
  },
  tipHeader:
  {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight:
      'bold',
    color: colors.text,
  },
  tipOptions: {
    flexDirection:
      'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,

  },
  tipOption: {
    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal:
      16,
    marginHorizontal: 4,
    marginBottom: 8,

    minWidth: 60,
    alignItems: 'center',

  },
  selectedTipOption: {
    borderColor: colors.primary,
    backgroundColor:
      `${colors.primary}10`,
  },
  tipOptionText: {
    fontSize: 14,

    color: colors.text,
  },

  selectedTipOptionText: {
    color: colors.primary,
    fontWeight: '500',

  },

  customTipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  customTipInput: {
    flex: 1,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize:
      14,
    marginRight: 8,
  },

  customTipButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,

    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems:
      'center',
  },
  customTipButtonText: {
    color:
      colors.background,
    fontSize: 14,
    fontWeight: '500',
  },


  // Additional Options Section
  additionalOptionsSection: {
    backgroundColor:
      colors.background,
    padding: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection:
      'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 12,
    borderBottomWidth: 1,

    borderBottomColor: colors.border,
  },
  optionLeft: {
    flexDirection: 'row',

    alignItems: 'center',
    flex: 1,
  },
  optionInfo:
  {
    flexDirection: 'row',
    alignItems: 'center',

    marginLeft: 12,
  },
  optionTextContainer: {
    marginLeft: 12,

    flex: 1,
  },
  optionTitle: {
    fontSize: 14,

    color: colors.text,
    marginBottom:
      4,

  },
  optionDescription: {
    fontSize: 12,
    color: colors.lightText,
    lineHeight: 16,
  },
  optionPrice: {
    fontSize: 14,
    color: colors.text,
  },
  noteRow: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical:
      12,
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

  // Payment Method Section
  paymentMethodSection:
  {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 8,
  },
  paymentMethodHeader: {
    marginBottom: 16,

  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,

  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentMethod:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 4,
    marginBottom:
      8,

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
    justifyContent: 'center',

    alignItems: 'center',
  },
  otherPaymentMethodsButton: {
    alignItems:
      'center',
  },
  otherPaymentMethodsText: {

    fontSize: 14,
    color: colors.primary,
  },

  // Terms Section 
  termsSection: {
    padding: 16,
    marginBottom:
      80, // Extra space for the fixed footer

  },
  termsText: {
    fontSize: 12,
    color: colors.lightText,
    textAlign:
      'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right:
      0,
    backgroundColor: colors.background,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor:
      colors.border,
  },
  placeOrderButton: {

    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius:
      4,
    alignItems: 'center',
  },
  disabledButton:
  {

    opacity: 0.7,
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },

  // Modal Styles
  modalContainer: {
    flex:
      1,
    backgroundColor: colors.background,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth:
      1,
    borderBottomColor: colors.border,
  },
  modalBackButton: {

    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',

    color: colors.text,
    marginLeft: 8,
  },

  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalConfirmButton:
  {
    backgroundColor: colors.primary,
    padding:
      16,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    fontSize:
      16,
    fontWeight: 'bold',
    color: colors.background,
  },


  // Address Modal Styles
  addressItem: {
    flexDirection: 'row',

    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 8,
  },
  addressItemContent: {
    flex: 1,

  },
  addressItemHeader: {
    flexDirection: 'row',
    alignItems:
      'center',
    marginBottom: 8,
  },

  addressItemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight:
      8,
  },
  defaultBadge:
  {

    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize:
      10,
    color: colors.primary,
  },
  addressItemText:
  {
    fontSize: 14,
    color: colors.text,
    marginBottom:
      4,
    lineHeight: 20,
  },
  addressItemPhone: {
    fontSize: 14,
    color: colors.lightText,
  },

  addressItemRadio: {
    width: 30,

    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressButton:
  {
    padding: 16,
    borderWidth: 1,
    borderStyle:
      'dashed',
    borderColor: colors.primary,
    borderRadius:
      8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:
      16,
  },
  addAddressButtonText: {
    fontSize: 14,
    color: colors.primary,

    fontWeight: '500',
  },

  // Delivery Options Modal Styles

  deliveryOptionItem: {

    flexDirection:
      'row',
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
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,

  },
  deliveryOptionDescription: {
    fontSize: 14,
    color: colors.lightText,

    marginBottom: 4,
  },
  deliveryOptionPrice: {
    fontSize:
      14,
    color: colors.primary,
    fontWeight: '500',
  },

  deliveryOptionRadio: {
    width: 30,
    justifyContent: 'center',
    alignItems:
      'center',
  },

  // Note Modal Styles
  noteInputContainer: {

    flex: 1,
    padding: 16,
  },
  noteInput:
  {
    flex: 1,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,

    color: colors.text,
    textAlignVertical:
      'top',
  },
  noteCharCount: {
    fontSize: 12,
    color:
      colors.lightText,
    alignSelf: 'flex-end',
    marginTop: 8,

  },

  // Radio Button Styles
  radioOuter: {
    width: 20,
    height:
      20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,

    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },

});