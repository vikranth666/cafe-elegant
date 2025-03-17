import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  Chip,
  Avatar,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';

// Import actions from profileSlice
import { fetchOrders, clearError, cancelOrder } from '../store/slices/profileSlice';

// Animation variants
const pageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const OrderItem = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  '&:before': {
    display: 'none',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
}));

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);
  
  // Get orders and loading/error states from Redux store
  const { orders, isLoading, error } = useSelector((state) => state.profile);

  // Show error snackbar when error occurs
  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  // Close snackbar handler
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearError());
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch orders when the profile page loads
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewOrderDetails = (orderId) => {
    navigate('/orderDetails', { state: { orderId } });
  };

  // Handler to retry fetching orders
  const handleRetryFetch = () => {
    if (user?.id) {
      dispatch(fetchOrders(user.id));
    }
  };

  // Open cancel order dialog
  const handleOpenCancelDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  // Close cancel order dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  // Confirm cancel order
  const handleConfirmCancel = () => {
    if (selectedOrderId && user?.id) {
      dispatch(cancelOrder({ userId: user.id, orderId: selectedOrderId }));
      setCancelDialogOpen(false);
      // Success message will be shown after the action completes
    }
  };

  // Format date from ISO string or use fallback
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Check if order can be cancelled (only if not delivered or shipped)
  const canCancelOrder = (status) => {
    return ['pending', 'processing', 'paid'].includes(status.toLowerCase());
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageAnimation}
      >
        {/* Profile Header */}
        <ProfileHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 0 } }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main' }}
            >
              {user.firstName ? user.firstName[0] : <PersonIcon fontSize="large" />}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/editProfile')}
            sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
          >
            Edit Profile
          </Button>
        </ProfileHeader>

        {/* Tab Navigation */}
        <StyledPaper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab icon={<AccountCircleIcon />} label="Account" />
            <Tab icon={<HistoryIcon />} label="Order History" />
          </Tabs>

          {/* Account Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{user.phone || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Default Shipping Address
              </Typography>
              <Typography variant="body1" gutterBottom>
                {user.address?.street || 'No address provided'}
              </Typography>
              {user.address?.street && (
                <Typography variant="body1" gutterBottom>
                  {user.address.city}, {user.address.state} {user.address.zipCode}
                </Typography>
              )}
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => navigate('/editAddress')}
              >
                {user.address?.street ? 'Update Address' : 'Add Address'}
              </Button>
            </Box>
          )}

          {/* Order History Tab */}
          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Your Orders
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${orders.length} ${orders.length === 1 ? 'order' : 'orders'}`}
                    color="primary"
                    size="small"
                  />
                  <Button 
                    size="small" 
                    startIcon={<RefreshIcon />} 
                    onClick={handleRetryFetch}
                    disabled={isLoading}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Orders Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    You haven't placed any orders yet.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/store')}
                  >
                    Start Shopping
                  </Button>
                </Box>
              ) : (
                <List sx={{ width: '100%', p: 0 }}>
                  {orders.map((order) => {
                    // Handle possible differences in order structure
                    const orderId = order._id || order.id;
                    const orderDate = formatDate(order.date || order.createdAt);
                    const status = order.status || (order.isPaid ? 'paid' : 'pending');
                    const items = order.items || order.products || [];
                    const total = order.totalAmount || 0;
                    
                    return (
                      <OrderItem key={orderId}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Grid container alignItems="center">
                            <Grid item xs={1}>
                              <ReceiptIcon color="primary" />
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="subtitle2">
                                #{orderId.slice(0, 8)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {orderDate}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Chip
                                size="small"
                                label={status.toUpperCase()}
                                color={
                                  status.toLowerCase() === 'delivered' ? 'success' :
                                  status.toLowerCase() === 'cancelled' ? 'error' :
                                  status.toLowerCase() === 'processing' || status.toLowerCase() === 'paid' ? 'warning' : 'info'
                                }
                              />
                            </Grid>
                            <Grid item xs={3} sx={{ textAlign: 'right' }}>
                              <Typography variant="subtitle2">
                                ${parseFloat(total).toFixed(2)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionSummary>

                        <AccordionDetails>
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Items ({items.length})
                            </Typography>

                            <List dense sx={{ mb: 2 }}>
                              {items.map((item, index) => (
                                <ListItem key={item._id || item.id || index}>
                                  <ListItemAvatar>
                                    <Avatar
                                      src={item.image}
                                      variant="rounded"
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={item.name || item.productName}
                                    secondary={`Qty: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}`}
                                  />
                                  <Typography variant="body2">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </Typography>
                                </ListItem>
                              ))}
                            </List>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Subtotal:
                              </Typography>
                              <Typography variant="body2">
                                ${(parseFloat(total) * 0.9).toFixed(2)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <LocalShippingIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                Shipping:
                              </Typography>
                              <Typography variant="body2">
                                ${(order.shipping || 5.99).toFixed(2)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Tax:
                              </Typography>
                              <Typography variant="body2">
                                ${(order.tax || (parseFloat(total) * 0.1)).toFixed(2)}
                              </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="subtitle2">
                                Total:
                              </Typography>
                              <Typography variant="subtitle2">
                                ${parseFloat(total).toFixed(2)}
                              </Typography>
                            </Box>

                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: { xs: 'column', sm: 'row' }, 
                              justifyContent: 'space-between',
                              gap: 1
                            }}>
                              <ActionButton
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleViewOrderDetails(orderId)}
                                fullWidth
                              >
                                View Full Details
                              </ActionButton>
                              
                              {canCancelOrder(status) && (
                                <ActionButton
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleOpenCancelDialog(orderId)}
                                  fullWidth
                                >
                                  Cancel Order
                                </ActionButton>
                              )}
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </OrderItem>
                    );
                  })}
                </List>
              )}
            </Box>
          )}
        </StyledPaper>
      </motion.div>

      {/* Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
          <Button 
            size="small" 
            color="inherit" 
            onClick={handleRetryFetch}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Snackbar>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            No, Keep Order
          </Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
