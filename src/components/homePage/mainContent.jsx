import { useEffect, useState } from "react";
import {
  Layout,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Carousel,
  Tabs,
  Space,
  message,
} from "antd";

function MainContent() {
  
const { Content } = Layout;
  return (
    <Content
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px",
        paddingTop: "20px",
      }}
    >
      <div className="main-content">
        <h1>Welcome to ScanMe</h1>
        <p>Đây là giao diện của trang ScanMe</p>
      </div>
    </Content>
  );
}

export default MainContent;
