import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import isEqual from 'lodash.isequal';

// API configuration
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/products`;
const CART_API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/cart`; // Separate API for cart-related requests

// Fetch products from API
export const fetchProducts = createAsyncThunk(
  'onlineOrder/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to fetch products');
    }
  }
);

// Fetch cart items from API
export const fetchOrderItems = createAsyncThunk(
  'onlineOrder/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(CART_API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to fetch cart items');
    }
  }
);

// Add item to cart
export const addItemToOrder = createAsyncThunk(
  'onlineOrder/addItem',
  async (item, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulating API call delay
      return item;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to add item to cart');
    }
  }
);

// Remove item from cart
export const removeItemFromOrder = createAsyncThunk(
  'onlineOrder/removeItem',
  async ({ id, customizations }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, customizations }; // Return object to remove the correct item
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to remove item from cart');
    }
  }
);

// Update item quantity in cart
export const updateItemQuantity = createAsyncThunk(
  'onlineOrder/updateQuantity',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, quantity };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to update item quantity');
    }
  }
);

// Clear the entire cart
export const clearCart = createAsyncThunk(
  'onlineOrder/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return true;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || error?.message || 'Failed to clear cart');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  products: [],
  productsLoading: false,
  productsError: null,
  loading: false,
  error: null,
  lastAddedItem: null,
};

// Create the slice
const onlineOrderSlice = createSlice({
  name: 'onlineOrder',
  initialState,
  reducers: {
    clearLastAddedItem: (state) => {
      state.lastAddedItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })

      // Fetch cart items
      .addCase(fetchOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add item to cart
      .addCase(addItemToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToOrder.fulfilled, (state, action) => {
        state.loading = false;
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === action.payload.id && isEqual(item.customizations, action.payload.customizations)
        );

        if (existingItemIndex >= 0) {
          state.items[existingItemIndex].quantity += 1;
        } else {
          state.items.push({ ...action.payload, quantity: 1 });
        }

        state.lastAddedItem = action.payload;
      })
      .addCase(addItemToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove item from cart
      .addCase(removeItemFromOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => !(item.id === action.payload.id && isEqual(item.customizations, action.payload.customizations))
        );
      })
      .addCase(removeItemFromOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update item quantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { id, quantity } = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id === id);

        if (itemIndex >= 0) {
          state.items[itemIndex].quantity = quantity;
        }
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.lastAddedItem = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export selectors
export const selectOrderItems = (state) => state.onlineOrder.items;
export const selectOrderLoading = (state) => state.onlineOrder.loading;
export const selectOrderError = (state) => state.onlineOrder.error;
export const selectLastAddedItem = (state) => state.onlineOrder.lastAddedItem;
export const selectCartTotal = (state) =>
  state.onlineOrder.items.reduce((total, item) => total + (item.finalPrice || item.price) * item.quantity, 0);

// Export actions & reducer
export const { clearLastAddedItem } = onlineOrderSlice.actions;
export default onlineOrderSlice.reducer;
