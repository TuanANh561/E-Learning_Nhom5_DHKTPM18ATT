// screens/PurchaseSuccessScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PurchaseSuccessScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { course } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.subtitle}>Bạn đã sở hữu khóa học:</Text>
        <Text style={styles.courseName}>{course.title}</Text>

        <Pressable
          style={styles.startBtn}
          onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
        >
          <Text style={styles.startText}>Bắt đầu học ngay</Text>
        </Pressable>

        <Pressable onPress={() => navigation.popToTop()}>
          <Text style={styles.backText}>Quay về trang chủ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  content: { alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20, color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 16 },
  courseName: { fontSize: 18, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  startBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
  },
  startText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
  backText: { marginTop: 20, color: '#00bfff', fontWeight: '500' },
});