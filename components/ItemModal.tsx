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
import { X, Minus, Plus, Check } from "lucide-react-native";
import colors from "@/constants/colors";
import { MenuItem, MenuItemOption } from "@/types";

interface ItemModalProps {
  visible: boolean;
  onClose: () => void;
  selectedItem: MenuItem | null;
  selectedOptions: Record<string, string | string[]>;
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onAddToCart: () => void;
}

export default function ItemModal({
  visible,
  onClose,
  selectedItem,
  selectedOptions,
  setSelectedOptions,
  quantity,
  setQuantity,
  onAddToCart,
}: ItemModalProps) {
    console.log("selecteditemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", selectedOptions);
    
  const handleOptionSelect = (optionId: string, choiceId: string) => {
    setSelectedOptions((prev) => {
      const option = selectedItem?.options?.find((o) => o.id === optionId);

      if (option?.multiple) {
        const currentSelections = (prev[optionId] as string[]) || [];
        if (currentSelections.includes(choiceId)) {
          return {
            ...prev,
            [optionId]: currentSelections.filter((id) => id !== choiceId),
          };
        } else {
          return {
            ...prev,
            [optionId]: [...currentSelections, choiceId],
          };
        }
      } else {
        return {
          ...prev,
          [optionId]: choiceId,
        };
      }
    });
  };

  const isOptionSelected = (optionId: string, choiceId: string) => {
    const selection = selectedOptions[optionId];
    if (Array.isArray(selection)) {
      return selection.includes(choiceId);
    }
    return selection === choiceId;
  };

  const canAddToCart = () => {
    if (!selectedItem) return false;

    if (selectedItem.options) {
      for (const option of selectedItem.options) {
        if (option.required) {
          const selection = selectedOptions[option.id];
          if (
            !selection ||
            (Array.isArray(selection) && selection.length === 0)
          ) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const calculateItemPrice = () => {
    if (!selectedItem) return 0;

    let totalPrice = selectedItem.price;

    if (selectedItem.options) {
      selectedItem.options.forEach((option) => {
        if (option.multiple) {
          const selectedChoices =
            (selectedOptions[option.id] as string[]) || [];
          selectedChoices.forEach((choiceId) => {
            const choice = option.choices.find((c) => c.id === choiceId);
            if (choice && choice.price) {
              totalPrice += choice.price;
            }
          });
        } else {
          const choiceId = selectedOptions[option.id] as string;
          if (choiceId) {
            const choice = option.choices.find((c) => c.id === choiceId);
            if (choice && choice.price) {
              totalPrice += choice.price;
            }
          }
        }
      });
    }

    return totalPrice * quantity;
  };

  if (!selectedItem) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: selectedItem.image }}
              style={styles.modalImage}
            />

            <View style={styles.modalItemInfo}>
              <Text style={styles.modalItemName}>{selectedItem.name}</Text>
              <Text style={styles.modalItemDescription}>
                {selectedItem.description}
              </Text>
              <Text style={styles.modalItemPrice}>
                {selectedItem.price.toLocaleString("vi-VN")}đ
              </Text>
            </View>

            {selectedItem.options &&
              selectedItem.options.map((option) => (
                <View key={option.id} style={styles.optionSection}>
                  <Text style={styles.optionTitle}>
                    {option.name}{" "}
                    {option.required && (
                      <Text style={styles.requiredText}>*</Text>
                    )}
                  </Text>

                  {option.choices.map((choice) => (
                    <TouchableOpacity
                      key={choice.id}
                      style={[
                        styles.choiceItem,
                        isOptionSelected(option.id, choice.id) &&
                          styles.selectedChoice,
                      ]}
                      onPress={() => handleOptionSelect(option.id, choice.id)}
                    >
                      <View style={styles.choiceContent}>
                        <Text style={styles.choiceName}>{choice.name}</Text>
                        {choice.price && choice.price > 0 && (
                          <Text style={styles.choicePrice}>
                            +{choice.price.toLocaleString("vi-VN")}đ
                          </Text>
                        )}
                      </View>

                      {isOptionSelected(option.id, choice.id) && (
                        <View style={styles.checkIcon}>
                          <Check size={16} color={colors.background} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}

            <View style={styles.quantitySection}>
              <Text style={styles.quantityTitle}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity <= 1 && styles.disabledButton,
                  ]}
                  onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus
                    size={20}
                    color={quantity <= 1 ? colors.lightText : colors.text}
                  />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity((prev) => prev + 1)}
                >
                  <Plus size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                !canAddToCart() && styles.disabledButton,
              ]}
              onPress={onAddToCart}
              disabled={!canAddToCart()}
            >
              <Text style={styles.addToCartText}>
                Add to Cart - {calculateItemPrice().toLocaleString("vi-VN")}đ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  modalItemInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  modalItemDescription: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  optionSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  requiredText: {
    color: colors.error,
  },
  choiceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedChoice: {
    borderColor: colors.primary,
    backgroundColor: "rgba(255, 75, 58, 0.05)",
  },
  choiceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  choiceName: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  choicePrice: {
    fontSize: 14,
    color: colors.primary,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quantitySection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#F5F5F5",
    opacity: 0.7,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.background,
  },
});