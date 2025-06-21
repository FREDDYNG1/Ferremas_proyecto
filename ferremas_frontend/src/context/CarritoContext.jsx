import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { v4 as uuidv4 } from 'uuid'; // Importar uuid para generar IDs únicos

const CarritoContext = createContext(null);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(null);
  const [loadingCarrito, setLoadingCarrito] = useState(true);
  const [errorCarrito, setErrorCarrito] = useState(null);
  const [guestCartId, setGuestCartId] = useState(null); // Estado para el ID del carrito de invitado

  // Cargar el guestCartId de localStorage al montar el componente
  useEffect(() => {
    let currentGuestCartId = localStorage.getItem('guest_cart_id');
    if (!currentGuestCartId) {
      currentGuestCartId = uuidv4(); // Generar un nuevo ID si no existe
      localStorage.setItem('guest_cart_id', currentGuestCartId);
    }
    setGuestCartId(currentGuestCartId);
  }, []);

  // Función para cargar el carrito desde el backend
  const fetchCarrito = async () => {
    setLoadingCarrito(true);
    setErrorCarrito(null);
    try {
      // Obtener el guestCartId del estado después de haberlo cargado o generado
      const currentGuestCartId = localStorage.getItem('guest_cart_id');
      
      const response = await api.get('/carritos/get_cart/', {
        params: { guest_cart_id: currentGuestCartId } // Enviar guest_cart_id como query param
      });
      setCarrito(response.data);
    } catch (err) {
      console.error('Error fetching carrito:', err);
      setErrorCarrito('Error al cargar el carrito.');
      setCarrito(null); // Asegurarse de que el carrito sea null en caso de error
    } finally {
      setLoadingCarrito(false);
    }
  };

  // Cargar el carrito después de obtener el guestCartId
  useEffect(() => {
    if (guestCartId) {
      fetchCarrito();
    }
  }, [guestCartId]); // Dependencia en guestCartId para cargar el carrito una vez que el ID esté disponible

  // Función para agregar un item al carrito (llama al backend y recarga el carrito)
  const agregarItem = async (productoId, cantidad = 1) => {
    try {
      // Obtener el guestCartId del estado
      const currentGuestCartId = guestCartId || localStorage.getItem('guest_cart_id');

      const response = await api.post('/carritos/add_item/', {
        producto_id: productoId,
        cantidad: cantidad,
        guest_cart_id: currentGuestCartId // Incluir guest_cart_id en el cuerpo de la solicitud
      });

      if (response.status === 200) {
        // Si se creó un nuevo carrito de invitado en el backend, actualizar el ID en localStorage
        if (response.data.guest_cart_id && response.data.guest_cart_id !== currentGuestCartId) {
            localStorage.setItem('guest_cart_id', response.data.guest_cart_id);
            setGuestCartId(response.data.guest_cart_id); // Actualizar el estado
        }
        // Recargar el carrito para actualizar el estado global
        fetchCarrito();
      } else {
         console.error('Error inesperado al agregar item:', response);
         setErrorCarrito('Error al agregar el producto al carrito.');
      }

    } catch (error) {
      console.error('Error al agregar item al carrito:', error);
      let errorMessage = 'Error al agregar el producto al carrito. Inténtalo de nuevo.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Debes iniciar sesión para agregar productos al carrito.';
      }
      setErrorCarrito(errorMessage);
      // Puedes mostrar un snackbar de error aquí si no lo haces en el componente que llama a agregarItem
    }
  };

  // Función para eliminar un item del carrito
  const eliminarItem = async (itemId) => {
    try {
      setLoadingCarrito(true);
      const currentGuestCartId = guestCartId || localStorage.getItem('guest_cart_id');
      
      if (!currentGuestCartId) {
        throw new Error('No hay un carrito de invitado');
      }

      const response = await api.post('/carritos/remove_item/', {
        item_id: itemId,
        guest_cart_id: currentGuestCartId
      });

      if (response.status === 200) {
        await fetchCarrito();
        return true;
      } else {
        throw new Error('Error inesperado al eliminar item');
      }
    } catch (error) {
      console.error('Error al eliminar item del carrito:', error);
      let errorMessage = 'Error al eliminar el producto del carrito. Inténtalo de nuevo.';
      if (error.response?.status === 401) {
        errorMessage = 'Debes iniciar sesión para modificar el carrito.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setErrorCarrito(errorMessage);
      return false;
    } finally {
      setLoadingCarrito(false);
    }
  };

  // Función para actualizar la cantidad de un item
  const actualizarCantidad = async (itemId, cantidad) => {
    try {
      const currentGuestCartId = guestCartId || localStorage.getItem('guest_cart_id');
      
      const response = await api.post('/carritos/update_quantity/', {
        item_id: itemId,
        new_quantity: cantidad,
        guest_cart_id: currentGuestCartId
      });

      if (response.status === 200) {
        // Recargar el carrito para actualizar el estado global
        fetchCarrito();
        return true;
      } else {
        console.error('Error inesperado al actualizar cantidad:', response);
        setErrorCarrito('Error al actualizar la cantidad del producto.');
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      let errorMessage = 'Error al actualizar la cantidad. Inténtalo de nuevo.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Debes iniciar sesión para modificar el carrito.';
      }
      setErrorCarrito(errorMessage);
      return false;
    }
  };

  // Función para iniciar el proceso de checkout
  const iniciarCheckout = async (formData) => {
    try {
      setLoadingCarrito(true);
      const currentGuestCartId = guestCartId || localStorage.getItem('guest_cart_id');
      
      if (!currentGuestCartId) {
        throw new Error('No hay un carrito de invitado');
      }

      // Asegurarse de que todos los campos requeridos estén presentes
      const checkoutData = {
        guest_cart_id: currentGuestCartId,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        codigo_postal: formData.codigo_postal,
        metodo_pago: formData.metodo_pago || 'tarjeta'
      };

      console.log('Enviando datos de checkout:', checkoutData); // Para depuración

      const response = await api.post('/carritos/checkout/', checkoutData);

      if (response.status === 200) {
        // Limpiar el carrito después de una compra exitosa
        setCarrito(null);
        return response.data;
      } else {
        throw new Error('Error inesperado al iniciar checkout');
      }
    } catch (error) {
      console.error('Error al iniciar checkout:', error);
      let errorMessage = 'Error al iniciar el proceso de pago. Inténtalo de nuevo.';
      if (error.response?.status === 401) {
        errorMessage = 'Debes iniciar sesión para proceder al pago.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setErrorCarrito(errorMessage);
      return null;
    } finally {
      setLoadingCarrito(false);
    }
  };

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      loadingCarrito, 
      errorCarrito, 
      fetchCarrito, 
      agregarItem, 
      eliminarItem, 
      actualizarCantidad,
      iniciarCheckout,
      guestCartId 
    }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito must be used within a CarritoProvider');
  }
  return context;
};