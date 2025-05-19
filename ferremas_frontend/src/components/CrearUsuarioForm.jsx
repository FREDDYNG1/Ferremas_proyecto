import { useState } from 'react';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, CircularProgress, Alert, InputAdornment, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ResponsiveNavbar from './ResponsiveNavbar';

const CrearUsuarioForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    telefono: '',
    rol: 'trabajador',
    rut: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validación de contraseña
    if (formData.password.length < 8) {
      setError('❌ La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('❌ No hay sesión activa. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Crear el payload exactamente como se necesita
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        direccion: formData.direccion,
        comuna: formData.comuna,
        ciudad: formData.ciudad,
        telefono: formData.telefono,
        rol: formData.rol,
      };

      if (formData.rol === 'admin') {
        payload.rut = formData.rut;
      }

      console.log('Datos a enviar:', payload);

      const response = await axios.post('http://localhost:8000/api/crear-usuario/',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta del servidor:', response.data);

      setMensaje('✅ Usuario creado exitosamente');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        direccion: '',
        comuna: '',
        ciudad: '',
        telefono: '',
        rol: 'trabajador',
        rut: ''
      });
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      if (err.response && err.response.data) {
        const errorMessage = typeof err.response.data === 'object' 
          ? Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : err.response.data;
        setError(`❌ ${errorMessage}`);
      } else {
        setError('❌ Error al crear el usuario. Por favor, verifica tus datos e intenta nuevamente.');
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveNavbar />

      <Box component="main" sx={{ p: 3, mt: 8 }}>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
            Crear usuario
          </Typography>

          {mensaje && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {mensaje}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
             <TextField
              label="Apellido"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />

            <TextField
              label="Correo electrónico"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="rol-label">Rol</InputLabel>
              <Select
                labelId="rol-label"
                id="rol"
                name="rol"
                value={formData.rol}
                label="Rol"
                onChange={handleChange}
              >
                <MenuItem value="trabajador">Trabajador</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            {formData.rol === 'admin' && (
               <TextField
                label="RUT (para contraseña)"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
              />
            )}

            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
               InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar contraseña"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Visibility />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              margin="normal"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
             <TextField
              label="Comuna"
              variant="outlined"
              fullWidth
              margin="normal"
              name="comuna"
              value={formData.comuna}
              onChange={handleChange}
            />
             <TextField
              label="Ciudad"
              variant="outlined"
              fullWidth
              margin="normal"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Crear usuario
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default CrearUsuarioForm;
