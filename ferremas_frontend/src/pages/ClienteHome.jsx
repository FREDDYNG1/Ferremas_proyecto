import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClienteHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido Cliente 🛒</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default ClienteHome;
