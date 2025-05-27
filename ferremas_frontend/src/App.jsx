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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Box sx={{ flex: 1 }}>
          <Routes>
            {/* Home page now shows public products */}
            <Route path="/" element={<ProductosPublicos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegistroCliente />} />

            {/* Public Products Route (can keep it as an alternative) */}
            <Route path="/productos" element={<ProductosPublicos />} />
            
            {/* Ruta para la página del carrito */}
            <Route path="/carrito" element={
              <CarritoPage />
            } />

            {/* Admin Home route (no layout) - Matches exactly /admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                  <AdminHome />
                </PrivateRoute>
              }
            />

            {/* Route for creating users (no layout) - Separate route */}
             <Route 
               path="/admin/usuarios/crear"
               element={
                 <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                   <CrearUsuarioForm />
                 </PrivateRoute>
               }
             />

            {/* Route for listing workers (no layout) - Separate route */}
             <Route 
               path="/admin/usuarios/trabajadores"
               element={
                 <PrivateRoute requiredRoles={['admin']}>
                   <TrabajadoresLista />
                 </PrivateRoute>
               }
             />

            {/* Route for editing workers (no layout) - Separate route */}
             <Route 
               path="/admin/usuarios/trabajador/:id/editar"
               element={
                 <PrivateRoute requiredRoles={['admin']}>
                   <EditarTrabajador />
                 </PrivateRoute>
               }
             />

            {/* Admin Management routes (uses ProductosLayout) - Matches /admin/* (except exact /admin) */}
             <Route
               path="/admin"
               element={
                 <PrivateRoute requiredRoles={['admin', 'trabajador']}>
                   <ProductosLayout /> {/* This route renders the layout for its children */}
                 </PrivateRoute>
               }
             >
               {/* Nested routes within /admin that use ProductosLayout */}
               {/* These routes will render within the <Outlet> in ProductosLayout */}
               {/* No index route needed here as /admin is handled by the route above */}
               {/* Remove usuarios/crear from here as it's now a separate route */}
               <Route path="productos" element={<ProductosLista />} />
               <Route path="productos/crear" element={<ProductosCrear />} />
               <Route
                 path="productos/editar/:id"
                 element={
                   <ProductoEditWrapper />
                 }
               />
               {/* Add other management routes here (e.g., usuarios lista) */}
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
        {/* Footer is not rendered globally in App.jsx */}
        {/* Add Footer to specific pages or layouts where needed */}
      </Box>
    </CarritoProvider>
  );
};

// Componente wrapper para obtener el ID de la URL y pasarlo al formulario
const ProductoEditWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/productos'); // Redirect to product list after successful edit
  };

  return <ProductoForm id={id} onSuccess={handleSuccess} />;
};

export default App;


