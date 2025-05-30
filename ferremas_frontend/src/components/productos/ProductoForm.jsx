import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { productoService } from '../../services/productoService';

const ProductoForm = ({ id, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    marca: '',
    imagen: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadProducto();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadProducto = async () => {
    try {
      const data = await productoService.getById(id);
      setFormData(data);
    } catch (error) {
      setError('Error al cargar el producto');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Crear una copia de formData para eliminar el campo stock si existe
    const dataToSend = { ...formData };
    if (dataToSend.hasOwnProperty('stock')) {
      delete dataToSend.stock;
    }

    try {
      if (id) {
        await productoService.update(id, dataToSend);
      } else {
        await productoService.create(dataToSend);
      }
      // Llama a onSuccess solo al guardar correctamente
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      setError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="number"
            label="Precio"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Categoría"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Marca"
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            type="file"
            onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
          />
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default ProductoForm;
