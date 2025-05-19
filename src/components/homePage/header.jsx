import { Layout, Button, Menu, Space, Dropdown, Avatar } from "antd";
import {
  DownOutlined,
  QuestionCircleOutlined,
  CompassOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { notifySuccess } from "../../components/notification/ToastNotification.jsx";
import authService from "../../services/AuthService.jsx";
import "../../static/css/styles.css";
import { useState, useEffect } from "react";

const { Header: AntHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const currentTime = Date.now();
      if (currentTime - lastCheckTime < 2000) {
        return;
      }
      setLastCheckTime(currentTime);

      if (!authService.isAuthenticated()) {
        handleLogout(false);
        return;
      }

      const userData = await authService.getUser();
      if (userData && userData.data) {
        setIsLoggedIn(true);
        setUser(userData.data);
      } else {
        handleLogout(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (error.message.includes("Too Many Requests")) {
        return;
      }
      handleLogout(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setIsLoggedIn(true);
      setUser({ username: username });
      checkAuthStatus();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (showNotification = true) => {
    try {
      if (isLoggedIn && showNotification) {
        await authService.logout();
        notifySuccess("Đăng xuất thành công!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    }
  };

  const userMenu = (
    <Menu style={{ width: 150, listStyleType: "none", padding: 15 }}>
      <Menu.Item key="1">
        <a href="/information/profile">Tài khoản</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href="/information/payment-history">Lịch sử trả tiền</a>
      </Menu.Item>
      <Menu.Item key="3">
        <a href="/information/booking-history">Lịch sử đặt phòng</a>
      </Menu.Item>
      <Menu.Item key="5">
        <a href="/information/feedback">Phản hồi</a>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item
        key="6"
        onClick={handleLogout}
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LogoutOutlined />{" "}
        <a href="#" style={{ textAlign: "center" }}>
          Đăng xuất
        </a>
      </Menu.Item>
    </Menu>
  );

  const tripMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Khách sạn",
        },
        {
          key: "2",
          label: "Vé máy bay",
        },
        {
          key: "3",
          label: "Tour du lịch",
        },
      ]}
    />
  );

  // Menu items config
  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Mua Sản Phẩm", path: "/products" },
    { label: "Mua Voucher", path: "/vouchers" },
  ];

  return (
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
      <div style={{ display: "flex", alignItems: "center", minWidth: 120 }}>
        <img
          onClick={() => navigate("/")}
          src="https://vi.hotels.com/_dms/header/logo.svg?locale=vi_VN&siteid=3213&2&6f9ec7db"
          alt="logo"
          style={{ height: "28px", marginRight: "24px", cursor: "pointer" }}
        />
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
                location.pathname === item.path ||
                (item.path === "/" && location.pathname === "/")
                  ? "#e61e43"
                  : "#222",
              fontWeight: 500,
              fontSize: 15,
              borderBottom:
                location.pathname === item.path ||
                (item.path === "/" && location.pathname === "/")
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
                location.pathname === item.path ||
                (item.path === "/" && location.pathname === "/")
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
              Tạo tài khoản
            </Button>
          </>
        )}
      </div>
    </AntHeader>
  );
}

export default Header;
