import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import DealCard from './DealCard';
import { Deal } from '@/types';
import colors from '@/constants/colors';

interface DealsSectionProps {
  title: string;
  deals: Deal[];
  onSeeAllPress?: () => void;
  onDealPress?: (deal: Deal) => void;
}

export default function DealsSection({ 
  title, 
  deals, 
  onSeeAllPress,
  onDealPress 
}: DealsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={colors.lightText} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={deals}
        renderItem={({ item }) => (
          <DealCard deal={item} onPress={onDealPress} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 12,
    color: colors.lightText,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});