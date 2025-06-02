import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../services/api';
import { productoService } from '../../services/productoService';

const GestionStock = () => {
  // Estados principales
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState('');
  const [selectedTienda, setSelectedTienda] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productoLoading, setProductoLoading] = useState(true);
  const [tiendaLoading, setTiendaLoading] = useState(true);
  
  // Estados para el modal de ajuste
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [operacion, setOperacion] = useState('agregar');
  const [stockMinimo, setStockMinimo] = useState(0);

  // Estado para el modal de nuevo stock
  const [newStockDialog, setNewStockDialog] = useState(false);
  const [newStockCantidad, setNewStockCantidad] = useState(1);
  const [newStockMinimo, setNewStockMinimo] = useState(0);
  const [newStockTienda, setNewStockTienda] = useState('');
  
  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Cargar productos y tiendas al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/productos/');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        showSnackbar('Error al cargar productos', 'error');
      } finally {
        setProductoLoading(false);
      }
    };

    const fetchTiendas = async () => {
      try {
        const response = await api.get('/tiendas/');
        setTiendas(response.data);
      } catch (error) {
        console.error('Error al cargar tiendas:', error);
        showSnackbar('Error al cargar tiendas', 'error');
      } finally {
        setTiendaLoading(false);
      }
    };

    fetchProductos();
    fetchTiendas();
  }, []);

  // Cargar stock cuando se selecciona un producto
  useEffect(() => {
    const fetchStockData = async () => {
      if (!selectedProducto) {
        setStockData([]);
        return;
      }

      setLoading(true);
      try {
        const data = await productoService.getStockPorTienda(selectedProducto);
        setStockData(data);
      } catch (error) {
        console.error('Error al cargar stock:', error);
        showSnackbar('Error al cargar datos de stock', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedProducto]);

  // Filtrar stock por tienda seleccionada
  const filteredStockData = selectedTienda 
    ? stockData.filter(stock => stock.tienda === parseInt(selectedTienda))
    : stockData;

  // Mostrar notificación
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Abrir modal para ajustar stock
  const handleAjustarStock = (stock) => {
    setCurrentStock(stock);
    setCantidad(1);
    setOperacion('agregar');
    setStockMinimo(stock.stock_minimo);
    setDialogOpen(true);
  };

  // Guardar ajuste de stock
  const saveStockAdjustment = async () => {
    try {
      setLoading(true);
      const cantidadAjuste = operacion === 'agregar' ? cantidad : -cantidad;
      
      const response = await api.post(`/stock-tienda/${currentStock.id}/ajustar_stock/`, {
        cantidad: cantidadAjuste
      });
      
      // Actualizar datos locales
      const updatedStockData = stockData.map(item => 
        item.id === currentStock.id ? response.data : item
      );
      setStockData(updatedStockData);
      
      setDialogOpen(false);
      showSnackbar('Stock actualizado correctamente');
    } catch (error) {
      console.error('Error al ajustar stock:', error);
      showSnackbar('Error al actualizar stock: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para agregar nuevo stock
  const handleAddNewStock = () => {
    // Solo mostrar tiendas que no tienen stock para este producto
    const tiendasConStock = stockData.map(stock => stock.tienda);
    if (tiendas.filter(tienda => !tiendasConStock.includes(tienda.id)).length === 0) {
      showSnackbar('Todas las tiendas ya tienen stock para este producto', 'info');
      return;
    }
    
    setNewStockTienda('');
    setNewStockCantidad(1);
    setNewStockMinimo(0);
    setNewStockDialog(true);
  };

  // Guardar nuevo stock
  const saveNewStock = async () => {
    if (!selectedProducto || !newStockTienda) {
      showSnackbar('Seleccione producto y tienda', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/stock-tienda/', {
        producto: selectedProducto,
        tienda: newStockTienda,
        cantidad: newStockCantidad,
        stock_minimo: newStockMinimo
      });
      
      // Actualizar datos locales
      setStockData([...stockData, response.data]);
      
      setNewStockDialog(false);
      showSnackbar('Stock agregado correctamente');
    } catch (error) {
      console.error('Error al agregar stock:', error);
      showSnackbar('Error al agregar stock: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calcular stock total
  const stockTotal = filteredStockData.reduce((total, item) => total + item.cantidad, 0);

  // Refrescar datos de stock
  const refreshStockData = async () => {
    if (!selectedProducto) return;
    
    setLoading(true);
    try {
      const data = await productoService.getStockPorTienda(selectedProducto);
      setStockData(data);
      showSnackbar('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      showSnackbar('Error al actualizar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Gestión de Stock por Tienda</Typography>
      
      {/* Filtros de selección */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <FormControl fullWidth disabled={productoLoading}>
              <InputLabel>Seleccionar Producto</InputLabel>
              <Select
                value={selectedProducto}
                onChange={(e) => setSelectedProducto(e.target.value)}
                label="Seleccionar Producto"
              >
                {productos.map(producto => (
                  <MenuItem key={producto.id} value={producto.id}>
                    {producto.nombre} ({producto.codigo})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <FormControl fullWidth disabled={tiendaLoading}>
              <InputLabel>Filtrar por Tienda</InputLabel>
              <Select
                value={selectedTienda}
                onChange={(e) => setSelectedTienda(e.target.value)}
                label="Filtrar por Tienda"
              >
                <MenuItem value="">Todas las tiendas</MenuItem>
                {tiendas.map(tienda => (
                  <MenuItem key={tienda.id} value={tienda.id}>
                    {tienda.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={refreshStockData}
              disabled={!selectedProducto || loading}
              fullWidth
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Card>
      
      {/* Información de stock */}
      {selectedProducto ? (
        <Card sx={{ mt: 2, boxShadow: 2 }}>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">
              Información de Stock {selectedTienda ? 'por Tienda' : 'en Todas las Tiendas'}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleAddNewStock}
              disabled={!selectedProducto || loading}
            >
              Agregar Stock
            </Button>
          </Box>
          <Divider />
          
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : filteredStockData.length > 0 ? (
            <Box p={2}>
              <Typography variant="subtitle1" gutterBottom>
                Stock Total: <strong>{stockTotal} unidades</strong>
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Tienda</strong></TableCell>
                      <TableCell align="center"><strong>Stock Disponible</strong></TableCell>
                      <TableCell align="center"><strong>Stock Mínimo</strong></TableCell>
                      <TableCell align="center"><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Acciones</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStockData.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell>{stock.tienda_nombre}</TableCell>
                        <TableCell align="center">{stock.cantidad}</TableCell>
                        <TableCell align="center">{stock.stock_minimo}</TableCell>
                        <TableCell align="center">
                          {stock.cantidad <= stock.stock_minimo ? (
                            <Typography color="error.main" variant="body2">
                              Bajo Stock
                            </Typography>
                          ) : stock.cantidad > 0 ? (
                            <Typography color="success.main" variant="body2">
                              Disponible
                            </Typography>
                          ) : (
                            <Typography color="text.disabled" variant="body2">
                              Sin Stock
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="primary"
                            onClick={() => handleAjustarStock(stock)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Box p={3} textAlign="center">
              <Alert severity="info">
                {selectedProducto && 'No hay stock registrado para este producto' + 
                 (selectedTienda ? ' en la tienda seleccionada.' : ' en ninguna tienda.')}
              </Alert>
              {selectedProducto && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNewStock}
                  sx={{ mt: 2 }}
                >
                  Agregar Stock
                </Button>
              )}
            </Box>
          )}
        </Card>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Seleccione un producto para ver y gestionar su stock
        </Alert>
      )}
      
      {/* Diálogo para ajustar stock */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Ajustar Stock</DialogTitle>
        <DialogContent>
          {currentStock && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tienda: <strong>{currentStock.tienda_nombre}</strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                Stock actual: <strong>{currentStock.cantidad} unidades</strong>
              </Typography>
              
              <Box mt={2}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Operación</InputLabel>
                  <Select
                    value={operacion}
                    onChange={(e) => setOperacion(e.target.value)}
                    label="Operación"
                  >
                    <MenuItem value="agregar">Agregar stock</MenuItem>
                    <MenuItem value="quitar">Quitar stock</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  type="number"
                  label="Cantidad"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 0))}
                  margin="normal"
                  InputProps={{ inputProps: { min: 1 } }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Stock Mínimo"
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(Math.max(0, parseInt(e.target.value) || 0))}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={saveStockAdjustment} 
            variant="contained" 
            disabled={!cantidad || cantidad <= 0 || loading}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para agregar nuevo stock */}
      <Dialog open={newStockDialog} onClose={() => setNewStockDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Agregar Stock a Nueva Tienda</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tienda</InputLabel>
              <Select
                value={newStockTienda}
                onChange={(e) => setNewStockTienda(e.target.value)}
                label="Tienda"
              >
                {tiendas
                  .filter(tienda => !stockData.some(s => s.tienda === tienda.id))
                  .map(tienda => (
                    <MenuItem key={tienda.id} value={tienda.id}>
                      {tienda.nombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              type="number"
              label="Cantidad"
              value={newStockCantidad}
              onChange={(e) => setNewStockCantidad(Math.max(0, parseInt(e.target.value) || 0))}
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Stock Mínimo"
              value={newStockMinimo}
              onChange={(e) => setNewStockMinimo(Math.max(0, parseInt(e.target.value) || 0))}
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStockDialog(false)}>Cancelar</Button>
          <Button 
            onClick={saveNewStock} 
            variant="contained" 
            disabled={!newStockTienda || newStockCantidad < 0 || loading}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GestionStock;
