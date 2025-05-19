import React from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ProductoForm from '../../components/productos/ProductoForm';

const ProductoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Editar Producto</Typography>
      <ProductoForm id={id} onSuccess={() => navigate('/admin/productos')} />
    </Box>
  );
};

export default ProductoEditar;
