import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { ArrowLeft, Star, Send, Image as ImageIcon } from "lucide-react-native";
import colors from "@/constants/colors";
import { getAccessToken } from "@/storange/auth.storage";
import orderApiRequest from "@/api/order.api";

export default function RateDishScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  //   const { getOrderById, rateOrder } = useAppStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Get other dishes from the same restaurant for recommendations

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    const token = await getAccessToken();

    const { payload } = await orderApiRequest.addRating({
      rating,
      comment,
      id,
    },token);
    console.log("Rating submitted successfully",payload);
    if(payload.EC ==="0"){
        
        Alert.alert("Success", "Rating submitted successfully");
        router.back();
    }
    // Submit the rating
    // if (order) {
    // //   rateOrder(order.id);

    //   // Show success message
    //   Alert.alert(
    //     'Thank You!',
    //     'Your rating has been submitted successfully.',
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => router.back()
    //       }
    //     ]
    //   );
    // }
  };

  //   if (!order || !orderItem) {
  //     return (
  //       <View style={styles.container}>
  //         <Stack.Screen
  //           options={{
  //             headerShown: true,
  //             headerTitle: "Đánh giá món ăn",
  //             headerLeft: () => (
  //               <TouchableOpacity onPress={() => router.back()}>
  //                 <ArrowLeft size={24} color={colors.text} />
  //               </TouchableOpacity>
  //             ),
  //           }}
  //         />
  //         <View style={styles.centerContainer}>
  //           <Text style={styles.notFoundText}>Order not found</Text>
  //         </View>
  //       </View>
  //     );
  //   }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Đánh giá món ăn",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.restaurantSection}>
          {/* <Text style={styles.restaurantName}>{order.restaurant.name}</Text>
          <Text style={styles.orderDate}>{order.orderTime}</Text> */}
        </View>

        {/* <View style={styles.dishSection}>
          <Image 
            source={{ uri: orderItem.image }} 
            style={styles.dishImage}
          />
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{orderItem.name}</Text>
            <Text style={styles.dishPrice}>{orderItem.price.toLocaleString()}đ</Text>
          </View>
        </View> */}

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Đánh giá món ăn</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Star
                  size={36}
                  color={star <= rating ? colors.secondary : colors.border}
                  fill={star <= rating ? colors.secondary : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Chia sẻ đánh giá của bạn về món ăn này..."
              placeholderTextColor={colors.lightText}
              multiline
              value={comment}
              onChangeText={setComment}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitRating}
        >
          <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
          <Send size={20} color={colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  restaurantSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.lightText,
  },
  dishSection: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  dishInfo: {
    flex: 1,
    justifyContent: "center",
  },
  dishName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  dishPrice: {
    fontSize: 14,
    color: colors.text,
  },
  ratingSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  starButton: {
    marginHorizontal: 8,
  },
  commentContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
  },
  commentInput: {
    minHeight: 100,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPhotoText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 12,
    color: colors.lightText,
  },
  recommendationSection: {
    padding: 16,
  },
  recommendationSubtitle: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 16,
  },
  recommendedDishes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recommendedDish: {
    width: "48%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    position: "relative",
  },
  recommendedDishSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(255, 75, 58, 0.05)",
  },
  recommendedDishImage: {
    width: "100%",
    height: 100,
    borderRadius: 4,
    marginBottom: 8,
  },
  recommendedDishName: {
    fontSize: 14,
    color: colors.text,
  },
  recommendedDishNameSelected: {
    color: colors.primary,
    fontWeight: "bold",
  },
  recommendedCheckmark: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedCheckmarkText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.background,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.background,
    marginRight: 8,
  },
});
