import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import LayoutUser from "./page/userInformation/LayoutUser.jsx";
import Profile from "./page/customers/Profile.jsx";
import ProductsPage from "./page/ProductsPage.jsx";
import VouchersPage from "./page/VouchersPage.jsx";

function App() {
  return (
    <>
      <ToastNotification />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<MainContent />} />
            <Route path="information/*" element={<LayoutUser />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="vouchers" element={<VouchersPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/403" element={<AccessDeniedPage />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/admin/*"
              element={
                <RoleBaseRoute allowedRoles={["SUPER_ADMIN"]}>
                  <Dashboard />
                </RoleBaseRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* Catch-all route for undefined routes */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
