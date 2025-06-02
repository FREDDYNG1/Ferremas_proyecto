import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { convertirMoneda } from '../../services/mondeaService';

const ProductoCard = ({ producto, onDelete, mostrarBotonCarrito = false, onAgregarCarrito }) => {
  const navigate = useNavigate();
  const imagenUrl = producto.imagen_url || '/placeholder.png';

  const moneda = localStorage.getItem('moneda') || 'USD';
  const [precioConvertido, setPrecioConvertido] = useState(producto.precio);

  useEffect(() => {
    let isMounted = true;

    const convertir = async () => {
      if (moneda !== 'USD') {
        try {
          const data = await convertirMoneda({
            cantidad: producto.precio,
            origen: 'USD',
            destino: moneda
          });
          if (isMounted && data?.resultado) {
            setPrecioConvertido(data.resultado);
          }
        } catch (error) {
          console.error('Error al convertir moneda:', error);
        }
      }
    };

    convertir();

    return () => {
      isMounted = false;
    };
  }, [producto.precio, moneda]);

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
        <Typography gutterBottom variant="h6" component="div">
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {producto.descripcion}
        </Typography>
        <Typography variant="body1" color="text.primary" gutterBottom>
          {formatoPrecio.format(precioConvertido)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Stock Total:</strong> {producto.stock_total || 0}
        </Typography>
        
        {/* Mostrar detalle de stock por tienda */}
        <Accordion sx={{ mt: 1, boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="caption" color="primary">
              <strong>Ver stock por tienda</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {producto.stock_por_tienda && producto.stock_por_tienda.length > 0 ? (
              producto.stock_por_tienda.map(stock => (
                <Typography key={stock.id} variant="caption" display="block" sx={{ mb: 0.5 }}>
                  <strong>{stock.tienda_nombre}:</strong> {stock.cantidad} unidades
                </Typography>
              ))
            ) : (
              <Typography variant="caption">No hay stock registrado por tienda</Typography>
            )}
          </AccordionDetails>
        </Accordion>
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

        {/* ✅ Mostrar botón para agregar al carrito si se habilita */}
        {mostrarBotonCarrito && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            onClick={() => onAgregarCarrito(producto)}
          >
            Agregar al carrito
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductoCard;
