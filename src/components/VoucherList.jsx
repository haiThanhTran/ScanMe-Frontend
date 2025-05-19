import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Empty, message } from "antd";
import VoucherCard from "./VoucherCard";

const VoucherList = ({ selectedStores, selectedCategories }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Build query string
    const params = [];
    if (selectedStores.length > 0)
      params.push(`storeId=${selectedStores.join(",")}`);
    if (selectedCategories.length > 0)
      params.push(`category=${selectedCategories.join(",")}`);
    const query = params.length ? `?${params.join("&")}` : "";
    fetch(`/api/voucher${query}`)
      .then((res) => res.json())
      .then((data) => {
        setVouchers(data.vouchers || []);
        setLoading(false);
      })
      .catch(() => {
        message.error("Không thể tải voucher!");
        setLoading(false);
      });
  }, [selectedStores, selectedCategories]);

  return (
    <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        {vouchers.length === 0 && !loading && (
          <Col span={24}>
            <Empty description="Không có voucher phù hợp" />
          </Col>
        )}
        {vouchers.map((voucher) => (
          <Col xs={24} sm={12} md={8} lg={8} key={voucher._id}>
            <VoucherCard voucher={voucher} />
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

export default VoucherList;
