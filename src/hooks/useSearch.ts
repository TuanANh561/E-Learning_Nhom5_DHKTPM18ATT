import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from './api';
import { Course } from '../types';

interface SearchParams {
  title?: string;
  categoryId?: number;
  instructorId?: number;
  status?: string;
  page?: number;
  size?: number;
}

interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export default function useSearchCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const { page = 0, size = 20, ...body } = params;

      const response = await axios.post<PagedResponse<Course>>(
        `${API_URL.courses}/search?page=${page}&size=${size}`,
        body
      );

      setCourses(response.data.content);
      setTotal(response.data.totalElements);
    } catch (err: any) {
      console.error('Lỗi tìm khóa học:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchCourses, courses, total, loading, error };
}
