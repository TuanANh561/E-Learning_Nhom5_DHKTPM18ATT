import { useState } from 'react';
import axios from 'axios';
import { API_URL } from './api';

export default function usePayments() {
  const [loading, setLoading] = useState(false);

  const complete = async (transactionId: number) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL.payments}/complete`, {
        transactionId,
        status: 'COMPLETED'
      });
    } catch (err) {
      console.error('Complete payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { complete, loading };
}