// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('user_id');

      if (token && role) {
        setUser({ token, role, user_id: userId });
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Usar el endpoint de login personalizado
      const response = await api.post('/usuarios/login/', {
        email,
        password,
      });

      console.log('Respuesta del backend:', response.data); // Log de depuración

      const { access, refresh, role, user_id } = response.data;
      
      console.log('Datos extraídos:', { access, role, user_id }); // Log de depuración
      
      // Configurar axios para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Guardar en localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('role', role);
      localStorage.setItem('user_id', user_id);

      // Actualizar estado
      setUser({ token: access, role, user_id });

      console.log('Usuario guardado en estado:', { token: access, role, user_id }); // Log de depuración

      return { success: true, role };
    } catch (error) {
      console.error('Error en login:', error); // Log de depuración
      if (error.response) {
        // El servidor respondió con un código de error
        throw new Error(error.response.data.detail || 'Error al iniciar sesión');
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // Error al configurar la petición
        throw new Error('Error al procesar la solicitud');
      }
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    
    // Limpiar estado
    setUser(null);
  };

  const isAuthenticated = () => !!user;

  const hasRole = (role) => user?.role === role;

  if (loading) {
    return null; // O un componente de loading si lo prefieres
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated, 
        hasRole,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
