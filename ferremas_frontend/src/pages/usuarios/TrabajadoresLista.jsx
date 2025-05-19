import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../utils/axiosConfig';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const TrabajadoresLista = () => {
  const navigate = useNavigate();
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [trabajadorToDeleteId, setTrabajadorToDeleteId] = useState(null);

  const fetchTrabajadores = async () => {
    try {
      const response = await api.get('/usuarios/', { params: { rol: 'trabajador' } });
      const data = Array.isArray(response.data) ? response.data : [];
      setTrabajadores(data);
    } catch (err) {
      setError('Error al cargar la lista de trabajadores.');
      console.error('Error fetching trabajadores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickEliminar = (id) => {
    setTrabajadorToDeleteId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setTrabajadorToDeleteId(null);
  };

  const handleConfirmEliminar = async () => {
    setOpenConfirmDialog(false);
    if (trabajadorToDeleteId === null) return;

    try {
      await api.delete(`/usuarios/trabajador/${trabajadorToDeleteId}/eliminar/`);
      setTrabajadores((prev) => prev.filter((t) => t.id !== trabajadorToDeleteId));
      alert('Trabajador eliminado correctamente');
    } catch (err) {
      console.error('Error al eliminar trabajador:', err);
      alert('No se pudo eliminar el trabajador.');
    } finally {
        setTrabajadorToDeleteId(null);
    }
  };

  const handleEditar = (id) => {
    navigate(`/admin/usuarios/trabajador/${id}/editar`);
  };

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <ResponsiveNavbar />
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom component="h1">
          Lista de Trabajadores
        </Typography>

        {trabajadores.length > 0 ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader aria-label="lista de trabajadores table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre de Usuario</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trabajadores.map((trabajador) => (
                    <TableRow key={trabajador.id}>
                      <TableCell>{trabajador.username}</TableCell>
                      <TableCell>{trabajador.email}</TableCell>
                      <TableCell>{trabajador.role}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEditar(trabajador.id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleClickEliminar(trabajador.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No hay trabajadores registrados.
          </Typography>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">{"Confirmar Eliminación"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              ¿Estás seguro de que deseas eliminar este trabajador?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
            <Button onClick={handleConfirmEliminar} autoFocus color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default TrabajadoresLista;
