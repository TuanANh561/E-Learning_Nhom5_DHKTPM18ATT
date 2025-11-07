import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './api';

export default function useLessonProgress(userId: number | null, courseId: number | null) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !courseId) {
      setCompleted(new Set());
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL.progress}/by-enrollment`, {
          params: { user_id: userId, course_id: courseId },
        });

        if (Array.isArray(data) && data.length > 0) {
          const completedIds = data
            .filter((p: any) => p.isCompleted)
            .map((p: any) => p.lessonId);
          setCompleted(new Set(completedIds));
        } else {
          setCompleted(new Set());
        }
      } catch (e) {
        console.error('Lỗi lấy progress:', e);
        setCompleted(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, courseId]);

  // ✅ Đánh dấu hoàn thành
  const markComplete = async (lessonId: number) => {
    if (!userId || !courseId) return;
    try {
      await axios.post(`${API_URL.progress}/complete`, null, {
        params: { user_id: userId, course_id: courseId, lesson_id: lessonId },
      });
      setCompleted(prev => new Set(prev).add(lessonId));
    } catch (e) {
      console.error('Lỗi mark complete:', e);
    }
  };

  return { completedLessonIds: completed, loading, markComplete };
}
