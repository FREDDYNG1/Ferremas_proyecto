import api from './api'; // usa tu instancia base axios

// Función para convertir moneda
export const convertirMoneda = async ({ cantidad, origen, destino }) => {
  const response = await api.post('/convertir-moneda/', {
    cantidad,
    origen,
    destino
  });
  return response.data;
};
