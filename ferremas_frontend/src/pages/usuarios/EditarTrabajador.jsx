import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import api from '../../utils/axiosConfig';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';

const EditarTrabajador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [trabajador, setTrabajador] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: ''
  });

  useEffect(() => {
    const fetchTrabajador = async () => {
      try {
        const response = await api.get(`/usuarios/trabajador/${id}/`);
        setTrabajador(response.data);
      } catch (err) {
        setError('Error al cargar los datos del trabajador');
        console.error('Error fetching trabajador:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajador();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrabajador(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/usuarios/trabajador/${id}/editar/`, trabajador);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/usuarios/trabajadores');
      }, 2000);
    } catch (err) {
      setError('Error al actualizar el trabajador');
      console.error('Error updating trabajador:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !trabajador.username) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ResponsiveNavbar />
      <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom component="h1">
          Editar Trabajador
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="first_name"
                  value={trabajador.first_name}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  name="last_name"
                  value={trabajador.last_name}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={trabajador.email}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={trabajador.telefono}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="direccion"
                  value={trabajador.direccion}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Comuna"
                  name="comuna"
                  value={trabajador.comuna}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  name="ciudad"
                  value={trabajador.ciudad}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Guardar Cambios'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/usuarios/trabajadores')}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Snackbar
          open={success}
          autoHideDuration={2000}
          onClose={() => setSuccess(false)}
          message="Trabajador actualizado correctamente"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default EditarTrabajador; 