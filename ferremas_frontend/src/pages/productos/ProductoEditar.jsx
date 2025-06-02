import React, { useState, useEffect } from 'react';
import { Typography, Box, Snackbar, Alert, Divider, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ProductoForm from '../../components/productos/ProductoForm';
import StockPorTienda from '../../components/productos/StockPorTienda';
import { productoService } from '../../services/productoService';

const ProductoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        const data = await productoService.getById(id);
        setProducto(data);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setSnackbarMessage('Error al cargar la información del producto');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      cargarProducto();
    }
  }, [id]);

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
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Información del Producto</Typography>
        <ProductoForm id={id} onSuccess={handleSuccess} />
      </Paper>
      
      {id && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Gestión de Stock</Typography>
          <Divider sx={{ mb: 3 }} />
          <StockPorTienda productoId={id} />
        </Paper>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductoEditar;
