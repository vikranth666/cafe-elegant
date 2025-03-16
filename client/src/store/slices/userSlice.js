import { createSlice } from '@reduxjs/toolkit';

// Safe parsing function for localStorage
const getAddressesFromLocalStorage = () => {
  try {
    const addresses = localStorage.getItem('userAddresses');
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error("Error parsing addresses from localStorage:", error);
    return [];
  }
};

const getOrdersFromLocalStorage = () => {
  try {
    const orders = localStorage.getItem('userOrders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error parsing orders from localStorage:", error);
    return [];
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    addresses: getAddressesFromLocalStorage(),
    orders: getOrdersFromLocalStorage(),
    selectedAddress: null,
    loading: false,
    error: null,
  },
  reducers: {
    // **ADDRESS MANAGEMENT**
    addAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addAddressSuccess: (state, action) => {
      state.loading = false;
      const newAddress = {
        ...action.payload,
        id: Date.now().toString(),
        isDefault: state.addresses.length === 0,
      };
      state.addresses.push(newAddress);
      localStorage.setItem('userAddresses', JSON.stringify(state.addresses));
    },
    addAddressFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    updateAddressSuccess: (state, action) => {
      state.loading = false;
      state.addresses = state.addresses.map(address =>
        address.id === action.payload.id ? action.payload : address
      );
      localStorage.setItem('userAddresses', JSON.stringify(state.addresses));
    },

    deleteAddressSuccess: (state, action) => {
      state.loading = false;
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
      if (state.addresses.length > 0 && !state.addresses.some(addr => addr.isDefault)) {
        state.addresses[0].isDefault = true;
      }
      localStorage.setItem('userAddresses', JSON.stringify(state.addresses));
    },

    setDefaultAddress: (state, action) => {
      state.addresses = state.addresses.map(address => ({
        ...address,
        isDefault: address.id === action.payload,
      }));
      localStorage.setItem('userAddresses', JSON.stringify(state.addresses));
    },

    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
      localStorage.removeItem('userAddresses');
    },

    // **ORDER MANAGEMENT**
    addOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addOrderSuccess: (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
      localStorage.setItem('userOrders', JSON.stringify(state.orders));
    },
    addOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      localStorage.setItem('userOrders', JSON.stringify(state.orders));
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem('userOrders');
    }
  }
});

// Export actions
export const {
  addAddressStart,
  addAddressSuccess,
  addAddressFailure,
  updateAddressSuccess,
  deleteAddressSuccess,
  setDefaultAddress,
  selectAddress,
  clearAddresses,
  addOrderStart,
  addOrderSuccess,
  addOrderFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  clearOrders,
} = userSlice.actions;

// **Thunk for adding an order**
export const addOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(addOrderStart());
    // Simulating API call
    // const response = await api.post('/orders', orderData);
    dispatch(addOrderSuccess(orderData));
  } catch (error) {
    dispatch(addOrderFailure(error.message));
  }
};

// **Thunk for fetching orders**
export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersStart());
    // Simulating API call
    // const response = await api.get('/orders');
    const orders = getOrdersFromLocalStorage();
    dispatch(fetchOrdersSuccess(orders));
  } catch (error) {
    dispatch(fetchOrdersFailure(error.message));
  }
};

export default userSlice.reducer;
