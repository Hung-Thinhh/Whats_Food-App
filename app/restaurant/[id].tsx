import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  Search,
} from "lucide-react-native";
import { useAppStore } from "@/store/useAppStore";
import { MenuItem } from "@/types";
import colors from "@/constants/colors";
import RestaurantApiRequest from "@/api/restaurant";
import { RestaurantData } from "@/schema/restaurant.schema";
import { AddCartBodyType } from "@/schema/cart.schema";
import ItemModal from "@/components/ItemModal"; // Import component mới
import CartModal from "@/components/CartModal"; // Import component mới

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    favorites,
    toggleFavorite,
    addToCart,
    cart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getRestaurantFromCart,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState("Popular");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCartVisible, setModalCartVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | string[]>
  >({});
  const [quantity, setQuantity] = useState(1);

  const isFavorite = favorites.includes(id as string);

  // Refs for scroll handling
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: number }>({});
  const isScrolling = useRef(false);

  // Get cart info
  const cartItemOfRes = getCartItemCount(id);
  const cartRestaurantId = getRestaurantFromCart();

  const [restaurant, setRestaurant] = useState<RestaurantData>();
  const [menu, setMenu] = useState<any>();
  const groupedMenuItems = React.useMemo(() => {
    if (!menu || !menu.sections) return {};

    return menu.sections.reduce((acc, section) => {
      if (!section || !section.products) {
        acc[section.name || "Other"] = [];
        return acc;
      }

      acc[section.name || "Other"] = section.products
        .map((product) => {
          if (!product) return null;

          return {
            id: product.productId._id,
            name: product.productId.name || "Unnamed Product",
            description: product.description || "",
            price: product.productId.price || 0,
            image:
              product.productId?.image || "https://via.placeholder.com/150",
            category: product.name || "",
            options:
              product.productId?.topping
                ?.map((topping) => {
                  if (!topping) return null;

                  return {
                    id: topping._id || `topping-${Date.now()}`,
                    name: topping.name || "Option",
                    required: topping.option?.type === 1,
                    multiple: topping.option?.type === 1,
                    choices:
                      topping.item
                        ?.map((item) => {
                          if (!item) return null;

                          return {
                            id: item._id || `choice-${Date.now()}`,
                            name: item.name || "Choice",
                            price: item.price || 0,
                          };
                        })
                        .filter(Boolean) || [],
                  };
                })
                .filter(Boolean) || [],
          };
        })
        .filter(Boolean);

      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menu]);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const { payload } = await RestaurantApiRequest.getRestaurant(id);
        console.log("resssssssssssssssssssss data:", payload.DT.DT.menu);
        setRestaurant(payload.DT.DT.restaurant);
        setMenu(payload.DT.DT.menu);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRestaurant();
  }, []);

  useEffect(() => {
    console.log("menu", menu);
  }, [menu]);

  if (!restaurant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          onPress: () =>
            updateCartItemQuantity(itemId, currentQuantity - 1, "decrease"),
          style: "destructive",
        },
      ]);
    }
  };

  const handleFavoritePress = () => {
    toggleFavorite(id as string);
  };

  const handleSharePress = () => {
    console.log("Share restaurant:", restaurant.name);
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);

    if (scrollViewRef.current && categoryRefs.current[category] !== undefined) {
      isScrolling.current = true;
      scrollViewRef.current.scrollTo({
        y: categoryRefs.current[category],
        animated: true,
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrolling.current) return;

    const scrollY = event.nativeEvent.contentOffset.y;

    let closestCategory = "Popular";
    let minDistance = Number.MAX_VALUE;

    Object.entries(categoryRefs.current).forEach(([category, position]) => {
      const distance = Math.abs(scrollY - position);
      if (distance < minDistance) {
        minDistance = distance;
        closestCategory = category;
      }
    });

    if (closestCategory !== activeCategory) {
      setActiveCategory(closestCategory);
    }
  };

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    const initialOptions: Record<string, string | string[]> = {};
    if (item.options) {
      item.options.forEach((option) => {
        if (option.required && !option.multiple) {
          initialOptions[option.id] = option.choices[0].id;
        } else if (option.multiple) {
          initialOptions[option.id] = [];
        }
      });
    }

    setSelectedOptions(initialOptions);
    setQuantity(1);
    setModalVisible(true);
  };

  const openCartModal = () => {
    setModalCartVisible(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    if (cartRestaurantId && cartRestaurantId !== restaurant._id) {
      Alert.alert(
        "Replace Cart Items?",
        "Your cart contains items from another restaurant. Would you like to clear your cart and add this item?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Replace",
            onPress: () => addItemToCart(),
          },
        ]
      );
    } else {
      addItemToCart();
    }
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
      restaurantId: restaurant._id,
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

  const handleViewDishDetails = (item: any) => {
    router.push(`/dish/${item.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.background} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleSharePress}
              >
                <Share2 size={24} color={colors.background} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleFavoritePress}
              >
                <Heart
                  size={24}
                  color={colors.background}
                  fill={isFavorite ? colors.primary : "transparent"}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.avt }} style={styles.coverImage} />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Star size={16} color="#FFC107" fill="#FFC107" />
                <Text style={styles.statText}>
                  {restaurant.rating &&
                  typeof restaurant.rating.average === "number"
                    ? restaurant.rating.average.toFixed(1)
                    : "0.0"}
                </Text>
              </View>

              <View style={styles.statItem}>
                <MapPin size={16} color={colors.lightText} />
                <Text style={styles.statText}>
                  {restaurant.distance || 2}km
                </Text>
              </View>

              <View style={styles.statItem}>
                <Clock size={16} color={colors.lightText} />
                <Text style={styles.statText}>
                  {restaurant.deliveryTime || 20}min
                </Text>
              </View>
            </View>

            {restaurant.discount && (
              <View style={styles.discountContainer}>
                <Text style={styles.discountText}>
                  {restaurant.discount.value}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.searchContainer}>
            <Search
              size={18}
              color={colors.lightText}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholder}>
              Search in {restaurant.name}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {Object.keys(groupedMenuItems).map((category) => {
              const isActive = category === activeCategory;

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    isActive && styles.activeCategoryTab,
                  ]}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.activeCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.menuContainer}>
            {Object.keys(groupedMenuItems || {}).length > 0 ? (
              Object.entries(groupedMenuItems).map(([category, items]) => {
                if (!items || items.length === 0) return null;

                return (
                  <View
                    key={category}
                    onLayout={(event) => {
                      categoryRefs.current[category] =
                        event.nativeEvent.layout.y;
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.categoryTitle,
                        activeCategory === category && styles.activeCategory,
                      ]}
                      onPress={() => handleCategoryPress(category)}
                    >
                      <Text style={styles.categoryTitleText}>{category}</Text>
                    </TouchableOpacity>

                    {items &&
                      items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.menuItem}
                          onPress={() => handleViewDishDetails(item)}
                        >
                          <View style={styles.menuItemContent}>
                            <Image
                              source={{ uri: item.image || "ok" }}
                              style={styles.menuItemImage}
                            />
                            <View style={styles.menuItemInfo}>
                              <Text style={styles.menuItemName}>
                                {item.name}
                              </Text>
                              <Text
                                style={styles.menuItemDescription}
                                numberOfLines={2}
                              >
                                {item.description}
                              </Text>
                              <Text style={styles.menuItemPrice}>
                                {item.price.toLocaleString("vi-VN")}đ
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={styles.btn_add}
                              onPress={() => openItemModal(item)}
                            >
                              <Text style={{ color: "#fff" }}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyMenuContainer}>
                <Text style={styles.emptyMenuText}>
                  No menu items available
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {cartItemOfRes &&
        cartItemOfRes.items &&
        cartItemOfRes.items.length > 0 && (
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => openCartModal()}
          >
            <View style={styles.cartInfo}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemOfRes.items.length}
                </Text>
              </View>
              <Text style={styles.cartText}>Giỏ hàng</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push(`/checkout/${id}`)}
            >
              <Text style={styles.checkoutButtonText}>Thanh toán</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

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
        visible={modalCartVisible}
        onClose={() => setModalCartVisible(false)}
        cartItems={cartItemOfRes}
        restaurantName={restaurant.name}
        onCheckout={() => router.push(`/checkout/${id}`)}
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  headerRightContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    height: 250,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  contentContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  discountContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  discountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.lightText,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.border,
  },
  activeCategoryTab: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  activeCategoryText: {
    color: colors.background,
    fontWeight: "bold",
  },
  menuContainer: {
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  cartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cartInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.background,
  },
  cartText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  checkoutButtonText: {
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