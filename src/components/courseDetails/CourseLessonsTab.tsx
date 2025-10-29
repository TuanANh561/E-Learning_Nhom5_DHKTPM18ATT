import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lesson, Section } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

interface OpenSectionsState { [key: number]: boolean; }
interface CourseLessonsTabProps { 
    lessons: Lesson[]; 
    sections: Section[]; 
    onLessonPressPause?: () => void;
}
interface SectionWithLessons extends Section { lessons: Lesson[]; }

export default function CourseLessonsTab({ lessons, sections, onLessonPressPause }: CourseLessonsTabProps) {
  const [openSections, setOpenSections] = useState<OpenSectionsState>({ 9: true });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Learning'>>();

  const handleLessonPress = (lesson: Lesson, courseId: number) => {
    if (lesson.is_free) {
      onLessonPressPause?.()
      navigation.navigate('Learning', {lessonId: lesson.id, courseId: courseId,});
      
    } else {
      Alert.alert("Bạn phải mua khóa học để xem bài này!");
    }
  };

  const toggleSection = (sectionId: number) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const sectionsWithLessons: SectionWithLessons[] = useMemo(() => {
    const lessonMap = lessons.reduce((acc, l) => {
      acc[l.section_id] = acc[l.section_id] || [];
      acc[l.section_id].push(l);
      return acc;
    }, {} as Record<number, Lesson[]>);

    return sections.map(section => ({
      ...section,
      lessons: lessonMap[section.id] || []
    }));
  }, [sections, lessons]);

  return (
    <View style={styles.tabContent}>
      {sectionsWithLessons.map(section => {
        const isOpen = !!openSections[section.id];
        return (
          <View key={section.id}>
            <Pressable style={styles.sectionHeader} onPress={() => toggleSection(section.id)}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#666" />
            </Pressable>

            {isOpen && section.lessons.map((lesson, idx) => (
              <Pressable
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() => handleLessonPress(lesson, section.course_id)}
              >
                <Text style={styles.lessonNumber}>
                  {(idx + 1).toString().padStart(2, '0')}
                </Text>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.duration}>{lesson.duration_mins.toFixed(2)} mins</Text>
                </View>
                <Ionicons
                  name={lesson.is_free ? "play-circle-outline" : "lock-closed-outline"}
                  size={20}
                  color={lesson.is_free ? "#00bfff" : "#999"}
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
  tabContent: { paddingVertical: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  lessonNumber: { width: 32, fontSize: 14, color: '#666' },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonTitle: { fontSize: 14, color: '#333' },
  duration: { fontSize: 12, color: '#999', marginTop: 2 },
});