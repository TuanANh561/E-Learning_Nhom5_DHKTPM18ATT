import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as ScreenOrientation from 'expo-screen-orientation';

import useCourses from '../hooks/useCourses';
import useUsers from '../hooks/useUsers';
import useSections from '../hooks/useSections';
import useLessons from '../hooks/useLessons';
import useReviews from '../hooks/useReviews';

import CourseOverviewTab from '../components/courseDetails/CourseOverviewTab';
import CourseLessonsTab from '../components/courseDetails/CourseLessonsTab';
import CourseReviewTab from '../components/courseDetails/CourseReviewTab';
import { RootStackParamList } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CourseDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CourseDetail'>>();
  const navigation = useNavigation();
  const courseId = Number(route.params.courseId);

  const { courses, loading: coursesLoading } = useCourses();
  const { users, loading: usersLoading } = useUsers();
  const { sections, loading: sectionsLoading } = useSections();
  const { lessons, loading: lessonsLoading } = useLessons();
  const { reviews, loading: reviewsLoading } = useReviews();

  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const course = useMemo(() => courses.find(c => Number(c.id) === courseId), [courses, courseId]);
  const teacher = useMemo(() => users.find(u => Number(u.id) === course?.teacher_id), [users, course]);
  const similarCourses = useMemo(
    () => courses.filter(c => c.category_id === course?.category_id && c.id !== courseId).slice(0, 3),
    [courses, courseId, course]
  );

  const courseSections = useMemo(() => sections.filter(s => Number(s.course_id) === courseId), [sections, courseId]);
  const courseLessons = useMemo(
    () => lessons.filter(l => courseSections.map(s => Number(s.id)).includes(l.section_id)),
    [lessons, courseSections]
  );
  const courseReviews = useMemo(() => reviews.filter(r => r.course_id === courseId), [reviews, courseId]);

  // 🎬 Khởi tạo video player
  const player = useVideoPlayer(
    course?.video_url_preview || 'https://www.w3schools.com/html/mov_bbb.mp4',
    (player) => {
      player.pause(); // không tự play khi mở
    }
  );

  // 🛑 Hàm dừng video
  const handlePauseVideo = () => {
    if (player && player.pause) {
      player.pause();
    }
  };

  // 🔁 Theo dõi xoay màn hình
  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener(evt => {
      const o = evt.orientationInfo.orientation;
      if (
        o === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
        o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
      ) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    });
    return () => ScreenOrientation.removeOrientationChangeListener(subscription);
  }, []);

  useEffect(() => {
    if (!coursesLoading && !reviewsLoading) {
      setActiveTab('OVERVIEW');
    }
  }, [coursesLoading, reviewsLoading]);

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

  if (coursesLoading || usersLoading || sectionsLoading || lessonsLoading || reviewsLoading || !course) {
    return <ActivityIndicator size="large" color="#00bfff" style={styles.loading} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return <CourseOverviewTab course={course} teacher={teacher} similarCourses={similarCourses} />;
      case 'LESSONS':
        return <CourseLessonsTab lessons={courseLessons} sections={courseSections} onLessonPressPause={handlePauseVideo}  />;
      case 'REVIEW':
        return <CourseReviewTab reviews={courseReviews} course={course} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <ScrollView style={styles.scrollView}>
        {/* === HEADER === */}
        {!isFullScreen && (
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
            </Pressable>
            <Text style={styles.headerTitle}>Course details</Text>
            <View style={styles.headerIcons}>
              <Ionicons name="bookmark-outline" size={24} color="#000" style={{ marginRight: 10 }} />
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </View>
          </View>
        )}

        {/* === VIDEO PLAYER === */}
        <View style={[styles.videoContainer, isFullScreen && styles.videoFull]}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>

        {/* === MAIN CONTENT === */}
        {!isFullScreen && (
          <>
            <View style={styles.mainInfoContainer}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>★ {course.rating_avg.toFixed(1)} ({course.rating_count})</Text>
                <Text style={styles.lessonsText}>• {course.lesson_count} lessons</Text>
              </View>
            </View>

            <View style={styles.tabsContainer}>
              {['OVERVIEW', 'LESSONS', 'REVIEW'].map(tab => (
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
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceCurrent}>${course.price}</Text>
            <Text style={styles.priceDiscount}>${course.original_price}</Text>
          </View>
          <Pressable style={styles.addToCartButton}>
            <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 5 }} />
            <Text style={styles.addToCartText}>Add to cart</Text>
          </Pressable>
        </View>
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
  addToCartButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00bfff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  addToCartText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
