import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch Orders
export const fetchOrders = createAsyncThunk("admin/fetchOrders", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Update Order Status
export const updateOrder = createAsyncThunk("admin/updateOrder", async ({ orderId, status }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, { status });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Fetch Products
export const fetchProducts = createAsyncThunk("admin/fetchProducts", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);

        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Add Product
export const addProduct = createAsyncThunk("admin/addProduct", async (product, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, product);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Update Product
export const updateProduct = createAsyncThunk("admin/updateProduct", async (product, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${product._id}`, product);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Delete Product
export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (productId, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`);
            return { _id: productId };  // Ensure payload is an object with `_id`
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


// Fetch Reservations
export const fetchReservations = createAsyncThunk("admin/fetchReservations", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reservations`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Update Reservation Status
export const updateReservation = createAsyncThunk("admin/updateReservation", async ({ reservationId, status }, { rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/reservations/${reservationId}`, { status });
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        orders: [],
        products: [],
        reservations: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Orders
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            });

        // Products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(product => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product._id !== action.payload._id);
            })
            
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Reservations
        builder
            .addCase(fetchReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = action.payload;
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateReservation.fulfilled, (state, action) => {
                const index = state.reservations.findIndex(reservation => reservation._id === action.payload._id);
                if (index !== -1) {
                    state.reservations[index] = action.payload;
                }
            });
    }
});

export const { clearError, setLoading } = adminSlice.actions;
export default adminSlice.reducer;