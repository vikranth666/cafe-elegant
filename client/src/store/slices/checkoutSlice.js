import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/checkouts`;

// Async thunks
export const initiateCheckout = createAsyncThunk(
  'checkout/initiateCheckout',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/checkout/initiate`, checkoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initiate checkout');
    }
  }
);

export const updateShippingAddress = createAsyncThunk(
  'checkout/updateShippingAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/checkout/shipping-address`, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shipping address');
    }
  }
);

export const updateBillingAddress = createAsyncThunk(
  'checkout/updateBillingAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/checkout/billing-address`, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update billing address');
    }
  }
);

export const calculateTaxes = createAsyncThunk(
  'checkout/calculateTaxes',
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/checkout/${checkoutId}/taxes`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate taxes');
    }
  }
);

const initialState = {
  checkoutId: null,
  orderType: null, // 'store' or 'online'
  items: [],
  subtotal: 0,
  taxes: 0,
  total: 0,
  discounts: [],
  shippingAddress: null,
  billingAddress: null,
  pickupTime: null,
  deliveryOption: null,
  loading: false,
  error: null,
  checkoutCompleted: false
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setCheckoutItems: (state, action) => {
      state.items = action.payload.items;
      state.subtotal = action.payload.subtotal;
      state.total = action.payload.subtotal + state.taxes;
    },
    setPickupTime: (state, action) => {
      state.pickupTime = action.payload;
    },
    setDeliveryOption: (state, action) => {
      state.deliveryOption = action.payload;
    },
    applyDiscount: (state, action) => {
      state.discounts.push(action.payload);
      state.total = state.subtotal + state.taxes - state.discounts.reduce((sum, discount) => sum + discount.amount, 0);
    },
    removeDiscount: (state, action) => {
      state.discounts = state.discounts.filter(discount => discount.code !== action.payload);
      state.total = state.subtotal + state.taxes - state.discounts.reduce((sum, discount) => sum + discount.amount, 0);
    },
    resetCheckout: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // initiateCheckout
      .addCase(initiateCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutId = action.payload.checkoutId;
      })
      .addCase(initiateCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // updateShippingAddress
      .addCase(updateShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingAddress = action.payload.address;
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // updateBillingAddress
      .addCase(updateBillingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBillingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.billingAddress = action.payload.address;
      })
      .addCase(updateBillingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // calculateTaxes
      .addCase(calculateTaxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateTaxes.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = action.payload.taxes;
        state.total = state.subtotal + action.payload.taxes - 
          state.discounts.reduce((sum, discount) => sum + discount.amount, 0);
      })
      .addCase(calculateTaxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { 
  setOrderType, 
  setCheckoutItems, 
  setPickupTime, 
  setDeliveryOption, 
  applyDiscount, 
  removeDiscount, 
  resetCheckout 
} = checkoutSlice.actions;

// Selectors
export const selectCheckoutInfo = (state) => state.checkout;
export const selectCheckoutItems = (state) => state.checkout.items;
export const selectCheckoutTotal = (state) => state.checkout.total;
export const selectCheckoutSubtotal = (state) => state.checkout.subtotal;
export const selectCheckoutTaxes = (state) => state.checkout.taxes;
export const selectCheckoutLoading = (state) => state.checkout.loading;
export const selectCheckoutError = (state) => state.checkout.error;
export const selectShippingAddress = (state) => state.checkout.shippingAddress;
export const selectBillingAddress = (state) => state.checkout.billingAddress;
export const selectOrderType = (state) => state.checkout.orderType;

export default checkoutSlice.reducer;