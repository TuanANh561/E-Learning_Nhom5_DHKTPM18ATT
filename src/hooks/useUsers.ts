import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User } from '../types';
import { API_URL } from './api';

export default function useUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [topTeachers, setTopTeachers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [resUsers, resTopTeachers] = await Promise.all([
				axios.get(API_URL.users),
				axios.get(API_URL.topTeachers)
			]);
			setUsers(resUsers.data);
			setTopTeachers(resTopTeachers.data);
		} catch (err: any) {
			setError(err.message || 'Lỗi khi tải người dùng');
		} finally {
			setLoading(false);
		}
	}, []);

	  const fetchTeacherById = useCallback(async (id: number) => {
		try {
			const res = await axios.get<User>(`${API_URL.users}/teacher/${id}`);
			return res.data;
		} catch (err) {
			console.error('Không tìm thấy teacher:', err);
			return null;
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { users, topTeachers, loading, error, refetch: fetchData, fetchTeacherById };
}