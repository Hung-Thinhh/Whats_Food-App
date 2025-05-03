import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Ticket, 
  Coins, 
  CreditCard, 
  MapPin, 
  Users, 
  HelpCircle, 
  Store,
  FileText,
  Settings,
  Utensils,
  ChevronRight,
  User,
  Phone,
  Mail,
  Edit
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const menuItems = [
    {
      id: 'vouchers',
      icon: Ticket,
      title: 'My Vouchers',
      route: '/vouchers',
    },
    {
      id: 'coins',
      icon: Coins,
      title: 'My Shopee Coins',
      subtitle: '200 Coins',
      route: '/coins',
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Payment',
      route: '/payment-methods',
    },
    {
      id: 'address',
      icon: MapPin,
      title: 'Address',
      route: '/addresses',
    },
    {
      id: 'invite',
      icon: Users,
      title: 'Invite Friends',
      route: '/invite',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Help Centre',
      route: '/help',
    },
    {
      id: 'shop',
      icon: Store,
      title: 'For Shop Owners',
      route: '/shop-owners',
    },
    {
      id: 'policy',
      icon: FileText,
      title: 'User Policy',
      route: '/policy',
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Settings',
      route: '/settings',
    },
    {
      id: 'about',
      icon: Utensils,
      title: 'About ShopeeFood',
      route: '/about',
    },
  ];

  const handleMenuItemPress = (route: string) => {
    router.push(route);
  };
  
  const handleLoginPress = () => {
    router.push('/auth/login');
  };
  const handleRegisterPress = () => {
    router.push('/auth/register');
  };
  
  const handleLogoutPress = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            // No need to navigate as the user will stay on the profile screen
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            {isAuthenticated && user ? (
              <>
                <Image 
                  source={{ 
                    uri: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww' 
                  }} 
                  style={styles.avatar} 
                />
                <Text style={styles.userName}>{user.name || 'User'}</Text>
                
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEditProfile}
                >
                  <Edit size={16} color={colors.background} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.avatarPlaceholder}>
                  <User size={40} color={colors.background} />
                </View>
                <Text style={styles.loginPrompt}>Login to your account</Text>
                
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleLoginPress}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleRegisterPress}
                >
                  <Text style={styles.loginButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        {isAuthenticated && user && (
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoItem}>
              <Phone size={20} color={colors.primary} style={styles.userInfoIcon} />
              <Text style={styles.userInfoText}>{user.phoneNumber}</Text>
            </View>
            
            {user.email && (
              <View style={styles.userInfoItem}>
                <Mail size={20} color={colors.primary} style={styles.userInfoIcon} />
                <Text style={styles.userInfoText}>{user.email}</Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            
            return (
              <TouchableOpacity 
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <IconComponent size={20} color={colors.primary} />
                </View>
                
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                
                {item.subtitle ? (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                ) : (
                  <ChevronRight size={20} color={colors.lightText} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {isAuthenticated && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.versionText}>
          Version 7.40.1{'\n'}
          Foody Corporation
        </Text>
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
    padding: 20,
    backgroundColor: '#FF5722',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.background,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 8,
  },
  loginPrompt: {
    fontSize: 16,
    color: colors.background,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.background,
    marginLeft: 4,
    fontWeight: '500',
  },
  userInfoContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  userInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoIcon: {
    marginRight: 12,
  },
  userInfoText: {
    fontSize: 14,
    color: colors.text,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.text,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 20,
    lineHeight: 18,
  },
});