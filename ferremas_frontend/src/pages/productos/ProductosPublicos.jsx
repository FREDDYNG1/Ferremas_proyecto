import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert as MuiAlertComponent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import api from '../../utils/axiosConfig';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import Footer from '../../components/Footer';
import { useCarrito } from '../../context/CarritoContext';
import { useCurrency } from '../../context/CurrencyContext';

const SnackbarAlert = React.forwardRef(function SnackbarAlert(
  props, ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductosPublicos = () => {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarItem } = useCarrito();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { currency } = useCurrency();

  const fetchProductos = async (categoria = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = categoria && categoria !== 'Todas las Categorías' ? { categoria: categoria } : {};
      params._ = new Date().getTime();
      const response = await api.get('/productos/', { params });
      const data = Array.isArray(response.data) ? response.data : [];
      setProductos(data);
    } catch (err) {
      setError('Error al cargar la lista de productos.');
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await api.get('/productos/categories/');
      setCategorias(['Todas las Categorías', ...response.data]);
    } catch (err) {
      console.error('Error fetching categorias:', err);
    }
  };

  const convertPrice = async (cantidad, monedaOrigen, monedaDestino) => {
    if (!cantidad || !monedaOrigen || !monedaDestino || monedaOrigen === monedaDestino) {
      return cantidad;
    }
    try {
      const response = await api.post('/convertir-moneda/', {
        cantidad: cantidad,
        origen: monedaOrigen,
        destino: monedaDestino,
      });
      if (response.data && response.data.resultado !== undefined) {
        return response.data.resultado;
      } else {
        console.error('Respuesta inesperada de la API de conversión:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error al convertir precio:', error);
      return null;
    }
  };

  useEffect(() => {
    setSelectedCategory(null);
    fetchProductos();
    fetchCategorias();
  }, [location.pathname]);

  useEffect(() => {
    const actualizarPreciosMostrados = async () => {
      const productosActualizados = await Promise.all(productos.map(async (producto) => {
        const precioOriginal = producto.precio;
        const monedaOrigen = 'CLP';
        const precioConvertido = await convertPrice(precioOriginal, monedaOrigen, currency);
        return { ...producto, precioConvertido: precioConvertido !== null ? precioConvertido : precioOriginal };
      }));
    };
  }, [currency, productos]);

  const handleAddToCart = async (productoId) => {
    console.log(`Agregar producto ${productoId} al carrito`);
    try {
      await agregarItem(productoId, 1);
      setSnackbarMessage('Producto agregado al carrito!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      let errorMessage = 'Error al agregar el producto al carrito. Inténtalo de nuevo.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Debes iniciar sesión para agregar productos al carrito.';
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleBuyNow = (productoId) => {
    console.log(`Comprar producto ${productoId} ahora`);
    alert('Funcionalidad de comprar ahora no implementada aún.');
  };

  const handleCategoryClick = (categoria) => {
    const categoryValue = categoria === 'Todas las Categorías' ? null : categoria;
    setSelectedCategory(categoryValue);
    fetchProductos(categoryValue);
  };

  return (
    <>
      <ResponsiveNavbar />
      <Box sx={{ display: 'flex', flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid #e0e0e0',
            p: 2,
            mt: '64px',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Categorías
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {categorias.map((categoria) => (
              <ListItem key={categoria} disablePadding>
                <ListItemButton
                  selected={selectedCategory === categoria || (selectedCategory === null && categoria === 'Todas las Categorías')}
                  onClick={() => handleCategoryClick(categoria)}
                >
                  <ListItemText primary={categoria} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
          <Typography variant="h4" gutterBottom component="h1" sx={{ mb: 4 }}>
            {selectedCategory ? `Productos en ${selectedCategory}` : 'Nuestro Catálogo de Productos'}
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ mt: 4 }}>
              <MuiAlert severity="error">{error}</MuiAlert>
            </Box>
          ) : productos.length > 0 ? (
            <Grid container spacing={3} alignItems="stretch">
              {productos.map((producto) => (
                <Grid item key={producto.id} xs={12} sx={{ 
                  '@media (min-width: 600px)': { width: '50%' },
                  '@media (min-width: 900px)': { width: '33.33%' },
                  '@media (min-width: 1200px)': { width: '25%' }
                }}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': { transform: 'scale(1.03)' },
                      minHeight: 450,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 180,
                        height: 180,
                        objectFit: 'cover',
                        margin: 'auto',
                      }}
                      image={producto.imagen_url}
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.png';
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                      {producto.marca && (
                         <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                           {producto.marca}
                         </Typography>
                       )}
                      <Typography gutterBottom variant="subtitle1" component="div" sx={{ lineHeight: 1.3 }}>
                        {producto.nombre}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {producto.descripcion}
                      </Typography>
                      <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        <RenderPrecioConvertido 
                            precioOriginal={producto.precio} 
                            monedaOriginal="CLP"
                            monedaDestino={currency} 
                        />
                      </Typography>
                    </CardContent>
                                        <CardContent sx={{ pt: 0.5, pb: 1.5, flexGrow: 0 }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        Stock Total: {producto.stock_total}
                      </Typography>
                      {producto.stock_por_tienda && producto.stock_por_tienda.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Stock por Tienda:
                          </Typography>
                          {producto.stock_por_tienda.map(stock => (
                            <Typography key={stock.id} variant="caption" color="text.secondary" display="block" sx={{ ml: 1 }}>
                              - {stock.tienda_nombre}: {stock.cantidad}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ pt: 1, justifyContent: 'flex-start' }}>
                      <Button size="small" onClick={() => handleAddToCart(producto.id)}>Agregar al Carrito</Button>
                      <Button size="small" variant="contained" onClick={() => handleBuyNow(producto.id)}>Comprar</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No hay productos disponibles en esta categoría.
            </Typography>
          )}
        </Box>
      </Box>
      <Footer />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <SnackbarAlert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </SnackbarAlert>
      </Snackbar>
    </>
  );
};

const RenderPrecioConvertido = ({ precioOriginal, monedaOriginal, monedaDestino }) => {
    const [precioMostrado, setPrecioMostrado] = useState('Cargando...');

    useEffect(() => {
        const fetchAndSetPrice = async () => {
            if (!precioOriginal || !monedaOriginal || !monedaDestino || monedaOriginal === monedaDestino) {
                setPrecioMostrado(`${precioOriginal} ${monedaOriginal}`);
                return;
            }
            try {
                const response = await api.post('/convertir-moneda/', {
                    cantidad: precioOriginal,
                    origen: monedaOriginal,
                    destino: monedaDestino,
                });
                if (response.data && response.data.resultado !== undefined) {
                    setPrecioMostrado(`${response.data.resultado.toFixed(2)} ${monedaDestino}`);
                } else {
                    console.error('Respuesta inesperada al convertir precio:', response.data);
                    setPrecioMostrado(`${precioOriginal} ${monedaOriginal}`);
                }
            } catch (error) {
                console.error('Error al obtener precio convertido:', error);
                setPrecioMostrado(`${precioOriginal} ${monedaOriginal}`);
            }
        };

        fetchAndSetPrice();

    }, [precioOriginal, monedaOriginal, monedaDestino]);

    return <>{precioMostrado}</>;
};

export default ProductosPublicos; 