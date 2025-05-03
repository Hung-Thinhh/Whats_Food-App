import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Tag, ChevronRight, FileText } from 'lucide-react-native';
import colors from '@/constants/colors';

const mockPromotions = [
  {
    id: '1',
    title: 'GIẢM 99.000Đ, ăn ngon cuối tuần',
    description: "🍕 Bún Trộn Chi Cục 🍕 The Pizza Company🍕 Bento Delichi... 💛Đặt ShopeeFood thôi!",
    date: '26/04/2023 17:05',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emF8ZW58MHx8MHx8fDA%3D',
    badgeText: 'GIẢM 99K',
  },
  {
    id: '2',
    title: 'Bữa xế CHỈ 0Đ tới đâyyyy!',
    description: "🧡 Khi nhập mã 55SIEUDEAL0Đ 🧡 Giảm 25.000Đ đơn từ 25.000Đ 🧡 Bánh tráng, bánh flan, đồ... 🧡 Xế chiều buồn miệng, order cho tiện!",
    date: '26/04/2023 13:40',
    image: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RyZWV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
    badgeText: 'FREESHIP 0Đ',
  },
  {
    id: '3',
    title: 'Ăn trưa nha! GIẢM 55.000Đ nè',
    description: "🧡 Busan Korean Food 🧡 Mì Quảng 3 Anh Em 🧡 Otoke Chicken, Papas' Chicken 🧡 Steak Bin & Pizza... Đặt ngay!",
    date: '26/04/2023 10:39',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnViYmxlJTIwdGVhfGVufDB8fDB8fHww',
    badgeText: 'GIẢM 55K',
  },
  {
    id: '4',
    title: 'Ăn sáng CHỈ 0Đ quá đã!',
    description: "🧡 Giảm 30.000Đ đơn từ 30.000Đ 🧡Bún chả, phở cuốn, bánh mì, cà phê... 🧡 Đói mòn, ăn sáng đi nào bạn ơi!",
    date: '26/04/2023 06:01',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlldG5hbWVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D',
    badgeText: 'FREESHIP 0Đ',
  },
  {
    id: '5',
    title: 'Thứ 6 GIẢM KHÔNG GIỚI HẠN',
    description: "🧡 Khi nhập mã T6GIAM15 🧡 Giảm 15% không giới hạn 🧡Com, bún thịt nướng, bánh canh... 🧡 Đặt ngay, món ngon giao tới đây!",
    date: '26/04/2023 05:30',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hpY2tlbiUyMHJpY2V8ZW58MHx8MHx8fDA%3D',
    badgeText: 'GIẢM 15%',
  },
];

export default function NotificationsScreen() {
  const [activeSection, setActiveSection] = useState('Promotions');

  const renderPromotionItem = ({ item }: { item: typeof mockPromotions[0] }) => (
    <TouchableOpacity style={styles.promotionItem}>
      <View style={styles.promotionHeader}>
        <Image source={{ uri: item.image }} style={styles.promotionImage} />
        <View style={styles.promotionBadge}>
          <Text style={styles.promotionBadgeText}>{item.badgeText}</Text>
        </View>
      </View>
      
      <View style={styles.promotionContent}>
        <Text style={styles.promotionTitle}>{item.title}</Text>
        <Text style={styles.promotionDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.promotionDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>
      
      <ScrollView>
        <TouchableOpacity 
          style={styles.sectionItem}
          onPress={() => setActiveSection('News')}
        >
          <View style={styles.sectionIcon}>
            <Bell size={20} color={colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>News</Text>
            <Text style={styles.sectionEmpty}>No News yet</Text>
          </View>
          <ChevronRight size={20} color={colors.lightText} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sectionItem}
          onPress={() => setActiveSection('Updates')}
        >
          <View style={styles.sectionIcon}>
            <FileText size={20} color={colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Key Updates</Text>
            <Text style={styles.sectionEmpty}>No updates yet</Text>
          </View>
          <ChevronRight size={20} color={colors.lightText} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <Text style={styles.promotionsTitle}>Promotions</Text>
        
        <FlatList
          data={mockPromotions}
          renderItem={renderPromotionItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 75, 58, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  sectionEmpty: {
    fontSize: 14,
    color: colors.lightText,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  promotionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    padding: 16,
  },
  promotionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  promotionHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  promotionImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  promotionBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  promotionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  },
  promotionContent: {
    paddingHorizontal: 4,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  promotionDate: {
    fontSize: 12,
    color: colors.lightText,
  },
});