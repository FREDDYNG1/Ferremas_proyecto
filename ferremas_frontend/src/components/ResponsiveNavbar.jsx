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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  ExitToApp,
  Person,
  Inventory,
  Assessment,
  Home,
  Email,
} from '@mui/icons-material';
import { useCarrito } from '../context/CarritoContext';
import { useCurrency } from '../context/CurrencyContext';
import ContactNotification from './ContactNotification';

const ResponsiveNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { carrito } = useCarrito();
  const { currency, setCurrency } = useCurrency();

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

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const getNavItems = () => {
    let items = [{ text: 'Inicio', icon: <Home />, path: '/' }];

    if (!user || user.role === 'cliente') {
      items.push({ text: 'Productos', icon: <ShoppingCart />, path: '/productos' });
      items.push({ text: 'Contacto', icon: <Email />, path: '/contacto' });
    }

    if (user?.role === 'cliente') {
      items.push({ text: 'Mis Pedidos', icon: <Inventory />, path: '/pedidos' });
    } else if (user?.role === 'trabajador') {
      items.push(
        { text: 'Inventario', icon: <Inventory />, path: '/admin/productos' },
        { text: 'Mensajes', icon: <Email />, path: '/admin/mensajes' }
      );
    } else if (user?.role === 'admin') {
      items.push(
        { text: 'Inventario', icon: <Inventory />, path: '/admin/productos' },
        { text: 'Usuarios', icon: <Person />, path: '/admin/usuarios/trabajadores' },
        { text: 'Mensajes', icon: <Email />, path: '/admin/mensajes' }
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
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2, pb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="currency-select-label">Moneda</InputLabel>
          <Select
            labelId="currency-select-label"
            id="currency-select"
            value={currency}
            label="Moneda"
            onChange={handleCurrencyChange}
          >
            <MenuItem value={"USD"}>USD</MenuItem>
            <MenuItem value={"EUR"}>EUR</MenuItem>
            <MenuItem value={"CLP"}>CLP</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}
            >
              Ferremas 🛠️
            </Typography>

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

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
               <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
                <InputLabel id="currency-select-label-desktop" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Moneda</InputLabel>
                <Select
                  labelId="currency-select-label-desktop"
                  id="currency-select-desktop"
                  value={currency}
                  label="Moneda"
                  onChange={handleCurrencyChange}
                  sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
                >
                  <MenuItem value={"USD"}>USD</MenuItem>
                  <MenuItem value={"EUR"}>EUR</MenuItem>
                  <MenuItem value={"CLP"}>CLP</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {/* Notificación de mensajes para admin/trabajador */}
              <ContactNotification />

              {/* Carrito para clientes e invitados */}
              {(!user || user.role === 'cliente') && (
                <Tooltip title="Ver carrito">
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/carrito')}
                    sx={{ mr: 1 }}
                  >
                    <Badge badgeContent={totalItems} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {user ? (
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
                <Box sx={{ flexGrow: 0 }}>
                   <Tooltip title="Abrir menú">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default ResponsiveNavbar; 