import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for fetching orders with proper error handling
export const fetchOrders = createAsyncThunk(
  'profile/fetchOrders',
  async (userId, { rejectWithValue }) => {
    try {
      // Use the correct API endpoint with query parameter as in your backend code
      const response = await fetch(`/api/orders?userId=${userId}`);
      
      // Check if request was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const orders = await response.json();
      console.log("Orders fetched successfully:", orders);
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching a single order's details
export const fetchOrderDetails = createAsyncThunk(
  'profile/fetchOrderDetails',
  async ({ userId, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}?userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
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
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if required
        },
        body: JSON.stringify({
          userId,
          ...order
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const savedOrder = await response.json();
      return { userId, order: savedOrder.order || savedOrder };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for canceling an order
export const cancelOrder = createAsyncThunk(
  'profile/cancelOrder',
  async ({ orderId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      return { orderId, userId };
    } catch (error) {
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
    }
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

      // Add these cases inside the extraReducers builder
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
