import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";
import PrivateRoute from "./security/PrivateRoute.jsx";
import NotFoundPage from "./page/404.jsx";
import AccessDeniedPage from "./page/403.jsx";
import ToastNotification from "./components/notification/ToastNotification.jsx";
import Dashboard from "./page/adminScreen/DashboardScreen.jsx";
import HomePage from "./components/homePage/homepage.jsx";
import MainContent from "./components/homePage/mainContent.jsx";
import RoleBaseRoute from "./security/RoleBaseRoute.jsx";
import Checkout from "./page/customers/Checkout.jsx";
import BookingSuccess from "./page/customers/BookingSuccess.jsx";
import BookingHistory from "./page/customers/BookingHistory.jsx";
import RoomListing from "./page/customers/RoomListing.jsx";
import PaymentHistory from "./components/homePage/paymentHistory.jsx";
import RoomDetails from "./page/room/RoomDetails.jsx";
import LayoutUser from "./page/userInformation/layoutUser.jsx";


function App() {
  return (
    <>
      <ToastNotification />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<MainContent />} />
            <Route path="/details" element={<RoomDetails />} />
            <Route path="/information/*" element={<LayoutUser />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/403" element={<AccessDeniedPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/rooms/:type" element={<RoomListing />} />
          <Route path="/payment-history" element={<PaymentHistory />} />

          <Route element={<PrivateRoute />}>
            <Route
              path="/admin/*"
              element={
                <RoleBaseRoute allowedRoles={["SUPER_ADMIN"]}>
                  <Dashboard />
                </RoleBaseRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
