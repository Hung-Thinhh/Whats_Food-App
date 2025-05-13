import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Search } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
  editable?: boolean;
}

export default function SearchBar({ 
  onPress, 
  placeholder = 'Món ngon húp lẹ...',
  editable = true
}: SearchBarProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={editable ? 1 : 0.7}
    >
      <View style={styles.searchIcon}>
        <Search size={20} color={colors.lightText} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.lightText}
        editable={editable}
      />
    </TouchableOpacity>
  );
}

// Add the missing styles definition
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
});