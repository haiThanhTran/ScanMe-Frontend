import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Tag } from "antd";
import "./FlashSaleBar.css"; // Tạo file css riêng cho đẹp
import fetchUtils from "../../utils/fetchUtils";
import { useNavigate } from "react-router-dom";

function formatCurrency(amount) {
  return amount?.toLocaleString("vi-VN") + " ₫";
}

function getDiscountPercent(product) {
  if (!product.bestVoucher) return 0;
  if (product.bestVoucher.discountType === "fixed") {
    return Math.round((product.maxDiscount / product.price) * 100);
  }
  return product.bestVoucher.discountValue;
}

function getCurrentFlashSalePeriod() {
  const now = new Date();
  const startHour = Math.floor(now.getHours() / 2) * 2;
  const endHour = startHour + 2;
  const start = new Date(now);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(now);
  end.setHours(endHour, 0, 0, 0);
  return { start, end };
}

export default function FlashSaleBar() {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [period, setPeriod] = useState(getCurrentFlashSalePeriod());
  const navigate = useNavigate();

  useEffect(() => {
    fetchUtils
      .get("/products/flash-sale", false)
      .then((data) => setProducts(data.products || []));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let { start, end } = getCurrentFlashSalePeriod();
      if (now >= end) {
        // sang phiên mới
        ({ start, end } = getCurrentFlashSalePeriod());
      }
      setPeriod({ start, end });
      setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const settings = {
    dots: false,
    infinite: products.length > 6,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    draggable: false,
    swipe: false,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 5 } },
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 900, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div
      className="flash-sale-bar"
      style={{
        padding: "24px",
        maxWidth: "1300px",
        margin: "10px auto 40px auto",
        alignItems: "flex-start",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flash-sale-header">
        <span className="flash-sale-title">FLASH SALE</span>
        <span className="flash-sale-timer">
          <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </span>
      </div>
      <Slider {...settings}>
        {products.map((product) => (
          <div
            className="flash-sale-item"
            key={product._id}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="flash-sale-img-wrap">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="flash-sale-img"
                style={{ borderRadius: 2 }}
              />
              {product.bestSeller && (
                <div className="flash-sale-hot">ĐANG BÁN CHẠY</div>
              )}
            </div>
            <div className="flash-sale-name">{product.name}</div>
            <div className="flash-sale-prices">
              <span className="flash-sale-price">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
