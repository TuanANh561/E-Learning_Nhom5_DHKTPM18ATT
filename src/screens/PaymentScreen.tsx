import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';

type PaymentMethod = 'CARD' | 'BANK' | 'MOMO';

export default function PaymentScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Payment'>>();
  const navigation = useNavigation<any>();
  const { course } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CARD');

  const paymentMethods = [
    { id: 'CARD', icon: 'card-outline', label: 'Thẻ tín dụng / Ví điện tử', color: '#00bfff' },
    { id: 'BANK', icon: 'business-outline', label: 'Chuyển khoản ngân hàng', color: '#4CAF50' },
    { id: 'MOMO', icon: 'wallet-outline', label: 'Ví Momo', color: '#9c27b0' },
  ];

  const handlePayment = () => {
    const methodName = paymentMethods.find(m => m.id === selectedMethod)?.label || 'phương thức';
    Alert.alert(
      "Thanh toán thành công!",
      `Bạn đã mua thành công khóa học:\n"${course.title}"\nvới giá $${course.price}\nPhương thức: ${methodName}`,
      [{ text: "OK", onPress: () => navigation.popToTop() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER CỐ ĐỊNH */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Thông tin khóa học */}
        <View style={styles.courseCard}>
          <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
            <Text style={styles.teacherName}>Giảng viên: {course.instructorName}</Text>
          </View>
        </View>

        {/* Giá tiền */}
        <View style={styles.priceSection}>
          <Text style={styles.label}>Giá gốc</Text>
          <Text style={styles.price}>${course.originalPrice}</Text>
        </View>
        {course.originalPrice > course.price && (
          <View style={styles.priceSection}>
            <Text style={styles.label}>Giảm giá</Text>
            <Text style={styles.discount}>-${course.originalPrice - course.price}</Text>
          </View>
        )}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>${course.price}</Text>
        </View>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
        {paymentMethods.map((method) => (
          <Pressable
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedMethod === method.id && styles.paymentMethodSelected,
            ]}
            onPress={() => setSelectedMethod(method.id as PaymentMethod)}
          >
            <Ionicons name={method.icon as any} size={24} color={method.color} />
            <Text style={[styles.methodText, selectedMethod === method.id && styles.methodTextSelected]}>
              {method.label}
            </Text>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
            )}
          </Pressable>
        ))}

        {/* KHOẢNG TRỐNG ĐỂ NÚT THANH TOÁN KHÔNG BỊ CHE */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.paymentButton} onPress={handlePayment}>
          <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
        </Pressable>
      </View>
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
    zIndex: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  scrollContent: {
    flex: 1,
    padding: 20,
  },

  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumbnail: { width: 70, height: 70, borderRadius: 8 },
  courseInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  teacherName: { fontSize: 13, color: '#666', marginTop: 4 },

  priceSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 15, color: '#666' },
  price: { fontSize: 15, fontWeight: '600', color: '#000' },
  discount: { fontSize: 15, color: '#4CAF50' },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    marginBottom: 24,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#ff4757' },

  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#333' },

  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  paymentMethodSelected: {
    borderColor: '#00bfff',
    backgroundColor: '#f0f8ff',
    elevation: 3,
  },
  methodText: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '500', color: '#333' },
  methodTextSelected: { fontWeight: 'bold', color: '#00bfff' },

  bottomBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  paymentButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },

  note: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 16 },
});