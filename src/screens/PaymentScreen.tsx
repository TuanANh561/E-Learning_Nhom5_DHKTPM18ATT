import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useOrder from '../hooks/useOrders'; // Chỉ cần createOrder
import usePayments from '../hooks/usePayments';

type PaymentMethod = 'ZaloPay' | 'VNPay' | 'MOMO';

export default function PaymentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { course } = route.params;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('MOMO');
  const [showQR, setShowQR] = useState(false);
  const [qrData] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=FAKE_QR_FOR_SIMULATION');

  const { createOrderAndEnroll, loading: orderLoading } = useOrder();
  const { complete } = usePayments();

  const paymentMethods = [
    { id: 'ZaloPay', icon: 'card-outline', label: 'ZaloPay', color: '#00bfff' },
    { id: 'VNPay', icon: 'business-outline', label: 'VN PAY', color: '#4CAF50' },
    { id: 'MOMO', icon: 'wallet-outline', label: 'Ví Momo', color: '#9c27b0' },
  ];

  const handlePayment = () => {
    if (orderLoading) return;
    setShowQR(true); // HIỆN QR GIẢ LẬP NGAY
  };

  const handleSimulateScan = async () => {
    if (orderLoading) return;

    try {
      // GỌI API TẠO ORDER + ENROLLMENT KHI QUÉT
      await createOrderAndEnroll(course.id, selectedMethod);
      setShowQR(false);
      navigation.replace('PurchaseSuccess', { course });
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Thanh toán thất bại');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.courseCard}>
          <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
          <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>${course.price}</Text>
        </View>

        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        {paymentMethods.map((m) => (
          <Pressable
            key={m.id}
            style={[styles.method, selectedMethod === m.id && styles.selected]}
            onPress={() => setSelectedMethod(m.id as PaymentMethod)}
          >
            <Ionicons name={m.icon as any} size={24} color={m.color} />
            <Text style={[styles.methodText, selectedMethod === m.id && styles.selectedText]}>
              {m.label}
            </Text>
            {selectedMethod === m.id && <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />}
          </Pressable>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {!showQR && (
        <View style={styles.bottomBar}>
          <Pressable
            style={[styles.payBtn, orderLoading && { opacity: 0.7 }]}
            onPress={handlePayment}
            disabled={orderLoading}
          >
            {orderLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>Thanh toán</Text>}
          </Pressable>
        </View>
      )}

      <Modal visible={showQR} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qrModal}>
            <Text style={styles.qrTitle}>Mã QR thanh toán</Text>
            <Image source={{ uri: qrData }} style={styles.qrCode} />
            <Text style={styles.qrNote}>Quét mã để thanh toán</Text>

            <Pressable style={styles.scanBtn} onPress={handleSimulateScan}>
              <Text style={styles.scanText}>Quét</Text>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={() => setShowQR(false)}>
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  thumbnail: { width: 60, height: 60, borderRadius: 8 },
  courseTitle: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#ff4757' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selected: { borderColor: '#00bfff', backgroundColor: '#f0f8ff' },
  methodText: { flex: 1, marginLeft: 12, fontSize: 15 },
  selectedText: { fontWeight: 'bold', color: '#00bfff' },
  bottomBar: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' },
  payBtn: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  qrModal: { backgroundColor: '#fff', padding: 30, borderRadius: 16, alignItems: 'center' },
  qrTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  qrCode: { width: 200, height: 200 },
  qrNote: { marginTop: 16, color: '#666', fontWeight: '500' },
  scanBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  scanText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { marginTop: 12 },
  cancelText: { color: '#e74c3c', fontWeight: '600' },
  pendingNote: { marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' },
});