import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CrearUsuarioForm from '../components/CrearUsuarioForm';
import '../styles/DashboardAdmin.css';

const DashboardAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container container my-5">
      <div className="card shadow dashboard-card p-4">
        <div className="text-center mb-4">
          <div className="admin-header d-flex justify-content-center align-items-center gap-2">
            <div className="avatar-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
              <i className="bi bi-shield-lock-fill fs-4"></i>
            </div>
            <h2 className="fw-bold mb-0">Bienvenido Administrador</h2>
          </div>

          <p className="text-muted mt-2 mb-1">
            Email: <strong>{user?.email}</strong>
          </p>

          <span className="badge bg-info text-dark">Rol: Administrador</span>

          <button
            className="btn btn-danger mt-3"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>

        <hr className="mb-4" />

        <h4 className="mb-3">Crear nuevos usuarios</h4>
        <CrearUsuarioForm />
      </div>
    </div>
  );
};

export default DashboardAdmin;
