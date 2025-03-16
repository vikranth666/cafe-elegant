import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/reservations`;

// Helper function to get the token
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token && token !== "null" ? token : null;
};

// ** Fetch all reservations (No Auth Required) **
export const fetchReservations = createAsyncThunk(
  "reservation/fetchReservations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL); // No token required
      console.log("Fetched Reservations:", response.data); // Add logging
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error); // Add logging
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reservations");
    }
  }
);

// ** Add a new reservation (Requires Auth) **
export const addReservation = createAsyncThunk(
  "reservation/addReservation",
  async (reservationData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Unauthorized: Please log in to add a reservation.");

      const response = await axios.post(API_URL, reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add reservation");
    }
  }
);

// ** Edit a reservation (Requires Auth) **
export const editReservation = createAsyncThunk(
  "reservation/editReservation",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue("Unauthorized: Please log in to edit a reservation.");

      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update reservation");
    }
  }
);

// ** Delete a reservation (Requires Auth) **
export const deleteReservation = createAsyncThunk(
  "reservation/deleteReservation",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue("Unauthorized: Please log in to delete a reservation.");
      }

      console.log("Deleting reservation at URL:", `${API_URL}/${id}`);

      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Reservation deleted successfully:", id);
      return { _id: id };
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to delete reservation");
    }
  }
);
const reservationSlice = createSlice({
  name: "reservation",
  initialState: {
    reservations: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ** Fetch Reservations **
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.reservations = action.payload;
        state.loading = false;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ** Add Reservation **
      .addCase(addReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.reservations = action.payload; // ✅ Update the whole list
        state.loading = false;
      })      
      .addCase(addReservation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ** Edit Reservation **
      .addCase(editReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editReservation.fulfilled, (state, action) => {
        const index = state.reservations.findIndex(
          (reservation) => reservation._id === action.payload._id
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(editReservation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ** Delete Reservation **
      .addCase(deleteReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.reservations = state.reservations.filter(
          (reservation) => reservation._id !== action.payload._id
        );
        
        state.loading = false;
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default reservationSlice.reducer;
