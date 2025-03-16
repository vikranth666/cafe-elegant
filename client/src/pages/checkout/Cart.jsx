import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Badge,
  Drawer,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { 
  removeItemFromOrder, 
  updateItemQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectOrderLoading
} from '../../store/slices/onlineOrderSlice';
import { 
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  X
} from 'lucide-react';

const MotionFab = motion.create(Fab);
const MotionPaper = motion.create(Paper);

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const isLoading = useSelector(selectOrderLoading);

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromOrder(itemId));
    setSnackbarMessage('Item removed from cart');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleQuantityChange = (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    const newQuantity = (item.quantity || 1) + change;
    
    if (newQuantity > 0) {
      dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
    } else {
      handleRemoveItem(itemId);
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setSnackbarMessage('Cart cleared');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    setOpen(false);
  };

  const handleCheckout = () => {
    // Navigate to checkout page or handle checkout process
    setSnackbarMessage('Proceeding to checkout...');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    // Typically you would navigate here:
    // navigate('/checkout');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const formatCustomizations = (item) => {
    if (!item.customizations) return null;
    
    const customizationsList = [];
    for (const [key, value] of Object.entries(item.customizations)) {
      if (value) {
        // Find the option details
        const option = item.options?.find(opt => opt.id === key);
        if (option) {
          customizationsList.push(option.name + (option.price > 0 ? ` (+$${option.price.toFixed(2)})` : ''));
        }
      }
    }
    
    return customizationsList.length > 0 ? (
      <Typography variant="body2" color="text.secondary">
        {customizationsList.join(', ')}
      </Typography>
    ) : null;
  };

  return (
    <>
      {/* Floating cart button */}
      <MotionFab
        color="primary"
        aria-label="cart"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Badge badgeContent={cartItems.length} color="error">
          <ShoppingCart />
        </Badge>
      </MotionFab>

      {/* Cart drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 450 },
            padding: 2,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, position: 'relative' }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 0, top: 0 }}
          >
            <X />
          </IconButton>

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Your Cart
          </Typography>

          {cartItems.length === 0 ? (
            <MotionPaper
              elevation={0}
              sx={{ 
                py: 8, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: 'background.default' 
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart size={64} color="#9e9e9e" />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Your cart is empty
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 3, textTransform: 'none' }}
                onClick={() => setOpen(false)}
              >
                Browse Menu
              </Button>
            </MotionPaper>
          ) : (
            <>
              <List sx={{ mb: 4 }}>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        py: 2,
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: 'background.paper',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          variant="rounded" 
                          src={item.image} 
                          alt={item.name}
                          sx={{ width: 64, height: 64, borderRadius: 1 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight={600}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {formatCustomizations(item)}
                            <Typography variant="body2" color="primary" fontWeight={500} sx={{ mt: 1 }}>
                              ${item.finalPrice.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                        sx={{ ml: 1 }}
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus size={18} />
                          </IconButton>
                          <Typography sx={{ mx: 1, minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity || 1}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus size={18} />
                          </IconButton>
                        </Box>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleRemoveItem(item.id)}
                          color="error"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </motion.div>
                ))}
              </List>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">${cartTotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tax</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${(cartTotal * 0.0825).toFixed(2)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>Total</Typography>
                  <Typography variant="h6" fontWeight={600}>
                    ${(cartTotal * 1.0825).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleClearCart}
                  sx={{ 
                    flex: 1, 
                    py: 1, 
                    textTransform: 'none',
                    fontWeight: 500 
                  }}
                  disabled={isLoading}
                >
                  Clear Cart
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleCheckout}
                  sx={{ 
                    flex: 2, 
                    py: 1, 
                    textTransform: 'none',
                    fontWeight: 600 
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Checkout'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Cart;