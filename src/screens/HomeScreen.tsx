import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Alert, Pressable, Image, RefreshControl } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useCategories from '../hooks/useCategories';
import useCourses from '../hooks/useCourses';
import useUsers from '../hooks/useUsers';
import CategorySection from '../components/category/CategorySection';
import RecommendedSection from '../components/course/RecommendedSection';
import InspiringCoursesSection from '../components/course/InspiringCoursesSection';
import PopularCoursesSection from '../components/course/PopularCoursesSection';
import TopTeachersSection from '../components/teacher/TopTeachersSection';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/AuthContext';

export default function HomeScreen() {
  const { categories, loading: l1, error: e1, refetch: refetchCategories } = useCategories();
  const { popular, recommended, inspiring, loading: l2, error: e2, refetch: refetchCourses } = useCourses();
  const { topTeachers, loading: l3, error: e3, refetch: refetchUsers} = useUsers();

  const { user, isLoggedIn } = useAuth();

  const loading = l1 || l2 || l3;
  const error = e1 || e2 || e3;

  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchCategories(),
        refetchCourses(),
        refetchUsers(),
      ]);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể làm mới dữ liệu');
    } finally {
      setRefreshing(false);
    }
  },[refetchCategories, refetchCourses, refetchUsers]);

  useEffect(() => {
    if (error) {Alert.alert('Lỗi kết nối', error)}
  }, [error]);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#00bfff" />
      </SafeAreaView>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 10) return `Chào buổi sáng ${user?.fullName || ""}`;
    if (hour < 18) return `Chào buổi chiều ${user?.fullName || ""}`;
    if (hour >= 18) return `Chào buổi tối ${user?.fullName || ""} Siêng thế e`
    return '';
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      
      {/* App Header (Hello, Cart, Notification) */}
      <View style={styles.appHeader}>
        <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.subtitle}>Hôm nay bạn muốn học gì nào?</Text>
        </View>
        <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={24} color="white" />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false} 
        scrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Khóa học Quản lý dự án</Text>
            <Text style={styles.discount}>Giảm giá 20%</Text>
            <Pressable style={styles.joinButton} onPress={() => {}}>
              <Text style={styles.joinText}>Tham gia ngay</Text>
            </Pressable>
          </View>
          <Image source={{ uri: 'https://res.cloudinary.com/dwzjxsdli/image/upload/v1761705336/banner_jlbyvl.jpg' }} 
            style={styles.bannerImage} resizeMode="cover"/>
        </View>

        <CategorySection categories={categories} />

        <PopularCoursesSection courses={popular} onViewMore={() => navigation.navigate('CourseListScreen', { title: 'Popular Courses' })}/>
        <RecommendedSection courses={recommended} onViewMore={() => navigation.navigate('CourseListScreen', { title: 'Recommended for you' })}/>
        <InspiringCoursesSection courses={inspiring} onViewMore={() => navigation.navigate('CourseListScreen', { title: 'Inspiring' })}/>

        <TopTeachersSection teachers={topTeachers} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    backgroundColor: '#00bfff',
  },
  headerIcons: { flexDirection: 'row' },
  greeting: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 14, color: 'white' },

  banner: { 
    backgroundColor: '#9b59b6', 
    marginHorizontal: 15,
    marginVertical: 10, 
    padding: 20, 
    borderRadius: 10, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150,
  },
  bannerText: { maxWidth: '60%' },
  bannerTitle: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  discount: { fontSize: 14, color: '#fff', marginTop: 4, marginBottom: 10 },
  joinButton: { 
    backgroundColor: '#00bfff', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 5, 
  },
  joinText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  bannerImage: { width: '40%', height: 100, borderRadius: 5, marginLeft: 10 },
});