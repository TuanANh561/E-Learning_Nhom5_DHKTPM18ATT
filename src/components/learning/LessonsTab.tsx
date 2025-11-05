import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson } from '../../types';
import useCourseLessons from '../../hooks/useCourseLessons';

interface LessonsTabProps {
  courseId: number;
  currentLessonId: number;
  onLessonPress: (lesson: Lesson) => void;
  isEnrolled: boolean;
}

export default function LessonsTab({ courseId, currentLessonId, onLessonPress, isEnrolled}: LessonsTabProps) {
  const { sections, loading } = useCourseLessons(courseId);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (sections.length > 0 && currentLessonId) {
      const sectionWithCurrent = sections.find(section =>
        section.lessons.some(lesson => lesson.id === currentLessonId)
      );

      if (sectionWithCurrent) {
        setOpenSections({ [sectionWithCurrent.id]: true });
      }
    }
  }, [sections, currentLessonId]);

  const toggleSection = (sectionId: number) => {
    setOpenSections(prev => ({...prev,[sectionId]: !prev[sectionId],}));
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.isFree || isEnrolled) {
      onLessonPress(lesson);
    } else {
      Alert.alert( 'Khóa học bị khóa', 'Bài học này chỉ dành cho học viên đã mua khóa học!',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {sections.map(section => {
        const isOpen = !!openSections[section.id];
        return (
          <View key={section.id}>
            <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.id)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
            </Pressable>

            {isOpen &&
              section.lessons.map((lesson, idx) => {
                const isActive = lesson.id === currentLessonId;
                return (
                  <Pressable key={lesson.id} style={[styles.lessonItem, isActive && { backgroundColor: '#e6f7ff' }]}
                    onPress={() => handleLessonPress(lesson)}
                  >
                    <Text style={styles.lessonNumber}> {(idx + 1).toString().padStart(2, '0')}</Text>
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.duration}> {(lesson.durationInSeconds / 60).toFixed(1)} phút</Text>
                    </View>
                    <Ionicons name={ isActive ? 'play-circle' : lesson.isFree || isEnrolled ? 'play-circle-outline' : 'lock-closed-outline'}
                      size={20}
                      color={ isActive ? '#00bfff' : lesson.isFree || isEnrolled ? '#00bfff' : '#999'}
                    />
                  </Pressable>
                );
              })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: { backgroundColor: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  lessonNumber: { width: 32, fontSize: 14, color: '#666' },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 14, color: '#333' },
  duration: { fontSize: 12, color: '#999', marginTop: 2 },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
