import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import ClienteHome from './pages/ClienteHome';
import TrabajadorHome from './pages/TrabajadorHome';
import PrivateRoute from './components/PrivateRoute';
import CambiarPassword from './pages/CambiarPassword';
import RegistroCliente from './pages/RegistroCliente';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroCliente />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <DashboardAdmin />
              </PrivateRoute>
            }
          />
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
              <PrivateRoute requiredRole="trabajador">
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
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
