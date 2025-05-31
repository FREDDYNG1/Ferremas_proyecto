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
              <Typography variant="body2" color="text.secondary">
                No tienes pedidos recientes.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Productos Favoritos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No tienes productos favoritos.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/productos')}
          >
            Ver Catálogo
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
