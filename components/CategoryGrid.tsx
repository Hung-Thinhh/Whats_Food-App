import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Dimensions
} from 'react-native';
import { Category } from '@/types';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 4;
const ITEM_WIDTH = (width - 32) / NUM_COLUMNS;

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
}

export default function CategoryGrid({ 
  categories, 
  onCategoryPress 
}: CategoryGridProps) {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => onCategoryPress && onCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image source={{ uri: item.icon }} style={styles.icon} />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        scrollEnabled={false}
        contentContainerStyle={styles.gridContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  gridContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    height: 32,
  },
});