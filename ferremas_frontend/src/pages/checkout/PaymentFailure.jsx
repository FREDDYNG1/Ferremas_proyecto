import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  const getFailureReason = (status) => {
    switch (status) {
      case 'rejected':
        return 'El pago fue rechazado por el banco o la entidad financiera.';
      case 'cancelled':
        return 'El pago fue cancelado por el usuario.';
      case 'in_process':
        return 'El pago está siendo procesado. Puede tardar hasta 48 horas.';
      default:
        return 'Ocurrió un error durante el proceso de pago.';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header de error */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="error.main">
          Pago No Completado
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {getFailureReason(status)}
        </Typography>
        
        {paymentId && (
          <Typography variant="body2" color="text.secondary">
            ID de Pago: {paymentId}
          </Typography>
        )}
      </Paper>

      {/* Información adicional */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          ¿Qué puedes hacer?
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <RefreshIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Intentar nuevamente"
              secondary="Puedes volver al carrito y realizar el pago otra vez"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <HelpIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Verificar información"
              secondary="Asegúrate de que los datos de tu tarjeta sean correctos"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <ShoppingCartIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Revisar carrito"
              secondary="Verifica que los productos y cantidades sean correctos"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Alertas informativas */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Consejos para un pago exitoso:</strong>
        </Typography>
        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          • Verifica que tu tarjeta tenga fondos suficientes
        </Typography>
        <Typography variant="body2">
          • Asegúrate de que los datos de facturación sean correctos
        </Typography>
        <Typography variant="body2">
          • Si usas tarjeta de crédito, verifica que no esté bloqueada
        </Typography>
      </Alert>

      {/* Botones de acción */}
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <Button
          variant="contained"
          size="large"
          startIcon={<ShoppingCartIcon />}
          onClick={() => navigate('/carrito')}
        >
          Volver al Carrito
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Ir al Inicio
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentFailure; 