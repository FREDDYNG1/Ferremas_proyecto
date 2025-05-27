import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Snackbar,
  Grid,
  Divider
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import MuiAlert from '@mui/material/Alert';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import Footer from '../../components/Footer';
import CarritoItem from '../../components/Carrito/CarritoItem';
import { useCarrito } from '../../context/CarritoContext';
import { useMercadoPago } from '../../hooks/useMercadoPago';
import { useSnackbar } from '../../hooks/useSnackbar';
import { CARRITO_MESSAGES } from '../../constants/messages';
import CheckoutForm from '../../components/Checkout/CheckoutForm';

const SnackbarAlert = React.forwardRef(function SnackbarAlert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CarritoPage = () => {
  const { carrito, loadingCarrito, errorCarrito, eliminarItem, actualizarCantidad } = useCarrito();
  const { isCheckingOut, error: mpError, iniciarPago, verificarEstadoPago } = useMercadoPago();
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    hideSnackbar
  } = useSnackbar();

  const checkoutFormRef = useRef(null);

  const handleRemoveItem = async (itemId) => {
    const success = await eliminarItem(itemId);
    if (success) {
      showSnackbar(CARRITO_MESSAGES.PRODUCTO_ELIMINADO, 'success');
    } else {
      showSnackbar(CARRITO_MESSAGES.ERROR_ELIMINAR, 'error');
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const success = await actualizarCantidad(itemId, newQuantity);
    if (!success) {
      showSnackbar(CARRITO_MESSAGES.ERROR_ACTUALIZAR, 'error');
    }
  };

  const handleProceedToCheckout = () => {
    if (checkoutFormRef.current) {
      checkoutFormRef.current.submit();
    }
  };

  const handleShippingFormSubmit = async (shippingData) => {
    console.log('Datos de envío capturados:', shippingData);
    try {
      await iniciarPago(shippingData);
    } catch (error) {
      showSnackbar(mpError || CARRITO_MESSAGES.ERROR_MERCADO_PAGO, 'error');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id');
    const status = urlParams.get('status');

    if (paymentId && status) {
      verificarEstadoPago(paymentId).then((paymentData) => {
        if (paymentData) {
          if (status === 'approved') {
            showSnackbar(CARRITO_MESSAGES.PAGO_APROBADO, 'success');
          } else if (status === 'pending') {
            showSnackbar(CARRITO_MESSAGES.PAGO_PENDIENTE, 'warning');
          } else {
            showSnackbar(CARRITO_MESSAGES.PAGO_ERROR, 'error');
          }
        }
      });
    }
  }, []);

  const calculateTotal = () => {
    if (!carrito || !carrito.items) return 0;
    return Math.floor(
      carrito.items.reduce((sum, item) => sum + item.producto_precio * item.cantidad, 0)
    );
  };

  const totalCarrito = calculateTotal();

  return (
    <>
      <ResponsiveNavbar />
      <Box sx={{ flexGrow: 1, p: 3, mt: '64px', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Checkout
        </Typography>

        {loadingCarrito ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : errorCarrito ? (
          <Box sx={{ mt: 4 }}>
            <Alert severity="error">{errorCarrito}</Alert>
          </Box>
        ) : carrito && carrito.items && carrito.items.length > 0 ? (
          <Grid container spacing={4}>
            {/* Columna izquierda: Formulario */}
            <Grid item xs={12} md={6}>
              <CheckoutForm ref={checkoutFormRef} onSubmit={handleShippingFormSubmit} />
            </Grid>

            {/* Columna derecha: Carrito + Resumen + Botón */}
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Productos */}
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Productos
                  </Typography>
                  {carrito.items.map((item) => (
                    <CarritoItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </Paper>

                {/* Resumen del pedido */}
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Resumen del Pedido
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>
                      Subtotal ({carrito.items.length} producto
                      {carrito.items.length > 1 ? 's' : ''})
                    </Typography>
                    <Typography>${Math.floor(carrito.total)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${totalCarrito}</Typography>
                  </Box>

                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleProceedToCheckout}
                      disabled={isCheckingOut}
                      startIcon={<PaymentIcon />}
                      sx={{ px: 5 }}
                    >
                      {isCheckingOut ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Procesando...
                        </>
                      ) : (
                        'Pagar'
                      )}
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {CARRITO_MESSAGES.CARRITO_VACIO}
          </Typography>
        )}
      </Box>

      <Footer />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={hideSnackbar}>
        <SnackbarAlert
          onClose={hideSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </SnackbarAlert>
      </Snackbar>
    </>
  );
};

export default CarritoPage;
