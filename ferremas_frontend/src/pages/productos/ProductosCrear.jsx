import React from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductoForm from '../../components/productos/ProductoForm';

const ProductoCrear = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Crear Producto</Typography>
      <ProductoForm onSuccess={() => navigate('/admin/productos')} />
    </Box>
  );
};

export default ProductoCrear;
