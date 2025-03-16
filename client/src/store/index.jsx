import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import reservationReducer from './slices/reservationSlice';
import onlineOrderReducer from './slices/onlineOrderSlice';
import adminReducer from './slices/adminSlice';
import userReducer from './slices/userSlice'; 
import orderReducer from './slices/orderSlice';
import checkoutReducer from './slices/checkoutSlice';
import paymentReducer from './slices/paymentSlice';
import orderSummaryReducer from './slices/orderSummarySlice';
import profileReducer from './slices/profileSlice';


const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
    order:orderReducer,
    onlineOrder: onlineOrderReducer,
    reservation: reservationReducer,
    checkout: checkoutReducer,
    payment: paymentReducer,
    orderSummary: orderSummaryReducer,
    admin: adminReducer,
  },
});

export default store;
