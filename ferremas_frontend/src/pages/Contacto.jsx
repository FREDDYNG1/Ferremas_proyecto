import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  CheckCircle
} from '@mui/icons-material';
import ResponsiveNavbar from '../components/ResponsiveNavbar';
import Footer from '../components/Footer';
import { contactService } from '../services/contactService';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await contactService.enviarMensaje(formData);
      setSuccess('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Email color="primary" sx={{ fontSize: 40 }} />,
      title: 'Email',
      content: 'contacto@ferremas.cl',
      description: 'Envíanos un correo electrónico'
    },
    {
      icon: <Phone color="primary" sx={{ fontSize: 40 }} />,
      title: 'Teléfono',
      content: '+56 2 2345 6789',
      description: 'Llámanos directamente'
    },
    {
      icon: <LocationOn color="primary" sx={{ fontSize: 40 }} />,
      title: 'Dirección',
      content: 'Av. Providencia 123, Santiago',
      description: 'Visítanos en nuestra tienda'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ResponsiveNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              Contáctanos
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Estamos aquí para ayudarte.
              Envíanos un mensaje y te responderemos lo antes posible.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Información de contacto */}
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom color="primary">
                Información de Contacto
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Puedes contactarnos a través de cualquiera de estos medios:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Card key={index} elevation={2} sx={{ p: 2 }}>
                    <CardContent sx={{ p: '0 !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {info.icon}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6" component="h3">
                            {info.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {info.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {info.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Horarios */}
              <Card elevation={2} sx={{ mt: 3, p: 2 }}>
                <CardContent sx={{ p: '0 !important' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Horarios de Atención
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Lunes a Viernes:</strong> 8:00 AM - 8:00 PM
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Sábados:</strong> 9:00 AM - 6:00 PM
                  </Typography>
                  <Typography variant="body2">
                    <strong>Domingos:</strong> 10:00 AM - 2:00 PM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Formulario de contacto */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Envíanos un Mensaje
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert 
                    severity="success" 
                    sx={{ mb: 3 }}
                    icon={<CheckCircle />}
                  >
                    {success}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Nombre completo"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        variant="outlined"
                        disabled={loading}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        disabled={loading}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Asunto (opcional)"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        variant="outlined"
                        disabled={loading}
                        placeholder="Ej: Consulta sobre productos, Problema con mi pedido, etc."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={6}
                        disabled={loading}
                        placeholder="Cuéntanos en qué podemos ayudarte..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                        sx={{ 
                          py: 1.5, 
                          px: 4,
                          fontSize: '1.1rem'
                        }}
                      >
                        {loading ? 'Enviando...' : 'Enviar Mensaje'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Información adicional */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom color="primary">
              ¿Por qué contactarnos?
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" fontWeight="medium" gutterBottom>
                  📦 Consultas sobre Productos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Información sobre disponibilidad, especificaciones técnicas y recomendaciones.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" fontWeight="medium" gutterBottom>
                  🛒 Soporte de Compras
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ayuda con pedidos, seguimiento de envíos y problemas de pago.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" fontWeight="medium" gutterBottom>
                  💡 Sugerencias y Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comparte tu experiencia y ayúdanos a mejorar nuestro servicio.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Contacto; 