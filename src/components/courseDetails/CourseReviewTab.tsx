import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Review, User, Course } from '../../types';

interface Props {
  reviews: Review[];
  course: Course;
}

export default function CourseReviewTab({ reviews, course }: Props) {
  const [filter, setFilter] = useState<number | 'All'>('All');
  const filtered = filter === 'All' ? reviews : reviews.filter(r => r.rating === filter);

  const renderReview = ({ item }: { item: Review }) => {

    return (
      <View style={styles.review}>
        <Image source={{ uri: item.userrAvatarUrl || 'https://via.placeholder.com/40' }} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.userFullName || 'Unknown'}</Text>
            <Text style={styles.date}>{item.createdAt}</Text>
          </View>
          <View style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Ionicons key={i} name="star" size={16} color={i < item.rating ? '#ffd700' : '#ddd'} />
            ))}
          </View>
          <Text style={styles.comment}>{item.comment}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.rating}>
          <Ionicons name="star" size={20} color="#ffd700" />
          <Text style={styles.avg}>{course.ratingAvg.toFixed(1)}/5 ({course.ratingCount}+ reviews)</Text>
        </View>
        <Pressable><Text style={styles.viewAll}>View all</Text></Pressable>
      </View>

      <View style={styles.filters}>
        {['All', 5, 4, 3, 2, 1].map(star => (
          <Pressable
            key={star}
            style={[styles.filterBtn, filter === star && styles.active]}
            onPress={() => setFilter(star as any)}
          >
            <Text style={[styles.filterText, filter === star && styles.activeText]}>
              {star === 'All' ? 'All' : star}
              {star !== 'All' && <Ionicons name="star" size={12} color={filter === star ? '#fff' : '#ffd700'} style={{ marginLeft: 2 }} />}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList data={filtered} renderItem={renderReview} keyExtractor={item => item.id.toString()} scrollEnabled={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  avg: { marginLeft: 5, fontWeight: 'bold' },
  viewAll: { color: '#00bfff' },
  filters: { flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: { backgroundColor: '#e0f7ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 5 },
  active: { backgroundColor: '#00bfff' },
  filterText: { color: '#00bfff', fontWeight: 'bold' },
  activeText: { color: '#fff' },
  review: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  content: { flex: 1, marginLeft: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: 'bold' },
  date: { color: '#999', fontSize: 12 },
  stars: { flexDirection: 'row', marginVertical: 5 },
  comment: { color: '#666' },
});