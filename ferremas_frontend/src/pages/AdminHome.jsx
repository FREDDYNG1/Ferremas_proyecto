import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import CrearUsuarioForm from '../components/CrearUsuarioForm'; // Remove this import
// import "../Styles/DashboardAdmin.css"; // Remove this import if it's only for the form

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
} from '@mui/material'; // Add Material UI components as needed

const AdminHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Add navigation handlers for products and users
  const navigateToProducts = () => {
    navigate('/admin/productos');
  };

  const navigateToCreateUser = () => {
    navigate('/admin/usuarios/crear');
  };

  const navigateToViewWorkers = () => {
    navigate('/admin/usuarios/trabajadores');
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido, {user?.email} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Panel de administración. Gestiona productos, usuarios y más.
          </Typography>
           {user?.role === 'admin' && (
             <Box sx={{ mt: 2 }}>
               <span className="badge bg-info text-dark">Rol: Administrador</span>
             </Box>
           )}

          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3 }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Paper>

        {/* Cards for navigation */} 
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gestión de Productos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administra el inventario, crea, edita y elimina productos.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={navigateToProducts}
              >
                Ver Productos
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
             <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gestión de Usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea y administra cuentas de usuario.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={navigateToCreateUser} // Link to create user page
              >
                Crear Usuario
              </Button>
              {/* Add another button here for viewing users if you create UsuariosLista.jsx */}
              <Button
                variant="outlined" // Use outlined for secondary action
                color="primary"
                fullWidth
                sx={{ mt: 1 }} // Add margin top to separate buttons
                onClick={navigateToViewWorkers}
              >
                Ver Trabajadores
              </Button>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default AdminHome;
