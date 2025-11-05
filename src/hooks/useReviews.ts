import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Review } from '../types';
import { API_URL } from './api';

type FetchByCourseResult = { data: Review[]; total: number; page: number; limit: number };

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

    const fetchReviewByCourseId = useCallback(async (courseId: number, page: number, limit: number): Promise<FetchByCourseResult> => {
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

    /**
     * Fetch the current user's review for a specific course.
     * Backend: GET /my-review-alt/{courseId}?user_id={userId}
     */
    const fetchMyReview = useCallback(async (courseId: number, userId: number): Promise<Review | null> => {
        setLoading(true);
        setError(null);
        try {
            const url = `${API_URL.reviews}/my-review-alt/${courseId}?user_id=${userId}`;
            const res = await axios.get(url);
            // Expecting a single Review response or 404 / empty
            return res.data as Review;
        } catch (err: any) {
            // If not found, return null; otherwise set error
            if (err.response && err.response.status === 404) return null;
            setError(err.message || 'Lỗi khi lấy đánh giá của người dùng');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createReview = useCallback(async (
        reviewRequestDTO: { courseId: number; rating: number; comment: string },
        userId: number
    ) => {
        setLoading(true);
        setError(null);
        try {
            const url = `${API_URL.reviews}/add?user_id=${userId}`;
            const res = await axios.post(url, reviewRequestDTO);
            const created = res.data as Review;
            setReviews(prev => [created, ...prev]);
            return created;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi gửi đánh giá');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateReview = useCallback(async (
        reviewId: number,
        reviewRequestDTO: { courseId: number; rating: number; comment: string },
        userId: number
    ) => {
        setLoading(true);
        setError(null);
        try {
            const url = `${API_URL.reviews}/edit/${reviewId}?user_id=${userId}`;
            const res = await axios.put(url, reviewRequestDTO);
            const updated = res.data as Review;
            setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
            return updated;
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật đánh giá');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { reviews, loading, error, refetch: fetchData, fetchReviewByCourseId, fetchMyReview, createReview, updateReview };
}