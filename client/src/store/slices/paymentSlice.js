import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

// Async thunks
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/payment/create-intent`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async (paymentDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/payment/confirm`, paymentDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed');
    }
  }
);

export const savePaymentMethod = createAsyncThunk(
  'payment/savePaymentMethod',
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/payment/save-method`, paymentMethodData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save payment method');
    }
  }
);

const initialState = {
  clientSecret: null,
  paymentIntentId: null,
  paymentMethods: [],
  selectedPaymentMethod: null,
  paymentStatus: null, // 'pending', 'processing', 'succeeded', 'failed'
  paymentError: null,
  loading: false,
  saveCardForFuture: false,
  transactionId: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
    },
    setSaveCardForFuture: (state, action) => {
      state.saveCardForFuture = action.payload;
    },
    resetPayment: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // createPaymentIntent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.paymentError = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.paymentIntentId = action.payload.paymentIntentId;
        state.paymentStatus = 'pending';
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.paymentError = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // confirmPayment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.paymentError = null;
        state.paymentStatus = 'processing';
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'succeeded';
        state.transactionId = action.payload.transactionId;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentError = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // savePaymentMethod
      .addCase(savePaymentMethod.pending, (state) => {
        state.loading = true;
        state.paymentError = null;
      })
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = [...state.paymentMethods, action.payload.paymentMethod];
      })
      .addCase(savePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.paymentError = action.payload;
      });
  }
});

export const { 
  setSelectedPaymentMethod, 
  setSaveCardForFuture, 
  resetPayment 
} = paymentSlice.actions;

// Selectors
export const selectPaymentInfo = (state) => state.payment;
export const selectClientSecret = (state) => state.payment.clientSecret;
export const selectPaymentStatus = (state) => state.payment.paymentStatus;
export const selectPaymentError = (state) => state.payment.paymentError;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectSavedPaymentMethods = (state) => state.payment.paymentMethods;
export const selectSelectedPaymentMethod = (state) => state.payment.selectedPaymentMethod;

export default paymentSlice.reducer;