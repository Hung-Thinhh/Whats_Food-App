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
  Modal,
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
  Plus,
  Minus,
  Check,
  X,
} from "lucide-react-native";
import { restaurants } from "@/mocks/data";
import { useAppStore } from "@/store/useAppStore";
import { MenuItem, MenuItemOption, CartItem } from "@/types";
import colors from "@/constants/colors";
import RestaurantApiRequest from "@/api/restaurant";
import { RestaurantData } from "@/schema/restaurant.schema";

const mockMenuCategories = ["Popular", "Drinks", "Food", "Snacks", "Desserts"];

// Expanded menu items with categories

// Group menu items by category

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    favorites,
    toggleFavorite,
    addToCart,
    cart,
    getCartItemCount,
    getRestaurantFromCart,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState("Popular");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | string[]>
  >({});
  const [quantity, setQuantity] = useState(1);

  // const restaurant = restaurants.find((r) => r.id === '5');
  const isFavorite = favorites.includes(id as string);

  // Refs for scroll handling
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: number }>({});
  const isScrolling = useRef(false);

  // Get cart info
  const cartItemCount = getCartItemCount();
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
            id: product._id || `temp-${Date.now()}`,
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

  const handleFavoritePress = () => {
    toggleFavorite(id as string);
  };

  const handleSharePress = () => {
    // Share functionality would go here
    console.log("Share restaurant:", restaurant.name);
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);

    // Scroll to the selected category section
    if (scrollViewRef.current && categoryRefs.current[category] !== undefined) {
      isScrolling.current = true;
      scrollViewRef.current.scrollTo({
        y: categoryRefs.current[category],
        animated: true,
      });

      // Reset the flag after animation completes
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Skip if we're programmatically scrolling
    if (isScrolling.current) return;

    const scrollY = event.nativeEvent.contentOffset.y;

    // Find which category section is most visible
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

    // Initialize selected options with defaults
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

    // Check if all required options are selected
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

    // Add price for selected options
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

  const handleAddToCart = () => {
    if (!selectedItem || !canAddToCart()) return;

    // Check if adding from a different restaurant
    if (
      cartRestaurantId &&
      cartRestaurantId !== restaurant._id &&
      cartItemCount > 0
    ) {
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
  
    // Format selected options for cart (the new format)
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
              choices.push({
                id: choice.id,
                name: choice.name,
                price: choice.price || 0,
              });
            }
          }
        } else {
          const choiceId = selected as string;
          if (choiceId) {
            const choice = option.choices.find((c) => c.id === choiceId);
            if (choice) {
              choices.push({
                id: choice.id,
                name: choice.name,
                price: choice.price || 0,
              });
            }
          }
        }
  
        if (choices.length > 0) {
          formattedOptions.push({
            id: optionId,
            name: optionName,
            choices,
          });
        }
      }
    }
  
    // Create cart item
    const cartItem: CartItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: quantity,
      image: selectedItem.image,
      options: formattedOptions.length > 0 ? formattedOptions : undefined,
    };
  
    addToCart(cartItem);
    setModalVisible(false);
  
    Alert.alert(
      "Added to Cart",
      `${quantity} x ${selectedItem.name} added to your cart.`
    );
  };
  

  const renderItemModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
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
                onPress={handleAddToCart}
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

            <View style={styles.tagsContainer}>
              {/* {restaurant.tags.map((tag, index) => (
                <View key={index} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))} */}
            </View>

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
                      // Store the y-position of each category section
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
                          // onPress={() => openItemModal(item)}
                        >
                          <View style={styles.menuItemContent}>
                            <Image
                              source={{ uri: item.image }}
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
                              <Text style={{color:'#fff'}}>
                                +
                              </Text>
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

      {cartItemCount > 0 && (
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => router.push("/cart")}
        >
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.cartText}>View Cart</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push("/checkout")}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {renderItemModal()}
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: "rgba(255, 75, 58, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
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
  btn_add: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    color:'#fff',
    fontSize:25,
    display:'flex',
  },
});
