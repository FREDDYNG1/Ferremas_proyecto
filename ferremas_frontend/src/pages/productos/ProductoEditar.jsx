import React, { useState } from 'react';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ProductoForm from '../../components/productos/ProductoForm';

const ProductoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSuccess = () => {
    setSnackbarMessage('Producto actualizado exitosamente!');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    // La navegación ocurrirá después de cerrar el Snackbar
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    navigate('/admin/productos'); // Navegar después de cerrar
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Editar Producto</Typography>
      <ProductoForm id={id} onSuccess={handleSuccess} />

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductoEditar;
