import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/contactService';

const ContactNotification = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Solo mostrar para admin y trabajador
  const shouldShow = user && ['admin', 'trabajador'].includes(user.role);

  const fetchUnreadCount = async () => {
    if (!shouldShow) return;
    
    try {
      setLoading(true);
      const stats = await contactService.getEstadisticas();
      setUnreadCount(stats.mensajes_sin_leer || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchUnreadCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const handleClick = () => {
    navigate('/admin/mensajes');
  };

  if (!shouldShow) return null;

  return (
    <Tooltip title={`${unreadCount} mensaje${unreadCount !== 1 ? 's' : ''} sin leer`}>
      <IconButton
        color="inherit"
        onClick={handleClick}
        disabled={loading}
        sx={{ mr: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Email />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default ContactNotification; 