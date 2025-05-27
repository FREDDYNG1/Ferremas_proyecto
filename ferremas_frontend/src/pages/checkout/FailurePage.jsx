import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import Footer from '../../components/Footer';

const FailurePage = () => {
  return (
    <>
      <ResponsiveNavbar />
      <Container sx={{ mt: '64px', py: 4, textAlign: 'center', minHeight: '80vh' }}>
        <Box sx={{ p: 4, border: '1px solid #f44336', borderRadius: 2, backgroundColor: '#ffebee' }}>
          <Typography variant="h4" gutterBottom color="error.main">
            Pago Fallido
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Hubo un problema al procesar tu pago. Por favor, inténtalo de nuevo.
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/carrito">
            Volver al Carrito
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default FailurePage; 