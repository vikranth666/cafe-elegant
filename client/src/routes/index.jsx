import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../pages/Home';
import About from '../pages/About';
import Menu from '../pages/Menu';
import Reservations from '../pages/Reservations';
import Store from '../pages/Store';
import Order from '../pages/Order';
import Location from '../pages/Location';
import AdminDashboard from '../pages/AdminDashboard';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import UserProfile from '../components/UserProfile';
import {Checkout , OrderSummary } from '../pages/checkout/index';
import EditProfile from '../components/EditProfile';
import EditAddress from '../components/EditAddress';
/* import Payment from '../pages/checkout/Payment';*/
import OrderDetails from '../pages/checkout/OrderDetails'; 




/**
 * Protected Route Wrapper
 * Redirects users if they are not authorized
 */
const ProtectedRoute = ({ element, role }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return element;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/store" element={<Store />} />
      <Route path="/order" element={<Order />} />
      <Route path="/location" element={<Location />} />
      <Route path="/checkout" element={<Checkout />} /> {/* Checkout route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orderSummary" element={<OrderSummary />} />
      <Route path="/editProfile" element={<EditProfile />} />
      <Route path="/editAddress" element={<EditAddress/>} />
     {/*  <Route path="/payment" element={<Payment />} />*/}
      <Route path="/orderDetails" element={<OrderDetails />} /> 

      {/* Admin Route - Protected */}
      <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
    </Routes>
  );
};

export default AppRoutes;
