// src/components/productos/ProductoCard.jsx
import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions, 
  Button,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductoCard = ({ producto, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={producto.imagen || '/placeholder.png'}
        alt={producto.nombre}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          SKU: {producto.sku}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Categoría: {producto.categoria}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stock: {producto.stock}
        </Typography>
        <Typography variant="h6" color="primary">
          ${producto.precio}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/productos/editar/${producto.id}`)}
        >
          Editar
        </Button>
        <Button 
          size="small" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(producto.id)}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductoCard;
