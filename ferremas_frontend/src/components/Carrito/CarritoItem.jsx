import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

const CarritoItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <img
            src={item.producto_imagen_url}
            alt={item.producto_nombre}
            style={{ width: '100%', maxWidth: '150px', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">{item.producto_nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            Precio: ${Math.floor(item.producto_precio)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              size="small"
              onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
            >
              -
            </Button>
            <Typography sx={{ mx: 2 }}>{item.cantidad}</Typography>
            <Button
              size="small"
              onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
            >
              +
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            color="error"
            onClick={() => onRemove(item.id)}
            size="small"
          >
            Eliminar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarritoItem; 