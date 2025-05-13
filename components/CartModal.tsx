import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { X, Minus, Plus } from "lucide-react-native";
import colors from "@/constants/colors";
import { CartItem } from "@/types";

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  cartItems: { items: CartItem[]; totalPrice: number } | null;
  restaurantName: string;
  onCheckout: () => void;
  onIncreaseQuantity: (itemId: string, currentQuantity: number) => void;
  onDecreaseQuantity: (itemId: string, currentQuantity: number) => void;
}

export default function CartModal({
  visible,
  onClose,
  cartItems,
  restaurantName,
  onCheckout,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: CartModalProps) {
  if (!cartItems) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalCartContainer}>
        <View style={styles.modalCartContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Giỏ hàng</Text>
            <TouchableOpacity style={styles.closeCartButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollContainer}>
            <View style={styles.modalRestaurantInfo}>
              <Text style={styles.modalRestaurantName}>{restaurantName}</Text>
            </View>

            <View>
              {cartItems.items &&
                cartItems.items.map((selectedItem) => (
                  <View key={selectedItem._id}>
                    <View style={styles.modalCartItem}>
                      <Image
                        source={{ uri: selectedItem.foodId.image || "ok" }}
                        style={styles.modalItemImage}
                      />
                      <View style={styles.modalItemDetails}>
                        <Text style={styles.modalCartName}>
                          {selectedItem.foodId.name}
                        </Text>
                        {selectedItem.topping &&
                          selectedItem.topping.length > 0 && (
                            <View style={styles.modalOptionsContainer}>
                              {selectedItem.topping.map((option, index) => (
                                <Text
                                  key={index}
                                  style={styles.modalOptionGroup}
                                >
                                  {option.item.map((choice) => choice.name).join(", ")}
                                </Text>
                              ))}
                            </View>
                          )}
                        <View style={styles.modalItemPriceRow}>
                          <Text style={styles.modalCartPrice}>
                            {selectedItem.price.toLocaleString("vi-VN")}đ
                          </Text>
                          <View style={styles.modalQuantityControls}>
                            <TouchableOpacity
                              style={styles.modalQuantityButton}
                              onPress={() =>
                                onDecreaseQuantity(
                                  selectedItem._id,
                                  selectedItem.quantity
                                )
                              }
                            >
                              <Minus size={16} color={"#fff"} />
                            </TouchableOpacity>
                            <Text style={styles.modalQuantityText}>
                              {selectedItem.quantity}
                            </Text>
                            <TouchableOpacity
                              style={styles.modalQuantityButton}
                              onPress={() =>
                                onIncreaseQuantity(
                                  selectedItem._id,
                                  selectedItem.quantity
                                )
                              }
                            >
                              <Plus size={16} color={"#fff"} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.modalSummaryContainer}>
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Total</Text>
                <Text style={styles.modalSummaryValue}>
                  {cartItems.totalPrice.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <Text style={styles.modalPriceNote}>
                Giá đã bao gồm thuế, nhưng không bao gồm phí vận chuyển và các loại phí khác
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalCartFooter}>
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={onCheckout}
            >
              <Text style={styles.modalAddButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalCartContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalCartContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  closeCartButton: {
    padding: 4,
  },
  modalScrollContainer: {
    maxHeight: "80%",
  },
  modalRestaurantInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalRestaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
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
  modalQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  modalQuantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff532c",
  },
  modalQuantityText: {
    width: 32,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text,
    backgroundColor: "#fff",
    padding: 4,
  },
  modalOptionsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 5,
  },
  modalOptionGroup: {
    color: "#8c8c8c",
  },
  modalSummaryContainer: {
    padding: 16,
  },
  modalSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalSummaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  modalSummaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  modalPriceNote: {
    fontSize: 12,
    color: colors.lightText,
    fontStyle: "italic",
  },
  modalCartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalAddButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalAddButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});