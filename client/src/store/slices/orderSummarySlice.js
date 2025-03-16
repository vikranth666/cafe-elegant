import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Async thunks
export const createOrder = createAsyncThunk(
  'orderSummary/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orderSummary/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'orderSummary/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders/user`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user orders');
    }
  }
);

const initialState = {
  currentOrder: null,
  orderHistory: [],
  orderLoading: false,
  orderError: null,
  orderStatus: null, // 'pending', 'processing', 'completed', 'cancelled'
  estimatedDeliveryTime: null,
  orderNumber: null,
  orderConfirmation: false
};

const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {
    updateOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    setEstimatedDeliveryTime: (state, action) => {
      state.estimatedDeliveryTime = action.payload;
    },
    resetOrderSummary: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload.order;
        state.orderNumber = action.payload.orderNumber;
        state.orderStatus = action.payload.status;
        state.estimatedDeliveryTime = action.payload.estimatedDeliveryTime;
        state.orderConfirmation = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
        state.orderConfirmation = false;
      })
      
      // getOrderById
      .addCase(getOrderById.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload;
        state.orderStatus = action.payload.status;
        state.estimatedDeliveryTime = action.payload.estimatedDeliveryTime;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
      })
      
      // getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderHistory = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
      });
  }
});

export const { 
  updateOrderStatus, 
  setEstimatedDeliveryTime, 
  resetOrderSummary 
} = orderSummarySlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.orderSummary.currentOrder;
export const selectOrderHistory = (state) => state.orderSummary.orderHistory;
export const selectOrderStatus = (state) => state.orderSummary.orderStatus;
export const selectOrderNumber = (state) => state.orderSummary.orderNumber;
export const selectOrderLoading = (state) => state.orderSummary.orderLoading;
export const selectOrderError = (state) => state.orderSummary.orderError;
export const selectEstimatedDeliveryTime = (state) => state.orderSummary.estimatedDeliveryTime;

export default orderSummarySlice.reducer;