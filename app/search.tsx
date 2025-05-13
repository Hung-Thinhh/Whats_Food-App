import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, ArrowLeft, Star } from "lucide-react-native";
import { useAppStore } from "@/store/useAppStore";
import { debounce } from "lodash";
import colors from "@/constants/colors";
import SearchApiRequest from "@/api/search.api";

export default function SearchScreen() {
  const router = useRouter();
  const { recentSearches, addRecentSearch } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Set initial search query
    setSearchQuery("");
    debouncedSearch("");
  }, []);

  const handleSearch = async (text) => {
    if (text.trim().length > 0) {
      try {
        const { payload } = await SearchApiRequest.search(text);
        if (payload.EC === "0") {
          setSearchResults(payload.DT.results || []);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        Alert.alert("Lỗi", "Không thể tải kết quả tìm kiếm. Vui lòng thử lại.");
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Debounce search để tránh gọi API quá nhiều khi gõ
  const debouncedSearch = debounce((text) => {
    handleSearch(text);
  }, 300);

  // Xử lý khi nhấn nút Search
  const handleSearchButton = () => {
    if (searchQuery.trim().length > 0) {
      addRecentSearch(searchQuery);
      handleSearch(searchQuery); // Gọi API ngay lập tức
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      addRecentSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRestaurantPress = (restaurantId) => {
    if (searchQuery.trim().length > 0) {
      addRecentSearch(searchQuery);
    }
    router.push(`/restaurant/${restaurantId}`);
  };

  const renderMenuItem = (item, restaurantId) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleRestaurantPress(restaurantId)}
        activeOpacity={0.7}
      >
        {item.image && (
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/60" }}
            style={styles.menuItemImage}
          />
        )}
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemPrice}>{`${item.price.toLocaleString(
            "vi-VN"
          )}đ`}</Text>
        </View>
        
      </TouchableOpacity>
    );
  };

  const renderRestaurantItem = ({ item }) => {
    return (
      <View style={styles.restaurantItem}>
        <TouchableOpacity
          style={styles.restaurantHeader}
          onPress={() => handleRestaurantPress(item.restaurant._id)}
          activeOpacity={0.7}
        >
          <View style={styles.restaurantImageContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/80" }} // Hình ảnh mặc định
              style={styles.restaurantImage}
            />
            {item.restaurant.status === "open" && (
              <View style={styles.statusTag}>
                <Text style={styles.statusTagText}>Mở cửa</Text>
              </View>
            )}
          </View>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantLabel}>
              <View style={styles.restaurantNameRow}>
                <Text style={styles.restaurantName} numberOfLines={1}>
                  {item.restaurant.name}
                </Text>
              </View>

              <View style={styles.restaurantMetrics}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFC107" fill="#FFC107" />
                  <Text style={styles.ratingText}>
                    {/* {item.restaurant.rating && item.restaurant.rating?.toFixed(1) || '0.0'} */}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.menuItemsContainer}>
              {item.foods.map((food) =>
                renderMenuItem(food, item.restaurant._id)
              )}

              {item.foods.length > 0 && (
                <TouchableOpacity
                  style={styles.viewMoreButton}
                  onPress={() => handleRestaurantPress(item.restaurant._id)}
                >
                  <Text style={styles.viewMoreText}>Xem thêm món</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm quán ăn, món ăn..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              debouncedSearch(text);
            }}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearSearch}
            >
              <X size={20} color={colors.lightText} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchButton}
          >
            <Search size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {searchResults.length === 0 && searchQuery && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Không tìm thấy kết quả</Text>
          <Text style={styles.tryAgainText}>
            Hãy thử tìm kiếm với từ khóa khác
          </Text>
        </View>
      )}

      <FlatList
        data={searchResults}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.restaurant._id}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Nền sáng, giống giao diện ứng dụng thực tế
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF", // Header trắng để nổi bật
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    elevation: 2, // Shadow nhẹ cho Android
    shadowColor: "#000", // Shadow cho iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Nền search bar xám nhạt
    borderRadius: 12, // Bo góc lớn hơn
    paddingHorizontal: 12,
    height: 44, // Tăng chiều cao để giống giao diện thực tế
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
    paddingHorizontal: 4,
    fontFamily: "System", // Font chữ chuẩn
  },
  clearButton: {
    padding: 6,
  },
  searchButton: {
    padding: 6,
    marginLeft: 4,
    borderRadius: 8,
    backgroundColor: "#E0E0E0", // Nền nút Search xám nhạt
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  restaurantItem: {
    marginBottom: 16, // Tăng khoảng cách giữa các nhà hàng
    backgroundColor: "#FFFFFF", // Card trắng
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  restaurantHeader: {
    flexDirection: "row",
    padding: 16, // Tăng padding để thoáng hơn
  },
  restaurantInfo: {
    flex: 1,
    justifyContent: "center",
  },
  restaurantNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8, // Tăng khoảng cách
  },
  restaurantName: {
    fontSize: 18, // Tăng kích thước chữ
    fontWeight: "700", // Đậm hơn
    color: colors.text,
    flex: 1,
  },
  restaurantLabel:{
    height:90
  },
  restaurantMetrics: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
    fontWeight: "500",
  },
  restaurantImageContainer: {
    position: "relative",
    width: 90, // Tăng kích thước hình ảnh
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Viền nhẹ
  },
  restaurantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusTag: {
    position: "absolute",
    bottom: 8, // Đặt ở góc dưới bên phải
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  menuItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    // backgroundColor: "#FAFAFA", // Nền món ăn nhạt hơn
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16, // Tăng kích thước chữ
    color: colors.text,
    fontWeight: "500",
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "600",
  },
  menuItemImage: {
    width: 50, // Tăng kích thước hình ảnh món ăn
    height: 50,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  viewMoreText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "600",
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: colors.lightText,
    fontWeight: "500",
    marginBottom: 8,
  },
  tryAgainText: {
    fontSize: 14,
    color: colors.placeholder,
  },
});
