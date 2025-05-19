import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
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
  Stack
} from '@mui/material';
import api from '../../utils/axiosConfig';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import Footer from '../../components/Footer';

const ProductosPublicos = () => {
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAddToCart = (productoId) => {
    console.log(`Agregar producto ${productoId} al carrito`);
    alert('Funcionalidad de agregar al carrito no implementada aún.');
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

  useEffect(() => {
    setSelectedCategory(null);
    fetchProductos();
    fetchCategorias();
  }, [location.pathname]);

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
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : productos.length > 0 ? (
            <Grid container spacing={3} alignItems="stretch">
              {productos.map((producto) => (
                <Grid item key={producto.id} xs={12} sm={6} md={4} lg={3}>
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
                        ${producto.precio.toFixed(2)}
                      </Typography>

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
    </>
  );
};

export default ProductosPublicos; 