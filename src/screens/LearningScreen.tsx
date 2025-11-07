import React, { useState, useEffect, useCallback } from 'react';
import { View, Text,StyleSheet, ScrollView, ActivityIndicator, Pressable,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import useCourses from '../hooks/useCourses';
import useLessons from '../hooks/useLessons';
import useSections from '../hooks/useSections';
import { RootStackParamList, Lesson, Course } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import LessonsTab from '../components/learning/LessonsTab';
import QATab from '../components/learning/QATab';

export default function LearningScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Learning'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Learning'>>();
  const lessonId = route.params.lessonId;
  const courseId = route.params.courseId;
  const isEnrolled = route.params.isEnrolled;

  console.log(lessonId)

  const [activeTab, setActiveTab] = useState<'lessons' | 'qa'>('lessons');
  const [currentLessonId, setCurrentLessonId] = useState(lessonId);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const { fetchLessonById, loading: loadingLessons } = useLessons();
  const { fetchCourseById, loading: loadingCourses } = useCourses();
  const { loading: loadingSections } = useSections();

  useEffect(() => {
    const loadData = async () => {
      const [lesson, course] = await Promise.all([
        fetchLessonById(lessonId),
        fetchCourseById(courseId),
      ]);
      setCurrentLesson(lesson);
      setCurrentLessonId(lessonId);
      setCurrentCourse(course);
    };
    loadData();
  }, [lessonId, courseId]);

  const player = useVideoPlayer( currentLesson?.playbackUrl || '', player => {
    player.pause();
  });

  const handleLessonPress = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentLessonId(lesson.id);
  }, []);

  const renderTabContent = () => {
    if (loadingLessons || loadingSections) {
      return <ActivityIndicator size="large" color="#00bfff" style={{ marginVertical: 50 }} />;
    }

    switch (activeTab) {
      case 'lessons':
        return (
          <LessonsTab
            courseId={courseId}
            currentLessonId={currentLessonId}
            onLessonPress={handleLessonPress}
            isEnrolled={isEnrolled}
          />
        );
      case 'qa':
        return <QATab />;
      default:
        return null;
    }
  };

  if (loadingCourses || !currentCourse || !currentLesson) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#333" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Learning Lessons</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
            <Ionicons name="ellipsis-vertical" size={24} color="#333" style={{ marginLeft: 10 }} />
          </View>
        </View>

        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        </View>

        <View style={styles.courseInfoContainer}>
          <Text style={styles.courseMainTitle}>
            {currentCourse.title}: {currentLesson?.title}
          </Text>
          <View style={styles.actionsBar}>
            <View style={styles.actionItem}>
              <View style={styles.rating}>
                <Text style={styles.ratingText}>
                  <Ionicons name="star" size={16} color="#FFD700" /> 
                  {currentCourse.ratingAvg.toFixed(1)} ({currentCourse.ratingCount})
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabBarContainer}>
          {(['lessons', 'qa'] as const).map(tab => (
            <Pressable key={tab} style={[styles.tabItem, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
                {tab.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerIcons: { flexDirection: 'row' },
  videoContainer: { width: '100%', height: 220, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  courseInfoContainer: { paddingHorizontal: 16, paddingTop: 12 },
  courseMainTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  actionsBar: { flexDirection: 'row', alignItems: 'center' },
  actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  actionText: { marginLeft: 5, color: '#666', fontSize: 13 },
  tabBarContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: { borderBottomWidth: 2, borderColor: '#00bfff' },
  tabLabel: { fontSize: 13, fontWeight: 'bold', color: '#666' },
  activeTabLabel: { color: '#00bfff' },
  rating: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  ratingText: { fontSize: 14, color: '#666' },
});