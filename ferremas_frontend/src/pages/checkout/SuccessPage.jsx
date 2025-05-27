import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import Footer from '../../components/Footer';

const SuccessPage = () => {
  return (
    <>
      <ResponsiveNavbar />
      <Container sx={{ mt: '64px', py: 4, textAlign: 'center', minHeight: '80vh' }}>
        <Box sx={{ p: 4, border: '1px solid #4CAF50', borderRadius: 2, backgroundColor: '#e8f5e9' }}>
          <Typography variant="h4" gutterBottom color="success.main">
            ¡Pago Exitoso!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Tu pago ha sido procesado correctamente. Gracias por tu compra.
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

export default SuccessPage; 