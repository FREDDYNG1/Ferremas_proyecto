import React, { useEffect, useState } from 'react';
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
import { convertirMoneda } from '../../services/mondeaService'; 
const ProductoCard = ({ producto, onDelete }) => {
  const navigate = useNavigate();
  const imagenUrl = producto.imagen_url || '/placeholder.png';

  // Leer la moneda seleccionada del usuario (guardada desde el selector de país)
  const moneda = localStorage.getItem('moneda') || 'USD';
  const [precioConvertido, setPrecioConvertido] = useState(producto.precio);

  useEffect(() => {
    const convertir = async () => {
      if (moneda !== 'USD') {
        try {
          const data = await convertirMoneda({
            cantidad: producto.precio,
            origen: 'USD',
            destino: moneda
          });
          setPrecioConvertido(data.resultado);
        } catch (error) {
          console.error('Error al convertir moneda:', error);
        }
      }
    };

    convertir();
  }, [producto.precio, moneda]);

  // Formatear el precio con el símbolo correcto
  const formatoPrecio = new Intl.NumberFormat('es', {
    style: 'currency',
    currency: moneda
  });

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={imagenUrl}
        alt={producto.nombre}
        sx={{ 
          objectFit: 'contain',
          '& img': { objectFit: 'contain' }
        }}
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
          {formatoPrecio.format(precioConvertido)}
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
