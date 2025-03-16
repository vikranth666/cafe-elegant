import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { updateUserAddress } from '../store/slices/authSlice';

// Animation variants
const pageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 }
};

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
}));

const AddressIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
}));

// Indian States list for dropdown
const INDIAN_STATES = [
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OD', label: 'Odisha' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UK', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' },
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'DN', label: 'Dadra and Nagar Haveli and Daman and Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'LA', label: 'Ladakh' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'PY', label: 'Puducherry' }
];

const EditAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const token = useSelector((state) => state.auth.token);
  
  // Local state for form
  const [formData, setFormData] = useState({
    street: '',
    buildingName: '',
    landmark: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: true,
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Initialize form with user address data if it exists
    if (user && user.address) {
      setFormData({
        street: user.address.street || '',
        buildingName: user.address.buildingName || '',
        landmark: user.address.landmark || '',
        city: user.address.city || '',
        state: user.address.state || '',
        pinCode: user.address.pinCode || '',
        isDefault: true,
      });
    }
  }, [user, token, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Dispatch update action
      await dispatch(updateUserAddress(formData)).unwrap();
      
      setSnackbar({
        open: true,
        message: 'Address updated successfully!',
        severity: 'success'
      });
      
      // Navigate back to profile after short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error || 'Failed to update address',
        severity: 'error'
      });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageAnimation}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/profile')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {user.address?.street ? 'Update Address' : 'Add New Address'}
          </Typography>
        </Box>
        
        <StyledPaper>
          <form onSubmit={handleSubmit}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <AddressIcon>
                <HomeIcon sx={{ fontSize: 40 }} />
              </AddressIcon>
              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This address will be used for shipping your orders
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Flat, House no., Building, Company, Apartment"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  placeholder="42, Sunshine Apartments"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Area, Street, Sector, Village"
                  name="buildingName"
                  value={formData.buildingName}
                  onChange={handleChange}
                  required
                  placeholder="MG Road, Sector 14"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Landmark (optional)"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Near Apollo Hospital"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Town/City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Mumbai"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  {INDIAN_STATES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                  inputProps={{
                    pattern: "[0-9]{6}",
                    maxLength: 6
                  }}
                  placeholder="400001"
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Address'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </motion.div>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditAddress;