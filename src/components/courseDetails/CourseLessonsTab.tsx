import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCourseLessons from '../../hooks/useCourseLessons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Lesson, RootStackParamList } from '../../types';

type Props = {
  courseId: number;
  onLessonPressPause?: () => void;
  isEnrolled: boolean;
};

export default function CourseLessonsTab({ courseId, onLessonPressPause, isEnrolled }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Learning'>>();
  const { sections, loading } = useCourseLessons(courseId);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.isFree || isEnrolled) {
      onLessonPressPause?.();
      navigation.navigate('Learning', { lessonId: lesson.id, courseId, isEnrolled});
    } else {
      Alert.alert('Bài học chỉ dành cho học viên đã mua khóa học!');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00bfff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sections.map((section) => {
        const isOpen = !!openSections[section.id];
        return (
          <View key={section.id}>
            <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.id)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
            </Pressable>

            {isOpen &&
              section.lessons.map((lesson: Lesson, idx: number) => (
                <Pressable
                  key={lesson.id}
                  style={styles.lessonItem}
                  onPress={() => handleLessonPress(lesson)}
                >
                  <Text style={styles.lessonNumber}>{String(idx + 1).padStart(2, '0')}</Text>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.duration}>{(lesson.durationInSeconds / 60).toFixed(2)} phút</Text>
                  </View>
                  <Ionicons
                    name={lesson.isFree || isEnrolled ? 'play-circle-outline' : 'lock-closed-outline'}
                    size={20}
                    color={lesson.isFree || isEnrolled ? '#00bfff' : '#999'}
                  />
                </Pressable>
              ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
});
