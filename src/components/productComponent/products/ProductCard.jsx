import React from "react";
import { Card, Typography, Button, Space, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../../static/css/styles.css"; // Import styles

const { Title, Text } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const storeName = product?.store?.name || "Cửa hàng không xác định";

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <Card
      hoverable
      className="product-card"
      bordered={false}
      style={{
        borderRadius: 18,
        minHeight: 300,
        boxShadow: "0 2px 12px #eee",
      }}
      bodyStyle={{ padding: "16px 20px", position: "relative" }}
      cover={
        <div className="product-card-image-container">
          {" "}
          {/* Container for image */}
          <img
            alt={product.name}
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "placeholder.png"
            }
            className="product-card-image"
          />
          {/* Add discount tag if available */}
          {product.discountedPrice &&
            product.price > product.discountedPrice && (
              <div className="discount-tag">
                {" "}
                {/* Discount tag */}
                {/* Calculate discount percentage or amount */}
                {
                  product.price &&
                  typeof product.price === "number" &&
                  product.discountedPrice &&
                  typeof product.discountedPrice === "number"
                    ? `Giảm ${Math.round(
                        ((product.price - product.discountedPrice) /
                          product.price) *
                          100
                      )}%`
                    : null // Or display amount if percentage is not suitable
                }
              </div>
            )}
        </div>
      }
      onClick={handleClick}
    >
      <div style={{ marginBottom: 8 }}>
        <Title
          level={5}
          className="product-card-title"
          style={{ marginBottom: 0 }}
        >
          {product.name}
        </Title>
        <Text type="secondary" className="product-card-store">
          {storeName}
        </Text>
      </div>

      <div className="product-card-prices" style={{ marginBottom: 8 }}>
        {product.discountedPrice ? (
          <Space size={4}>
            <Text delete className="original-price">
              {`$${product.price?.toLocaleString()}`}
            </Text>
            <Text strong type="danger" className="discounted-price">
              {`$${product.discountedPrice?.toLocaleString()}`}
            </Text>
          </Space>
        ) : (
          <Text strong className="price">
            {`$${product.price?.toLocaleString()}`}
          </Text>
        )}
      </div>

      <div style={{ marginTop: "16px" }} className="product-card-actions">
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          block
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#ff7800",
            border: "none",
            fontWeight: 600,
          }}
        >
          Thêm vào giỏ hàng
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
