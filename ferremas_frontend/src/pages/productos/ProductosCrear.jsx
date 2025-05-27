import React, { useState } from 'react';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductoForm from '../../components/productos/ProductoForm';

const ProductoCrear = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSuccess = () => {
    setSnackbarMessage('¡Producto guardado exitosamente!');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
    // Solo navega si el mensaje fue de éxito, no si fue por cancelar
    navigate('/admin/productos');
  };

  // Nueva función para cancelar
  const handleCancel = () => {
    navigate('/admin/productos');
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Crear Producto
      </Typography>
      <ProductoForm onSuccess={handleSuccess} onCancel={handleCancel} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Reducir a 3 segundos para una navegación más rápida
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%', fontSize: '1.1rem' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductoCrear;
