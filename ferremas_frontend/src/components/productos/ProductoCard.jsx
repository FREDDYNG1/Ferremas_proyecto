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
  
  // Asegurarse de que la imagen siempre se cargue fresca
  const imagenUrl = producto.imagen_url || '/placeholder.png';

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={imagenUrl}
        alt={producto.nombre}
        // Forzar recarga de la imagen
        sx={{ 
          objectFit: 'contain',
          '& img': {
            objectFit: 'contain'
          }
        }}
        // Forzar recarga de la imagen
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.png';
        }}
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
          Stock: {producto.stock_total}
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