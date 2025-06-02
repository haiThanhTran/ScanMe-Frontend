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
import LayoutUser from "./page/customers/userInformation/LayoutUser.jsx";
import Profile from "./page/customers/ProfilePage.jsx";
import ProductsPage from "./page/ProductPages/ProductsPage.jsx";
import VouchersPage from "./page/VoucherPage/VouchersPage.jsx";
import ProductDetailPage from "./page/ProductPages/ProductDetailPage.jsx";
import MyVouchersPage from "./page/customers/MyVouchersPage.jsx";
import OrderHistoryPage from "./page/customers/OrderHistoryPage.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx"; // <<<<<< IMPORT COMPONENT MỚI
import FAQPage from "./components/homePage/faqPage.jsx"; // Import FAQPage

function App() {
  return (
    <>
      <ToastNotification />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route index element={<MainContent />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="vouchers" element={<VouchersPage />} />
            {/* <Route path="orders" element={<OrderHistoryPage />} /> */}
            <Route path="information/*" element={<LayoutUser />} />
            <Route path="faq" element={<FAQPage />} /> {/* Added FAQ route */}
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
          </Route>
          {/* Catch-all route for undefined routes */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;