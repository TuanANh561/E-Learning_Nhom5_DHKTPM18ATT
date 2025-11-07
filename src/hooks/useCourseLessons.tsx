import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lesson, Section } from '../types';
import { API_URL } from './api';

interface SectionWithLessons extends Section {
  lessons: Lesson[];
}

export default function useCourseLessons(courseId: number) {
  const [sections, setSections] = useState<SectionWithLessons[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL.sections}/by-course?course_id=${courseId}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setSections(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sections/lessons:', error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  return { sections, loading };
}