import React from "react";
import ProductCard from "./ProductCard"; // Đảm bảo đường dẫn này đúng
import { Row, Col, Empty } from "antd";

const ProductList = ({ products }) => {
  // Kiểm tra products có phải là mảng không, nếu không thì render Empty hoặc null
  if (!Array.isArray(products)) {
    console.warn("ProductList received non-array products:", products);
    return (
      <Col span={24}>
        <Empty description="Dữ liệu sản phẩm không hợp lệ." />
      </Col>
    );
  }

  if (products.length === 0) {
    // Empty state sẽ được xử lý ở ProductsPage, nên ở đây có thể không cần render gì
    // Hoặc bạn có thể để lại nếu ProductList được dùng ở nơi khác mà không có logic loading/empty ở cha
    // return (
    //   <Col span={24}>
    //     <Empty description="Không có sản phẩm nào." />
    //   </Col>
    // );
    return null; // Để ProductsPage quản lý Empty state
  }

  return (
    // Bỏ <div> không cần thiết ở đây nếu Row là root
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;