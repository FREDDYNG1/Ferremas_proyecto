import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  Delete,
  Search,
  FilterList,
  Refresh,
  Email,
  Schedule,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { contactService } from '../../services/contactService';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import { useSnackbar } from '../../hooks/useSnackbar';

const GestionMensajes = () => {
  const [mensajes, setMensajes] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);
  const [selectedMensaje, setSelectedMensaje] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mensajeToDelete, setMensajeToDelete] = useState(null);
  
  // Filtros y paginación
  const [filtros, setFiltros] = useState({
    search: '',
    asunto: '',
    fecha_desde: '',
    fecha_hasta: '',
    ordenar_por: '-fecha_envio'
  });
  const [pagination, setPagination] = useState({
    page: 0,
    page_size: 10,
    count: 0
  });

  const { showSnackbar } = useSnackbar();

  // Cargar mensajes
  const cargarMensajes = async () => {
    try {
      setLoading(true);
      const params = {
        ...filtros,
        page: pagination.page + 1,
        page_size: pagination.page_size
      };
      
      const response = await contactService.getMensajes(params);
      setMensajes(response.results || response);
      setPagination(prev => ({
        ...prev,
        count: response.count || response.length
      }));
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      showSnackbar('Error al cargar los mensajes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      setLoadingEstadisticas(true);
      const stats = await contactService.getEstadisticas();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarMensajes();
    cargarEstadisticas();
  }, [filtros, pagination.page, pagination.page_size]);

  // Ver mensaje
  const handleVerMensaje = async (mensajeId) => {
    try {
      const mensaje = await contactService.getMensajeDetalle(mensajeId);
      setSelectedMensaje(mensaje);
      setDialogOpen(true);
    } catch (error) {
      showSnackbar('Error al cargar el mensaje', 'error');
    }
  };

  // Eliminar mensaje
  const handleEliminarMensaje = async () => {
    if (!mensajeToDelete) return;
    
    try {
      await contactService.eliminarMensaje(mensajeToDelete);
      showSnackbar('Mensaje eliminado exitosamente', 'success');
      setDeleteDialogOpen(false);
      setMensajeToDelete(null);
      cargarMensajes();
      cargarEstadisticas();
    } catch (error) {
      showSnackbar('Error al eliminar el mensaje', 'error');
    }
  };

  // Manejar cambios en filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  // Manejar cambios en paginación
  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination(prev => ({
      ...prev,
      page: 0,
      page_size: parseInt(event.target.value, 10)
    }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      search: '',
      asunto: '',
      fecha_desde: '',
      fecha_hasta: '',
      ordenar_por: '-fecha_envio'
    });
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveNavbar />
      
      <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Mensajes de Contacto
        </Typography>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {loadingEstadisticas ? <CircularProgress size={20} /> : estadisticas.total_mensajes || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Mensajes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {loadingEstadisticas ? <CircularProgress size={20} /> : estadisticas.mensajes_hoy || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hoy
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {loadingEstadisticas ? <CircularProgress size={20} /> : estadisticas.mensajes_semana || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Esta Semana
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Warning color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h6">
                      {loadingEstadisticas ? <CircularProgress size={20} /> : estadisticas.mensajes_sin_leer || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sin Leer
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filtros
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={filtros.search}
                onChange={(e) => handleFiltroChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Asunto"
                value={filtros.asunto}
                onChange={(e) => handleFiltroChange('asunto', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Fecha Desde"
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Fecha Hasta"
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filtros.ordenar_por}
                  onChange={(e) => handleFiltroChange('ordenar_por', e.target.value)}
                  label="Ordenar por"
                >
                  <MenuItem value="-fecha_envio">Más recientes</MenuItem>
                  <MenuItem value="fecha_envio">Más antiguos</MenuItem>
                  <MenuItem value="nombre">Nombre A-Z</MenuItem>
                  <MenuItem value="-nombre">Nombre Z-A</MenuItem>
                  <MenuItem value="email">Email A-Z</MenuItem>
                  <MenuItem value="-email">Email Z-A</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={limpiarFiltros}
              startIcon={<Refresh />}
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Paper>

        {/* Tabla de mensajes */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Asunto</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : mensajes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay mensajes para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  mensajes.map((mensaje) => (
                    <TableRow key={mensaje.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{mensaje.nombre}</Typography>
                      </TableCell>
                      <TableCell>{mensaje.email}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {mensaje.asunto || 'Sin asunto'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {mensaje.fecha_envio_formateada}
                          </Typography>
                          <Chip
                            label={mensaje.tiempo_transcurrido}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleVerMensaje(mensaje.id)}
                          title="Ver mensaje"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setMensajeToDelete(mensaje.id);
                            setDeleteDialogOpen(true);
                          }}
                          title="Eliminar mensaje"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={pagination.count}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.page_size}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
          />
        </Paper>

        {/* Dialog para ver mensaje */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Mensaje de {selectedMensaje?.nombre}
          </DialogTitle>
          <DialogContent>
            {selectedMensaje && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMensaje.nombre}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMensaje.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Asunto
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMensaje.asunto || 'Sin asunto'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha de envío
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedMensaje.fecha_envio_formateada}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mensaje
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                        {selectedMensaje.mensaje}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEliminarMensaje} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GestionMensajes; 