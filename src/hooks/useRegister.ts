import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from './api';

export interface RegisterData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL.users}/register`, data);

      if (res.data.status === 200) {
        return true;
      } else {
        setError(res.data.message || 'Đăng ký thất bại');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi kết nối server');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { register, loading, error };
}
