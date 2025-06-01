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

const { Header: AntHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
      if (event.key === 'token' || event.key === 'username') {
        checkAuthStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuthStatus]);

  useEffect(() => {
    const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 70;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 5) {
        setIsHeaderVisible(true);
        setIsDocked(false); // Luôn undocked khi ở top
      } else if (currentScrollY > lastScrollY.current && currentScrollY > headerHeight / 2) {
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
      case "profile": navigate("/information/profile"); break;
      case "cart": navigate("/information/cart"); break;
      case "vouchers": navigate("/information/my-vouchers"); break;
      case "orders": navigate("/information/order-history"); break;
      case "logout": handleLogout(); break;
      default: break;
    }
  };

  const userMenuItems = [
    {
        key: "userHeader", // Key cho mục header trong dropdown
        label: (user && user.username) ? user.username : "Tài khoản", // Hiển thị username
        type: "group", // Kiểu group để style khác
        className: styles.dropdownUserHeader // Class để style
    },
    { type: "divider" },
    { key: "profile", label: "Tài khoản của tôi", icon: <UserOutlined /> },
    { key: "cart", label: "Giỏ hàng của tôi", icon: <ShoppingCartOutlined /> },
    { key: "vouchers", label: "Ví Voucher", icon: <WalletOutlined /> },
    { key: "orders", label: "Đơn hàng", icon: <HistoryOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true },
  ];

  const mainMenuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Mua Sản Phẩm", path: "/products" },
    { label: "Săn Voucher", path: "/vouchers" },
  ];

  const headerClasses = [
    styles.appHeader,
    isHeaderVisible ? styles.visible : styles.hidden,
    isDocked ? styles.docked : styles.undocked,
  ].join(" ");

  return (
    <AntHeader ref={headerRef} className={headerClasses}>
      <div className={styles.headerMaxWidthContainer}>
        <div className={styles.headerContent}>
          <div className={styles.leftSection}>
            <div className={styles.logoContainer} onClick={() => navigate("/")}>
              <img
                src="https://www.dinkel.shop/media/7c/17/5c/1688390963/sale-cart.png"
                alt="Logo"
                className={styles.logo}
              />
            </div>
            <nav className={styles.mainNav}>
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/");
                let linkColor = isDocked ? (isActive ? "#D9232D" : "#333333") : (isActive ? "#FFFFFF" : "#E0E0E0");

                return (
                  <Button
                    key={item.path}
                    type="text"
                    className={`${styles.menuItem} ${isActive ? styles.active : ""}`}
                    style={{ color: linkColor }}
                    onClick={() => navigate(item.path)}
                  >
                    <span className={styles.menuItemUnderline}></span>
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className={styles.rightSection}>
            {isLoggedIn && user ? (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleMenuClick }}
                placement="bottomRight"
                trigger={["hover"]} // ĐỔI THÀNH HOVER
                overlayClassName={styles.userDropdownOverlay}
              >
                {/* Bỏ span username ở đây, nó sẽ nằm trong dropdown menu */}
                <Space className={`${styles.userDropdownToggle} ${isDocked ? styles.textDark : styles.textLight}`}>
                  <Avatar
                      icon={<UserOutlined />}
                      size="default" // To hơn chút
                      style={{
                          backgroundColor: isDocked ? '#FFF1F0' : 'rgba(255,255,255,0.3)',
                          color: isDocked ? '#D9232D' : '#fff'
                      }}
                  />
                   {/* <DownOutlined style={{fontSize: '10px'}} /> Bỏ down arrow nếu không muốn */}
                </Space>
              </Dropdown>
            ) : (
              <Space size="small">
                  <Button className={`${styles.headerButton} ${styles.aiaPlusButton} ${!isDocked ? styles.buttonHomeUndocked : ""}`}>
                      AIA+
                  </Button>
                  <Button
                    type="primary"
                    danger
                    className={`${styles.headerButton} ${styles.contactButton}`}
                    onClick={() => navigate("/register")}
                  >
                    Liên hệ
                  </Button>
              </Space>
            )}
          </div>
        </div>
      </div>
    </AntHeader>
  );
}

export default Header;