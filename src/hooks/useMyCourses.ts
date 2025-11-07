import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { MyCourse } from '../types';
import { API_URL } from './api';
import { useAuth } from './AuthContext';

interface FetchResult {
  data: MyCourse[];
  total: number;
}

export default function useMyCourses() {
  const { user } = useAuth();
  const userId = user?.id;

  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyCourses = useCallback(async (page = 1, limit = 10): Promise<FetchResult> => {
    if (!userId) {
      setCourses([]);
      setTotal(0);
      return { data: [], total: 0 };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL.myCourses}?student_id=${userId}&_page=${page}&_limit=${limit}`);
      const data: MyCourse[] = res.data.myCourses ?? [];
      const totalCount: number = res.data.total ?? 0;

      setCourses(prev => (page === 1 ? data : [...prev, ...data]));
      setTotal(totalCount);

      return { data, total: totalCount };
    } catch (err) {
      setError('Không thể tải khóa học');
      setCourses([]);
      setTotal(0);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMyCourses(1, 10);
    } else {
      setCourses([]);
      setTotal(0);
    }
  }, [userId, fetchMyCourses]);

  const refetch = useCallback(() => fetchMyCourses(1, 10), [fetchMyCourses]);

  return { courses, total, loading, error, fetchMyCourses, refetch };
}
