import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import useCourses from '../hooks/useCourses';
import useReviews from '../hooks/useReviews';
import { Course, User, Review } from '../types';
import CourseOverviewTab from '../components/courseDetails/CourseOverviewTab';
import CourseLessonsTab from '../components/courseDetails/CourseLessonsTab';
import CourseReviewTab from '../components/courseDetails/CourseReviewTab';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import useEnrollment from '../hooks/useEnrollment';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CourseDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CourseDetail'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CourseDetail'>>();
  const courseId = Number(route.params.courseId);

  const { fetchCourseById, fetchByCategoryId, loading: coursesLoading } = useCourses();
  const { reviews, loading: reviewsLoading, fetchReviewByCourseId } = useReviews();

  const [course, setCourse] = useState<Course>();
  const [similarCourses, setSimilarCourses] = useState<Course[]>([]);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('Tổng quan');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const userId = 1; // Giả lập user ở đây
  const { isEnrolled, loading: enrollmentLoading } = useEnrollment(userId, course?.id || null);


  useEffect(() => {
    if (!courseId) return;

    const loadData = async () => {
      setLoading(true);

      try {
        const course = await fetchCourseById(courseId);
        if (!course) {
          Alert.alert('Lỗi', 'Không tìm thấy khóa học');
          setLoading(false);
          return;
        }
        setCourse(course);

        try {
          const res = await fetchReviewByCourseId(courseId, 1, 20);
          setCourseReviews(res.data || []);
        } catch {
          setCourseReviews([]);
        }

        if (course.categoryId) {
          try {
            const res = await fetchByCategoryId(course.categoryId, 1, 10);
            const filtered = res.data.filter(c => c.id !== courseId).slice(0, 5);
            setSimilarCourses(filtered);
          } catch {
            setSimilarCourses([]);
          }
        }

      } catch {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const player = useVideoPlayer(
    course?.videoPreviewUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
    (player) => {
      player.pause();
    }
  );

  const handlePauseVideo = () => {
    if (player && player.pause) {
      player.pause();
    }
  };

  const handleBuyNow = () => {
    if (!userId) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để mua khóa học.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    if (!course) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin khóa học.');
      return;
    }

    navigation.navigate('ConfirmOrder', { course });
  };

  if (!courseId) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#ff4444' }}>Lỗi: Không tìm thấy ID khóa học.</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 10, padding: 8, backgroundColor: '#eee', borderRadius: 5 }}>
          <Text>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  if (coursesLoading || reviewsLoading || !course) {
    return <ActivityIndicator size="large" color="#00bfff" style={styles.loading} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tổng quan':
        return <CourseOverviewTab course={course} similarCourses={similarCourses} />;
      case 'Bài học':
        return <CourseLessonsTab courseId={courseId} onLessonPressPause={handlePauseVideo} isEnrolled={isEnrolled}/>;
      case 'Đánh giá':
        return <CourseReviewTab reviews={courseReviews} course={course} isEnrolled={isEnrolled}/>;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {!isFullScreen && (
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
            </Pressable>
            <Text style={styles.headerTitle}>Chi tiết Khóa học</Text>
            <View style={styles.headerIcons}>
              <Ionicons name="bookmark-outline" size={24} color="#000" style={{ marginRight: 10 }} />
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </View>
          </View>
        )}

        <View style={[styles.videoContainer, isFullScreen && styles.videoFull]}>
          <VideoView style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>

        {!isFullScreen && (
          <>
            <View style={styles.mainInfoContainer}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>
                  <Ionicons name="star" size={16} color="#FFD700" /> 
                  {course.ratingAvg.toFixed(1)} ({course.ratingCount})
                </Text>
                <Text style={styles.lessonsText}>• {course.lessonCount} bài học</Text>
              </View>
            </View>

            <View style={styles.tabsContainer}>
              {['Tổng quan', 'Bài học', 'Đánh giá'].map(tab => (
                <Pressable key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                  {activeTab === tab && <View style={styles.tabIndicator} />}
                </Pressable>
              ))}
            </View>

            {renderTabContent()}
            <View style={{ height: 120 }} />
          </>
        )}
      </ScrollView>

      {!isFullScreen && (
      <>
        
        {enrollmentLoading ? (
          <ActivityIndicator color="#fff" />
        ) : isEnrolled ? (
            <></>
        ) : (
          <View style={styles.bottomBar}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceCurrent}>{(course.price).toLocaleString()} VNĐ</Text>
              {course.originalPrice > course.price && (
                <Text style={styles.priceDiscount}>{(course.originalPrice).toLocaleString()} VNĐ</Text>
              )}
            </View>
            <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
              <Text style={styles.buyNowText}>Mua ngay</Text>
            </Pressable>
          </View>
        )}
      </>
    )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row' },
  videoContainer: {
    width: screenWidth,
    height: 230,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenHeight,
    height: screenWidth,
    backgroundColor: '#000',
    zIndex: 99,
  },
  video: { width: '100%', height: '100%' },
  mainInfoContainer: { paddingHorizontal: 20, paddingTop: 10 },
  courseTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  ratingText: { fontSize: 14, color: '#000', fontWeight: '500' },
  lessonsText: { fontSize: 14, color: '#666', marginLeft: 8 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 20 },
  tabButton: { paddingVertical: 12, alignItems: 'center', flex: 1 },
  tabText: { fontSize: 16, color: '#666' },
  tabTextActive: { color: '#00bfff', fontWeight: 'bold' },
  tabIndicator: { height: 3, width: '80%', backgroundColor: '#00bfff', position: 'absolute', bottom: 0 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  priceContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  priceCurrent: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  priceDiscount: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  buyNowButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 14, 
    paddingHorizontal: 28, 
    borderRadius: 8,
    elevation: 3,
  },
  buyNowText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});
