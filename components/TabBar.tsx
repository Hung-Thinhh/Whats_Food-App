import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, ClipboardList, Heart, Bell, User } from 'lucide-react-native';
import colors from '@/constants/colors';

interface TabBarProps {
  activeTab: string;
}

export default function TabBar({ activeTab }: TabBarProps) {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/')}
      >
        <Home 
          size={24} 
          color={activeTab === 'home' ? colors.tabBarActive : colors.tabBarInactive} 
        />
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'home' ? colors.tabBarActive : colors.tabBarInactive }
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/orders')}
      >
        <ClipboardList 
          size={24} 
          color={activeTab === 'orders' ? colors.tabBarActive : colors.tabBarInactive} 
        />
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'orders' ? colors.tabBarActive : colors.tabBarInactive }
          ]}
        >
          Đơn hàng
        </Text>
      </TouchableOpacity>

     

      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/notifications')}
      >
        <Bell 
          size={24} 
          color={activeTab === 'notifications' ? colors.tabBarActive : colors.tabBarInactive} 
        />
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'notifications' ? colors.tabBarActive : colors.tabBarInactive }
          ]}
        >
          Thông báo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab}
        onPress={() => router.push('/profile')}
      >
        <User 
          size={24} 
          color={activeTab === 'profile' ? colors.tabBarActive : colors.tabBarInactive} 
        />
        <Text 
          style={[
            styles.tabText, 
            { color: activeTab === 'profile' ? colors.tabBarActive : colors.tabBarInactive }
          ]}
        >
          Tôi
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Giữ nguyên phần styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});