import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Button, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await productoService.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productoService.delete(deleteDialog.id);
      setProductos(productos.filter(p => p.id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Productos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/productos/crear')}
        >
          Nuevo Producto
        </Button>
      </Box>

      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <Grid container spacing={3}>
          {productos.map(producto => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
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
          <Button onClick={handleDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductosLista;
