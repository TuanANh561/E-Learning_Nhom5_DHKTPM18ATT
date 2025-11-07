import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useCourseLessons from '../../hooks/useCourseLessons';
import useLessonProgress from '../../hooks/useLessonProgress';
import { RootStackParamList, Lesson } from '../../types';
import { useAuth } from '../../hooks/AuthContext';

type Props = {
  courseId: number;
  onLessonPressPause?: () => void;
  isEnrolled: boolean;
};

export default function CourseLessonsTab({ courseId, onLessonPressPause, isEnrolled }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Learning'>>();
  const { user, isLoggedIn} = useAuth();
  const userId = user?.id || 0;

  const { sections = [], loading: secLoading } = useCourseLessons(courseId);
  const { completedLessonIds, loading: progLoading, markComplete } = useLessonProgress(userId, courseId);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  const toggleSection = (id: number) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (lesson.isFree || isEnrolled) {
      onLessonPressPause?.();
      navigation.navigate('Learning', {
        lessonId: lesson.id,
        courseId,
        isEnrolled,
      });
    } else {
      Alert.alert('Bài học chỉ dành cho học viên đã mua khóa học!');
    }
  };

  if (secLoading || progLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00bfff" />
      </View>
    );
  }

  // Nếu không có section nào
  if (!sections || sections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bài học sẽ sớm được cập nhật</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sections.map(section => {
        const isOpen = !!openSections[section.id];

        return (
          <View key={section.id}>
            <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.id)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </Pressable>

            {isOpen &&
              section.lessons?.map((lesson, idx) => {
                const isCompleted = completedLessonIds.has(lesson.id);
                const canAccess = lesson.isFree || isEnrolled;

                return (
                  <Pressable
                    key={lesson.id}
                    style={styles.lessonItem}
                    onPress={() => handleLessonPress(lesson)}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                    ) : (
                      <Text style={styles.lessonNumber}>
                        {String(idx + 1).padStart(2, '0')}
                      </Text>
                    )}

                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.duration}>
                        {(lesson.durationInSeconds / 60).toFixed(2)} phút
                      </Text>
                    </View>

                    {canAccess && !isCompleted && isLoggedIn &&(
                      <Pressable
                        onPress={() => markComplete(lesson.id)}
                        style={styles.completeButton}
                      >
                        <Text style={styles.completeText}>Hoàn thành</Text>
                      </Pressable>
                    )}

                    <Ionicons
                      name={canAccess ? 'play-circle-outline' : 'lock-closed-outline'}
                      size={20}
                      color={canAccess ? '#00bfff' : '#999'}
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
  container: { paddingVertical: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
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
  completeButton: { marginRight: 8 },
  completeText: { color: '#4CAF50', fontWeight: '600', fontSize: 13 },
});