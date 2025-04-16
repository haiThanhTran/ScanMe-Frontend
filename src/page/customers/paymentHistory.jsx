import { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Descriptions,
  Divider,
  Empty,
  Skeleton,
  Row,
  Col,
  Statistic,
  Input,
  Tabs,
} from "antd";
import {
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  CreditCardOutlined,
  SearchOutlined,
  FileTextOutlined,
  FilterOutlined,
  DollarOutlined,
  BankOutlined,
} from "@ant-design/icons";

import styles from "../../static/css/BookingHistory.module.css";

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for payment history
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPayments = [
        {
          _id: "PAY-123456",
          booking_id: {
            _id: "BK-123456",
            hotelName: "Luxury Palace Hotel & Spa",
            roomType: "Deluxe Room",
            checkIn: "2023-07-15",
            checkOut: "2023-07-18",
            customerName: "Nguyễn Văn A",
          },
          amount: 3500000,
          payment_date: "2023-07-01T12:30:45",
          method: "credit_card",
          status: "paid",
        },
        {
          _id: "PAY-234567",
          booking_id: {
            _id: "BK-234567",
            hotelName: "Grand Riverside Resort",
            roomType: "Premium Suite",
            checkIn: "2023-08-10",
            checkOut: "2023-08-15",
            customerName: "Nguyễn Văn A",
          },
          amount: 5200000,
          payment_date: "2023-07-20T10:15:30",
          method: "bank_transfer",
          status: "paid",
        },
        {
          _id: "PAY-345678",
          booking_id: {
            _id: "BK-345678",
            hotelName: "Seaside Paradise Hotel",
            roomType: "Ocean View Room",
            checkIn: "2023-06-01",
            checkOut: "2023-06-05",
            customerName: "Nguyễn Văn A",
          },
          amount: 4800000,
          payment_date: "2023-05-15T09:45:20",
          method: "paypal",
          status: "paid",
        },
        {
          _id: "PAY-456789",
          booking_id: {
            _id: "BK-456789",
            hotelName: "Mountain View Resort",
            roomType: "Mountain Suite",
            checkIn: "2023-09-20",
            checkOut: "2023-09-25",
            customerName: "Nguyễn Văn A",
          },
          amount: 6300000,
          payment_date: "2023-08-10T14:25:10",
          method: "bank_transfer",
          status: "unpaid",
        },
        {
          _id: "PAY-567890",
          booking_id: {
            _id: "BK-567890",
            hotelName: "City Central Hotel",
            roomType: "Business Room",
            checkIn: "2023-05-05",
            checkOut: "2023-05-07", 
            customerName: "Nguyễn Văn A",
          },
          amount: 1800000,
          payment_date: "2023-04-20T11:35:55",
          method: "credit_card",
          status: "failed",
        },
      ];

      setPayments(mockPayments);
      setLoading(false);
    }, 1500);
  }, []);

  const showModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "paid":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã thanh toán
          </Tag>
        );
      case "unpaid":
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chưa thanh toán
          </Tag>
        );
      case "failed":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Thanh toán thất bại
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <CreditCardOutlined />;
      case "paypal":
        return <DollarOutlined />;
      case "bank_transfer":
        return <BankOutlined />;
      case "cash":
        return <DollarOutlined />;
      default:
        return <CreditCardOutlined />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case "credit_card":
        return "Thẻ tín dụng";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Chuyển khoản";
      case "cash":
        return "Tiền mặt";
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.booking_id.hotelName.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.booking_id.roomType.toLowerCase().includes(searchText.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return payment.status === activeTab && matchesSearch;
  });

  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text strong>{id}</Text>,
    },
    {
      title: "Thông tin đặt phòng",
      dataIndex: "booking_id",
      key: "booking_id",
      render: (booking) => (
        <div className={styles.hotelInfo}>
          <Text strong>{booking.hotelName}</Text>
          <div>
            <Text type="secondary">
              <UserOutlined /> {booking.customerName}
            </Text>
          </div>
          <div>
            <Text type="secondary">
              Phòng: {booking.roomType}
            </Text>
          </div>
          <div className={styles.dateInfo}>
            <CalendarOutlined /> {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </div>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Text strong className={styles.amount}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      render: (method) => (
        <span>
          {getPaymentMethodIcon(method)} {getPaymentMethodName(method)}
        </span>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => showModal(record)}
            className={styles.viewButton}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div className={styles.pageHeader}>
          <div className={styles.titleSection}>
            <HistoryOutlined className={styles.headerIcon} />
            <Title level={2}>Lịch sử trả tiền</Title>
          </div>
          <div className={styles.searchSection}>
            <Input
              placeholder="Tìm kiếm theo tên khách sạn, loại phòng, mã thanh toán..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.searchInput}
              allowClear
            />
          </div>
        </div>

        <Card className={styles.card}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className={styles.tabs}
            tabBarExtraContent={
              <div className={styles.tabExtra}>
                <Button icon={<FilterOutlined />}>Lọc</Button>
              </div>
            }
          >
            <TabPane
              tab={
                <span>
                  <HistoryOutlined />
                  Tất cả
                </span>
              }
              key="all"
            />
            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined />
                  Đã thanh toán
                </span>
              }
              key="paid"
            />
            <TabPane
              tab={
                <span>
                  <ClockCircleOutlined />
                  Chưa thanh toán
                </span>
              }
              key="unpaid"
            />
            <TabPane
              tab={
                <span>
                  <CloseCircleOutlined />
                  Thất bại
                </span>
              }
              key="failed"
            />
          </Tabs>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
              <Skeleton active avatar paragraph={{ rows: 4 }} />
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
          ) : filteredPayments.length > 0 ? (
            <Table
              dataSource={filteredPayments}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              className={styles.table}
            />
          ) : (
            <Empty
              description="Không tìm thấy lịch sử thanh toán nào"
              className={styles.empty}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {selectedPayment && (
          <Modal
            title={
              <div className={styles.modalTitle}>
                <HistoryOutlined className={styles.modalTitleIcon} />
                Chi tiết thanh toán
              </div>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Đóng
              </Button>,
              selectedPayment.status === "unpaid" && (
                <Button key="pay" type="primary">
                  Thanh toán ngay
                </Button>
              ),
            ]}
            width={700}
            className={styles.detailModal}
          >
            <div className={styles.bookingId}>
              <FileTextOutlined /> Mã thanh toán:{" "}
              <Text strong>{selectedPayment._id}</Text>
            </div>

            <Divider />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card
                  title="Thông tin đặt phòng"
                  bordered={false}
                  className={styles.detailCard}
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="Mã đặt phòng">
                      {selectedPayment.booking_id._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Khách sạn">
                      {selectedPayment.booking_id.hotelName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại phòng">
                      {selectedPayment.booking_id.roomType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày nhận phòng">
                      {formatDate(selectedPayment.booking_id.checkIn)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày trả phòng">
                      {formatDate(selectedPayment.booking_id.checkOut)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Khách hàng">
                      {selectedPayment.booking_id.customerName}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="Thông tin thanh toán"
                  bordered={false}
                  className={styles.detailCard}
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="Phương thức thanh toán">
                      {getPaymentMethodIcon(selectedPayment.method)}{" "}
                      {getPaymentMethodName(selectedPayment.method)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày thanh toán">
                      {formatDate(selectedPayment.payment_date)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {getStatusTag(selectedPayment.status)}
                    </Descriptions.Item>
                  </Descriptions>

                  <Divider />

                  <Row>
                    <Col span={24}>
                      <Statistic
                        title="Tổng tiền"
                        value={selectedPayment.amount}
                        precision={0}
                        formatter={(value) => formatCurrency(value)}
                        className={styles.totalAmount}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Modal>
        )}
      </Content>
    </Layout>
  );
};

export default PaymentHistory;
