import React from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box } from '@mui/material';

import Home from './pages/Home';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import ClienteHome from './pages/ClienteHome';
import TrabajadorHome from './pages/TrabajadorHome';
import PrivateRoute from './components/PrivateRoute';
import CambiarPassword from './pages/CambiarPassword';
import RegistroCliente from './pages/RegistroCliente';
import Footer from './components/Footer';
import ProductosLayout from './layouts/ProductosLayout';
import ProductosLista from './pages/productos/ProductosLista';
import ProductoForm from './components/productos/ProductoForm';
import CrearUsuarioForm from './components/CrearUsuarioForm';
import TrabajadoresLista from './pages/usuarios/TrabajadoresLista';
import EditarTrabajador from './pages/usuarios/EditarTrabajador';
import ProductosPublicos from './pages/productos/ProductosPublicos';
import ProductosCrear from './pages/productos/ProductosCrear';
import CarritoPage from './pages/carrito/CarritoPage';
import { CarritoProvider } from './context/CarritoContext';

const App = () => {
  return (
    <CarritoProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ProductosPublicos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegistroCliente />} />
            <Route path="/productos" element={<ProductosPublicos />} />
            <Route path="/carrito" element={<CarritoPage />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                  <AdminHome />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/usuarios/crear"
              element={
                <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                  <CrearUsuarioForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/usuarios/trabajadores"
              element={
                <PrivateRoute requiredRoles={['admin']}>
                  <TrabajadoresLista />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/usuarios/trabajador/:id/editar"
              element={
                <PrivateRoute requiredRoles={['admin']}>
                  <EditarTrabajador />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                  <ProductosLayout />
                </PrivateRoute>
              }
            >
              <Route path="productos" element={<ProductosLista />} />
              <Route path="productos/crear" element={<ProductosCrear />} />
              <Route
                path="productos/editar/:id"
                element={<ProductoEditWrapper />}
              />
            </Route>

            <Route
              path="/cliente"
              element={
                <PrivateRoute requiredRole="cliente">
                  <ClienteHome />
                </PrivateRoute>
              }
            />
            <Route
              path="/trabajador"
              element={
                <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                  <TrabajadorHome />
                </PrivateRoute>
              }
            />
            <Route
              path="/cambiar-password"
              element={
                <PrivateRoute>
                  <CambiarPassword />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
          </Routes>
        </Box>
      </Box>
    </CarritoProvider>
  );
};

// Componente wrapper para obtener el ID de la URL y pasarlo al formulario
const ProductoEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/productos');
  };

  return <ProductoForm id={id} onSuccess={handleSuccess} />;
};

export default App;
