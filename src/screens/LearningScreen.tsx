// src/screens/LearningScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video'; // ✅ Dùng expo-video mới

import useCourses from '../hooks/useCourses';
import useLessons from '../hooks/useLessons';
import useSections from '../hooks/useSections';

import { RootStackParamList, Lesson, Course } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

// Import 2 tab
import LessonsTab from '../components/learning/LessonsTab';
import QATab from '../components/learning/QATab';

type LearningNavigationProp = StackNavigationProp<RootStackParamList, 'Learning'>;

export default function LearningScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<LearningNavigationProp>();
  const { lessonId, courseId } = route.params as { lessonId: number; courseId: number };

  const [activeTab, setActiveTab] = useState<'lessons' | 'qa'>('lessons');
  const [currentLessonId, setCurrentLessonId] = useState(lessonId);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const { fetchLessonById, lessons, loading: loadingLessons } = useLessons();
  const { fetchCourseById, loading: loadingCourses } = useCourses();
  const { sections, loading: loadingSections } = useSections();

  // 🔹 Fetch dữ liệu ban đầu
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

  // ✅ Player (thay vì dùng <Video/> cũ)
  const player = useVideoPlayer(currentLesson?.video_url || '', player => {
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
            allLessons={lessons}
            allSections={sections}
            currentLessonId={currentLessonId}
            onLessonPress={handleLessonPress}
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
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color="#333" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Learning Lessons</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="bookmark-outline" size={24} color="#333" />
            <Ionicons name="ellipsis-vertical" size={24} color="#333" style={{ marginLeft: 10 }} />
          </View>
        </View>

        {/* Video player */}
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        </View>

        {/* Course Info */}
        <View style={styles.courseInfoContainer}>
          <Text style={styles.courseMainTitle}>
            {currentCourse.title}: {currentLesson.title}
          </Text>
          <View style={styles.actionsBar}>
            <View style={styles.actionItem}>
              <Ionicons name="heart-outline" size={20} color="red" />
              <Text style={styles.actionText}>231 Like</Text>
            </View>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBarContainer}>
          {(['lessons', 'qa'] as const).map(tab => (
            <Pressable
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
                {tab.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES ===
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
});
