// src/components/homePage/HomePage.jsx
import React from "react";
import Header from "./header";
import Footer from "./footer"; // Bạn muốn Footer hiển thị ở tất cả các trang trong HomePage này
import { Outlet, useLocation } from "react-router-dom"; // Thêm useLocation
import styles from "./HomePage.module.css";

const HEADER_HEIGHT = 70;

function HomePage() {
  const location = useLocation();
  // Quyết định có hiển thị Footer hay không dựa trên path
  // Ví dụ: Không hiển thị footer cho các trang trong /information/*
  const shouldShowFooter = !location.pathname.startsWith("/information");

  return (
    <div className={styles.homePageWrapper}>
      <Header />
      <main
        className={styles.outletContent}
        style={{
          paddingTop: `${HEADER_HEIGHT}px`,
          // Thêm padding-bottom nếu bạn muốn có khoảng trống cố định trước Footer
          // paddingBottom: shouldShowFooter ? '50px' : '0', // Ví dụ
        }}
      >
        <Outlet /> {/* LayoutUser sẽ được render ở đây */}
      </main>
       <Footer />
    </div>
  );
}
export default HomePage;
