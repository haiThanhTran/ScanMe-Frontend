import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Empty, message, Pagination } from "antd";
import VoucherCard from "./VoucherCard";
import fetchUtils from "../../utils/fetchUtils";

const VoucherList = ({ selectedStores, selectedCategories }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Build query string
    const params = [];
    if (selectedStores.length > 0)
      params.push(`storeId=${selectedStores.join(",")}`);
    if (selectedCategories.length > 0)
      params.push(`category=${selectedCategories.join(",")}`);
    params.push(`page=${page}`);
    params.push(`limit=${pageSize}`);
    const query = params.length ? `?${params.join("&")}` : "";
    fetchUtils
      .get(`/voucher${query}`, false)
      .then((data) => {
        setVouchers(data.vouchers || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        message.error("Không thể tải voucher!");
        setLoading(false);
      });
  }, [selectedStores, selectedCategories, page, pageSize]);

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
      <div
        style={{ marginTop: 32, textAlign: total === 0 ? "center" : "right" }}
      >
        {total > 0 && (
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOptions={[6, 12, 18, 24, 30]}
            onChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
          />
        )}
      </div>
    </Spin>
  );
};

export default VoucherList;
