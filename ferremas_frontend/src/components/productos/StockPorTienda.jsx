import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import { productoService } from '../../services/productoService';
import api from '../../services/api';

const StockPorTienda = ({ productoId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Clave para forzar recarga
  
  // Estados para el diálogo de ajuste de stock
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [operacion, setOperacion] = useState('agregar'); // 'agregar' o 'quitar'
  
  // Estado para el diálogo de agregar stock a nueva tienda
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTienda, setSelectedTienda] = useState('');
  const [newCantidad, setNewCantidad] = useState(1);
  const [stockMinimo, setStockMinimo] = useState(0);
  
  // Estado para mostrar mensajes de éxito o error
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Función para cargar los datos de stock
  const fetchStockData = async () => {
    try {
      setLoading(true);
      const data = await productoService.getStockPorTienda(productoId);
      setStockData(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el stock por tienda:', err);
      setError('No se pudo cargar la información de stock. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cargar las tiendas disponibles
  const fetchTiendas = async () => {
    try {
      const response = await api.get('/tiendas/');
      setTiendas(response.data);
    } catch (err) {
      console.error('Error al cargar tiendas:', err);
    }
  };
  
  // Función para ajustar el stock (aumentar o disminuir)
  const ajustarStock = async () => {
    try {
      const cantidadAjuste = operacion === 'agregar' ? cantidad : -cantidad;
      
      const response = await api.post(`/stock-tienda/${currentStock.id}/ajustar_stock/`, {
        cantidad: cantidadAjuste
      });
      
      // Cerrar diálogo y actualizar datos
      setDialogOpen(false);
      setCantidad(0);
      setRefreshKey(oldKey => oldKey + 1); // Forzar recarga
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: 'Stock actualizado correctamente',
        severity: 'success'
      });
      
      // Actualizar los datos en el estado local
      const updatedStockData = stockData.map(item => 
        item.id === currentStock.id ? response.data : item
      );
      setStockData(updatedStockData);
    } catch (err) {
      console.error('Error al ajustar stock:', err);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el stock: ' + (err.response?.data?.error || err.message),
        severity: 'error'
      });
    }
  };
  
  // Función para agregar stock a una nueva tienda
  const agregarStockNuevaTienda = async () => {
    try {
      const response = await api.post('/stock-tienda/', {
        producto: productoId,
        tienda: selectedTienda,
        cantidad: newCantidad,
        stock_minimo: stockMinimo
      });
      
      // Cerrar diálogo y actualizar datos
      setAddDialogOpen(false);
      setSelectedTienda('');
      setNewCantidad(1);
      setStockMinimo(0);
      setRefreshKey(oldKey => oldKey + 1); // Forzar recarga
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: 'Stock agregado correctamente',
        severity: 'success'
      });
      
      // Actualizar los datos en el estado local
      setStockData([...stockData, response.data]);
    } catch (err) {
      console.error('Error al agregar stock:', err);
      setSnackbar({
        open: true,
        message: 'Error al agregar stock: ' + (err.response?.data?.error || err.message),
        severity: 'error'
      });
    }
  };
  
  // Cargar datos cuando el componente se monta o cuando cambia el productoId o refreshKey
  useEffect(() => {
    if (productoId) {
      fetchStockData();
      fetchTiendas();
    }
  }, [productoId, refreshKey]);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={2}>
        <CircularProgress size={30} thickness={5} />
      </Box>
    );
  }
  
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  
  if (stockData.length === 0) {
    return (
      <Alert severity="info">
        No hay información de stock disponible para este producto en ninguna tienda.
      </Alert>
    );
  }
  
  // Calcular el stock total
  const stockTotal = stockData.reduce((total, item) => total + item.cantidad, 0);
  
  return (
    <Card sx={{ mt: 2, boxShadow: 2 }}>
      <CardHeader 
        title="Disponibilidad en Tiendas" 
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        sx={{ bgcolor: 'primary.light', color: 'white', py: 1 }}
        action={
          <IconButton onClick={() => setRefreshKey(old => old + 1)} color="inherit" title="Actualizar">
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle1">
            Stock Total Disponible: <strong>{stockTotal} unidades</strong>
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            size="small"
          >
            Agregar Stock a Tienda
          </Button>
        </Box>
        
        <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
          <Table size="small">
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
              {stockData.map((stock) => (
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
                      size="small" 
                      color="primary" 
                      onClick={() => {
                        setCurrentStock(stock);
                        setDialogOpen(true);
                      }}
                      title="Ajustar stock"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Diálogo para ajustar stock */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={ajustarStock} 
              variant="contained" 
              disabled={!cantidad || cantidad <= 0}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Diálogo para agregar stock a nueva tienda */}
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>Agregar Stock a Tienda</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, minWidth: '300px' }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tienda</InputLabel>
                <Select
                  value={selectedTienda}
                  onChange={(e) => setSelectedTienda(e.target.value)}
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
                value={newCantidad}
                onChange={(e) => setNewCantidad(Math.max(0, parseInt(e.target.value) || 0))}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
            <Button 
              onClick={agregarStockNuevaTienda} 
              variant="contained" 
              disabled={!selectedTienda || newCantidad < 0}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar para mensajes */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Card>
  );
};

export default StockPorTienda;
