import { useState, useCallback } from 'react';
import axios from 'axios';
import { MyCourse } from '../types';
import { API_URL } from './api';

export default function useMyCourses(userId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCourses = useCallback(
    async (page: number = 1, limit: number = 6) => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API_URL.myCourses}?student_id=${userId}&_page=${page}&_limit=${limit}`);
        return {
          data: res.data.myCourses as MyCourse[],
          total: res.data.total as number,
          page,
          limit,
        };
      } catch (err: any) {
        setError('Lỗi khi tải khóa học của tôi');
        console.error('Lỗi khi lấy khóa học:', err);
        return { data: [], total: 0, page, limit };
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { fetchMyCourses, loading, error};
}