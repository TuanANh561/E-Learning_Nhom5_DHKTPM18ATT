import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from './api';

export default function useEnrollment(userId: number | null, courseId: number | null) {
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkEnrollment = useCallback(async () => {
    if (!userId || !courseId) {
      setIsEnrolled(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL.enrollments}/check?user_id=${userId}&course_id=${courseId}`);
      const enrolled = res.data.data;
      console.log(enrolled)
      setIsEnrolled(enrolled);
    } catch (err: any) {
      console.error('Lỗi kiểm tra enrollment:', err);
      setError(err.response?.data?.message || 'Không thể kiểm tra trạng thái sở hữu');
      setIsEnrolled(false);
    } finally {
      setLoading(false);
    }
  }, [userId, courseId]);

  useEffect(() => {
    checkEnrollment();
  }, [checkEnrollment]);

  return { isEnrolled, loading, error, refetch: checkEnrollment};
}