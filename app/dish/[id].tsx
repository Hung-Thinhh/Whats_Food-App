import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Share2,
  Star,
  Plus,
  ShoppingCart,
} from "lucide-react-native";
import colors from "@/constants/colors";
import { useAppStore } from "@/store/useAppStore";
import foodApiRequest from "@/api/food.api";
import { MenuItem } from "@/types";
import ItemModal from "@/components/ItemModal";
import CartModal from "@/components/CartModal";

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, cart, getCartItemCount, updateCartItemQuantity, removeFromCart } = useAppStore();

  const [dish, setDish] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});

  const cartItemCount = getCartItemCount();

  useEffect(() => {
    async function fetchDish() {
      try {
        setLoading(true);
        const { payload } = await foodApiRequest.get(id);
        if (payload.EC === "0" && payload.DT) {
          const dishData = payload.DT;
          console.log("Dish data:", dishData);
          setDish(dishData);
        } else {
          console.warn("No dish data found");
        }
      } catch (error) {
        console.error("Error fetching dish:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDish();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!dish) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Món ăn không tìm thấy</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!selectedItem) return;

   
      addItemToCart();
    
  };

  const addItemToCart = () => {
    if (!selectedItem) return;

    const formattedOptions = [];

    if (selectedItem.options) {
      for (const option of selectedItem.options) {
        const optionId = option.id;
        const optionName = option.name;
        const selected = selectedOptions[optionId];

        const choices = [];

        if (option.multiple) {
          const selectedChoices = Array.isArray(selected) ? selected : [];
          for (const choiceId of selectedChoices) {
            const choice = option.choices.find((c) => c.id === choiceId);
            if (choice) {
              choices.push(choice.id);
            }
          }
        } else {
          const choiceId = selected as string;
          if (choiceId) {
            const choice = option.choices.find((c) => c.id === choiceId);
            if (choice) {
              choices.push(choice.id);
            }
          }
        }

        if (choices.length > 0) {
          formattedOptions.push({
            id: optionId,
            item: choices,
          });
        }
      }
    }

    const cartItem: AddCartBodyType = {
      restaurantId: dish.restaurant,
      foodId: selectedItem.id,
      quantity: quantity,
      totalPrice: calculateItemPrice(),
      topping: formattedOptions,
    };
    console.log("Cart Item:", JSON.stringify(cartItem));

    addToCart(cartItem);
    setModalVisible(false);

    Alert.alert(
      "Added to Cart",
      `${quantity} x ${selectedItem.name} added to your cart.`
    );
  };

  const handleShare = () => {
    console.log("Share dish:", dish.name);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const renderAvailability = () => {
    return dish.availability.map((day, index) => (
      <View key={index} style={styles.availabilityItem}>
        <Text style={styles.availabilityText}>
          {["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"][
            day.day
          ]}: {day.timeSlots[0].start} - {day.timeSlots[0].end}
        </Text>
      </View>
    ));
  };

  const openItemModal = (item: any) => {
    const formattedItem = {
      id: item._id,
      name: item.name,
      description: item.description || "",
      price: item.price || 0,
      image: item.image || "https://via.placeholder.com/150",
      options: item.topping?.map((topping) => ({
        id: topping._id || `topping-${Date.now()}`,
        name: topping.name || "Option",
        required: topping.option?.type === 1,
        multiple: topping.option?.quantity > 1,
        choices: topping.item?.map((choice) => ({
          id: choice._id || `choice-${Date.now()}`,
          name: choice.name || "Choice",
          price: choice.price || 0,
        })) || [],
      })) || [],
    };
    console.log("Formatted Item:", formattedItem);

    setSelectedItem(formattedItem);

    const initialOptions: Record<string, string | string[]> = {};
    if (item.topping) {
      item.topping.forEach((option) => {
        initialOptions[option._id] =
          option.option?.type === 1 && option.option?.quantity <= 1
            ? option.item[0]?._id || ""
            : [];
      });
    }
    setSelectedOptions(initialOptions);
    setQuantity(1);
    setModalVisible(true);
  };

  const canAddToCart = () => {
    if (!selectedItem) return false;

    if (selectedItem.options) {
      for (const option of selectedItem.options) {
        if (option.required) {
          const selection = selectedOptions[option.id];
          if (!selection || (Array.isArray(selection) && selection.length === 0)) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleOptionSelect = (optionId: string, choiceId: string) => {
    setSelectedOptions((prev) => {
      const option = selectedItem?.options?.find((o) => o.id === optionId);
      if (option?.multiple) {
        const currentSelections = Array.isArray(prev[optionId])
          ? (prev[optionId] as string[])
          : [];
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

  const calculateItemPrice = () => {
    if (!selectedItem) return dish.price;

    console.log("Selected Item:", selectedItem);
    console.log("Selected Options:", selectedOptions);

    let totalPrice = selectedItem.price;

    if (selectedItem.options) {
      selectedItem.options.forEach((option) => {
        if (option.multiple) {
         const selectedChoices =
            (selectedOptions[option.id] as string[]) || [];
          console.log(`Option ${option.id} - Selected Choices:`, selectedChoices);
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

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateCartItemQuantity(itemId, currentQuantity + 1, "increase");
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItemQuantity(itemId, currentQuantity - 1, "decrease");
    } else {
      Alert.alert("Xóa món", "Bạn có chắc muốn xóa món này khỏi giỏ hàng?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => updateCartItemQuantity(itemId, currentQuantity - 1, "decrease"),
          style: "destructive",
        },
      ]);
    }
  };

  const openCartModal = () => {
    setCartModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: dish.image }} style={styles.dishImage} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.dishName}>{dish.name}</Text>
          <Text style={styles.dishDescription}>
            {dish.description || "Chưa có mô tả"}
          </Text>
          <View style={styles.containerPrice}>
            <Text style={styles.priceText}>
              {dish.price.toLocaleString("vi-VN")}đ
            </Text>
            <TouchableOpacity
              style={styles.btn_add}
              onPress={() => openItemModal(dish)}
            >
              <Text style={{ color: "#fff" }}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Bình luận</Text>
          <Text style={styles.noReviewsText}>
            Chưa có bình luận cho món ăn này
          </Text>
        </View>
      </ScrollView>

      <View style={styles.cartContainer}>
        {cartItemCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.cartButton}
          onPress={openCartModal}
        >
          <ShoppingCart size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.priceContainer}>
          <Text style={styles.totalPrice}>
            {(dish.price * quantity).toLocaleString("vi-VN")}đ
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

      <ItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedItem={selectedItem}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
      />

      <CartModal
        visible={cartModalVisible}
        onClose={() => setCartModalVisible(false)}
        cartItems={cartItemCount > 0 ? { items: cart, totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) } : null}
        restaurantName={dish.restaurantName || "Unknown Restaurant"}
        onCheckout={() => router.push("/cart")}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.background,
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 400,
    width: "100%",
    backgroundColor: "#FFE4E1",
  },
  dishImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  dishName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  dishDescription: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 12,
  },
  containerPrice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  divider: {
    height: 8,
    backgroundColor: colors.border,
    marginHorizontal: -16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  availabilityItem: {
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: colors.text,
  },
  noReviewsText: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: "center",
    marginBottom: 16,
  },
  cartContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  cartBadge: {
    position: "absolute",
    top: 8,
    left: 32,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.background,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  priceContainer: {
    flex: 1,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.background,
  },
  btn_add: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: 25,
    display: "flex",
  },
});