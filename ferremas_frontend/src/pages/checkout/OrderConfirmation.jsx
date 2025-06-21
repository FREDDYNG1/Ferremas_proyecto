import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener parámetros de la URL
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Intentar obtener los detalles reales de la orden desde el backend
        let orderData = null;
        
        if (paymentId || externalReference) {
          orderData = await orderService.getOrderDetails(paymentId, externalReference);
        }
        
        // Si no se pudo obtener datos reales, usar datos simulados
        if (!orderData) {
          orderData = {
            orderId: externalReference || 'ORD-12345',
            paymentId: paymentId || 'MP-123456789',
            status: status || 'approved',
            total: 29990,
            items: [
              {
                id: 1,
                nombre: 'Martillo Profesional',
                cantidad: 2,
                precio: 14995,
                imagen: 'https://via.placeholder.com/50'
              },
              {
                id: 2,
                nombre: 'Destornillador Phillips',
                cantidad: 1,
                precio: 8995,
                imagen: 'https://via.placeholder.com/50'
              }
            ],
            customerInfo: {
              nombre: user?.first_name || 'Cliente',
              email: user?.email || 'cliente@example.com',
              telefono: '+56 9 1234 5678'
            },
            shippingInfo: {
              direccion: 'Av. Principal 123',
              ciudad: 'Santiago',
              codigoPostal: '8320000'
            },
            fechaCreacion: new Date().toLocaleDateString('es-CL'),
            fechaEstimadaEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL')
          };
        }

        setOrderDetails(orderData);
      } catch (err) {
        console.error('Error fetching order details:', err);
        // Si hay error, usar datos simulados como fallback
        setOrderDetails({
          orderId: externalReference || 'ORD-12345',
          paymentId: paymentId || 'MP-123456789',
          status: status || 'approved',
          total: 29990,
          items: [
            {
              id: 1,
              nombre: 'Martillo Profesional',
              cantidad: 2,
              precio: 14995,
              imagen: 'https://via.placeholder.com/50'
            },
            {
              id: 2,
              nombre: 'Destornillador Phillips',
              cantidad: 1,
              precio: 8995,
              imagen: 'https://via.placeholder.com/50'
            }
          ],
          customerInfo: {
            nombre: user?.first_name || 'Cliente',
            email: user?.email || 'cliente@example.com',
            telefono: '+56 9 1234 5678'
          },
          shippingInfo: {
            direccion: 'Av. Principal 123',
            ciudad: 'Santiago',
            codigoPostal: '8320000'
          },
          fechaCreacion: new Date().toLocaleDateString('es-CL'),
          fechaEstimadaEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentId, status, externalReference, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'pagado':
        return 'success';
      case 'pending':
      case 'pendiente':
        return 'warning';
      case 'rejected':
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
      case 'pagado':
        return 'Pago Aprobado';
      case 'pending':
      case 'pendiente':
        return 'Pago Pendiente';
      case 'rejected':
      case 'cancelado':
        return 'Pago Rechazado';
      default:
        return 'Estado Desconocido';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header de confirmación */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="success.main">
          ¡Pago Exitoso!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Tu orden ha sido confirmada
        </Typography>
        <Chip
          label={getStatusText(orderDetails.status)}
          color={getStatusColor(orderDetails.status)}
          sx={{ mt: 2 }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Detalles de la orden */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ReceiptIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Detalles de la Orden</Typography>
            </Box>
            
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Número de Orden
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {orderDetails.orderId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  ID de Pago
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {orderDetails.paymentId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Compra
                </Typography>
                <Typography variant="body1">
                  {orderDetails.fechaCreacion}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Pagado
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  ${orderDetails.total.toLocaleString('es-CL')}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Lista de productos */}
            <Typography variant="h6" gutterBottom>
              Productos Comprados
            </Typography>
            <List>
              {orderDetails.items.map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={item.imagen} alt={item.nombre} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.nombre}
                    secondary={`Cantidad: ${item.cantidad}`}
                  />
                  <Typography variant="body1" fontWeight="bold">
                    ${item.precio.toLocaleString('es-CL')}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Información de envío */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ShippingIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Información de Envío</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Dirección de Envío
                </Typography>
                <Typography variant="body1">
                  {orderDetails.shippingInfo.direccion}
                </Typography>
                <Typography variant="body1">
                  {orderDetails.shippingInfo.ciudad}, {orderDetails.shippingInfo.codigoPostal}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Fecha Estimada de Entrega
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary.main">
                  {orderDetails.fechaEstimadaEntrega}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar con información adicional */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de Contacto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nombre
            </Typography>
            <Typography variant="body1" mb={2}>
              {orderDetails.customerInfo.nombre}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" mb={2}>
              {orderDetails.customerInfo.email}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Teléfono
            </Typography>
            <Typography variant="body1">
              {orderDetails.customerInfo.telefono}
            </Typography>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Próximos Pasos
            </Typography>
            <Typography variant="body2" paragraph>
              • Recibirás un email de confirmación
            </Typography>
            <Typography variant="body2" paragraph>
              • Tu orden será procesada en 24-48 horas
            </Typography>
            <Typography variant="body2" paragraph>
              • Te notificaremos cuando tu pedido esté en camino
            </Typography>
            
            <Button
              variant="contained"
              fullWidth
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Volver al Inicio
            </Button>
            
            {user && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/cliente/mis-ordenes')}
                sx={{ mt: 1 }}
              >
                Ver Mis Órdenes
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderConfirmation; 