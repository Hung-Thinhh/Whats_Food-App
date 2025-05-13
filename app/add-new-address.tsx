import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import addressApiRequest from '@/api/address.api';
import { getAccessToken } from '@/storange/auth.storage';

const labelOptions = ['Home', 'Work', 'Other'];

export default function AddNewAddressScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [gate, setGate] = useState('');
  const [note, setNote] = useState('');
  const [label, setLabel] = useState('');
  const { newLocation } = useAppStore();
  const handleSave = async () => {
    if (!name.trim() || !phoneNumber.trim() || !newLocation) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ.');
      return;
    }
    
    try {
      const token = await getAccessToken();
      console.log(token);
      
      const newaddress = {
        name,
        phoneNumber,
        address:newLocation.address, 
        latitude:newLocation.latitude,
        longitude:newLocation.longitude
      }
      const data = await addressApiRequest.add(newaddress, token);
      router.back(); // Navigate back after successful save
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Có lỗi xảy ra khi lưu địa chỉ. Vui lòng thử lại.');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Thêm địa chỉ mới' }} />
      
      <TextInput
        style={styles.input}
        placeholder="Người nhận"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.addressSelector} onPress={() => router.push('/new-address-map')}>
        <Text style={{ color: newLocation ? colors.text : colors.placeholder }}>
          {newLocation.address || 'Chọn địa chỉ'}
        </Text>
      </TouchableOpacity>



      <TextInput
        style={styles.input}
        placeholder="Ghi chú cho Tài xế (Không bắt buộc)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu địa chỉ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: colors.text,
  },
  addressSelector: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  labelSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

