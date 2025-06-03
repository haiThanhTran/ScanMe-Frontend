import Box from "@mui/material/Box";
import SideMenu from "../../components/storeScreen/SideMenu";
import HomeStore  from "./HomeStore.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProductStore from "./productStore.jsx";
import RoleBaseRoute from "../../security/RoleBaseRoute.jsx";
import VoucherStore from "./voucherStore.jsx";
import StoreManagement from "./storeManagement.jsx";
import SettingProfile from "./settingProfile.jsx";
import OrderStore from "./orderStore.jsx";
import AddProduct from "./addProduct.jsx";
import ProductStoreDetail from "./productStoreDetail.jsx";
import AddVoucher from "./addVoucher.jsx";
import ViewDetailVoucher from "./ViewDetailVoucher.jsx";



export default function DashboardStore() {
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    navigate(`/store/${path}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu onMenuItemClick={handleMenuItemClick} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/homeStore" element={<HomeStore />} />
          <Route
            path="/voucherManagement"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <VoucherStore />
              </RoleBaseRoute>
            }
          />
           <Route
            path="/voucherManagement/create"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <AddVoucher />
              </RoleBaseRoute>
            }
          />
          <Route
            path="/voucherManagement/:id"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <ViewDetailVoucher />
              </RoleBaseRoute>
            }
          />
          <Route
            path="/productManagement"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <ProductStore />
              </RoleBaseRoute>
            }
          />
           <Route
            path="/productManagement/create"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <AddProduct />
              </RoleBaseRoute>
            }
          />
           <Route
            path="/productManagement/:id"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <ProductStoreDetail />
              </RoleBaseRoute>
            }
          />
          <Route
            path="/orderManagement"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <OrderStore />
              </RoleBaseRoute>
            }
          />
          <Route
            path="/storeManagement"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <StoreManagement />
              </RoleBaseRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <RoleBaseRoute allowedRoles={["STORE_MANAGER"]}>
                <SettingProfile />
              </RoleBaseRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}
