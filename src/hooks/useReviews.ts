import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Review } from '../types';
import { API_URL } from './api';

export default function useReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_URL.reviews);
            setReviews(res.data);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải đánh giá');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchReviewByCourseId = useCallback(async (courseId: number, page: number, limit: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get(`${API_URL.reviews}/by-course?course_id=${courseId}&_page=${page}&_limit=${limit}`);
			return {
				data: res.data.reviews as Review[], 
				total: res.data.total as number,
				page,
				limit,
			};
		} catch (err: any) {
			setError(err.message || 'Lỗi khi tải đánh giá theo khóa học');
			return { data: [], total: 0, page, limit };
		} finally {
			setLoading(false);
		}
	}, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { reviews, loading, error, refetch: fetchData, fetchReviewByCourseId };
}