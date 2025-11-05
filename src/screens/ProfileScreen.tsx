import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, FlatList, TouchableOpacity, Alert,Pressable,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { User, Course } from '../types';
import useUsers from '../hooks/useUsers';
import useCourses from '../hooks/useCourses';
import useFavorites from '../hooks/useFavorites';
import CourseCardVertical from '../components/course/CourseCardVertical';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function UserProfileScreen() {
  const route = useRoute<ProfileRouteProp>();
  const navigation = useNavigation<ProfileNavigationProp>();

  const { isLoggedIn: initialLogin = false, userId: initialUserId } = route.params || {};

  const [isLoggedIn, setIsLoggedIn] = useState(initialLogin);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { users, loading: loadingUsers } = useUsers();
  const { courses, loading: loadingCourses } = useCourses();
  const { favorites, loading: loadingFavorites } = useFavorites(
    isLoggedIn ? currentUser?.id || 1 : 1
  );

  useEffect(() => {
    if (initialUserId && users.length > 0) {
      const user = users.find((u) => u.id === initialUserId);
      if (user && user.role === 'STUDENT') {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    }
  }, [initialUserId, users]);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: () => {
          setIsLoggedIn(false);
          setCurrentUser(null);
          navigation.replace('Login');
        },
      },
    ]);
  };

  const savedCourses: Course[] = useMemo(() => {
    if (!isLoggedIn || !favorites.length) return [];
    const favoriteCourseIds = new Set(favorites.map((fav) => fav.course_id));
    return courses.filter((course) => favoriteCourseIds.has(Number(course.id)));
  }, [courses, favorites, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <Text style={styles.loginTitle}>Chưa đăng nhập</Text>
          <Text style={styles.loginSubtitle}>
            Đăng nhập để xem hồ sơ và khóa học đã lưu
          </Text>

          <Pressable
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </Pressable>

          <Pressable
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (loadingUsers || loadingCourses || loadingFavorites) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00bfff" />
          <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.topHeader}>
        <View style={{ width: 24 }} />
        <Text style={styles.screenTitle}>Hồ sơ người dùng</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      {/* DANH SÁCH KHÓA HỌC */}
      <FlatList
        data={savedCourses}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CourseCardVertical course={item} />}
        ListHeaderComponent={
          <>
            {/* COVER + AVATAR + TÊN */}
            <View style={styles.header}>
              <Image
                source={{
                  uri: 'https://res.cloudinary.com/dwzjxsdli/image/upload/v1761704111/background_ewmatc.jpg',
                }}
                style={styles.coverImage}
              />
              <Image
                source={{ uri: currentUser?.avatarUrl }}
                style={styles.profileAvatar}
              />
              <Text style={styles.profileName}>{currentUser?.fullName}</Text>
              <Text style={styles.profileRole}>Học viên</Text>
            </View>

            {/* THỐNG KÊ */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{savedCourses.length}</Text>
                <Text style={styles.statLabel}>Đã lưu</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Đang học</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>98</Text>
                <Text style={styles.statLabel}>Hoàn thành</Text>
              </View>
            </View>

            {/* TIÊU ĐỀ DANH SÁCH */}
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>Khóa học đã lưu</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>Bạn chưa lưu khóa học nào</Text>
          </View>
        }
        contentContainerStyle={styles.courseListVertical}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loginTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 16, color: '#333' },
  loginSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#00bfff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  registerButton: { paddingVertical: 12 },
  registerButtonText: { color: '#00bfff', fontWeight: '600' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  screenTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: 120,
    borderRadius: 0,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: -45,
  },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 12, color: '#333' },
  profileRole: { fontSize: 14, color: '#666', marginTop: 4 },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#00bfff' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },

  categoryHeader: { paddingHorizontal: 16, marginBottom: 12 },
  categoryTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  courseListVertical: { paddingHorizontal: 16, paddingBottom: 20 },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 12, color: '#999', fontSize: 15 },
});