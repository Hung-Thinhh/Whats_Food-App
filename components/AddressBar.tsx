import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import colors from '@/constants/colors';

interface AddressBarProps {
  onPress: () => void;
}

export default function AddressBar({ onPress }: AddressBarProps) {
  const { userLocation } = useAppStore();

  // Format the address to be shorter if it's too long
  const formatAddress = (address: string) => {
    if (address.length > 40) {
      return address.substring(0, 40) + '...';
    }
    return address;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.label}>Deliver To:</Text>
        <View style={styles.addressContainer}>
          <MapPin size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.address} numberOfLines={1}>
            {formatAddress(userLocation.address)}
          </Text>
          <ChevronRight size={16} color={colors.lightText} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});