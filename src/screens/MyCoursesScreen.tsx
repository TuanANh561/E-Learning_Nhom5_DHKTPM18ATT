import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator, StyleSheet,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MyCourse } from '../types';
import useMyCourses from '../hooks/useMyCourses';
import { useAuth } from '../hooks/AuthContext';

type MyCoursesNavigationProp = StackNavigationProp<RootStackParamList, 'MyCourses'>;

export default function MyCoursesScreen() {
  const navigation = useNavigation<MyCoursesNavigationProp>();
  const { user, isLoggedIn } = useAuth();
  const { loading, error, fetchMyCourses, refetch } = useMyCourses();

  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ON GOING' | 'COMPLETED'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadCourses = useCallback(
    async (pageNum: number = 1) => {
      const result = await fetchMyCourses(pageNum, limit);
      if (pageNum === 1) {
        setCourses(result.data);
      } else {
        setCourses((prev) => [...prev, ...result.data]);
      }
      setPage(pageNum);
    },
    [fetchMyCourses]
  );

  useEffect(() => {
    loadCourses(1);
  }, [loadCourses, user]);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        refetch(); // ← TỰ ĐỘNG LOAD MỖI KHI QUA TAB
      }
    }, [isLoggedIn, refetch])
  );

  const filteredCourses = useMemo(() => {
    if (activeTab === 'ALL') return courses;
    return courses.filter((c) => {
      const progress = c.progressPercentage ?? 0;
      if (activeTab === 'COMPLETED') return progress >= 1;
      if (activeTab === 'ON GOING') return progress > 0 && progress < 1;
      return false;
    });
  }, [courses, activeTab]);

  const formatDuration = useCallback((lessonCount: number) => {
    const mins = lessonCount * 5;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }, []);

  const goToDetail = useCallback(
    (courseId: number) => {
      navigation.navigate('CourseDetail', { courseId });
    },
    [navigation]
  );

  if (loading && courses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text style={styles.loading}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Lỗi: {error}</Text>
        <Pressable onPress={() => loadCourses(1)} style={styles.retry}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <View style={styles.banner}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dwzjxsdli/image/upload/v1761711204/banner_mycourse_vnelze.jpg' }}
            style={styles.bannerImg}
            resizeMode="cover"
          />
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {(['ALL', 'ON GOING', 'COMPLETED'] as const).map((tab) => (
            <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              >
                {tab === 'ON GOING' ? 'Đang học' : tab === 'COMPLETED' ? 'Hoàn thành' : 'Tất cả'}
              </Text>
              {activeTab === tab && <View style={styles.tabLine} />}
            </Pressable>
          ))}
        </View>

        {/* DANH SÁCH */}
        <View style={styles.list}>
          {filteredCourses.length === 0 ? (
            <Text style={styles.empty}>
              {activeTab === 'ALL' ? 'Chưa có khóa học nào.' : 'Không có khóa học phù hợp.'}
            </Text>
          ) : (
            filteredCourses.map((course) => {
              const progress = course.progressPercentage ?? 0;
              const isDone = progress >= 1;

              return (
                <Pressable
                  key={course.id}
                  style={styles.card}
                  onPress={() => goToDetail(course.id)}
                >
                  <Image source={{ uri: course.thumbnailUrl }} style={styles.thumb} />
                  <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                      {course.title}
                    </Text>
                    <Text style={styles.duration}>
                      {formatDuration(course.lessonCount ?? 0)}
                    </Text>

                    <View style={styles.progressContainer}>
                      <Progress.Bar
                        progress={Math.min(progress, 1)}
                        width={null}
                        color="#00bfff"
                        unfilledColor="#eee"
                        borderWidth={0}
                        height={8}
                        style={styles.progressBar}
                      />
                      <Text style={styles.percent}>
                        {isDone ? '100%' : `${Math.round(progress * 100)}%`}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {courses.length > 0 && (
          <View style={styles.paginationRow}>
            <Pressable
              onPress={() => page > 1 && loadCourses(page - 1)}
              style={[styles.navButton, page === 1 && styles.navButtonDisabled]}
              disabled={loading || page === 1}
            >
              <Text style={[styles.navButtonText, page === 1 && styles.navButtonTextDisabled]}>Trước</Text>
            </Pressable>
            <View style={styles.pageInfo}>
              <Text style={styles.pageInfoText}>
                Trang {page} / {Math.max(1, Math.ceil(courses.length / limit))}
              </Text>
            </View>
            <Pressable
              onPress={() => courses.length >= page * limit && loadCourses(page + 1)}
              style={[styles.navButton, courses.length < page * limit && styles.navButtonDisabled]}
              disabled={loading || courses.length < page * limit}
            >
              <Text style={[styles.navButtonText, courses.length < page * limit && styles.navButtonTextDisabled]}>Sau</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { margin: 20, height: 180, borderRadius: 16, overflow: 'hidden' },
  bannerImg: { width: '100%', height: '100%' },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 14, color: '#666' },
  tabTextActive: { color: '#00bfff', fontWeight: 'bold' },
  tabLine: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '60%',
    backgroundColor: '#00bfff',
    borderRadius: 2,
  },
  list: { padding: 20 },
  empty: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  thumb: { width: 100, height: 100 },
  info: { flex: 1, padding: 12, justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  duration: { fontSize: 13, color: '#666', marginTop: 4 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  progressBar: { flex: 1, marginRight: 8 },
  percent: { fontSize: 12, color: '#00bfff', fontWeight: 'bold' },
  loading: { marginTop: 10, textAlign: 'center', color: '#666' },
  error: { textAlign: 'center', color: 'red', marginTop: 20, paddingHorizontal: 20 },
  retry: { marginTop: 10, padding: 10, backgroundColor: '#00bfff', borderRadius: 8, alignSelf: 'center' },
  retryText: { color: '#fff', fontWeight: 'bold' },
  paginationContainer: { marginTop: 12, maxHeight: 48 },
  pageButton: { paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 6, borderRadius: 6, backgroundColor: '#f0f0f0' },
  pageButtonActive: { backgroundColor: '#00bfff' },
  pageButtonText: { color: '#333' },
  pageButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  paginationRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  navButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#00bfff', borderRadius: 6, marginHorizontal: 12 },
  navButtonDisabled: { backgroundColor: '#cfcfcf' },
  navButtonText: { color: '#fff', fontWeight: 'bold' },
  navButtonTextDisabled: { color: '#888' },
  pageInfo: { paddingHorizontal: 8 },
  pageInfoText: { color: '#333', fontWeight: '600' },
});