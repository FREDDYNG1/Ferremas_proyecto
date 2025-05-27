import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import Footer from '../../components/Footer';

const PendingPage = () => {
  return (
    <>
      <ResponsiveNavbar />
      <Container sx={{ mt: '64px', py: 4, textAlign: 'center', minHeight: '80vh' }}>
        <Box sx={{ p: 4, border: '1px solid #ff9800', borderRadius: 2, backgroundColor: '#fff3e0' }}>
          <Typography variant="h4" gutterBottom color="warning.main">
            Pago Pendiente
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Tu pago está pendiente de confirmación. Recibirás una notificación cuando se complete.
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/">
            Volver al Inicio
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default PendingPage; 