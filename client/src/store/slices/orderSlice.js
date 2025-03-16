import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log(" Sending Order Payload:", orderData); // Debug log

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(" Order Response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error(" Order Error:", error); // Debug log
      if (error.response) {
        // Server responded with a status code outside 2xx
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        // No response received
        return rejectWithValue({ message: "No response from server" });
      } else {
        // Something else went wrong
        return rejectWithValue({ message: error.message });
      }
    }
  }
);
// Initial state for order slice
const initialState = {
  orders: [],
  currentOrder: null,
  orderType: null, // 'store' or 'online'
  isLoading: false,
  error: null,
  orderPlaced: false,
  isProcessing: false, // Add this field for order processing state
  isComplete: false, // Add this field for order completion state
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    resetOrder: (state) => {
      state.currentOrder = null;
      state.isLoading = false;
      state.error = null;
      state.orderPlaced = false;
      state.isProcessing = false;
      state.isComplete = false;
    },
    setOrderProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setOrderComplete: (state, action) => {
      state.isComplete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isProcessing = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
        state.orderPlaced = true;
        state.isComplete = true;
        state.error = null;
        console.log(" Order Successfully Placed:", action.payload); // Debug log
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isProcessing = false;
        state.error = action.payload || { message: "Failed to create order" };
        state.orderPlaced = false;
        state.isComplete = false;
        console.error(" Order Failed:", action.payload); // Debug log
      });
  },
});

// Export actions
export const { setOrderType, resetOrder, setOrderProcessing, setOrderComplete } = orderSlice.actions;
export default orderSlice.reducer;