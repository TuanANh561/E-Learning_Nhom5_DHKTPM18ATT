import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import CourseCardVertical from '../components/course/CourseCardVertical';
import useUsers from '../hooks/useUsers';
import useCourses from '../hooks/useCourses';
import { Course, RootStackParamList, User } from '../types';

type TabType = 'overview' | 'courses';

export default function TeacherProfileScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'TeacherProfile'>>();
  const teacherId = route.params.teacherId;
  const navigation = useNavigation();
  const { fetchByTeacherId, loading: coursesLoading } = useCourses();
  const { fetchTeacherById } = useUsers();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([]);
  const [teacher, setTeacher] = useState<User>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const limit = 6;

  const loadTeacherCourses = useCallback(async (pageNum = 1, isLoadMore = false) => {
    if (!isLoadMore) setIsLoadingMore(true);
    try {
      const result = await fetchByTeacherId(teacherId, pageNum, limit);
      setTeacherCourses(isLoadMore ? prev => [...prev, ...result.data] : result.data);
      setTotal(result.total);
      setPage(pageNum);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải khóa học');
    } finally {
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [teacherId, fetchByTeacherId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const teacherData = await fetchTeacherById(teacherId);
        if (teacherData) setTeacher(teacherData);
        await loadTeacherCourses(1);
      } catch {
        Alert.alert('Lỗi', 'Không thể tải thông tin giảng viên');
      }
    };
    loadData();
  }, [teacherId, fetchTeacherById, loadTeacherCourses]);

  // pages array for pagination buttons (1..totalPages), capped at 100 pages
  const pages = useMemo(() => {
    const totalPages = Math.min(Math.max(Math.ceil(total / limit), 1), 100);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [total, limit]);

  const renderCourse = ({ item }: { item: Course }) => <CourseCardVertical course={item} />;

  if (coursesLoading)
    return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#00bfff" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Teacher's Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={activeTab === 'overview' ? teacherCourses.slice(0, 6) : teacherCourses}
        renderItem={renderCourse}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.coverContainer}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1552664730-d307ca884978' }} style={styles.coverImage} />
              <Image source={{ uri: teacher?.avatarUrl }} style={styles.avatar} />
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.name}>{teacher?.fullName}</Text>
              <Text style={styles.job}>UI/UX Designer</Text>
            </View>

            <View style={styles.tabContainer}>
              {(['overview', 'courses'] as TabType[]).map(tab => (
                <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
          </>
        }
        refreshing={isRefreshing}
        onRefresh={() => loadTeacherCourses(1)}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có khóa học</Text>}
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator style={{ padding: 20 }} color="#00bfff" />
          ) : (
            activeTab === 'courses' && pages.length > 0 ? (
              <View style={styles.paginationRow}>
                <Pressable
                  onPress={() => { if (page > 1) loadTeacherCourses(page - 1, false); }}
                  style={[styles.navButton, page === 1 && styles.navButtonDisabled]}
                >
                  <Text style={[styles.navButtonText, page === 1 && styles.navButtonTextDisabled]}>Trước</Text>
                </Pressable>

                <View style={styles.pageInfo}>
                  <Text style={styles.pageInfoText}>Trang {page} / {pages.length}</Text>
                </View>

                <Pressable
                  onPress={() => { if (page < pages.length) loadTeacherCourses(page + 1, false); }}
                  style={[styles.navButton, page === pages.length && styles.navButtonDisabled]}
                >
                  <Text style={[styles.navButtonText, page === pages.length && styles.navButtonTextDisabled]}>Sau</Text>
                </Pressable>
              </View>
            ) : null
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  coverContainer: { height: 120, marginBottom: 40},
  coverImage: { width: '100%', height: '100%' },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    position: 'absolute', 
    bottom: -40, 
    alignSelf: 'center',
    borderWidth: 3, 
    borderColor: '#fff'
  },
  infoSection: { alignItems: 'center', marginBottom: 20 },
  name: { fontSize: 20, fontWeight: 'bold' },
  job: { fontSize: 16, color: '#666' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', marginHorizontal: 15 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#00bfff' },
  tabText: { color: '#666' },
  activeTabText: { color: '#00bfff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
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
