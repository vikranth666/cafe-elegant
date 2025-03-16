import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerStart, registerSuccess, registerFailure } from '../../store/slices/authSlice';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

const MotionPaper = motion.create(Paper);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      dispatch(registerFailure('All fields are required'));
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    dispatch(registerStart());

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      dispatch(registerSuccess(data));
      navigate('/login');
    } catch (err) {
      dispatch(registerFailure(err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Clear password error when user types in password fields
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <MotionPaper
        elevation={3}
        sx={{ p: 4 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(registerFailure(null))}>
            {error}
          </Alert>
        )}
        {passwordError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setPasswordError('')}>
            {passwordError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={Boolean(passwordError)}
            helperText={passwordError}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/login" variant="body2">
            Already have an account? Login
          </Link>
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default Register;
