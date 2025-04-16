import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Steps,
  Button,
  Descriptions,
  Spin,
  Alert,
  Timeline,
  Space,
  Tag,
  Divider,
  Result,
  Row,
  Col,
  Statistic,
  Empty,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  HistoryOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../static/css/BookingCancelRefund.module.css";
import BookingService from "../../services/BookingService";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Step } = Steps;

const RefundStatus = () => {
  const { refundId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refundData, setRefundData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRefundStatus = async () => {
      try {
        setLoading(true);
        
        // Fetch real refund data
        const response = await BookingService.getRefundStatus(refundId);
        
        if (!response.success) {
          throw new Error(response.message || "Không thể tải thông tin hoàn tiền");
        }
        
        setRefundData(response.data.refund);
        setBookingData(response.data.booking);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching refund data:", error);
        setError("Không thể tải thông tin hoàn tiền. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (refundId) {
      fetchRefundStatus();
    } else {
      setError("Mã hoàn tiền không hợp lệ");
      setLoading(false);
    }
  }, [refundId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("vi-VN", options);
  };

  const getRefundMethodText = (method) => {
    switch (method) {
      case "original":
        return "Hoàn tiền về phương thức thanh toán ban đầu";
      case "wallet":
        return "Hoàn tiền vào ví điện tử";
      case "bank":
        return "Hoàn tiền vào tài khoản ngân hàng";
      default:
        return "Không xác định";
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "pending":
        return (
          <Tag icon={<ClockCircleOutlined />} color="blue">
            Đang chờ xử lý
          </Tag>
        );
      case "processing":
        return (
          <Tag icon={<ExclamationCircleOutlined />} color="orange">
            Đang xử lý
          </Tag>
        );
      case "completed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã hoàn thành
          </Tag>
        );
      case "failed":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Thất bại
          </Tag>
        );
      default:
        return (
          <Tag icon={<ClockCircleOutlined />} color="default">
            Không xác định
          </Tag>
        );
    }
  };

  const getRefundMethodIcon = (method) => {
    switch (method) {
      case "original":
        return <DollarOutlined />;
      case "wallet":
        return <DollarOutlined />;
      case "bank":
        return <BankOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "completed":
        return 2;
      case "failed":
        return 3;
      default:
        return 0;
    }
  };

  const renderBookingInfo = () => {
    if (!bookingData) return null;

    return (
      <Card
        title={
          <Space>
            <FileTextOutlined />
            Chi tiết đặt phòng đã hủy
          </Space>
        }
        className={styles["booking-cancel-card"]}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <img
              src={bookingData.hotel_image}
              alt={bookingData.hotel_name}
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} md={16}>
            <Title level={4}>{bookingData.hotel_name}</Title>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <HomeOutlined /> {bookingData.hotel_address}
              </Text>
              <Text strong>
                <CalendarOutlined /> Check-in: {formatDate(bookingData.check_in)}
              </Text>
              <Text strong>
                <CalendarOutlined /> Check-out:{" "}
                {formatDate(bookingData.check_out)}
              </Text>
              <Text>
                <UserOutlined /> {bookingData.guests} khách •{" "}
                {bookingData.room_type}
              </Text>
              <Tag color="blue">Mã đặt phòng: {bookingData.id}</Tag>
              <Divider style={{ margin: "12px 0" }} />
              <Text>
                <ClockCircleOutlined /> Ngày hủy:{" "}
                {formatDateTime(bookingData.cancellation_date)}
              </Text>
              <Text>
                <FileTextOutlined /> Lý do hủy: {bookingData.cancellation_reason}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderRefundStatus = () => {
    if (!refundData) return null;

    return (
      <Card
        title={
          <Space>
            <DollarOutlined />
            Trạng thái hoàn tiền
          </Space>
        }
        className={styles["booking-cancel-card"]}
      >
        <Steps
          current={getStatusStep(refundData.status)}
          status={
            refundData.status === "failed" ? "error" : "process"
          }
          style={{ marginBottom: 32 }}
        >
          <Step
            title="Đã nhận yêu cầu"
            description="Đang chờ xử lý"
            icon={<ClockCircleOutlined />}
          />
          <Step
            title="Đang xử lý"
            description="Đang hoàn tiền"
            icon={<ExclamationCircleOutlined />}
          />
          <Step
            title="Hoàn thành"
            description="Đã hoàn tiền"
            icon={<CheckCircleOutlined />}
          />
          <Step
            title="Thất bại"
            description="Có lỗi xảy ra"
            icon={<CloseCircleOutlined />}
            status={refundData.status === "failed" ? "error" : "wait"}
          />
        </Steps>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Statistic
              title="Số tiền hoàn trả"
              value={refundData.amount}
              precision={0}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
            />
            <Text type="secondary">
              ({refundData.refund_percentage}% tổng số tiền đã thanh toán)
            </Text>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Phương thức hoàn tiền</Title>
            <Space>
              {getRefundMethodIcon(refundData.refund_method)}
              {getRefundMethodText(refundData.refund_method)}
            </Space>

            {refundData.refund_method === "bank" && refundData.payment_details && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Thông tin tài khoản</Title>
                <ul style={{ paddingLeft: 20 }}>
                  <li>
                    Ngân hàng: {refundData.payment_details.bank_name}
                  </li>
                  <li>
                    Số tài khoản: {refundData.payment_details.account_number}
                  </li>
                  <li>
                    Chủ tài khoản: {refundData.payment_details.account_holder}
                  </li>
                </ul>
              </div>
            )}
          </Col>
        </Row>

        <Divider />

        <Title level={5}>Trạng thái hiện tại: {getStatusTag(refundData.status)}</Title>
        
        {refundData.notes && (
          <Alert
            message="Ghi chú"
            description={refundData.notes}
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
          />
        )}

        <Divider orientation="left">Tiến trình xử lý</Divider>

        {refundData.timeline && refundData.timeline.length > 0 ? (
          <Timeline mode="left">
            {refundData.timeline.map((item, index) => (
              <Timeline.Item
                key={index}
                color={
                  item.status === "pending"
                    ? "blue"
                    : item.status === "processing"
                    ? "orange"
                    : item.status === "completed"
                    ? "green"
                    : "red"
                }
                label={formatDateTime(item.date)}
              >
                {item.description}
              </Timeline.Item>
            ))}
            {refundData.status !== "completed" && refundData.status !== "failed" && (
              <Timeline.Item
                color="gray"
                label={formatDate(refundData.estimated_completion)}
                pending
              >
                Dự kiến hoàn tất {formatDate(refundData.estimated_completion)}
              </Timeline.Item>
            )}
          </Timeline>
        ) : (
          <Empty description="Không có dữ liệu tiến trình" />
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <Layout>
        <Content className={styles["site-layout-content"]}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
              flexDirection: "column",
            }}
          >
            <Spin size="large" />
            <Text style={{ marginTop: 16 }}>
              Đang tải thông tin hoàn tiền...
            </Text>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Content className={styles["site-layout-content"]}>
          <Result
            status="error"
            title="Không thể tải thông tin"
            subTitle={error}
            extra={[
              <Button
                type="primary"
                key="back"
                onClick={() => navigate("/booking-history")}
              >
                Quay lại lịch sử đặt phòng
              </Button>,
            ]}
          />
        </Content>
      </Layout>
    );
  }

  // For failed refunds
  if (refundData && refundData.status === "failed") {
    return (
      <Layout>
        <Content className={styles["site-layout-content"]}>
          <div className={styles.pageHeader}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/booking-history")}
              style={{ marginBottom: 16 }}
            >
              Quay lại lịch sử đặt phòng
            </Button>
            <Title level={2}>Trạng thái hoàn tiền</Title>
          </div>

          <Result
            status="error"
            title="Hoàn tiền thất bại"
            subTitle="Chúng tôi gặp vấn đề khi xử lý yêu cầu hoàn tiền của bạn. Vui lòng liên hệ bộ phận hỗ trợ để được giúp đỡ."
            extra={[
              <Button type="primary" key="support">
                Liên hệ hỗ trợ
              </Button>,
              <Button
                key="history"
                onClick={() => navigate("/booking-history")}
              >
                Quay lại lịch sử đặt phòng
              </Button>,
            ]}
          />

          {renderRefundStatus()}
          {renderBookingInfo()}
        </Content>
      </Layout>
    );
  }

  // For completed refunds
  if (refundData && refundData.status === "completed") {
    return (
      <Layout>
        <Content className={styles["site-layout-content"]}>
          <div className={styles.pageHeader}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/booking-history")}
              style={{ marginBottom: 16 }}
            >
              Quay lại lịch sử đặt phòng
            </Button>
            <Title level={2}>Trạng thái hoàn tiền</Title>
          </div>

          <Result
            status="success"
            title="Hoàn tiền thành công!"
            subTitle={`Số tiền ${formatCurrency(refundData.amount)} đã được hoàn trả thành công thông qua ${getRefundMethodText(refundData.refund_method).toLowerCase()}.`}
            extra={[
              <Button
                type="primary"
                key="history"
                onClick={() => navigate("/booking-history")}
              >
                Quay lại lịch sử đặt phòng
              </Button>,
            ]}
          />

          {renderRefundStatus()}
          {renderBookingInfo()}
        </Content>
      </Layout>
    );
  }

  // For pending & processing refunds
  return (
    <Layout>
      <Content className={styles["site-layout-content"]}>
        <div className={styles.pageHeader}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/booking-history")}
            style={{ marginBottom: 16 }}
          >
            Quay lại lịch sử đặt phòng
          </Button>
          <Title level={2}>Trạng thái hoàn tiền</Title>
        </div>

        {renderRefundStatus()}
        {renderBookingInfo()}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Button
            type="primary"
            onClick={() => navigate("/booking-history")}
          >
            Quay lại lịch sử đặt phòng
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default RefundStatus; 
