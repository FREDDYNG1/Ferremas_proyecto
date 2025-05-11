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

const TrabajadorHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveNavbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido, {user?.email} 🔧
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Panel de control para gestión de inventario y ventas.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Inventario
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona el stock de productos.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/inventario')}
              >
                Ver Inventario
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ventas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registra y gestiona ventas.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/ventas')}
              >
                Ver Ventas
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reportes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accede a reportes y estadísticas.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/reportes')}
              >
                Ver Reportes
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TrabajadorHome;
