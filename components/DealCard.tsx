import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Deal } from '@/types';
import colors from '@/constants/colors';

interface DealCardProps {
  deal: Deal;
  onPress?: (deal: Deal) => void;
}

export default function DealCard({ deal, onPress }: DealCardProps) {
  const getBadgeColor = () => {
    switch (deal.type) {
      case 'DISCOUNT':
        return colors.discount;
      case 'FREESHIP':
        return colors.freeship;
      case 'SPECIAL':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(deal)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: deal.image }} style={styles.image} />
      
      <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
        <Text style={styles.badgeText}>
          {deal.type === 'DISCOUNT' ? 'GIẢM' : 'FREESHIP'}
        </Text>
      </View>
      
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>
          {deal.type === 'DISCOUNT' ? deal.discount : '0Đ'}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {deal.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    borderRadius: 8,
    backgroundColor: colors.background,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  discountText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    height: 32,
  },
});