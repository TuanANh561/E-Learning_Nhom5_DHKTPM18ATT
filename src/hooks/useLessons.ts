import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Lesson } from '../types';
import { API_URL } from './api';

export default function useLessons() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_URL.lessons);
            setLessons(res.data);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải các bài học');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLessonById = useCallback(async (id: number) => {
        try {
            const res = await axios.get<Lesson>(`${API_URL.lessons}/${id}`);
            return res.data;
        } catch (error) {
            console.error("Lỗi khi lấy bài học ID:", id, error);
            return lessons.find(l => l.id === id) || null;
        }
    }, [lessons]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return { lessons, loading, error, refetch: fetchData, fetchLessonById };
}