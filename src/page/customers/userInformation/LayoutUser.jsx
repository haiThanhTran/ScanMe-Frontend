import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  HistoryOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined
  // LeftOutlined, // Đã thay bằng MenuFoldOutlined/MenuUnfoldOutlined
} from "@ant-design/icons";
import {
  Menu,
  Layout as AntLayout,
  Button,
  Tooltip,
  Avatar,
  Typography,
} from "antd"; // Thêm Typography
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import ProfilePage from "../ProfilePage";
import MyVouchersPage from "../MyVouchersPage";
import OrderHistoryPage from "../OrderHistoryPage";
import CartPage from "../Carts/CartPage";
import styles from "./LayoutUser.module.css";
import logo from "../../../assets/logo.png";
const { Sider, Content } = AntLayout;
const { Text } = Typography;

const LayoutUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar_url"); // Giả sử key là avatar_url
    if (storedUsername) {
      setCurrentUser({ username: storedUsername, avatar: storedAvatar });
    } else {
      setCurrentUser(null);
    }

    const handleStorageChange = () => {
      const updatedUsername = localStorage.getItem("username");
      const updatedAvatar = localStorage.getItem("avatar_url");
      if (updatedUsername) {
        setCurrentUser({ username: updatedUsername, avatar: updatedAvatar });
      } else {
        setCurrentUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location]); // Re-check on location change

  let selectedKey = "profile";
  // ... (logic selectedKey giữ nguyên)
  if (location.pathname.startsWith("/information/cart")) selectedKey = "cart";
  else if (location.pathname.startsWith("/information/order-history"))
    selectedKey = "orders";
  else if (location.pathname.startsWith("/information/my-vouchers"))
    selectedKey = "vouchers";
  else if (location.pathname.startsWith("/information/profile"))
    selectedKey = "profile";
  else if (
    location.pathname === "/information" ||
    location.pathname === "/information/"
  )
    selectedKey = "profile";

  const handleMenuClick = (e) => {
    // ... (logic handleMenuClick giữ nguyên)
    switch (e.key) {
      case "profile":
        navigate("/information/profile");
        break;
      case "cart":
        navigate("/information/cart");
        break;
      case "orders":
        navigate("/information/order-history");
        break;
      case "vouchers":
        navigate("/information/my-vouchers");
        break;
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("avatar_url");
        localStorage.removeItem("redirectUrl");
        setCurrentUser(null);
        navigate("/login");
        break;
      default:
        navigate("/information/profile");
    }
  };

  const mainMenuItems = [
    // { key: "profile", icon: <UserOutlined />, label: "Tài khoản của tôi" }, // Đổi label lại cho giống mẫu
    { key: "cart", icon: <ShoppingCartOutlined />, label: "Giỏ hàng" },
    { key: "orders", icon: <HistoryOutlined />, label: "Đơn hàng" },
    { key: "vouchers", icon: <WalletOutlined />, label: "Ví Voucher" },
  ];

  const bottomMenuItems = [
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất" }, // Label giống mẫu
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <AntLayout className={styles.layoutUserContainer}>
      <Sider
        className={styles.userSider}
        width={250}
        collapsedWidth={70} // Điều chỉnh cho phù hợp với icon và nút collapse
        theme="dark"
        collapsible
        collapsed={collapsed}
        trigger={null}
      >
        <div className={styles.siderHeader}>
          {!collapsed && (
            <img
              src={logo}
              alt="Logo"
              className={styles.siderLogo}
              onClick={() => navigate("/")}
            />
          )}
          {/* Nút collapse/expand sẽ nằm ở đây hoặc dưới cùng */}
          <div className={styles.siderCollapseTriggerContainer}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className={styles.collapseButtonBottom}
            />
          </div>
        </div>

        <Menu
          selectedKeys={[selectedKey]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={mainMenuItems.map((item) => ({
            key: item.key,
            icon: (
              <Tooltip placement="right" title={collapsed ? item.label : ""}>
                {item.icon}
              </Tooltip>
            ),
            label: collapsed ? null : item.label,
          }))}
          className={styles.userMenu}
          onClick={handleMenuClick}
        />
        {/* Phần User Info và Logout sẽ được đẩy xuống dưới cùng bằng flexbox */}
        <div className={styles.siderFooter}>
          {!collapsed && currentUser && (
            <div className={styles.userProfileSider}>
              <Avatar
                icon={<UserOutlined />}
                src={currentUser.avatar}
                size={32}
              />
              <Text className={styles.siderUsername} ellipsis>
                {currentUser.username || "User"}
              </Text>
            </div>
          )}
          <Menu
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            selectable={false}
            items={bottomMenuItems.map((item) => ({
              key: item.key,
              icon: (
                <Tooltip placement="right" title={collapsed ? item.label : ""}>
                  {item.icon}
                </Tooltip>
              ),
              label: collapsed ? null : item.label,
            }))}
            className={`${styles.userMenu} ${styles.userMenuFooter}`}
            onClick={handleMenuClick}
          />
          
        </div>
      </Sider>
      <AntLayout
        className={styles.userMainContentArea}
        style={{ marginLeft: collapsed ? 0 : 0 }} // marginLeft vẫn cần
      >
        <Content className={styles.actualPageContent}>
          <Routes>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="my-vouchers" element={<MyVouchersPage />} />
            <Route path="order-history" element={<OrderHistoryPage />} />
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default LayoutUser;
