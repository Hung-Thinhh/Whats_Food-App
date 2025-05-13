import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, Navigation, Plus, Map } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import colors from '@/constants/colors';



export default function LocationScreen() {
  const router = useRouter();
  const { userLocation, setUserLocation,savedAddresses } = useAppStore();
  console.log(savedAddresses);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleAddressSelect = (address) => {
    setUserLocation({ address });
    router.back();
  };

  

  const handleOpenMap = () => {
    router.push('/map-location');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Delivery Address',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.lightText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an address"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View 
              style={styles.addressItem}
            >
              <View style={styles.addressLabelContainer}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.addressLabel}>Vị trí hiện tại</Text>
              </View>
              <Text style={styles.addressText}>{userLocation.address}</Text>
              <Text style={styles.addressText}>{userLocation.name} | {userLocation.phoneNumber}</Text>
            </View>
      
      {Platform.OS !== 'web' && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleOpenMap}
        >
          <Map size={20} color={colors.primary} style={styles.actionIcon} />
          <Text style={styles.actionText}>Select on map</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.savedAddressesContainer}>
        <Text style={styles.sectionTitle}>Saved Addresses</Text>
        
        <FlatList
          data={savedAddresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.addressItem}
              onPress={() => handleAddressSelect(item.address)}
            >
              <View style={styles.addressLabelContainer}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.addressLabel}>Địa chỉ</Text>
              </View>
              <Text style={styles.addressText}>{item.address}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity style={styles.addAddressButton}
            onPress={() => router.push('/add-new-address')}
            >
              <Plus size={20} color={colors.primary} />
              <Text style={styles.addAddressText}>Add a new address</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  savedAddressesContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  addressItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: colors.lightText,
    paddingLeft: 28,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 75, 58, 0.1)',
    borderRadius: 8,
    marginTop: 8,
  },
  addAddressText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});