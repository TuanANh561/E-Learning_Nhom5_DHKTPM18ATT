import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, MyCourse } from '../types';
import { useAuth } from '../hooks/AuthContext';
import useMyCourses from '../hooks/useMyCourses';

type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function UserProfileScreen() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, isLoggedIn, logout, loading } = useAuth();
  const { courses, loading: coursesLoading } = useMyCourses();

  const handleLogout = () => {
    logout().then(() => navigation.replace('Login'));
  };

  useEffect(() => {
    if (!loading && !isLoggedIn) navigation.replace('Login');
  }, [loading, isLoggedIn]);

  if (loading) return <Text>Đang kiểm tra phiên đăng nhập...</Text>;
  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={{ width: 24 }} />
        <Text style={styles.screenTitle}>Hồ sơ người dùng</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://res.cloudinary.com/dwzjxsdli/image/upload/v1761704111/background_ewmatc.jpg',
          }}
          style={styles.coverImage}
        />
        <Image source={{ uri: user.avatarUrl }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{user.fullName}</Text>
        <Text style={styles.profileRole}>Học viên</Text>
      </View>

      <View style={styles.myCourses}>
        <Text style={styles.sectionTitle}>Khóa học của tôi</Text>
        {coursesLoading ? (
          <Text>Đang tải khóa học...</Text>
        ) : courses.length === 0 ? (
          <Text>Bạn chưa có khóa học nào</Text>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {courses.map(course => (
              <View key={course.id} style={styles.courseCard}>
                <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.lessons}>
                    {course.completedLessons}/{course.lessonCount} bài học
                  </Text>
                  <Text style={styles.progressText}>{course.progressPercentage*100}%</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 16 },
  coverImage: { width: '100%', height: 120, borderRadius: 0 },
  profileAvatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: '#fff', marginTop: -45 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 12, color: '#333' },
  profileRole: { fontSize: 14, color: '#666', marginTop: 4 },
  myCourses: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  courseCard: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee', padding: 10 },
  thumbnail: { width: 80, height: 80, borderRadius: 5, marginRight: 10 },
  courseInfo: { flex: 1, justifyContent: 'space-between' },
  courseTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  lessons: { fontSize: 16, color: '#666', marginBottom: 4 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 4 },
  progressText: { fontSize: 16, color: 'green' },
});
