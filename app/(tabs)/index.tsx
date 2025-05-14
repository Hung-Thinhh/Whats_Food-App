import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AddressBar from "@/components/AddressBar";
import SearchBar from "@/components/SearchBar";
import BannerCarousel from "@/components/BannerCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import DealsSection from "@/components/DealsSection";
import FlashSaleSection from "@/components/FlashSaleSection";
import RecentVisitsSection from "@/components/RecentVisitsSection";
import CategoryTabs from "@/components/CategoryTabs";
import RestaurantList from "@/components/RestaurantList";
import {
  categories,
  deals,
  flashSaleItems,
  banners,
  recentVisits,
  restaurants,
} from "@/mocks/data";
import colors from "@/constants/colors";
import { getHomeData } from "@/api/home.api"; // đúng đường dẫn file api mới tạo
import { HomeResType } from "@/schema/home.schema";
import { useAppStore } from "@/store/useAppStore";
import { getAccessToken } from "@/storange/auth.storage";

// Remove this code that uses hooks outside of a component
// const {
//   getCartToServer
// } = useAppStore();

export default function HomeScreen() {
  const router = useRouter();
  // Move the useAppStore hook inside the component
  const { getCartToServer, getSavedAddresses } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("Nearby");

  const categoryTabs = ["Gần đây", "Bán chạy", "Đánh giá cao"];

  const handleAddressPress = () => {
    router.push("/location");
  };

  const handleSearchPress = () => {
    router.push("/search");
  };

  const handleCategoryPress = (category: any) => {
    router.push(`/category/${category.id}`);
  };

  const handleDealPress = (deal: any) => {
    router.push(`/deal/${deal.id}`);
  };

  const handleFlashSaleItemPress = (item: any) => {
    router.push(`/flash-sale/${item.id}`);
  };

  const handleRecentVisitPress = (visit: any) => {
    router.push(`/restaurant/${visit.id}`);
  };

  const handleRestaurantPress = (restaurant: any) => {
    console.log("Restaurant IDaaaaaaaaaaaaaaaaaaaaaaa:", restaurant._id);

    router.push(`/restaurant/${restaurant._id}`);
  };

  const handleCategoryTabPress = (category: string) => {
    setActiveCategory(category);
  };
  const [homeData, setHomeData] = useState<HomeResType | null>(null);

  useEffect(() => {
    async function fetchHome() {
      try {
        const data = await getHomeData();
        console.log("Home data:", data);
        if(!data) {
          console.log("No data found");
        }
        setHomeData(data.DT);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchCart() {
      try {
        const token = await getAccessToken();
        console.log("Token:", token);
        if (token) {
          const data = await getCartToServer();
          const address = await getSavedAddresses();
          console.log("lấy rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchHome();
    fetchCart();
  }, []); // Add getCartToServer to the dependency array
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <AddressBar onPress={handleAddressPress} />
      <SearchBar onPress={handleSearchPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BannerCarousel banners={banners} />
        <CategoryGrid
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />

        <DealsSection
          title="Bộ sưu tầm"
          deals={deals}
          onDealPress={handleDealPress}
        />

        {/* <FlashSaleSection 
          items={flashSaleItems} 
          onItemPress={handleFlashSaleItemPress}
        /> */}

        <RecentVisitsSection
          visits={recentVisits}
          onVisitPress={handleRecentVisitPress}
        />

        <CategoryTabs
          categories={categoryTabs}
          activeCategory={activeCategory}
          onCategoryPress={handleCategoryTabPress}
        />

        <RestaurantList
          restaurants={homeData}
          onRestaurantPress={handleRestaurantPress}
          listView={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
