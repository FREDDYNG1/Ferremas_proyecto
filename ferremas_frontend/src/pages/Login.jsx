import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Iniciando login con:', { email, password });
      
      const { role } = await login(email, password);
      
      console.log('Login exitoso, rol recibido:', role);

      if (role === 'admin') {
        console.log('Redirigiendo a /admin');
        navigate('/admin');
      } else if (role === 'cliente') {
        console.log('Redirigiendo a /cliente');
        navigate('/cliente');
      } else if (role === 'trabajador') {
        console.log('Redirigiendo a /trabajador');
        navigate('/trabajador');
      } else {
        console.log('Rol no reconocido:', role);
      }
    } catch (err) {
      console.error('Error en handleLogin:', err);
      if (err.response) {
        setError(err.response.data.detail || 'Error al iniciar sesión');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor');
      } else {
        setError('Error al procesar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };
// MUI Container: centrado automático
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
          Iniciar Sesión 🔐
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Contraseña"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Ingresar'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
