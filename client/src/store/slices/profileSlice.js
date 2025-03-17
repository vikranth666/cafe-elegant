import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the API base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

// Helper function to build valid URLs
const buildUrl = (path, params = {}) => {
  try {
    // Ensure the base URL includes protocol
    let baseUrl = API_BASE_URL;
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `http://${baseUrl}`;
    }
    
    // Create URL object
    const url = new URL(path, baseUrl);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  } catch (error) {
    console.error("Error building URL:", error);
    // Fallback to a safe default
    return `${baseUrl || 'http://localhost:5000'}${path}`;
  }
};

// Thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'profile/fetchOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const url = buildUrl('/api/orders/user-orders', { userId });
      console.log("Fetching orders from:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const orders = await response.json();
      console.log('Orders fetched successfully:', orders);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching a single order's details
export const fetchOrderDetails = createAsyncThunk(
  'profile/fetchOrderDetails',
  async ({ userId, orderId }, { rejectWithValue }) => {
    try {
      const url = buildUrl(`/api/orders/${orderId}`, { userId });
      console.log("Fetching order details from:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const orderDetails = await response.json();
      console.log("Order details fetched successfully:", orderDetails);
      return orderDetails;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for adding an order to the user profile
export const addOrderToProfile = createAsyncThunk(
  'profile/addOrderToProfile',
  async ({ userId, order }, { rejectWithValue }) => {
    try {
      const url = buildUrl('/api/orders');
      console.log("Adding order at:", url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          ...order,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const savedOrder = await response.json();
      return { userId, order: savedOrder.order || savedOrder };
    } catch (error) {
      console.error("Error adding order:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for canceling an order
export const cancelOrder = createAsyncThunk(
  'profile/cancelOrder',
  async ({ orderId, userId }, { rejectWithValue }) => {
    try {
      const url = buildUrl(`/api/orders/${orderId}`);
      console.log("Canceling order at:", url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return { orderId, userId };
    } catch (error) {
      console.error("Error canceling order:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders Cases
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload; // Update orders with fetched data
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set error message
      })

      // Order Details Cases
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.selectedOrder = null;
      })
      
      // Add Order Cases
      .addCase(addOrderToProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addOrderToProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // Check if order already exists
        const orderExists = state.orders.some(
          (order) => order.id === action.payload.order.id
        );

        // Add order if it doesn't exist
        if (!orderExists) {
          state.orders.push(action.payload.order);
        }
      })
      .addCase(addOrderToProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set error message
      })

      // Cancel Order Cases
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload.orderId);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileOrders, setOrders, clearError } = profileSlice.actions;
export default profileSlice.reducer;
