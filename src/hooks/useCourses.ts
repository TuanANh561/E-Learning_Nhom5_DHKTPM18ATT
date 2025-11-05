import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Course } from '../types';
import { API_URL } from './api';

export default function useCourses() {
	const [popular, setPopular] = useState<Course[]>([]);
 	const [recommended, setRecommended] = useState<Course[]>([]);
  	const [inspiring, setInspiring] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const popularRes = await axios.get(API_URL.popularCourses);
			const recommendedRes = await axios.get(API_URL.recommendedCourses);
			const inspiringRes = await axios.get(API_URL.inspiringCourses);
			setPopular(popularRes.data);
			setRecommended(recommendedRes.data);
			setInspiring(inspiringRes.data);
		} catch (err: any) {
			setError(err.message || 'Lỗi khi tải khóa học');
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCourseById = useCallback(async (id: number) => {
		try {
			const res = await axios.get<Course>(`${API_URL.courses}/${id}`);
			return res.data;
		} catch (error) {
			console.error("Lỗi khi lấy khóa học ID:", id, error);
			return null;
		}
	}, []);

	const fetchByCategoryId = useCallback(async (categoryId: number, page: number, limit: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get(`${API_URL.courses}/by-category?category_id=${categoryId}&_page=${page}&_limit=${limit}`);
			return {
				data: res.data.courses as Course[], 
				total: res.data.total as number,
				page,
				limit,
			};
		} catch (err: any) {
			setError(err.message || 'Lỗi khi tải khóa học theo danh mục');
			return { data: [], total: 0, page, limit };
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchByTeacherId = useCallback(async (teacherId: number, page: number = 1, limit: number = 6) => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_URL.courses}/by-instructor?instructor_id=${teacherId}&_page=${page}&_limit=${limit}`
        );
        return {
          data: res.data.courses as Course[],
          total: res.data.total as number,
          page,
          limit,
        };
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải khóa học của giảng viên');
        return { data: [], total: 0, page, limit };
      } finally {
        setLoading(false);
      }
    },[]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { popular, recommended, inspiring, loading, error, refetch: fetchData, fetchCourseById, fetchByCategoryId, fetchByTeacherId };
}