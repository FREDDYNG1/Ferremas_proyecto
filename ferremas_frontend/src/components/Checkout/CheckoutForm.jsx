import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const CheckoutForm = forwardRef(({ onSubmit, loading, error }, ref) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{8,}$/;

    if (!formData.nombre.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.telefono)) {
      errors.telefono = 'Formato de teléfono inválido';
    }

    if (!formData.direccion.trim()) errors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) errors.ciudad = 'La ciudad es requerida';
    if (!formData.codigo_postal.trim()) errors.codigo_postal = 'El código postal es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Exponer método .submit() al padre
  useImperativeHandle(ref, () => ({
    submit: () => {
      const form = document.getElementById('checkout-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    },
    validate: () => validateForm()
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Información de Contacto y Envío
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form id="checkout-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!formErrors.nombre}
              helperText={formErrors.nombre}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={!!formErrors.telefono}
              helperText={formErrors.telefono}
              placeholder="+56912345678"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              error={!!formErrors.direccion}
              helperText={formErrors.direccion}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              error={!!formErrors.ciudad}
              helperText={formErrors.ciudad}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Código Postal"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleChange}
              error={!!formErrors.codigo_postal}
              helperText={formErrors.codigo_postal}
            />
          </Grid>

          {/* Botón invisible para habilitar submit desde padre */}
          <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
        </Grid>
      </form>
    </Paper>
  );
});

export default CheckoutForm;
