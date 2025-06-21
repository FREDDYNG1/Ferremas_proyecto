import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const MisOrdenes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getUserOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error al cargar el historial de pedidos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pagado':
      case 'approved':
        return 'success';
      case 'pendiente':
      case 'pending':
        return 'warning';
      case 'enviado':
        return 'info';
      case 'entregado':
        return 'success';
      case 'cancelado':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pagado':
      case 'approved':
        return 'Pago Aprobado';
      case 'pendiente':
      case 'pending':
        return 'Pago Pendiente';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
      case 'rejected':
        return 'Cancelado';
      default:
        return 'Estado Desconocido';
    }
  };

  const handleViewOrderDetails = (orderId) => {
    // Navegar a una página de detalles de orden específica
    navigate(`/cliente/orden/${orderId}`);
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveNavbar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveNavbar />
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={() => navigate('/cliente')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" gutterBottom>
              Mi Historial de Pedidos
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Aquí puedes ver todos tus pedidos realizados en Ferremas.
          </Typography>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {orders.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No tienes pedidos aún
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Cuando realices tu primera compra, aparecerá aquí.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/productos')}
              startIcon={<ShoppingCartIcon />}
            >
              Ver Productos
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order.orderId}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Orden #{order.orderId.slice(0, 8)}...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fecha: {order.fechaCreacion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total: ${order.total.toLocaleString('es-CL')}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="flex-end">
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status)}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} producto{order.items.length > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Productos */}
                    <Typography variant="subtitle1" gutterBottom>
                      Productos:
                    </Typography>
                    <List dense>
                      {order.items.slice(0, 3).map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar src={item.imagen} alt={item.nombre} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.nombre}
                            secondary={`Cantidad: ${item.cantidad} - $${item.precio.toLocaleString('es-CL')}`}
                          />
                        </ListItem>
                      ))}
                      {order.items.length > 3 && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            secondary={`... y ${order.items.length - 3} producto${order.items.length - 3 > 1 ? 's' : ''} más`}
                          />
                        </ListItem>
                      )}
                    </List>

                    {/* Información de envío */}
                    <Box mt={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Dirección de envío:
                      </Typography>
                      <Typography variant="body2">
                        {order.shippingInfo.direccion}, {order.shippingInfo.ciudad}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Entrega estimada: {order.fechaEstimadaEntrega}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Tooltip title="Ver detalles completos">
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewOrderDetails(order.orderId)}
                      >
                        Ver Detalles
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MisOrdenes; 