import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import ResponsiveNavbar from '../components/ResponsiveNavbar';

const ClienteHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveNavbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido, {user?.email} 🛒
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí podrás gestionar tus compras y ver tu historial de pedidos.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Mis Pedidos Recientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No tienes pedidos recientes.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Productos Favoritos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No tienes productos favoritos.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/productos')}
          >
            Ver Catálogo
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ClienteHome;
