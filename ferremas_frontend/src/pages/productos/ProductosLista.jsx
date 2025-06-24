//Ferrmas_frontend/src/pages/productos/ProductosLista.jsx
import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Button, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductoCard from '../../components/productos/ProductoCard';
import { productoService } from '../../services/productoService';

const ProductosLista = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  // Añadir estados para el Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    setLoading(true);
    try {
      console.log('Cargando productos...');
      const data = await productoService.getAll();
      console.log('Productos recibidos:', data);
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Mostrar información más detallada del error
      const errorMessage = error.response ? 
        `Error ${error.response.status}: ${error.response.data}` : 
        error.message || 'Error desconocido';
      
      setSnackbarMessage(`Error al cargar productos: ${errorMessage}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Añadir este estado al inicio del componente
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await productoService.delete(deleteDialog.id);
      
      // Cerrar el diálogo de confirmación
      setDeleteDialog({ open: false, id: null });
      
      // Mostrar mensaje de éxito
      setSnackbarMessage('¡Producto eliminado exitosamente!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Recargar la lista de productos desde el backend
      await loadProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setSnackbarMessage('Error al eliminar el producto');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para cerrar el Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Productos</Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={loadProductos}
            sx={{ mr: 2 }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Recargar'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/productos/crear')}
          >
            Nuevo Producto
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <Grid container spacing={3}>
          {productos.map(producto => (
            <Grid item xs={12} sx={{ 
              '@media (min-width: 600px)': { width: '50%' },
              '@media (min-width: 900px)': { width: '33.33%' }
            }} key={producto.id}>
              <ProductoCard
                producto={producto}
                onDelete={(id) => setDeleteDialog({ open: true, id })}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este producto?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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

export default ProductosLista;
