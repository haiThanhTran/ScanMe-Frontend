import {
  DollarOutlined,
  FileDoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import BookingHistory from "../customers/BookingHistory";

const LayoutUser = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current path to determine which menu item is active
  const currentPath = location.pathname;
  const selectedKey = currentPath.includes("/information/booking-history")
    ? "2"
    : currentPath.includes("/information/payment-history")
    ? "3"
    : "1";

  // Function to handle menu item clicks
  const handleMenuClick = (e) => {
    switch (e.key) {
      case "1":
        navigate("/information/profile");
        break;
      case "2":
        navigate("/information/booking-history");
        break;
      case "3":
        navigate("/information/payment-history");
        break;
      default:
        navigate("/information/profile");
    }
  };

  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "User Profile",
    },
    {
      key: "2",
      icon: <FileDoneOutlined />,
      label: "Booking History",
    },
    {
      key: "3",
      icon: <DollarOutlined />,
      label: "Payment History",
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: 256,
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedKey]}
          mode="inline"
          theme="light"
          items={items}
          style={{ listStyle: "none" }}
          onClick={handleMenuClick}
        />
      </div>
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          {/* <Route path="profile" element={<UserProfile />} /> */}
          <Route path="booking-history" element={<BookingHistory />} />
          {/* <Route path="payment-history" element={<PaymentHistory />} /> */}
          {/* <Route path="*" element={<UserProfile />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default LayoutUser;
