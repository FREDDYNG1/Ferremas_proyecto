import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import api from '../../utils/axiosConfig';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const TrabajadoresLista = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await api.get('/usuarios/', { params: { rol: 'trabajador' } });
        setTrabajadores(response.data);
      } catch (err) {
        setError('Error al cargar la lista de trabajadores.');
        console.error('Error fetching trabajadores:', err);
      } finally {
        setLoading(false);
      }
    };

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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <ResponsiveNavbar />
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
                  {/* Add more headers if needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {trabajadores.map((trabajador) => (
                  <TableRow key={trabajador.id}>
                    <TableCell>{trabajador.username}</TableCell>
                    <TableCell>{trabajador.email}</TableCell>
                    <TableCell>{trabajador.role}</TableCell>
                    {/* Add more cells if needed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Typography variant="body1">No hay trabajadores registrados.</Typography>
      )}
    </Box>
  );
};

export default TrabajadoresLista; 