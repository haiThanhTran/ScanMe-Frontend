import { Layout, Button, Menu, Space, Dropdown, Avatar } from "antd";
import {
  DownOutlined,
  QuestionCircleOutlined,
  CompassOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../../components/notification/ToastNotification.jsx";
import authService from "../../services/AuthService.jsx";
import "../../static/css/styles.css";
import { useState, useEffect } from "react";

const { Header: AntHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(0);

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

  return (
    <AntHeader
      className="header-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "0 152px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Left section with logo and dropdown */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          onClick={() => navigate("/")}
          src="https://vi.hotels.com/_dms/header/logo.svg?locale=vi_VN&siteid=3213&2&6f9ec7db"
          alt="logo"
          style={{ height: "32px", marginRight: "16px" }}
        />
        <Dropdown overlay={tripMenu} placement="bottomLeft">
          <Button
            type="primary"
            style={{
              backgroundColor: "#e61e43",
              border: "none",
              color: "white",
            }}
          >
            <Space>
              Đặt chuyến đi
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>

      {/* Middle section with links */}
      <div className="header-links" style={{ display: "flex", gap: "24px" }}>
        <Button style={{ color: "black" }} type="link" icon={<HomeOutlined />}>
          Đăng thông tin nơi lưu trú
        </Button>
        <Button
          style={{ color: "black" }}
          type="link"
          icon={<QuestionCircleOutlined />}
        >
          Hỗ trợ
        </Button>
        <Button
          style={{ color: "black" }}
          type="link"
          icon={<CompassOutlined />}
        >
          Chuyến đi
        </Button>
      </div>

      {/* Right section with user actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isLoggedIn ? (
          <Dropdown
            overlay={userMenu}
            placement="bottomRight"
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.username}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        ) : (
          <>
            <Button
              style={{ border: "none" }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
            <Button
              style={{
                backgroundColor: "#e61e43",
                border: "none",
                color: "white",
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
