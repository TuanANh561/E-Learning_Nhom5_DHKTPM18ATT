import { Course, RootStackParamList, User } from '../../types';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type CourseCardVerticalProps = {
  course: Course;
};

export default function CourseCardVertical({ course }: CourseCardVerticalProps) {
  const [isSaved, setIsSaved] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CourseDetail'>>();
  const handlePress = useCallback(() => {
    navigation.navigate('CourseDetail', { courseId: course.id });
  }, [navigation, course.id]);

  const toggleSaved = useCallback(() => {
    setIsSaved(prev => !prev);
  }, [isSaved]);

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{course.title}</Text>
          <Pressable onPress={toggleSaved} hitSlop={10}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={isSaved ? "#00bfff" : "#666"} />
          </Pressable>
        </View>
        <Text style={styles.teacher}>{course.instructorName}</Text>
        <Text style={styles.price}> {course.price.toLocaleString()} VNĐ</Text>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>
            <Ionicons name="star" size={16} color="#FFD700" /> 
            {course.ratingAvg.toFixed(1)} ({course.ratingCount})
          </Text>
          <Text style={styles.lessons}>• {course.lessonCount} bài học</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 15,
    padding: 10,
    flexDirection: 'row',
  },
  thumbnail: { 
    width: 80, 
    height: 80, 
    borderRadius: 5, 
    marginRight: 10,
    resizeMode: 'cover',
  },
  info: { 
    flex: 1, 
    justifyContent: 'space-between', 
    paddingVertical: 2 
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000',
    maxWidth: '85%',
  },
  teacher: { fontSize: 13, color: '#666', marginBottom: 5 },
  price: { fontSize: 16, color: '#00bfff', fontWeight: 'bold' },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 13, color: '#000', marginRight: 5 },
  lessons: { fontSize: 13, color: '#666' },
});