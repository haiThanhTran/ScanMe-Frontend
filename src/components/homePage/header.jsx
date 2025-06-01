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

import { Layout, Button, Menu, Space, Dropdown, Avatar } from "antd"
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import { notifySuccess } from "../../components/notification/ToastNotification.jsx"
import authService from "../../services/AuthService.jsx"
import { useState, useEffect } from "react"

const { Header: AntHeader } = Layout

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
  }

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
        className={`header-container${isScrolled ? " scrolled" : ""}`}
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
        <div style={{ display: "flex", alignItems: "center", height: "auto" }}>
          <img
            onClick={() => navigate("/")}
            src="./logoreal.svg"
            alt="logo"
            style={{
              height: "56px",
              width: "auto",
              objectFit: "contain",
              marginRight: "4px",
              cursor: "pointer"
            }}
          />
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}>
            ScanMe
          </span>
        </div>



        {/* Center: Menu */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {menuItems.map((item) => (
            <Button
              key={item.path}
              type="link"
              style={{
                color:
                  location.pathname === item.path || (item.path === "/" && location.pathname === "/")
                    ? "#e61e43"
                    : "#222",
                fontWeight: 500,
                fontSize: 15,
                borderBottom:
                  location.pathname === item.path || (item.path === "/" && location.pathname === "/")
                    ? "2px solid #e61e43"
                    : "none",
                background: "none",
                padding: "0 4px",
                margin: 0,
                borderRadius: 0,
                transition: "color 0.3s, border-bottom 0.3s",
                fontFamily: "Inter, Roboto, Arial, sans-serif",
              }}
              onClick={() => navigate(item.path)}
              onMouseOver={(e) => (e.currentTarget.style.color = "#e61e43")}
              onMouseOut={(e) =>
              (e.currentTarget.style.color =
                location.pathname === item.path || (item.path === "/" && location.pathname === "/")
                  ? "#e61e43"
                  : "#222")
              }
            >
              {item.label}
            </Button>
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
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.username}</span>
                <DownOutlined />
              </Space>
            </Dropdown>
          ) : (
            <>
              <Button
                style={{
                  border: "none",
                  color: "#e61e43",
                  fontWeight: 600,
                  fontSize: 15,
                }}
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </Button>
              <Button
                style={{
                  backgroundColor: "#e61e43",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 15,
                  minWidth: 100,
                  padding: "0 12px",
                }}
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </AntHeader>
    </>
  )
}

export default Header
