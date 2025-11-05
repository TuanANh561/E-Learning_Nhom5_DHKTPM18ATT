import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Course, RootStackParamList } from '../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CourseDetail'>>();
  const handlePress = useCallback(() => {
    navigation.navigate('CourseDetail', { courseId: course.id }); 
  }, [navigation, course.id]);

  return (
    <Pressable onPress={handlePress}style={styles.container}>
      <Image source={{ uri: course.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.teacher}>{course.instructorName}</Text> 
        <Text style={styles.price}>{course.price.toLocaleString()} VNĐ</Text>
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    padding: 10,
    marginRight: 5,
    width: 250,
  },
  thumbnail: { width: '100%', height: 120, borderRadius: 8, marginBottom: 10 },
  info: { padding: 5 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  teacher: { fontSize: 14, color: '#666', marginTop: 4 },
  price: { fontSize: 16, color: '#00bfff', fontWeight: 'bold', marginTop: 4 },
  rating: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  ratingText: { fontSize: 14, color: '#666' },
  lessons: { fontSize: 14, color: '#666' },
});