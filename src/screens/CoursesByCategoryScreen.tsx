import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CourseCardVertical from '../components/course/CourseCardVertical';
import useCourses from '../hooks/useCourses';
import { Course, RootStackParamList } from '../types';

const PAGE_SIZE = 6;

export default function CoursesByCategoryScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CoursesByCategory'>>();
  const { categoryId, categoryName } = route.params;
  const navigation = useNavigation<any>();

  const { fetchByCategoryId } = useCourses();

  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Gọi API lấy dữ liệu
  const loadCourses = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data, total } = await fetchByCategoryId(categoryId, pageNum, PAGE_SIZE);
      setCourses(data);
      setTotal(total);
      setPage(pageNum);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses(1);
  }, [categoryId]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </Pressable>
        <Text style={styles.title}>{categoryName}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{total}</Text>
        </View>
      </View>

      {/* Danh sách khóa học */}
      {loading && courses.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#00bfff" />
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseCardVertical course={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Chưa có khóa học nào</Text>
            </View>
          }
          ListFooterComponent={
            !loading && totalPages > 1 ? (
              <View style={styles.pagination}>
                <Pressable
                  onPress={() => page > 1 && loadCourses(page - 1)}
                  style={[styles.pageButton, page === 1 && styles.disabled]}
                >
                  <Text style={styles.pageText}>Trước</Text>
                </Pressable>

                <Text style={styles.pageInfo}>
                  Trang {page} / {totalPages}
                </Text>

                <Pressable
                  onPress={() => page < totalPages && loadCourses(page + 1)}
                  style={[styles.pageButton, page === totalPages && styles.disabled]}
                >
                  <Text style={styles.pageText}>Sau</Text>
                </Pressable>
              </View>
            ) : null
          }
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  badge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: { color: '#00bfff', fontWeight: '600' },
  list: { padding: 15 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#999', marginTop: 10 },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  pageButton: {
    backgroundColor: '#00bfff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  disabled: { backgroundColor: '#ccc' },
  pageText: { color: '#fff', fontWeight: '600' },
  pageInfo: { fontSize: 16 },
});
