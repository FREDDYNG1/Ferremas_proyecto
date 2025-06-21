import api from '../utils/axiosConfig';

export const contactService = {
  /**
   * Obtener mensajes de contacto con paginación y filtros
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise<Object>} - Lista paginada de mensajes
   */
  getMensajes: async (params = {}) => {
    try {
      const response = await api.get('/contacto/mensajes/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw error;
    }
  },

  /**
   * Obtener detalles de un mensaje específico
   * @param {number} mensajeId - ID del mensaje
   * @returns {Promise<Object>} - Detalles del mensaje
   */
  getMensajeDetalle: async (mensajeId) => {
    try {
      const response = await api.get(`/contacto/mensajes/${mensajeId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message details:', error);
      throw error;
    }
  },

  /**
   * Eliminar un mensaje
   * @param {number} mensajeId - ID del mensaje a eliminar
   * @returns {Promise<Object>} - Respuesta de eliminación
   */
  eliminarMensaje: async (mensajeId) => {
    try {
      const response = await api.delete(`/contacto/mensajes/${mensajeId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de mensajes
   * @returns {Promise<Object>} - Estadísticas de mensajes
   */
  getEstadisticas: async () => {
    try {
      const response = await api.get('/contacto/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  /**
   * Enviar mensaje de contacto (público)
   * @param {Object} mensajeData - Datos del mensaje
   * @returns {Promise<Object>} - Respuesta del envío
   */
  enviarMensaje: async (mensajeData) => {
    try {
      const response = await api.post('/contacto/', mensajeData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}; 