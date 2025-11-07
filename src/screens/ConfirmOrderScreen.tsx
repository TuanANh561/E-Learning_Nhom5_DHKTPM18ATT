import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ConfirmOrderScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { course } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Khóa học */}
        <View style={styles.courseCard}>
          <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.title}
            </Text>
            <Text style={styles.instructor}>Giảng viên: {course.instructorName}</Text>
          </View>
        </View>

        {/* Giá */}
        <View style={styles.priceRow}>
          <Text style={styles.label}>Giá gốc</Text>
          <Text style={styles.originalPrice}>${course.originalPrice}</Text>
        </View>

        {course.originalPrice > course.price && (
          <View style={styles.priceRow}>
            <Text style={styles.label}>Giảm giá</Text>
            <Text style={styles.discount}>-${course.originalPrice - course.price}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>${course.price}</Text>
        </View>

        {/* Nút tiếp tục */}
        <Pressable
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Payment', { course })}
        >
          <Text style={styles.continueText}>Tiếp tục thanh toán</Text>
        </Pressable>
      </ScrollView>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
  },
  thumbnail: { width: 80, height: 80, borderRadius: 8 },
  courseInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  courseTitle: { fontSize: 16, fontWeight: 'bold' },
  instructor: { fontSize: 13, color: '#666', marginTop: 4 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 15, color: '#666' },
  originalPrice: { fontSize: 15, textDecorationLine: 'line-through', color: '#999' },
  discount: { fontSize: 15, color: '#4CAF50' },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#ff4757' },

  continueBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  continueText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});