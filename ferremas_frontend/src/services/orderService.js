import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Configurar axios con interceptores para manejar tokens
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const orderService = {
  /**
   * Obtener detalles de una orden específica
   * @param {string} paymentId - ID del pago de MercadoPago
   * @param {string} externalReference - Referencia externa (ID de orden)
   * @returns {Promise<Object>} - Detalles de la orden
   */
  getOrderDetails: async (paymentId = null, externalReference = null) => {
    try {
      const params = new URLSearchParams();
      if (paymentId) params.append('payment_id', paymentId);
      if (externalReference) params.append('external_reference', externalReference);
      
      const response = await apiClient.get(`/carrito/get_order_details/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  /**
   * Obtener historial de órdenes del usuario
   * @returns {Promise<Array>} - Lista de órdenes
   */
  getUserOrders: async () => {
    try {
      const response = await apiClient.get('/carrito/user_orders/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva orden desde el carrito
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>} - Orden creada
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/carrito/create_order/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Actualizar el estado de una orden
   * @param {string} orderId - ID de la orden
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} - Orden actualizada
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.patch(`/carrito/orders/${orderId}/status/`, {
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Obtener una orden específica por ID
   * @param {string} orderId - ID de la orden
   * @returns {Promise<Object>} - Detalles de la orden
   */
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/carrito/orders/${orderId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw error;
    }
  }
};

export default orderService; 