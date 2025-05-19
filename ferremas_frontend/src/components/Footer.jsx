import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Información de la empresa */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Ferremas
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Tu ferretería de confianza con más de 20 años de experiencia en el mercado.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="WhatsApp">
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Enlaces rápidos */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Inicio
            </Link>
            <Link href="/productos" color="inherit" display="block" sx={{ mb: 1 }}>
              Productos
            </Link>
            <Link href="/servicios" color="inherit" display="block" sx={{ mb: 1 }}>
              Servicios
            </Link>
            <Link href="/contacto" color="inherit" display="block" sx={{ mb: 1 }}>
              Contacto
            </Link>
          </Grid>

          {/* Información de contacto */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Dirección: Av. Principal 123
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Teléfono: (123) 456-7890
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@ferremas.com
            </Typography>
            <Typography variant="body2">
              Horario: Lunes a Sábado 8:00 - 20:00
            </Typography>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Suscríbete para recibir nuestras ofertas y novedades.
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1,
              }}
            >
              <input
                type="email"
                placeholder="Tu email"
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: 'none',
                  flex: 1,
                }}
              />
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Suscribirse
              </button>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 5,
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Ferremas. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 