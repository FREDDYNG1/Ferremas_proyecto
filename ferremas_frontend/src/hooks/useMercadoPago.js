import { useState } from 'react';
import api from '../utils/axiosConfig';

export const useMercadoPago = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  const iniciarPago = async () => {
    try {
      setIsCheckingOut(true);
      setError(null);

      const guestCartId = localStorage.getItem('guest_cart_id');
      if (!guestCartId) {
        throw new Error('No se encontró el carrito');
      }

      const response = await api.post('/carritos/create_mercadopago_preference/', {
        guest_cart_id: guestCartId
      });

      const preferenceData = response.data;

      if (preferenceData && preferenceData.sandbox_init_point) {
        localStorage.setItem('mp_preference_id', preferenceData.preference_id);
        localStorage.setItem('mp_public_key', preferenceData.public_key);
        localStorage.setItem('mp_items', JSON.stringify(preferenceData.items));
        
        const sandboxUrl = preferenceData.sandbox_init_point;
        
        if (!sandboxUrl.startsWith('https://')) {
          throw new Error('URL de Mercado Pago inválida');
        }
        
        window.location.href = sandboxUrl;
      } else {
        throw new Error('No se recibió la URL de pago de Mercado Pago');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Error al procesar el pago');
      throw error;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const verificarEstadoPago = async (paymentId) => {
    try {
      const response = await api.get(`/carritos/payment_status/${paymentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar estado del pago:', error);
      return null;
    }
  };

  return {
    isCheckingOut,
    error,
    iniciarPago,
    verificarEstadoPago
  };
}; 