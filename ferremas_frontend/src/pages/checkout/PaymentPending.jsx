import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Pending as PendingIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header de pendiente */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <PendingIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="warning.main">
          Pago en Proceso
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Tu pago está siendo procesado por el banco
        </Typography>
        
        <Chip
          label="Estado: Pendiente"
          color="warning"
          variant="outlined"
          sx={{ mt: 2 }}
        />
        
        {paymentId && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            ID de Pago: {paymentId}
          </Typography>
        )}
        
        {externalReference && (
          <Typography variant="body2" color="text.secondary">
            Número de Orden: {externalReference}
          </Typography>
        )}
      </Paper>

      {/* Barra de progreso */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Progreso del Pago
        </Typography>
        <LinearProgress 
          variant="indeterminate" 
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Procesando transacción...
        </Typography>
      </Paper>

      {/* Información del proceso */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          ¿Qué está pasando?
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <ScheduleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Tiempo de procesamiento"
              secondary="El pago puede tardar entre 15 minutos y 48 horas en ser confirmado"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Notificaciones"
              secondary="Recibirás un email cuando el pago sea confirmado o rechazado"
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <ShoppingCartIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Tu orden"
              secondary="Una vez confirmado el pago, tu orden será procesada inmediatamente"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Alertas informativas */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Información importante:</strong>
        </Typography>
        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          • No cierres esta página hasta que recibas confirmación
        </Typography>
        <Typography variant="body2">
          • Puedes verificar el estado en tu historial de órdenes
        </Typography>
        <Typography variant="body2">
          • Si el pago es rechazado, podrás intentarlo nuevamente
        </Typography>
      </Alert>

      {/* Botones de acción */}
      <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
        >
          Ir al Inicio
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          startIcon={<ShoppingCartIcon />}
          onClick={() => navigate('/carrito')}
        >
          Ver Carrito
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentPending; 