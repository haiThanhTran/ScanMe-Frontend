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
  Tooltip,
  Col,
  Descriptions,
  List,
  Spin,
  Divider,
  Rate,
} from "antd";
import {
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  ShoppingOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarCircleOutlined,
  FileTextOutlined, // Thêm icon cho Mã ĐH
  CalendarOutlined, // Thêm icon cho Ngày đặt
  CreditCardOutlined, // Thêm icon cho thanh toán
  QuestionCircleOutlined, // Icon cho trạng thái không rõ
} from "@ant-design/icons";
import styles from "./OrderHistoryPage.module.css"; // Đảm bảo bạn có file CSS này
import { formatDate } from "../../utils/format"; // Đảm bảo formatDateTime đã được định nghĩa
import fetchUtils from "../../utils/fetchUtils";
import { TagOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const commonReasons = [
  "Tôi muốn thay đổi địa chỉ giao hàng",
  "Tôi đặt nhầm sản phẩm",
  "Tôi tìm được giá tốt hơn ở nơi khác",
  "Thời gian giao hàng quá lâu",
  "Khác",
];

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

const OrderHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredButtonType, setHoveredButtonType] = useState(null);
  const [modalFeedback, setModalFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrdersByUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUtils.get("/orders/user/me", true);
      if (response && response.success && Array.isArray(response.data)) {
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        setOrders([]);
        message.warning(
          response?.message || "Không tìm thấy lịch sử đơn hàng."
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response && error.response.status === 401) {
        message.error(
          "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
        );
      } else {
        message.error(
          "Không thể lấy thông tin đơn hàng: " +
          (error.response?.data?.message || error.message)
        );
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersByUser();
  }, [fetchOrdersByUser]);

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
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

  const getOrderStatusTag = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="gold">
            {" "}
            Chờ xác nhận{" "}
          </Tag>
        );
      case "processing":
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            {" "}
            Đang xử lý{" "}
          </Tag>
        );
      case "confirmed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="blue">
            {" "}
            Đã xác nhận{" "}
          </Tag>
        );
      case "delivering":
        return (
          <Tag icon={<ShoppingOutlined />} color="cyan">
            {" "}
            Đang giao hàng{" "}
          </Tag>
        );
      case "delivered":
      case "completed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {" "}
            Hoàn thành{" "}
          </Tag>
        );
      case "cancelled":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {" "}
            Đã hủy{" "}
          </Tag>
        );
      default:
        return (
          <Tag icon={<QuestionCircleOutlined />} color="default">
            {status || "Không rõ"}
          </Tag>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!order) return false;
    const searchTextLower = searchText.toLowerCase();
    const matchesSearch =
      (order.orderCode?.toLowerCase() || "").includes(searchTextLower) ||
      (order._id?.toString().toLowerCase() || "").includes(searchTextLower) ||
      order.items?.some(
        (item) =>
          item.productName?.toLowerCase().includes(searchTextLower) ||
          item.productId?.name?.toLowerCase().includes(searchTextLower) // Tìm cả trong product.name nếu productName chưa có
      );

    if (activeTab === "all") return matchesSearch;
    return order.status?.toLowerCase() === activeTab && matchesSearch;
  });

  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 180, // Tăng độ rộng một chút
      render: (text, record) => (
        <Text strong copyable={{ text: text || record._id }}>
          {text || record._id}
        </Text>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (date) =>
        date ? (formatDate ? formatDate(date) : formatDate(date)) : "-",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Sản phẩm (Tổng SL)",
      key: "products",
      ellipsis: true,
      render: (_, record) => {
        const totalQuantity = record.items?.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        const firstProductName =
          record.items?.[0]?.productName ||
          record.items?.[0]?.productId?.name ||
          "Sản phẩm";
        return (
          <Tooltip
            title={record.items
              ?.map(
                (item) =>
                  `${item.productName || item.productId?.name} (x${item.quantity
                  })`
              )
              .join(", ")}
          >
            <Text>
              {firstProductName}
              {record.items?.length > 1
                ? ` và ${record.items.length - 1} khác`
                : ""}
              {totalQuantity > 0 ? ` (Tổng: ${totalQuantity})` : ""}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "right",
      width: 160,
      render: (amount) => (
        <Text strong className={styles.amountCell}>
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 180,
      render: (status) => getOrderStatusTag(status),
      filters: [
        { text: "Chờ xác nhận", value: "pending" },
        { text: "Đang xử lý", value: "processing" },
        { text: "Đã xác nhận", value: "confirmed" },
        { text: "Đang giao", value: "delivering" },
        { text: "Hoàn thành", value: "completed" },
        { text: "Đã hủy", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 250,
      fixed: "right",
      render: (_, record) => (
        <Space>
          {/* Nút Xem */}
          <Button
            icon={<EyeOutlined />}
            onClick={() => showModal(record)}
            size="small"
            style={{
              ...redButtonStyle,
              ...(hoveredButtonId === record._id && hoveredButtonType === "view"
                ? redButtonHoverStyle
                : {}),
              marginRight: 8,
            }}
            onMouseEnter={() => {
              setHoveredButtonId(record._id);
              setHoveredButtonType("view");
            }}
            onMouseLeave={() => setHoveredButtonId(null)}
          >
            Xem
          </Button>

          {record.status === "pending" && (
            <Button
              size="small"
              onClick={() => {
                setCancelOrderId(record._id);
                setCancelModalVisible(true);
                setCancelReason("");
                setCustomReason("");
              }}
              style={{
                ...redButtonStyle,
                ...(hoveredButtonId === record._id && hoveredButtonType === "cancel"
                  ? redButtonHoverStyle
                  : {}),
                ...(record.status !== "pending" ? redButtonDisabledStyle : {}),
                marginRight: 8,
              }}
              onMouseEnter={() => {
                setHoveredButtonId(record._id);
                setHoveredButtonType("cancel");
              }}
              onMouseLeave={() => setHoveredButtonId(null)}
            >
              Hủy
            </Button>
          )}

          {record.status === "confirmed" && record.paymentStatus === "pending" && (
            <Button
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => {
                setSelectedOrderId(record._id);
                setModalFeedback(true);
              }}

              style={{
                ...redButtonStyle,
                ...(hoveredButtonId === record._id && hoveredButtonType === "review"
                  ? redButtonHoverStyle
                  : {}),
                marginRight: 8,
              }}
              onMouseEnter={() => {
                setHoveredButtonId(record._id);
                setHoveredButtonType("review");
              }}
              onMouseLeave={() => setHoveredButtonId(null)}
            >
              Đánh giá đơn hàng
            </Button>
          )}

        </Space>

      ),
    },
  ];

  const handleSubmitFeedback = async () => {
    if (!rating) {
      return message.warning("Vui lòng đánh giá và nhập bình luận.");
    }
   console.log("Submitting feedback:", {
        orderId: selectedOrderId,
        rating,
        comment
      });
    try {
      setSubmitting(true);

 await fetchUtils.post(
        "/orders/user/feedback",
        {
          orderId: selectedOrderId,
          feedback: {
            rating,
            comment,
          },
        });

      message.success("Đánh giá đã được gửi thành công.");
      setModalFeedback(false);
      setRating(0);
      setComment("");
      fetchOrdersByUser();
    } catch (error) {
      console.error(error);
      message.error("Gửi đánh giá thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout className={styles.orderHistoryLayout}>
      <Content className={styles.orderHistoryContent}>
        <Title level={3} className={styles.pageTitle}>
          <HistoryOutlined /> Lịch sử đơn hàng
        </Title>
        <Card bordered={false} className={styles.cardContainer}>
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col xs={24} md={8}>
              <Input
                placeholder="Tìm Mã ĐH, Tên sản phẩm..."
                prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col
              xs={24}
              md={16}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className={styles.orderTabs}
              >
                <TabPane tab="Tất cả" key="all" />
                <TabPane tab="Chờ xác nhận" key="pending" />
                <TabPane tab="Đang xử lý" key="processing" />
                <TabPane tab="Đang giao" key="delivering" />
                <TabPane tab="Hoàn thành" key="completed" />
                <TabPane tab="Đã hủy" key="cancelled" />
              </Tabs>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              position: ["bottomCenter"],
            }}
            className={styles.ordersTable}
            scroll={{ x: 1000 }} // Đặt chiều rộng tối thiểu để có cuộn ngang nếu cần
            locale={{
              emptyText: <Empty description="Không có đơn hàng nào." />,
            }}
          />
        </Card>

        <Modal
          title={
            <Title
              level={5}
              style={{ margin: 0, display: "flex", alignItems: "center" }}
            >
              <EyeOutlined style={{ marginRight: 8 }} /> Chi tiết đơn hàng: #
              {selectedOrder?.orderCode || selectedOrder?._id}
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
                ...(hoveredButtonType === "closeDetail"
                  ? redButtonHoverStyle
                  : {}),
              }}
              onMouseEnter={() => setHoveredButtonType("closeDetail")}
              onMouseLeave={() => setHoveredButtonType(null)}
            >
              Đóng
            </Button>,
          ]}
          width={800}
          className={styles.detailModal} // Sẽ thêm style cho modal body scroll
          destroyOnClose
          centered // Để modal ở giữa màn hình
        >
          {selectedOrder ? (
            <div className={styles.modalBodyContent}>
              {" "}
              {/* Thêm wrapper để style scroll */}
              <Descriptions
                bordered
                layout="vertical"
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                size="small"
              >
                <Descriptions.Item
                  label={
                    <>
                      <UserOutlined /> Tên người nhận
                    </>
                  }
                  span={1}
                >
                  {selectedOrder.shippingInfo?.name || (
                    <Text type="secondary">N/A</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <PhoneOutlined /> Số điện thoại
                    </>
                  }
                  span={1}
                >
                  {selectedOrder.shippingInfo?.phone || (
                    <Text type="secondary">N/A</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <EnvironmentOutlined /> Địa chỉ giao hàng
                    </>
                  }
                  span={2}
                >
                  {selectedOrder.shippingInfo?.address || (
                    <Text type="secondary">N/A</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <CalendarOutlined /> Ngày đặt hàng
                    </>
                  }
                >
                  {formatDate
                    ? formatDate(selectedOrder.createdAt)
                    : formatDate(selectedOrder.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái đơn hàng">
                  {getOrderStatusTag(selectedOrder.status)}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <CreditCardOutlined /> Phương thức TT
                    </>
                  }
                >
                  {selectedOrder.paymentMethod || "COD"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái TT">
                  <Tag
                    color={
                      selectedOrder.paymentStatus === "paid"
                        ? "success"
                        : "warning"
                    }
                  >
                    {selectedOrder.paymentStatus === "paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
              <Divider orientation="left" style={{ marginTop: 24 }}>
                Sản phẩm trong đơn
              </Divider>
              <List
                itemLayout="horizontal"
                dataSource={selectedOrder.items}
                className={styles.modalProductList}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.productId?._id || index}
                    className={styles.modalProductItem}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            item.productId?.images?.[0] ||
                            "/placeholder-image.png"
                          }
                          shape="square"
                          size={64}
                        />
                      }
                      title={
                        <Text
                          strong
                          ellipsis={{
                            tooltip: item.productName || item.productId?.name,
                          }}
                        >
                          {item.productName || item.productId?.name}
                        </Text>
                      }
                      description={
                        <>
                          <Text type="secondary">
                            Số lượng: {item.quantity}
                          </Text>{" "}
                          <br />
                          <Text type="secondary">
                            Đơn giá: {formatCurrency(item.unitPrice)}
                          </Text>
                        </>
                      }
                    />
                    <div style={{ textAlign: "right", minWidth: "120px" }}>
                      <Text strong>
                        {formatCurrency(
                          item.subTotalAfterDiscount !== undefined
                            ? item.subTotalAfterDiscount
                            : item.unitPrice * item.quantity
                        )}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
              {selectedOrder.appliedVouchers &&
                selectedOrder.appliedVouchers.length > 0 && (
                  <>
                    <Divider orientation="left" style={{ marginTop: 24 }}>
                      Voucher đã áp dụng
                    </Divider>
                    {selectedOrder.appliedVouchers.map((voucher) => (
                      <Paragraph
                        key={voucher.voucherId || voucher.code}
                        className={styles.appliedVoucherText}
                      >
                        <Tag color="geekblue" icon={<TagOutlined />}>
                          {voucher.code}
                        </Tag>
                        <Text>
                          Giảm:{" "}
                          {formatCurrency(
                            voucher.discountAmountApplied ||
                            voucher.discountAmount
                          )}
                        </Text>
                      </Paragraph>
                    ))}
                  </>
                )}
              <Divider style={{ marginTop: 24 }} />
              <Row justify="end" style={{ marginTop: "16px" }}>
                <Col>
                  <Space direction="vertical" align="end" size="small">
                    <Text>
                      Tạm tính: {formatCurrency(selectedOrder.subTotal)}
                    </Text>
                    {selectedOrder.totalDiscount > 0 && (
                      <Text type="success">
                        Giảm giá Voucher: -
                        {formatCurrency(selectedOrder.totalDiscount)}
                      </Text>
                    )}
                    <Title level={4} style={{ margin: 0 }}>
                      Tổng cộng:{" "}
                      <Text type="danger" strong>
                        {formatCurrency(selectedOrder.totalAmount)}
                      </Text>
                    </Title>
                  </Space>
                </Col>
              </Row>
            </div>
          ) : (
            <Skeleton active avatar paragraph={{ rows: 6 }} />
          )}
        </Modal>

        <Modal
          title="Hủy đơn hàng"
          open={cancelModalVisible}
          onCancel={() => setCancelModalVisible(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setCancelModalVisible(false)}
              style={{
                ...redButtonStyle,
                ...(hoveredButtonType === "closeCancel"
                  ? redButtonHoverStyle
                  : {}),
                marginRight: 8,
              }}
              onMouseEnter={() => setHoveredButtonType("closeCancel")}
              onMouseLeave={() => setHoveredButtonType(null)}
            >
              Đóng
            </Button>,
            <Button
              key="ok"
              onClick={async () => {
                let reason =
                  cancelReason === "Khác" ? customReason : cancelReason;
                if (!reason) {
                  message.warning("Vui lòng chọn hoặc nhập lý do hủy đơn.");
                  return;
                }
                try {
                  setLoading(true);
                  const res = await fetchUtils.patch(
                    "/orders/user/update-status",
                    {
                      orderId: cancelOrderId,
                      newStatus: "cancelled",
                      cancellationReason: reason,
                    },
                    true
                  );
                  if (res.success) {
                    message.success("Đã hủy đơn hàng thành công!");
                    setCancelModalVisible(false);
                    fetchOrdersByUser();
                  } else {
                    message.error(res.message || "Hủy đơn thất bại.");
                  }
                } catch (err) {
                  message.error("Lỗi khi hủy đơn.");
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                ...redButtonStyle,
                ...(hoveredButtonType === "confirmCancel"
                  ? redButtonHoverStyle
                  : {}),
              }}
              onMouseEnter={() => setHoveredButtonType("confirmCancel")}
              onMouseLeave={() => setHoveredButtonType(null)}
            >
              Xác nhận hủy
            </Button>,
          ]}
        >
          <div>
            <p>Chọn lý do hủy đơn:</p>
            <div>
              {commonReasons.map((reason) => (
                <div key={reason} style={{ marginBottom: 8 }}>
                  <label>
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={() => setCancelReason(reason)}
                    />{" "}
                    {reason}
                  </label>
                </div>
              ))}
              {cancelReason === "Khác" && (
                <Input.TextArea
                  rows={3}
                  placeholder="Nhập lý do hủy đơn..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
          </div>
        </Modal>
        <Modal
          title="Cảm ơn bạn đã mua hàng!"
          open={modalFeedback}
          onCancel={() => {
            setModalFeedback(false);
            setRating(0);
            setComment("");
          }}
          footer={null}
          width={600}
          centered
        >
          <div style={{ marginBottom: 16, marginTop: 16 }}>
            <Rate value={rating} onChange={setRating} style={{ fontSize: 24 }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Text strong>Nhận xét:</Text>
            <TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập nhận xét của bạn..."
            />
          </div>

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              loading={submitting}
              onClick={handleSubmitFeedback}
              style={{
                ...redButtonStyle,
                ...( hoveredButtonType === "feedback"
                  ? redButtonHoverStyle
                  : {}),
                marginRight: 8,
              }}
              onMouseEnter={() => {
                setHoveredButtonType("feedback");
              }}
              onMouseLeave={() => setHoveredButtonId(null)}
            >
              Gửi đánh giá
            </Button>
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default OrderHistoryPage;
