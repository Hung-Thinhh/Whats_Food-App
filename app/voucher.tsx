import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Ticket, Truck, AlertCircle, Search, Copy } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { vouchers } from '@/mocks/data';
import { Voucher } from '@/types';
import colors from '@/constants/colors';

export default function VouchersScreen() {
  const router = useRouter();
  const { getAvailableVouchers, getUnavailableVouchers, setSelectedVoucher } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  
  const availableVouchers = getAvailableVouchers();
  const unavailableVouchers = getUnavailableVouchers();
  
  const filteredVouchers = activeTab === 'available' 
    ? availableVouchers.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : unavailableVouchers.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const handleCopyCode = (code: string) => {
    // In a real app, this would copy to clipboard
    Alert.alert('Code Copied', `Voucher code ${code} copied to clipboard!`);
  };
  
  const handleSelectVoucher = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    router.back();
  };
  
  const renderVoucherItem = ({ item }: { item: Voucher }) => (
    <View style={styles.voucherItem}>
      <View 
        style={[
          styles.voucherIconContainer, 
          { backgroundColor: item.iconColor }
        ]}
      >
        {item.category === 'SHIPPING' ? (
          <Truck size={20} color="#fff" />
        ) : (
          <Ticket size={20} color="#fff" />
        )}
        <Text style={styles.voucherCategory}>
          {item.category === 'SHIPPING' ? 'Free Shipping' : 'Partners'}
        </Text>
      </View>
      
      <View style={styles.voucherContent}>
        <View style={styles.voucherTitleRow}>
          <Text style={styles.voucherItemTitle}>{item.title}</Text>
          {item.usageLimit && (
            <Text style={styles.voucherUsage}>x{item.usageLimit - (item.usageCount || 0)}</Text>
          )}
        </View>
        
        <Text style={styles.voucherLimitedTag}>
          {item.isLimited ? '[Limited Offer]' : ''}
        </Text>
        
        <Text style={styles.voucherDescription}>
          {item.description}
        </Text>
        
        <Text style={styles.voucherMinSpend}>
          Min. Spend: {item.minOrderValue.toLocaleString('vi-VN')}đ
        </Text>
        
        <Text style={styles.voucherValidity}>
          Valid Till: {item.expiryDate}
        </Text>
        
        {activeTab === 'unavailable' && item.unavailableReason && (
          <View style={styles.unavailableReasonContainer}>
            <AlertCircle size={14} color="#f5a623" />
            <Text style={styles.unavailableReasonText}>
              {item.unavailableReason}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.voucherTermsButton}>
          <Text style={styles.voucherTermsText}>T&C</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.voucherActions}>
        {activeTab === 'available' ? (
          <TouchableOpacity 
            style={styles.radioButton}
            onPress={() => handleSelectVoucher(item)}
          >
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.copyButtonContainer}>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={() => handleCopyCode(item.code)}
            >
              <Copy size={16} color={colors.primary} />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
            
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{item.code}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: "Select or Input Voucher",
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Please enter voucher code"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[
            styles.applyButton,
            !searchQuery.trim() && styles.disabledButton
          ]}
          disabled={!searchQuery.trim()}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'available' && styles.activeTab
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'available' && styles.activeTabText
            ]}
          >
            Available Vouchers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'unavailable' && styles.activeTab
          ]}
          onPress={() => setActiveTab('unavailable')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'unavailable' && styles.activeTabText
            ]}
          >
            Unavailable Vouchers
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.voucherInfoText}>
        <Text style={styles.voucherInfoTextContent}>
          {activeTab === 'available' ? '1 voucher can be selected' : ''}
        </Text>
      </View>
      
      <FlatList
        data={filteredVouchers}
        renderItem={renderVoucherItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? "No vouchers match your search" 
                : activeTab === 'available'
                  ? "You don't have any available vouchers"
                  : "You don't have any unavailable vouchers"
              }
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.okButton}
        onPress={() => router.back()}
      >
        <Text style={styles.okButtonText}>OK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    margin: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  applyButtonText: {
    color: colors.background,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.lightText,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  voucherInfoText: {
    padding: 12,
    paddingBottom: 4,
  },
  voucherInfoTextContent: {
    fontSize: 12,
    color: colors.lightText,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  voucherItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  voucherIconContainer: {
    width: 60,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherCategory: {
    color: colors.background,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  voucherContent: {
    flex: 1,
    padding: 12,
  },
  voucherTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  voucherItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    flex: 1,
  },
  voucherUsage: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  voucherLimitedTag: {
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  voucherDescription: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 4,
  },
  voucherMinSpend: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },
  voucherValidity: {
    fontSize: 12,
    color: colors.lightText,
    marginBottom: 8,
  },
  unavailableReasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unavailableReasonText: {
    fontSize: 12,
    color: '#f5a623',
    marginLeft: 4,
  },
  voucherTermsButton: {
    alignSelf: 'flex-start',
  },
  voucherTermsText: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  voucherActions: {
    width: 50,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    padding: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  copyButtonContainer: {
    alignItems: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  copyButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  codeContainer: {
    padding: 6,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    alignItems: 'center',
    width: '100%',
  },
  codeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
  },
});