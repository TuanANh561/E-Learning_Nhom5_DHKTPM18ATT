import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Pressable, FlatList, TextInput, Alert, ActivityIndicator} from 'react-native';
import useReviews from '../../hooks/useReviews';
import { Ionicons } from '@expo/vector-icons';
import { Review, Course } from '../../types';

// === COMPONENT CON: ReviewItem ===
const ReviewItem = React.memo(({ item }: { item: Review }) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <View style={styles.review}>
      <Image
        source={{ uri: item.userAvatarUrl || 'https://via.placeholder.com/40' }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.userFullName || 'Người dùng'}</Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={16}
              color={i < item.rating ? '#ffd700' : '#ddd'}
            />
          ))}
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    </View>
  );
});

interface Props {
  reviews: Review[];
  course: Course;
  isEnrolled: boolean;
}

export default function CourseReviewTab({ reviews: initialReviews, course, isEnrolled }: Props) {
  const { createReview, updateReview, fetchMyReview, fetchReviewByCourseId } = useReviews();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<number | 'All'>('All');

  const trimmedComment = comment.trim();

  const filteredReviews = useMemo(() => {
    return filter === 'All' ? reviews : reviews.filter((r) => r.rating === filter);
  }, [reviews, filter]);

  useEffect(() => {
    if (!isEnrolled) return;

    fetchMyReview(course.id, 1).then((review) => {
      if (review) {
        setUserReview(review);
        setRating(review.rating);
        setComment(review.comment || '');
      } else {
        setUserReview(null);
        setRating(0);
        setComment('');
      }
    });
  }, [isEnrolled, course.id, fetchMyReview]);

  // === REFRESH + CẬP NHẬT LIST ===
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const myReview = await fetchMyReview(course.id, 1);
      if (myReview) {
        setUserReview(myReview);
        setRating(myReview.rating);
        setComment(myReview.comment || '');
      } else {
        setUserReview(null);
        setRating(0);
        setComment('');
      }

      const result = await fetchReviewByCourseId(course.id, 1, 20);
      setReviews(result.data || []);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải lại dữ liệu');
    } finally {
      setRefreshing(false);
    }
  }, [course.id, fetchMyReview, fetchReviewByCourseId]);

  // === GỬI / CẬP NHẬT ĐÁNH GIÁ ===
  const handleSubmit = useCallback(async () => {
    if (rating === 0) return Alert.alert('Lỗi', 'Vui lòng chọn số sao');
    if (!trimmedComment) return Alert.alert('Lỗi', 'Vui lòng nhập nhận xét');

    setSubmitting(true);
    try {
      const reviewDTO = { courseId: course.id, rating, comment: trimmedComment };
      const review = userReview
        ? await updateReview(userReview.id, reviewDTO, 1)
        : await createReview(reviewDTO, 1);

      setUserReview(review);
      Alert.alert('Thành công!', userReview ? 'Cập nhật thành công!' : 'Gửi thành công!');

      await handleRefresh();
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  }, [
    rating,
    userReview,
    trimmedComment,
    course.id,
    createReview,
    updateReview,
    handleRefresh,
  ]);

  return (
    <View style={styles.container}>
      {/* Tóm tắt */}
      <View style={styles.summary}>
        <View style={styles.rating}>
          <Ionicons name="star" size={20} color="#ffd700" />
          <Text style={styles.avg}>
            {course.ratingAvg.toFixed(1)}/5 ({course.ratingCount}+)
          </Text>
        </View>
      </View>

      {/* Bộ lọc */}
      <View style={styles.filters}>
        {['All', 5, 4, 3, 2, 1].map((star) => (
          <Pressable
            key={star}
            style={[styles.filterBtn, filter === star && styles.active]}
            onPress={() => setFilter(star as any)}
          >
            <Text style={[styles.filterText, filter === star && styles.activeText]}>
              {star === 'All' ? 'Tất cả' : star}
              {star !== 'All' && (
                <Ionicons
                  name="star"
                  size={12}
                  color={filter === star ? '#fff' : '#ffd700'}
                  style={{ marginLeft: 2 }}
                />
              )}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Form đánh giá */}
      {isEnrolled && (
        <View style={styles.inputBox}>
          <Text style={styles.inputTitle}>Viết đánh giá</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Pressable key={s} onPress={() => setRating(s)} style={{ padding: 6 }}>
                <Ionicons name="star" size={24} color={s <= rating ? '#ffd700' : '#ddd'} />
              </Pressable>
            ))}
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Chia sẻ trải nghiệm..."
            multiline
            style={styles.textInput}
            editable={!submitting}
          />
          <Pressable
            style={[
              styles.submitBtn,
              (rating === 0 || !trimmedComment || submitting) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting || rating === 0 || !trimmedComment}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>{userReview ? 'Cập nhật' : 'Gửi'}</Text>
            )}
          </Pressable>
        </View>
      )}

      <FlatList
        data={filteredReviews}
        renderItem={({ item }) => <ReviewItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        style={styles.reviewList}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
            Chưa có đánh giá nào
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  summary: { marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  avg: { marginLeft: 5, fontWeight: 'bold' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  filterBtn: {
    backgroundColor: '#e0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 5,
  },
  active: { backgroundColor: '#00bfff' },
  filterText: { color: '#00bfff', fontWeight: 'bold' },
  activeText: { color: '#fff' },
  review: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  content: { flex: 1, marginLeft: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: 'bold' },
  date: { color: '#999', fontSize: 12 },
  stars: { flexDirection: 'row', marginVertical: 5 },
  comment: { color: '#666', lineHeight: 20 },
  reviewList: { flex: 1, marginTop: 10 },
  inputBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputTitle: { fontWeight: '700', marginBottom: 12, fontSize: 16 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  textInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: '#00bfff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#cfcfcf' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});