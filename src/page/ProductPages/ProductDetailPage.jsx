import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Spin,
  Typography,
  Image,
  Row,
  Col,
  Card,
  Space,
  Button,
  Tag,
} from "antd";
import ProductService from "../../services/ProductService";

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const data = await ProductService.getProductById(id);
        // Directly use the data returned by the service
        if (data) {
          setProduct(data);
        } else {
          // Product not found or error handled in service
          setProduct(null);
          // Optionally set a more specific error message here if needed
          setError(new Error("Product not found or could not be loaded."));
        }
      } catch (err) {
        console.error("Error fetching product detail in component:", err); // Log error for debugging
        setError(err); // Set error state
        setProduct(null); // Clear product on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    } else {
      setLoading(false);
      setError(new Error("No product ID provided."));
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    // Display error message
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3} type="danger">
          {error.message}
        </Title>
      </div>
    );
  }

  if (!product) {
    // Display not found message if no product and no specific error
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Product not found</Title>
      </div>
    );
  }

  const storeName = product.store?.name || "Unknown Store";

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Image.PreviewGroup>
              {product.images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Product Image ${index + 1}`}
                  style={{ maxWidth: "100%", marginBottom: "16px" }}
                />
              ))}
            </Image.PreviewGroup>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={2}>{product.name}</Title>
              <Text type="secondary">By: {storeName}</Text>
              <Divider />
              <div>
                <Typography.Text strong>Price: </Typography.Text>
                {product.discountedPrice ? (
                  <Space>
                    <Text delete>
                      {product.price?.toLocaleString("vi-VN")} đ
                    </Text>
                    <Text strong type="danger" style={{ fontSize: "1.2em" }}>
                      {product.discountedPrice?.toLocaleString("vi-VN")} đ
                    </Text>
                  </Space>
                ) : (
                  <Text strong style={{ fontSize: "1.2em" }}>
                    {product.price?.toLocaleString("vi-VN")} đ
                  </Text>
                )}
              </div>
              <Divider />
              <div>
                <Typography.Text strong>Description:</Typography.Text>
                <Paragraph>{product.description}</Paragraph>
              </div>
              {/* Add other details like stock, categories, etc. */}
              {product.stock !== undefined && (
                <Typography.Text>
                  <strong>Stock:</strong> {product.stock}
                </Typography.Text>
              )}
              {product.applicableCategories &&
                product.applicableCategories.length > 0 && (
                  <div>
                    <Typography.Text strong>Categories:</Typography.Text>
                    <Space size={[0, 8]} wrap>
                      {product.applicableCategories.map((cat) => (
                        <Tag key={cat._id || cat}>{cat.name || cat}</Tag> // Use cat.name if category object is populated, otherwise just id
                      ))}
                    </Space>
                  </div>
                )}
              <Divider />
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                block
              >
                Add to Cart
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
