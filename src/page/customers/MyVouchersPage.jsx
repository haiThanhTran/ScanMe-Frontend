import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Typography,
  Card,
  Table,
  Button,
  Space,
  Modal,
  Empty,
  Skeleton,
  Avatar,
  Tabs,
  Input,
  message,
  Tag,
  Row,
  Col,
  Descriptions,
  List,
  Spin,
  Divider,
  Popconfirm,
  Tooltip, // Thêm Tooltip
} from "antd";
import {
  WalletOutlined, // Đổi icon cho trang voucher
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FileTextOutlined,
  BankOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import styles from "./MyVouchersPage.module.css"; // Tạo file CSS riêng
import { formatDate } from "../../utils/format";
import {
  notifyError,
  notifySuccess,
} from "../../components/notification/ToastNotification";
import fetchUtils from "../../utils/fetchUtils";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const redButtonStyle = {
  backgroundColor: "#C31E29",
  color: "#fff",
  border: "1px solid #C31E29",
  transition: "all 0.2s",
};
const redButtonHoverStyle = {
  backgroundColor: "#fff",
  color: "#C31E29",
  border: "1.5px solid #C31E29",
};
const redButtonDisabledStyle = {
  backgroundColor: "#f5c6cb",
  color: "#fff",
  border: "1px solid #f5c6cb",
  cursor: "not-allowed",
  opacity: 0.7,
};

const MyVouchersPage = () => {
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hoveredButtonKey, setHoveredButtonKey] = useState(null);

  const fetchMyVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUtils.get(
        "/user/storage/voucher/vouchers",
        true
      );
      if (response && response.success && Array.isArray(response.data)) {
        setVouchers(
          response.data.map((v) => ({ ...v, key: v.savedVoucherId || v._id })) // Sử dụng savedVoucherId (ID của user_voucher) làm key
        );
      } else {
        setVouchers([]);
        message.warning(response?.message || "Không tìm thấy voucher đã lưu.");
      }
    } catch (error) {
      console.error("Error fetching my vouchers:", error);
      let errorMessage = "Không thể lấy thông tin voucher.";
      if (error.response?.data?.message)
        errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      message.error(errorMessage);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyVouchers();
  }, [fetchMyVouchers]);

  const showModal = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedVoucher(null);
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" && typeof amount !== "string") return "N/A";
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const formatGenericDate = (dateString) => {
    if (!dateString) return "-";
    if (
      formatDate &&
      typeof formatDate === "function" &&
      dateString.includes("T") &&
      dateString.includes("Z")
    ) {
      return formatDate(dateString);
    }
    return formatDate(dateString); // Fallback to formatDate
  };

  const getVoucherStatusTag = (isUsed, endDateStr) => {
    const now = new Date();
    const end = endDateStr ? new Date(endDateStr) : null;

    if (isUsed) {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          {" "}
          Đã dùng{" "}
        </Tag>
      );
    }
    if (end && end < now) {
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          {" "}
          Hết hạn{" "}
        </Tag>
      );
    }
    return (
      <Tag icon={<ClockCircleOutlined />} color="processing">
        {" "}
        Chưa dùng{" "}
      </Tag>
    );
  };

  const handleDeleteVoucher = (savedVoucherIdToDelete) => {
    if (!savedVoucherIdToDelete) {
      message.error("ID voucher không hợp lệ để xóa.");
      return;
    }
    Modal.confirm({
      title: "Xác nhận xóa voucher",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xóa voucher này khỏi ví không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setIsDeleting(true);
        try {
          const response = await fetchUtils.remove(
            `/user/storage/voucher/vouchers/${savedVoucherIdToDelete}`,
            true
          );
          if (response && response.success) {
            notifySuccess("Đã xóa voucher thành công!");
            setVouchers((prevVouchers) =>
              prevVouchers.filter(
                (v) => (v.savedVoucherId || v._id) !== savedVoucherIdToDelete
              )
            );
            if (
              selectedVoucher &&
              (selectedVoucher.savedVoucherId || selectedVoucher._id) ===
                savedVoucherIdToDelete
            ) {
              handleCancelModal(); // Đóng modal nếu voucher đang xem bị xóa
            }
          } else {
            notifyError(response?.message || "Xóa voucher thất bại.");
          }
        } catch (error) {
          console.error("Error deleting voucher:", error);
          let em = "Lỗi khi xóa voucher.";
          if (error.response?.data?.message) em = error.response.data.message;
          else if (error.message) em = error.message;
          notifyError(em);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    if (!voucher) return false;
    const searchTextLower = searchText.toLowerCase();
    const code = voucher.code || "";
    const description = voucher.description || "";
    const storeName =
      voucher.storeId?.name ||
      (voucher.storeId === null ? "áp dụng chung" : "");

    const matchesSearch =
      code.toLowerCase().includes(searchTextLower) ||
      description.toLowerCase().includes(searchTextLower) ||
      storeName.toLowerCase().includes(searchTextLower);

    if (activeTab === "all") return matchesSearch;
    const effectiveEndDate = voucher.expiresAt || voucher.endDate;
    if (activeTab === "used") return voucher.isUsed && matchesSearch;
    if (activeTab === "unused") {
      const isExpired = effectiveEndDate
        ? new Date(effectiveEndDate) < new Date()
        : false;
      return !voucher.isUsed && !isExpired && matchesSearch;
    }
    if (activeTab === "expired") {
      const isExpired = effectiveEndDate
        ? new Date(effectiveEndDate) < new Date()
        : false;
      return isExpired && matchesSearch; // Bao gồm cả voucher đã dùng mà hết hạn và chưa dùng mà hết hạn
    }
    return matchesSearch;
  });

  const columns = [
    {
      title: "Mã Voucher",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code) => <Text strong>{code || "N/A"}</Text>,
    },
    {
      title: "Thông tin Voucher",
      key: "info",
      width: 220,
      render: (_, record) => (
        <div className={styles.voucherInfoCell}>
          <Tooltip title={record.description}>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 4, fontWeight: 500, color: "#333" }}
            >
              {record.description || "Không có mô tả"}
            </Paragraph>
          </Tooltip>
          <Text type="secondary" style={{ fontSize: "0.85em" }}>
            <BankOutlined /> {record.storeId?.name || "Áp dụng chung"}
          </Text>
        </div>
      ),
    },
    {
      title: "Giá trị",
      key: "value",
      width: 90,
      align: "right",
      render: (_, record) => {
        if (!record || typeof record.discountValue === "undefined") return "-";
        if (record.discountType === "percentage") {
          return (
            <Text strong style={{ color: "#1890ff" }}>
              {record.discountValue}%
            </Text>
          );
        } else {
          return (
            <Text strong style={{ color: "#1890ff" }}>
              {record.discountValue.toLocaleString()}đ
            </Text>
          );
        }
      },
    },
    {
      title: "Ngày hết hạn",
      key: "endDate",
      width: 110,
      dataIndex: "endDate",
      render: (_, record) =>
        formatGenericDate(record.expiresAt || record.endDate),
      sorter: (a, b) =>
        new Date(a.expiresAt || a.endDate) - new Date(b.expiresAt || b.endDate),
    },
    {
      title: "Ngày nhận",
      dataIndex: "acquiredAt",
      key: "acquiredAt",
      width: 110,
      render: (date) => (date ? formatGenericDate(date) : "-"),
      sorter: (a, b) => new Date(a.acquiredAt) - new Date(b.acquiredAt),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 90,
      align: "center",
      render: (_, record) =>
        getVoucherStatusTag(record.isUsed, record.expiresAt || record.endDate),
      filters: [
        { text: "Chưa dùng & Còn hạn", value: "unused_valid" },
        { text: "Đã dùng", value: "used" },
        { text: "Đã hết hạn", value: "expired" },
      ],
      onFilter: (value, record) => {
        const isExpired =
          record.expiresAt || record.endDate
            ? new Date(record.expiresAt || record.endDate) < new Date()
            : false;
        if (value === "unused_valid") return !record.isUsed && !isExpired;
        if (value === "used") return record.isUsed;
        if (value === "expired") return isExpired;
        return false;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 140,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const idForDeletion = record.savedVoucherId || record._id;
        const isExpired =
          record.expiresAt || record.endDate
            ? new Date(record.expiresAt || record.endDate) < new Date()
            : false;
        const showDelete = !record.isUsed && !isExpired;
        return (
          <Space size="small">
            <Button
              icon={<EyeOutlined />}
              onClick={() => showModal(record)}
              size="small"
              style={{
                ...redButtonStyle,
                ...(hoveredButtonKey === `detail-${record.key}`
                  ? redButtonHoverStyle
                  : {}),
                marginRight: 8,
                minWidth: 90,
              }}
              onMouseEnter={() => setHoveredButtonKey(`detail-${record.key}`)}
              onMouseLeave={() => setHoveredButtonKey(null)}
            >
              Chi tiết
            </Button>
            {showDelete ? (
              <Popconfirm
                title="Xóa voucher này?"
                onConfirm={() => handleDeleteVoucher(idForDeletion)}
                okText="Xóa"
                cancelText="Hủy"
                placement="topRight"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{
                    ...redButtonStyle,
                    ...(hoveredButtonKey === `delete-${record.key}`
                      ? redButtonHoverStyle
                      : {}),
                    minWidth: 40,
                  }}
                  onMouseEnter={() =>
                    setHoveredButtonKey(`delete-${record.key}`)
                  }
                  onMouseLeave={() => setHoveredButtonKey(null)}
                />
              </Popconfirm>
            ) : (
              <span
                style={{ display: "inline-block", width: 40, height: 32 }}
              />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Layout className={styles.myVouchersLayout}>
      <Content className={styles.myVouchersContent}>
        <Title level={3} className={styles.pageTitle}>
          <WalletOutlined /> Ví Voucher Của Tôi
        </Title>
        <Card bordered={false} className={styles.cardContainer}>
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col xs={24} md={8} lg={6}>
              <Input
                placeholder="Tìm mã, mô tả, cửa hàng..."
                prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col
              xs={24}
              md={16}
              lg={18}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className={styles.voucherTabs}
              >
                <TabPane tab="Tất cả" key="all" />
                <TabPane tab="Chưa sử dụng" key="unused" />
                <TabPane tab="Đã sử dụng" key="used" />
                <TabPane tab="Đã hết hạn" key="expired" />
              </Tabs>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredVouchers}
            rowKey={(record) =>
              record.savedVoucherId || record._id || record.key
            }
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              position: ["bottomCenter"],
            }}
            className={styles.vouchersTable}
            scroll={{ x: "max-content" }}
            locale={{
              emptyText: <Empty description="Không có voucher nào." />,
            }}
          />
        </Card>

        <Modal
          title={
            <Title
              level={5}
              style={{ margin: 0, display: "flex", alignItems: "center" }}
            >
              <FileTextOutlined style={{ marginRight: 8 }} /> Chi tiết Voucher
            </Title>
          }
          open={isModalVisible}
          onCancel={handleCancelModal}
          footer={[
            <Button
              key="back"
              onClick={handleCancelModal}
              style={{
                ...redButtonStyle,
                ...(hoveredButtonKey === "closeModal"
                  ? redButtonHoverStyle
                  : {}),
              }}
              onMouseEnter={() => setHoveredButtonKey("closeModal")}
              onMouseLeave={() => setHoveredButtonKey(null)}
            >
              Đóng
            </Button>,
          ]}
          width={700}
          className={styles.detailModal}
          destroyOnClose
          centered
        >
          {selectedVoucher ? (
            <div className={styles.modalBodyContent}>
              <Descriptions
                bordered
                column={1}
                size="small"
                layout="horizontal"
              >
                <Descriptions.Item
                  labelStyle={{ width: 160 }}
                  label="Mã Voucher"
                >
                  <Tag color="processing">{selectedVoucher.code || "N/A"}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  <Paragraph
                    ellipsis={{
                      rows: 3,
                      expandable: true,
                      symbol: "(xem thêm)",
                    }}
                  >
                    {selectedVoucher.description || "Không có mô tả."}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Cửa hàng">
                  <BankOutlined />{" "}
                  {selectedVoucher.storeId?.name || "Áp dụng chung"}
                </Descriptions.Item>
                <Descriptions.Item label="Loại giảm giá">
                  {selectedVoucher.discountType === "percentage"
                    ? "Phần trăm (%)"
                    : "Số tiền cố định (VNĐ)"}
                </Descriptions.Item>
                <Descriptions.Item label="Giá trị giảm">
                  {selectedVoucher.discountType === "percentage"
                    ? `${selectedVoucher.discountValue}%`
                    : `${selectedVoucher.discountValue?.toLocaleString()}đ`}
                  {selectedVoucher.discountType === "percentage" &&
                    selectedVoucher.maxDiscountAmount > 0 && (
                      <Text type="secondary">
                        {" "}
                        (Tối đa{" "}
                        {selectedVoucher.maxDiscountAmount.toLocaleString()}đ)
                      </Text>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn hàng tối thiểu">
                  {selectedVoucher.minPurchaseAmount > 0
                    ? `${selectedVoucher.minPurchaseAmount.toLocaleString()}đ`
                    : "Không yêu cầu"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày nhận">
                  {selectedVoucher.acquiredAt
                    ? formatGenericDate(selectedVoucher.acquiredAt)
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Hiệu lực từ">
                  {selectedVoucher.startDate
                    ? formatGenericDate(selectedVoucher.startDate)
                    : "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Hết hạn vào">
                  {formatGenericDate(
                    selectedVoucher.expiresAt || selectedVoucher.endDate
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getVoucherStatusTag(
                    selectedVoucher.isUsed,
                    selectedVoucher.expiresAt || selectedVoucher.endDate
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Lượt sử dụng">
                  {typeof selectedVoucher.totalQuantity === "number" &&
                  selectedVoucher.totalQuantity > 0
                    ? `${selectedVoucher.usedQuantity || 0} / ${
                        selectedVoucher.totalQuantity
                      }`
                    : "Không giới hạn"}
                </Descriptions.Item>
                <Descriptions.Item label="Điều kiện">
                  {selectedVoucher.restrictions?.newUsersOnly && (
                    <Tag color="purple">Chỉ cho người dùng mới</Tag>
                  )}
                  {selectedVoucher.restrictions?.oneTimeUse && (
                    <Tag color="orange">Sử dụng một lần / người</Tag>
                  )}
                  {!selectedVoucher.restrictions?.newUsersOnly &&
                    !selectedVoucher.restrictions?.oneTimeUse && (
                      <Text type="secondary">-</Text>
                    )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : (
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default MyVouchersPage;
