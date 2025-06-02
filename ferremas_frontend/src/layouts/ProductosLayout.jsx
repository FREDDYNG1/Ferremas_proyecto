import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar, 
  Toolbar, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Warehouse as WarehouseIcon
} from '@mui/icons-material';

const ProductosLayout = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Panel de Administración
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/productos">
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Productos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/productos/crear">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Crear Producto" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin/productos/gestion-stock">
                <ListItemIcon>
                  <WarehouseIcon />
                </ListItemIcon>
                <ListItemText primary="Gestión de Stock" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProductosLayout;
