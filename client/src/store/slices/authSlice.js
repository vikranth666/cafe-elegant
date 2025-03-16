import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const getStoredToken = () => localStorage.getItem('token') || null;

//  Update User Profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) return rejectWithValue('No authentication token');

      const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

//  Update User Address
export const updateUserAddress = createAsyncThunk(
  'auth/updateAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) return rejectWithValue('No authentication token');

      const response = await axios.put(`${API_URL}/address`, addressData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Address update failed');
    }
  }
);

//  Async Thunk: Logout User
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: getStoredToken(),
    loading: false,
    error: null
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // New address reducers
    updateAddressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateAddressSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateAddressFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // ✅ Regular Reducer: Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload)); 
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // New address async thunk handlers
      .addCase(updateUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Handle Logout Async Thunk
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updateAddressStart,
  updateAddressSuccess,
  updateAddressFailure,
  logout
} = authSlice.actions;

export default authSlice.reducer;