import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="location" options={{ headerTitle: "Delivery Address" }} />
      <Stack.Screen name="map-location" options={{ headerTitle: "Vị trí" }} />
      <Stack.Screen name="cart" options={{ headerTitle: "Giỏ hàng" }} />
      <Stack.Screen name="checkout/[id]" options={{ headerTitle: "Đặt hàng" }} />
      <Stack.Screen name="auth/login" options={{ headerTitle: "Đăng ký" }} />
      <Stack.Screen name="auth/register" options={{ headerTitle: "Đăng nhập" }} />
      <Stack.Screen name="auth/verify" options={{ headerTitle: "Verification" }} />
      <Stack.Screen name="profile/edit" options={{ headerTitle: "Edit Profile" }} />
      <Stack.Screen name="auth/create-password" options={{ headerTitle: "Create Password" }} />
      <Stack.Screen name="vouchers" options={{ headerTitle: "My Vouchers" }} />
      <Stack.Screen name="add-new-address" options={{ headerTitle: "Add address" }} />
      <Stack.Screen name="new-address-map" options={{ headerTitle: "Add address" }} />
      <Stack.Screen name="dish/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
      {/* G7FPQBG9Y97PPZTEWJ4LQHWM */}
    </Stack>
  );
}
