import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { RecentVisit } from '@/types';
import colors from '@/constants/colors';

interface RecentVisitsSectionProps {
  visits: RecentVisit[];
  onSeeAllPress?: () => void;
  onVisitPress?: (visit: RecentVisit) => void;
}

export default function RecentVisitsSection({ 
  visits, 
  onSeeAllPress,
  onVisitPress 
}: RecentVisitsSectionProps) {
  const renderItem = ({ item }: { item: RecentVisit }) => (
    <TouchableOpacity 
      style={styles.visitContainer}
      onPress={() => onVisitPress && onVisitPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        
        {item.isClosed && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
            <Text style={styles.reopenText}>
              Scheduled to reopen on {item.reopenDate}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.visitContent}>
        <Text style={styles.visitName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.visitTime}>
          {item.visitedDaysAgo === 0 
            ? 'Today' 
            : item.visitedDaysAgo === 1 
              ? 'Yesterday' 
              : `${item.visitedDaysAgo} days ago`}
        </Text>
        
        {item.discount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>
              {item.discount.value}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Visits</Text>
        
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={visits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Add the missing styles definition
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  visitContainer: {
    width: 160,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.background,
  },
  reopenText: {
    fontSize: 12,
    color: colors.background,
    opacity: 0.8,
  },
  visitContent: {
    padding: 12,
  },
  visitName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  visitTime: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 8,
  },
  discountTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
  }
});