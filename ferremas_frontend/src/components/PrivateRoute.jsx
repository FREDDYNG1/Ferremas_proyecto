import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth();

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated());
  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - requiredRoles:', requiredRoles);

  if (!isAuthenticated()) {
    console.log('Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    console.log('Usuario no tiene el rol requerido, redirigiendo a /');
    return <Navigate to="/" replace />;
  }

  console.log('Usuario autenticado y autorizado, renderizando componente');
  return children;
};

export default PrivateRoute;
