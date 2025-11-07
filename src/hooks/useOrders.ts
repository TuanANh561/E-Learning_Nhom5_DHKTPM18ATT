import { useState } from 'react';
import axios from 'axios';
import { API_URL } from './api'

export interface OrderResponse {
  orderId: number;
  transactionId: number | null;
  amount: number;
  orderStatus: string;
  qrCodeData: string | null;
}

export default function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrderAndEnroll = async (courseId: number, paymentMethod: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL.orders}/complete-payment`, {
        courseId,
        paymentMethod,
      }, {
        params: { user_id: 1 }
      });
      return res.data.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Thanh toán thất bại';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { createOrderAndEnroll, loading, error };
}