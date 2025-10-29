import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MyCourse } from '../types';

const API = 'http://192.168.1.4:3000';
const USER_ID = 1;

export default function useMyCourses() {
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<MyCourse[]>(
        `${API}/my-courses?user_id=${USER_ID}`
      );
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching my courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    refetch: fetchCourses,
  };
}