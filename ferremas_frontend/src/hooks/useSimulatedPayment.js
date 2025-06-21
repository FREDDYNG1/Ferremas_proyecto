import { useState } from 'react';
import api from '../utils/axiosConfig';

export const useSimulatedPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processSimulatedPayment = async (shippingData) => {
    try {
      setIsProcessing(true);
      setError(null);

      const guestCartId = localStorage.getItem('guest_cart_id');
      const token = localStorage.getItem('access_token');

      const response = await api.post('/carritos/simulate_payment/', {
        guest_cart_id: guestCartId,
        ...shippingData
      }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      
      const result = response.data;

      if (result.status === 'success') {
        // Limpiar el carrito del localStorage
        localStorage.removeItem('guest_cart_id');
        
        // Redirigir a la página de confirmación con los datos de la orden
        const params = new URLSearchParams({
          payment_id: result.payment_id,
          external_reference: result.order_id,
          status: 'approved',
          method: 'simulated'
        });
        
        window.location.href = `/checkout/success?${params.toString()}`;
      } else {
        throw new Error(result.message || 'Error al procesar el pago simulado');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        const errorMessages = Object.entries(backendErrors).map(([field, messages]) => 
          `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        ).join('; ');
        setError(errorMessages);
      } else {
        setError(error.message || 'Error al procesar el pago simulado');
      }
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    processSimulatedPayment
  };
}; 