import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

const MotionPaper = motion.create(Paper);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setValidationError(''); // Clear validation error when user types
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setValidationError('Password is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      dispatch(loginSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <MotionPaper
        elevation={3}
        sx={{ p: 4, borderRadius: 2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>Login</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {validationError && <Alert severity="error" sx={{ mb: 3 }}>{validationError}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
            error={Boolean(validationError && !formData.email)}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
            error={Boolean(validationError && !formData.password)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/register" variant="body2">
            Don't have an account? Sign up
          </Link>
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default Login;
