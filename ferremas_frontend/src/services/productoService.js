import api from './api';

export const productoService = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await api.get('/productos/');
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id) => {
    const response = await api.get(`/productos/${id}/`);
    return response.data;
  },

  // Crear un nuevo producto
  create: async (productoData) => {
    const formData = new FormData();
    Object.keys(productoData).forEach(key => {
      formData.append(key, productoData[key]);
    });
    const response = await api.post('/productos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar un producto
  update: async (id, productoData) => {
    const formData = new FormData();
    Object.keys(productoData).forEach(key => {
      formData.append(key, productoData[key]);
    });
    const response = await api.put(`/productos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Eliminar un producto
  delete: async (id) => {
    const response = await api.delete(`/productos/${id}/`);
    return response.data;
  }
}; 