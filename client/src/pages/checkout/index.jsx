import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { v4 as uuidv4 } from 'uuid';

// Redux Actions
import { clearCart } from '../../store/slices/cartSlice';
import { setOrderProcessing, createOrder, setOrderType ,setOrderComplete} from '../../store/slices/orderSlice';
import { addOrderToProfile } from '../../store/slices/profileSlice';


// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  }));
  
  const CardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  }));
  
  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };
  
  const itemAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  // Stripe promise initialization
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Order Type', 'Shipping', 'Payment', 'Review'];
  
  // Get order type from location state or default to null
  const initialOrderType = location.state?.orderType || null;
  const [orderType, setLocalOrderType] = useState(initialOrderType);
  
  const cartItems = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const user = useSelector((state) => state.auth.user);

  const [orderData, setOrderData] = useState({
    orderType: null,
    shippingDetails: null,
    paymentDetails: null,
    specialInstructions: ''
  });

  // Handle order type selection
  const handleOrderTypeSelect = () => {
    dispatch(setOrderType(orderType));
    setOrderData(prev => ({ ...prev, orderType }));
    handleNext();
  };

  const handleNext = (stepData) => {
    if (stepData) {
      setOrderData((prev) => ({ ...prev, ...stepData }));
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <OrderTypeSelection 
            orderType={orderType} 
            setOrderType={setLocalOrderType} 
            onNext={handleOrderTypeSelect} 
          />
        );
      case 1:
        return <ShippingForm onNext={handleNext} orderType={orderType} />;
      case 2:
        return (
          <Elements stripe={stripePromise}>
            <PaymentForm 
              onNext={handleNext} 
              onBack={handleBack} 
              orderType={orderType} 
            />
          </Elements>
        );
      case 3:
        return (
          <OrderSummary 
            onBack={handleBack} 
            orderData={orderData} 
            orderType={orderType} 
          />
        );
      default:
        return 'Unknown step';
    }
  };

  // If cart is empty, show alert
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info">
          Your cart is empty. Please add some items before checking out.
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/home')}
        >
          Return to Store
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          {getStepContent(activeStep)}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

// New Order Type Selection Component
const OrderTypeSelection = ({ orderType, setOrderType, onNext }) => {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Select Order Type
      </Typography>
      <RadioGroup 
        value={orderType || ''} 
        onChange={(e) => setOrderType(e.target.value)}
      >
        <FormControlLabel 
          value="store" 
          control={<Radio />} 
          label="In-Store Pickup" 
        />
        <FormControlLabel 
          value="online" 
          control={<Radio />} 
          label="Online Delivery" 
        />
      </RadioGroup>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          onClick={onNext} 
          disabled={!orderType}
        >
          Continue
        </Button>
      </Box>
    </StyledPaper>
  );
};

// Modified Shipping Form to handle different order types
const ShippingForm = ({ onNext, orderType }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: orderType === 'online' ? '' : 'In-Store Pickup',
    city: orderType === 'online' ? '' : 'In-Store',
    state: orderType === 'online' ? '' : 'N/A',
    zipCode: orderType === 'online' ? '' : '00000',
    specialInstructions: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const shippingDetails = {
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      specialInstructions: formData.specialInstructions,
      orderType: orderType
    };
    onNext({ shippingDetails });
  };

  // Render form, similar to previous implementation but with conditional fields
  return (
    <StyledPaper>
      <form onSubmit={handleSubmit}>
        {/* Name and Email Fields */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>

          {/* Conditional Address Fields for Online Orders */}
          {orderType === 'online' && (
            <>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </Grid>
            </>
          )}

          {/* Special Instructions */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={orderType === 'store' ? 'Pickup Instructions' : 'Delivery Instructions'}
              multiline
              rows={2}
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" type="submit">
            Continue to Payment
          </Button>
        </Box>
      </form>
    </StyledPaper>
  );
};

// Payment Form Component

const PaymentForm = ({ onNext, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      const paymentDetails = {
        paymentMethod: paymentMethod.id,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand
      };

      onNext({ paymentDetails });
    } catch (err) {
      setError('An unexpected error occurred.');
      setProcessing(false);
    }
  };

  return (
    <motion.div variants={itemAnimation}>
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <form onSubmit={handleSubmit}>
          <CardContainer>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </CardContainer>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={onBack}>
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={processing}
              startIcon={processing && <CircularProgress size={20} />}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </Button>
          </Box>
        </form>
      </StyledPaper>
    </motion.div>
  );
};

// Order Summary Component
const OrderSummary = ({ onBack, orderData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const total = useSelector((state) => state.cart.total);
    const user = useSelector((state) => state.auth.user);
  
    console.log(" Debug - Order Data:", orderData);
  
    //  Handle Order Completion
  const handleComplete = async () => {
  try {
    dispatch(setOrderProcessing(true));

    // Validate order data
    if (!orderData?.shippingDetails || !orderData?.paymentDetails) {
      console.error("Missing order data!", orderData);
      return;
    }

    // Calculate total amount
    const totalAmount = total + 5.99 + total * 0.08;

    // Create order object
    const order = {
      id: uuidv4(),
      userId: user?.id || "guest",
      date: new Date().toISOString(),
      status: "processing",
      items: cartItems.map(({ id, name, price, quantity, image }) => ({
        id, name, price, quantity, image,
      })),
      shippingAddress: orderData.shippingDetails.shippingAddress,
      paymentDetails: orderData.paymentDetails,
      subtotal: total,
      shipping: 5.99,
      tax: total * 0.08,
      totalAmount,
    };

    // Dispatch createOrder action (assuming it updates the user's profile)
    await dispatch(createOrder(order)).unwrap();

    // Clear cart and mark order as complete
    dispatch(clearCart());
    dispatch(setOrderComplete(true));

    // Navigate to Profile with order ID
    navigate("/profile", { state: { orderId: order.id } });
  } catch (error) {
    console.error("Error processing order:", error);
  } finally {
    dispatch(setOrderProcessing(false));
  }
};
  
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
  
          {/* Order Items List */}
          <Box sx={{ my: 3 }}>
            {cartItems.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8 }} />
                    <Box>
                      <Typography>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
  
          <Divider sx={{ my: 2 }} />
  
          {/* Order Total */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Box>
  
          {/*  Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={onBack}>Back</Button>
            <Button variant="contained" color="primary" onClick={handleComplete}>
              Complete Order
            </Button>
          </Box>
        </StyledPaper>
      </motion.div>
    );
  };

export { Checkout ,OrderSummary};
