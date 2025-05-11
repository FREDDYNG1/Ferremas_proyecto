import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Grid,
  Paper,
} from '@mui/material';

const Home = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'primary.dark',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={5}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Bienvenido a Ferremas 🛠️
          </Typography>
          <Typography variant="h6" color="gray.300" gutterBottom>
            Tu ferretería en línea de confianza
          </Typography>

          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Iniciar sesión
          </Button>

          {role && (
            <Alert severity="info" sx={{ mt: 3, display: 'inline-block' }}>
              Estás autenticado como: <strong>{role}</strong>
            </Alert>
          )}
        </Box>

        {/* Tarjetas */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h3" mb={2}>🔧</Typography>
              <Typography variant="h6">Amplio Catálogo</Typography>
              <Typography variant="body2" color="text.secondary">
                Encuentra todo lo que necesitas para tus proyectos.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h3" mb={2}>🚚</Typography>
              <Typography variant="h6">Entrega Rápida</Typography>
              <Typography variant="body2" color="text.secondary">
                Recibe tus productos en tiempo récord.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h3" mb={2}>💬</Typography>
              <Typography variant="h6">Soporte 24/7</Typography>
              <Typography variant="body2" color="text.secondary">
                Atención personalizada cuando la necesites.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
