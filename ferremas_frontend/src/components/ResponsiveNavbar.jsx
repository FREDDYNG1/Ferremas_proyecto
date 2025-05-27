import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  ExitToApp,
  Person,
  Inventory,
  Assessment,
  Home,
} from '@mui/icons-material';
import { useCarrito } from '../context/CarritoContext';

const ResponsiveNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { carrito } = useCarrito();

  const totalItems = carrito && carrito.items ? carrito.items.reduce((sum, item) => sum + item.cantidad, 0) : 0;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleCloseUserMenu();
  };

  const getNavItems = () => {
    const items = [
      { text: 'Inicio', icon: <Home />, path: '/' },
    ];

    if (user?.role === 'cliente') {
      items.push(
        { text: 'Catálogo', icon: <ShoppingCart />, path: '/productos' },
        { text: 'Mis Pedidos', icon: <Inventory />, path: '/pedidos' }
      );
    } else if (user?.role === 'trabajador') {
      items.push(
        { text: 'Inventario', icon: <Inventory />, path: '/inventario' },
        { text: 'Ventas', icon: <ShoppingCart />, path: '/ventas' },
        { text: 'Reportes', icon: <Assessment />, path: '/reportes' }
      );
    }

    return items;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Ferremas 🛠️
      </Typography>
      <Divider />
      <List>
        {getNavItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo y menú móvil */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Ferremas 🛠️
            </Typography>

            {/* Menú desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              {getNavItems().map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Menú de usuario y Carrito */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {/* Ícono del carrito siempre visible */}
              <Tooltip title="Ver Carrito">
                <IconButton 
                  onClick={() => navigate('/carrito')}
                  color="inherit" // Para que el ícono sea blanco en la AppBar
                  sx={{ mr: 1 }} // Un poco de margen a la derecha
                >
                  <Badge badgeContent={totalItems} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>

              {user ? (
                // Si el usuario está autenticado, mostrar el avatar y el menú de usuario
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Abrir menú">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={user?.email} src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => {
                      if (user?.role === 'admin') {
                        navigate('/admin');
                      } else if (user?.role === 'trabajador') {
                        navigate('/trabajador');
                      } else if (user?.role === 'cliente') {
                        navigate('/cliente');
                      } else {
                        navigate('/');
                      }
                      handleCloseUserMenu();
                    }}>
                      <ListItemIcon>
                        <Person fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Perfil</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToApp fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Cerrar Sesión</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                // Si el usuario no está autenticado, mostrar opciones de Iniciar Sesión y Registrarse
                <Box sx={{ flexGrow: 0 }}>
                   <Tooltip title="Abrir menú">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                       {/* Podrías usar un ícono genérico o texto aquí para no autenticados */}
                      <Avatar /> 
                    </IconButton>
                  </Tooltip>
                   <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                      >
                        <MenuItem onClick={() => {
                          navigate('/login');
                          handleCloseUserMenu();
                        }}>
                          <ListItemIcon>
                            <ExitToApp fontSize="small" />
                          </ListItemIcon>
                          <Typography textAlign="center">Iniciar Sesión</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                          navigate('/registro');
                          handleCloseUserMenu();
                        }}>
                          <ListItemIcon>
                            <Person fontSize="small" />
                          </ListItemIcon>
                          <Typography textAlign="center">Registrarse</Typography>
                        </MenuItem>
                      </Menu>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en dispositivos móviles
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default ResponsiveNavbar; 