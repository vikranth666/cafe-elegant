import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
  ShoppingCart as CartIcon,
  LocationOn as LocationIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  LocalCafe as CoffeeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const MotionButton = motion.create(Button);
const MotionTypography = motion.create(Typography);
const MotionCoffeeIcon = motion.create(CoffeeIcon);

const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  },
  hover: {
    scale: 1.1,
    rotate: [0, 5, -5, 0],
    transition: {
      rotate: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2
      }
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      delay: 0.3,
      duration: 0.5
    }
  },
  hover: {
    color: "#2A9D94",
    transition: {
      duration: 0.2
    }
  }
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoAnimating, setLogoAnimating] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Run logo animation on component mount
    const timer = setTimeout(() => {
      setLogoAnimating(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setAnchorEl(null);
  };

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoHover = () => {
    setLogoAnimating(true);
  };

  const handleLogoLeave = () => {
    setLogoAnimating(false);
  };

  const menuItems = [
    { text: 'About', path: '/about', icon: <InfoIcon /> },
    { text: 'Menu', path: '/menu', icon: <RestaurantIcon /> },
    { text: 'Reservations', path: '/reservations', icon: <CalendarIcon /> },
    { text: 'Store', path: '/store', icon: <StoreIcon /> },
    { text: 'Order Online', path: '/order', icon: <CartIcon /> },
    { text: 'Hours & Location', path: '/location', icon: <LocationIcon /> },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ text: 'Admin Dashboard', path: '/admin', icon: <DashboardIcon /> });
  }

  // Fresh mint color palette 
  const freshMintPrimary = "#4ECDC4";      // Main color
  const freshMintDark = "#2A9D94";         // Darker version for contrast
  const freshMintLight = "#7EDBD5";        // Lighter version for accents
  const freshMintBg = "#F7FDFC";           // Very light background tint
  const freshMintContrast = "#1D6B65";     // High contrast for important elements

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={3}
        sx={{ 
          bgcolor: 'background.paper',
          /* borderBottom: `4px solid ${freshMintPrimary}` */
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none' 
            }}
            onMouseEnter={handleLogoHover}
            onMouseLeave={handleLogoLeave}
          >
            <MotionCoffeeIcon
              initial="hidden"
              animate="visible"
              variants={logoVariants}
              whileHover="hover"
              sx={{ 
                color: freshMintDark, 
                mr: 1.5, 
                fontSize: 40,
                filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.2))'
              }}
            />
            <MotionTypography
              initial="hidden"
              animate="visible"
              variants={textVariants}
              whileHover="hover"
              variant="h5"
              sx={{
                color: freshMintDark,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                letterSpacing: '0.5px',
                fontSize: { xs: '1.5rem', sm: '1.8rem' },
                textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
              }}
            >
              Café Elegante
            </MotionTypography>
          </Box>

          {isMobile ? (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ 
                color: freshMintDark,
                '&:hover': { 
                  bgcolor: `${freshMintLight}30` 
                }
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <MotionButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{ 
                    textTransform: 'none',
                    color: freshMintDark,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    '&:hover': {
                      color: freshMintContrast,
                      bgcolor: `${freshMintLight}20`
                    },
                    py: 1
                  }}
                >
                  {item.text}
                </MotionButton>
              ))}

              {user ? (
                <>
                  <IconButton 
                    onClick={handleProfileMenu}
                    sx={{
                      ml: 1,
                      border: `2px solid ${freshMintPrimary}`,
                      '&:hover': {
                        bgcolor: freshMintBg
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: freshMintDark,
                        color: '#fff',
                        width: 38,
                        height: 38,
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    >
                      {user.name?.[0]}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1,
                        border: `1px solid ${freshMintLight}`
                      }
                    }}
                  >
                    <MenuItem 
                      component={Link} 
                      to="/profile"
                      onClick={handleCloseMenu}
                      sx={{ 
                        py: 1.5,
                        '&:hover': { bgcolor: freshMintBg }
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon fontSize="small" sx={{ color: freshMintDark }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 500 }}>Profile</Typography>
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{ 
                        py: 1.5,
                        '&:hover': { bgcolor: freshMintBg }
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: freshMintDark }} />
                      </ListItemIcon>
                      <Typography sx={{ fontWeight: 500 }}>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <MotionButton
                  component={Link}
                  to="/login"
                  variant="contained"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{ 
                    bgcolor: freshMintDark, 
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    '&:hover': { 
                      bgcolor: freshMintContrast 
                    }
                  }}
                >
                  Login
                </MotionButton>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { 
            width: 280,
            boxShadow: '-4px 0 10px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2.5,
          borderBottom: `3px solid ${freshMintPrimary}`,
          bgcolor: freshMintBg
        }}>
          <CoffeeIcon sx={{ color: freshMintDark, mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              color: freshMintDark,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}
          >
            Café Elegante
          </Typography>
        </Box>
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{ 
                py: 1.5,
                '&:hover': { 
                  bgcolor: freshMintBg
                } 
              }}
            >
              <ListItemIcon sx={{ color: freshMintDark, minWidth: 42 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 600,
                    color: 'text.primary' 
                  } 
                }}
              />
            </ListItem>
          ))}
          
          <ListItem
            button
            component={Link}
            to={user ? "/profile" : "/login"}
            onClick={() => setMobileOpen(false)}
            sx={{ 
              py: 1.5,
              '&:hover': { 
                bgcolor: freshMintBg
              } 
            }}
          >
            <ListItemIcon sx={{ color: freshMintDark, minWidth: 42 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary={user ? "Profile" : "Login"} 
              primaryTypographyProps={{ 
                sx: { 
                  fontWeight: 600
                } 
              }}
            />
          </ListItem>
          
          {user && (
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{ 
                py: 1.5,
                '&:hover': { 
                  bgcolor: freshMintBg
                } 
              }}
            >
              <ListItemIcon sx={{ color: freshMintDark, minWidth: 42 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  sx: { 
                    fontWeight: 600
                  } 
                }}
              />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;