import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stepper,
  Step,
  StepLabel,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Import actions from profileSlice
import { fetchOrderDetails, cancelOrder } from '../../store/slices/profileSlice';

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

const OrderDetailHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderId } = location.state || {};
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Get user and order data from Redux store
  const user = useSelector((state) => state.auth.user);
  const { selectedOrder, isLoading, error } = useSelector((state) => state.profile);

  // Redirect if not logged in or no order ID provided
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!orderId) {
      navigate('/profile');
      return;
    }
    
    dispatch(fetchOrderDetails({ userId: user.id, orderId }));
  }, [dispatch, navigate, orderId, user]);

  // Show error snackbar when error occurs
  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  // Close snackbar handler
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Open cancel order dialog
  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  // Close cancel order dialog
  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
  };

  // Confirm cancel order
  const handleConfirmCancel = () => {
    if (orderId && user?.id) {
      dispatch(cancelOrder({ userId: user.id, orderId }));
      setCancelDialogOpen(false);
      // After successful cancellation, we'll stay on this page to see updated status
    }
  };

  // Format date from ISO string or use fallback
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Format time from ISO string
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '';
    }
  };

  // Get order status step for the stepper
  const getOrderStatusStep = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    
    if (statusLower === 'cancelled') {
      return -1; // Special case for cancelled orders
    }
    
    const statusMap = {
      'pending': 0,
      'paid': 1,
      'processing': 1,
      'shipped': 2,
      'delivered': 3
    };
    
    return statusMap[statusLower] || 0;
  };

  // Check if order can be cancelled (only if not delivered or shipped)
  const canCancelOrder = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    return ['pending', 'processing', 'paid'].includes(statusLower);
  };

  if (isLoading || !selectedOrder) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Container>
    );
  }

  // Extract order data
  const {
    date = selectedOrder.createdAt,
    status = selectedOrder.isPaid ? 'paid' : 'pending',
    items = selectedOrder.products || [],
    totalAmount = 0,
    shipping = 5.99,
    tax = totalAmount * 0.1,
    shippingAddress = selectedOrder.shippingAddress || {},
    paymentMethod = selectedOrder.paymentMethod || 'Credit Card',
  } = selectedOrder;

  const activeStep = getOrderStatusStep(status);
  const statusLowerCase = status.toLowerCase();
  const isOrderCancelled = statusLowerCase === 'cancelled';

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageAnimation}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/profile')}
          sx={{ mb: 3 }}
        >
          Back to Profile
        </Button>

        <OrderDetailHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h5">
                Order #{orderId.slice(0, 8)}
              </Typography>
            </Box>
            <Chip
              label={status.toUpperCase()}
              color={
                statusLowerCase === 'delivered' ? 'success' :
                statusLowerCase === 'cancelled' ? 'error' :
                statusLowerCase === 'processing' || statusLowerCase === 'paid' ? 'warning' : 'info'
              }
              size="medium"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon sx={{ mr: 1, fontSize: 'small', opacity: 0.7 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Placed on {formatDate(date)} at {formatTime(date)}
            </Typography>
          </Box>
          
          {canCancelOrder(status) && (
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<CancelIcon />}
              onClick={handleOpenCancelDialog}
              sx={{ alignSelf: 'flex-start', mt: 1 }}
            >
              Cancel Order
            </Button>
          )}
        </OrderDetailHeader>

        {!isOrderCancelled && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Order Status
            </Typography>
            
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Order Placed</StepLabel>
              </Step>
              <Step>
                <StepLabel>Processing</StepLabel>
              </Step>
              <Step>
                <StepLabel>Shipped</StepLabel>
              </Step>
              <Step>
                <StepLabel>Delivered</StepLabel>
              </Step>
            </Stepper>
            
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {statusLowerCase === 'pending' && "Your order has been received and is awaiting payment confirmation."}
              {statusLowerCase === 'paid' && "Your payment has been confirmed and your order is being prepared."}
              {statusLowerCase === 'processing' && "Your order is being prepared for shipment."}
              {statusLowerCase === 'shipped' && "Your order is on its way to you!"}
              {statusLowerCase === 'delivered' && "Your order has been delivered. Enjoy!"}
            </Typography>
          </StyledPaper>
        )}

        {isOrderCancelled && (
          <StyledPaper sx={{ bgcolor: '#FFEBEE' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CancelIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Order Cancelled</Typography>
            </Box>
            <Typography variant="body1">
              This order has been cancelled and will not be processed. If you have any questions,
              please contact customer support.
            </Typography>
          </StyledPaper>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper>
              <InfoSection>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <List sx={{ width: '100%' }}>
                  {items.map((item, index) => (
                    <React.Fragment key={item._id || item.id || index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            src={item.image}
                            variant="rounded"
                            sx={{ width: 64, height: 64 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {item.name || item.productName}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Box component="span" display="block" sx={{ typography: 'body2', color: 'text.secondary' }}>
                                Price: ${parseFloat(item.price).toFixed(2)}
                              </Box>
                              <Box component="span" display="block" sx={{ typography: 'body2', color: 'text.secondary' }}>
                                Quantity: {item.quantity}
                              </Box>
                            </>
                          }
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < items.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </InfoSection>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledPaper>
              <InfoSection>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">${totalAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">${shipping.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax:</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${(totalAmount + shipping + tax).toFixed(2)}
                  </Typography>
                </Box>
              </InfoSection>

              <InfoSection>
                <Typography variant="h6" gutterBottom>
                  Shipping Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, mt: 0.5 }} fontSize="small" color="action" />
                  <Typography variant="body2">
                    {shippingAddress.fullName || shippingAddress.name}<br />
                    {shippingAddress.address || shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip || shippingAddress.zipCode}<br />
                    {shippingAddress.country}
                  </Typography>
                </Box>
              </InfoSection>

              <InfoSection>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PaymentIcon sx={{ mr: 1 }} fontSize="small" color="action" />
                  <Typography variant="body2">
                    {paymentMethod}
                  </Typography>
                </Box>
              </InfoSection>
            </StyledPaper>
          </Grid>
        </Grid>

        {/* Confirmation Dialog for Order Cancellation */}
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
            <Button onClick={handleCloseCancelDialog}>No, Keep Order</Button>
            <Button onClick={handleConfirmCancel} color="error" autoFocus>
              Yes, Cancel Order
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error || 'An error occurred while loading order details'}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default OrderDetails;