import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from '../chatbot/ChatbotConfig';
import MessageParser from '../chatbot/MessageParser';
import ActionProvider from '../chatbot/ActionProvider';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Fab,
} from '@mui/material';

import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import ResponsiveNavbar from '../components/ResponsiveNavbar';

const ClienteHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveNavbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido, {user?.email} 🛒
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí podrás gestionar tus compras y ver tu historial de pedidos.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Mis Pedidos Recientes
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Revisa el estado de tus compras y el historial de pedidos.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/cliente/mis-ordenes')}
                fullWidth
              >
                Ver Historial de Pedidos
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Productos Favoritos
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                No tienes productos favoritos.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/productos')}
                fullWidth
              >
                Explorar Productos
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigate('/productos')}
          >
            Ver Catálogo
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/cliente/mis-ordenes')}
          >
            Mis Pedidos
          </Button>
        </Box>
      </Container>

      {/* Chatbot visible si chatVisible === true */}
      {chatVisible && (
        <Box sx={{ position: 'fixed', bottom: 90, right: 20, zIndex: 1000 }}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </Box>
      )}

      {/* Botón flotante circular */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1100 }}>
        <Fab
          color="secondary"
          onClick={() => setChatVisible((prev) => !prev)}
          aria-label="chat"
        >
          {chatVisible ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Box>
    </Box>
  );
};

export default ClienteHome;
