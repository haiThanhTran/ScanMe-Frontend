// src/components/layout/Header.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Layout, Button, Menu, Space, Dropdown, Avatar } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  WalletOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { notifySuccess } from "../../components/notification/ToastNotification.jsx";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
const { Header: AntHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isDocked, setIsDocked] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  const handleLogout = useCallback(
    async (showNotification = true, shouldNavigate = true) => {
      if (isLoggedIn && showNotification) {
        notifySuccess("Đăng xuất thành công!");
      }
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("redirectUrl");

      setIsLoggedIn(false);
      setUser(null);
      if (shouldNavigate) {
        navigate("/");
      }
    },
    [isLoggedIn, navigate]
  );

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      if (!isLoggedIn || user?.username !== storedUsername) {
        setIsLoggedIn(true);
        setUser({ username: storedUsername });
      }
    } else {
      if (isLoggedIn) {
        handleLogout(false, false);
      }
    }
  }, [isLoggedIn, user, handleLogout]);

  useEffect(() => {
    checkAuthStatus();
    const handleStorageChange = (event) => {
      if (event.key === "token" || event.key === "username") {
        checkAuthStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuthStatus]);

  useEffect(() => {
    const headerHeight = headerRef.current
      ? headerRef.current.offsetHeight
      : 70;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 5) {
        setIsHeaderVisible(true);
        setIsDocked(false); // Luôn undocked khi ở top
      } else if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > headerHeight / 2
      ) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
        setIsDocked(true);
      }
      lastScrollY.current = currentScrollY;
    };

    const currentScrollY = window.scrollY;
    setIsDocked(currentScrollY > 5);
    setIsHeaderVisible(true);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Chạy 1 lần khi mount

  const handleMenuClick = (e) => {
    const key = e.key;
    switch (key) {
      case "profile":
        navigate("/information/profile");
        break;
      case "cart":
        navigate("/information/cart");
        break;
      case "vouchers":
        navigate("/information/my-vouchers");
        break;
      case "orders":
        navigate("/information/order-history");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      key: "userHeader", // Key cho mục header trong dropdown
      label: user && user.username ? user.username : "Tài khoản", // Hiển thị username
      type: "group", // Kiểu group để style khác
      className: styles.dropdownUserHeader, // Class để style
    },
    { type: "divider" },
    // { key: "profile", label: "Tài khoản của tôi", icon: <UserOutlined /> },
    { key: "cart", label: "Giỏ hàng của tôi", icon: <ShoppingCartOutlined /> },
    { key: "vouchers", label: "Ví Voucher", icon: <WalletOutlined /> },
    { key: "orders", label: "Đơn hàng", icon: <HistoryOutlined /> },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const mainMenuItems = [
    { label: "Trang Chủ", path: "/" },
    { label: "Mua Sản Phẩm", path: "/products" },
    { label: "Kho Voucher", path: "/vouchers" },
    { label: "Trung tâm hỗ trợ", path: "/faq" },
  ];

  const headerClasses = [
    styles.appHeader,
    isHeaderVisible ? styles.visible : styles.hidden,
    isDocked ? styles.docked : styles.undocked,
  ].join(" ");

  return (
    <>
      <style>
        {`
          .header-container {
            background: #fff;
            transition: box-shadow 0.3s;
          }
          .header-container.scrolled {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      <AntHeader
        className={headerClasses}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          height: 64,
          boxSizing: "border-box",
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: "flex",padding: "10px", alignItems: "center", height: "auto" }}>
          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="logo"
            style={{
              height: "80px",
              width: "auto",
              
              objectFit: "contain",
              marginRight: "4px",
              cursor: "pointer",
            }}
          />
          
        </div>

        {/* Center: Menu */}
        <div className={styles.mainNav}>
          {mainMenuItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.menuItem} ${
                location.pathname.startsWith(item.path) && item.path !== "/" ? styles.active : ""
              }`}
              onClick={() => navigate(item.path)}
              type="button"
              tabIndex={0}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        {/* Right: User actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: 180,
            justifyContent: "flex-end",
          }}
        >
          {isLoggedIn ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="username"
                    disabled
                    style={{ fontWeight: 600, cursor: "default" }}
                  >
                    haiThanhTranDev
                  </Menu.Item>
                  <Menu.Divider />
                  {/* <Menu.Item
                    key="profile"
                    icon={<UserOutlined />}
                    onClick={() => navigate("/information/profile")}
                  >
                    Chỉnh Sửa Hồ Sơ
                  </Menu.Item> */}
                  <Menu.Item
                    key="cart"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => navigate("/information/cart")}
                  >
                    Giỏ Hàng Của Bạn
                  </Menu.Item>
                  <Menu.Item
                    key="orders"
                    icon={<HistoryOutlined />}
                    onClick={() => navigate("/information/order-history")}
                  >
                    Đơn Hàng Của Bạn
                  </Menu.Item>
                  <Menu.Item
                    key="vouchers"
                    icon={<WalletOutlined />}
                    onClick={() => navigate("/information/my-vouchers")}
                  >
                    Voucher Của Bạn
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    danger
                    onClick={handleLogout}
                  >
                    Đăng Xuất
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              trigger={["hover", "click"]}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{
                  cursor: "pointer",
                  background: "#eaeaea",
                  color: "#e61e43",
                }}
              />
            </Dropdown>
          ) : (
            <>
              <Button
                style={{
                  border: "1.5px solid #e61e43",
                  color: "#e61e43",
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 20,
                  background: "#fff",
                  minWidth: 100,
                  marginRight: 8,
                }}
                onClick={() => navigate("/faq")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#fff0f3")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                Hỗ Trợ
              </Button>
              <Button
                style={{
                  backgroundColor: "#e61e43",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 15,
                  minWidth: 100,
                  borderRadius: 20,
                }}
                onClick={() => navigate("/register")}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#c31e29")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#e61e43")
                }
              >
                Đăng Ký
              </Button>
            </>
          )}
        </div>
      </AntHeader>
    </>
  );
}

export default Header;
