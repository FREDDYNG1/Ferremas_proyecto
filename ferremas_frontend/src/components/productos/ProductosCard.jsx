// src/components/productos/ProductoCard.jsx
import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions, 
  Button
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductoCard = ({ producto, onDelete }) => {
  const navigate = useNavigate();
  
  // Usar imagen o placeholder
  const imagenUrl = producto.imagen_url || '/placeholder.png';

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={imagenUrl}
        alt={producto.nombre}
        sx={{ objectFit: 'contain' }}
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
        {/* ✅ Mostrar cantidad si está disponible */}
        {producto.cantidad !== undefined && (
          <Typography variant="body2" color="text.secondary">
            Cantidad: {producto.cantidad}
          </Typography>
        )}
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
