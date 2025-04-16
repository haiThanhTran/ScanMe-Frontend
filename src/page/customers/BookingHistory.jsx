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
  Avatar,
  Row,
  Col,
  Timeline,
  Tabs,
  Rate,
  Badge,
  Image,
  Statistic,
  Input,
} from "antd";
import {
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  CreditCardOutlined,
  PhoneOutlined,
  SearchOutlined,
  StarOutlined,
  HomeOutlined,
  PrinterOutlined,
  FileTextOutlined,
  MailOutlined,
  EyeOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import styles from "../../static/css/BookingHistory.module.css";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const BookingHistory = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for bookings history
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBookings = [
        {
          id: "BK-123456",
          hotelName: "Luxury Palace Hotel & Spa",
          hotelAddress: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
          hotelImage:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
          roomType: "Deluxe Room",
          roomImage:
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
          checkIn: "2023-07-15",
          checkOut: "2023-07-18",
          guests: 2,
          status: "completed",
          totalAmount: 3500000,
          paymentMethod: "Credit Card",
          paymentId: "PAY-123456",
          bookingDate: "2023-07-01",
          rating: 4.5,
          review: "Dịch vụ tuyệt vời, phòng sạch sẽ và nhân viên thân thiện.",
          amenities: [
            "Wifi miễn phí",
            "Điều hòa",
            "Minibar",
            "Bể bơi",
            "Bữa sáng miễn phí",
          ],
          customerName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0912345678",
        },
        {
          id: "BK-234567",
          hotelName: "Grand Riverside Resort",
          hotelAddress: "456 Võ Văn Kiệt, Quận 5, TP. Hồ Chí Minh",
          hotelImage:
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
          roomType: "Premium Suite",
          roomImage:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop",
          checkIn: "2023-08-10",
          checkOut: "2023-08-15",
          guests: 3,
          status: "upcoming",
          totalAmount: 5200000,
          paymentMethod: "Banking Transfer",
          paymentId: "PAY-234567",
          bookingDate: "2023-07-20",
          rating: null,
          review: null,
          amenities: [
            "Wifi miễn phí",
            "Điều hòa",
            "Minibar",
            "Bể bơi",
            "Spa",
            "Gym",
          ],
          customerName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0912345678",
        },
        {
          id: "BK-345678",
          hotelName: "Seaside Paradise Hotel",
          hotelAddress: "789 Trần Phú, Nha Trang, Khánh Hòa",
          hotelImage:
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
          roomType: "Ocean View Room",
          roomImage:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
          checkIn: "2023-06-01",
          checkOut: "2023-06-05",
          guests: 2,
          status: "completed",
          totalAmount: 4800000,
          paymentMethod: "Credit Card",
          paymentId: "PAY-345678",
          bookingDate: "2023-05-15",
          rating: 5,
          review: "Khách sạn tuyệt vời với view biển đẹp, sẽ quay lại lần sau!",
          amenities: [
            "Wifi miễn phí",
            "Điều hòa",
            "Minibar",
            "Bể bơi vô cực",
            "Bữa sáng miễn phí",
            "Bar trên sân thượng",
          ],
          customerName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0912345678",
        },
        {
          id: "BK-456789",
          hotelName: "Mountain View Resort",
          hotelAddress: "101 Hoàng Liên, Sa Pa, Lào Cai",
          hotelImage:
            "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop",
          roomType: "Mountain Suite",
          roomImage:
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop",
          checkIn: "2023-09-20",
          checkOut: "2023-09-25",
          guests: 4,
          status: "upcoming",
          totalAmount: 6300000,
          paymentMethod: "Banking Transfer",
          paymentId: "PAY-456789",
          bookingDate: "2023-08-10",
          rating: null,
          review: null,
          amenities: [
            "Wifi miễn phí",
            "Điều hòa",
            "Minibar",
            "Lò sưởi",
            "Bữa sáng miễn phí",
            "Tour leo núi",
          ],
          customerName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0912345678",
        },
        {
          id: "BK-567890",
          hotelName: "City Central Hotel",
          hotelAddress: "222 Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh",
          hotelImage:
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
          roomType: "Business Room",
          roomImage:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
          checkIn: "2023-05-05",
          checkOut: "2023-05-07",
          guests: 1,
          status: "cancelled",
          totalAmount: 1800000,
          paymentMethod: "Credit Card",
          paymentId: "PAY-567890",
          bookingDate: "2023-04-20",
          rating: null,
          review: null,
          amenities: [
            "Wifi miễn phí",
            "Điều hòa",
            "Minibar",
            "Bàn làm việc",
            "Bữa sáng miễn phí",
          ],
          customerName: "Nguyễn Văn A",
          email: "nguyenvana@example.com",
          phone: "0912345678",
        },
      ];

      setBookings(mockBookings);
      setLoading(false);
    }, 1500);
  }, []);

  const showModal = (booking) => {
    setSelectedBooking(booking);
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
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "completed":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã hoàn thành
          </Tag>
        );
      case "upcoming":
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Sắp tới
          </Tag>
        );
      case "cancelled":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Đã hủy
          </Tag>
        );
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.hotelName.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.roomType.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchText.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return booking.status === activeTab && matchesSearch;
  });

  const columns = [
    {
      title: "Khách sạn",
      dataIndex: "hotelName",
      key: "hotelName",
      render: (text, record) => (
        <div className={styles.hotelCell}>
          <Avatar
            src={record.hotelImage}
            size={64}
            shape="square"
            className={styles.hotelAvatar}
          />
          <div className={styles.hotelInfo}>
            <Text strong>{text}</Text>
            <div className={styles.hotelMeta}>
              <Text type="secondary">
                <EnvironmentOutlined /> {record.hotelAddress}
              </Text>
            </div>
            <div>
              <Text type="secondary">
                <HomeOutlined /> {record.roomType}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "checkIn",
      key: "checkIn",
      render: (text, record) => (
        <div className={styles.dateInfo}>
          <div>
            <CalendarOutlined /> Check-in: {formatDate(record.checkIn)}
          </div>
          <div>
            <CalendarOutlined /> Check-out: {formatDate(record.checkOut)}
          </div>
          <div>
            <ClockCircleOutlined />{" "}
            {calculateNights(record.checkIn, record.checkOut)} đêm
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Text strong className={styles.amount}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) =>
        rating ? (
          <Rate disabled defaultValue={rating} allowHalf />
        ) : (
          <Text type="secondary">Chưa đánh giá</Text>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
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
            <Title level={2}>Lịch sử đặt phòng</Title>
          </div>
          <div className={styles.searchSection}>
            <Input
              placeholder="Tìm kiếm theo tên khách sạn, loại phòng, mã đặt phòng..."
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
                <Badge
                  count={bookings.filter((b) => b.status === "upcoming").length}
                  offset={[-5, 5]}
                >
                  <Button icon={<FilterOutlined />}>Lọc</Button>
                </Badge>
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
                  Đã hoàn thành
                </span>
              }
              key="completed"
            />
            <TabPane
              tab={
                <span>
                  <ClockCircleOutlined />
                  Sắp tới
                </span>
              }
              key="upcoming"
            />
            <TabPane
              tab={
                <span>
                  <CloseCircleOutlined />
                  Đã hủy
                </span>
              }
              key="cancelled"
            />
          </Tabs>

          {loading ? (
            <div className={styles.loadingContainer}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
              <Skeleton active avatar paragraph={{ rows: 4 }} />
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </div>
          ) : filteredBookings.length > 0 ? (
            <Table
              dataSource={filteredBookings}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              className={styles.table}
            />
          ) : (
            <Empty
              description="Không tìm thấy lịch sử đặt phòng nào"
              className={styles.empty}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {selectedBooking && (
          <Modal
            title={
              <div className={styles.modalTitle}>
                <HistoryOutlined className={styles.modalTitleIcon} />
                Chi tiết đặt phòng
              </div>
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Đóng
              </Button>,
              selectedBooking.status === "upcoming" && (
                <Button key="cancel" danger>
                  Hủy đặt phòng
                </Button>
              ),
              <Button
                key="print"
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
                In hóa đơn
              </Button>,
              selectedBooking.status === "completed" &&
                !selectedBooking.review && (
                  <Button key="review" type="primary" icon={<StarOutlined />}>
                    Đánh giá
                  </Button>
                ),
            ]}
            width={800}
            className={styles.detailModal}
          >
            <div className={styles.bookingId}>
              <FileTextOutlined /> Mã đặt phòng:{" "}
              <Text strong>{selectedBooking.id}</Text>
            </div>

            <div className={styles.hotelDetailHeader}>
              <Image
                src={selectedBooking.hotelImage}
                alt={selectedBooking.hotelName}
                className={styles.hotelDetailImage}
                width={200}
              />
              <div className={styles.hotelDetailInfo}>
                <Title level={4}>{selectedBooking.hotelName}</Title>
                <Text>
                  <EnvironmentOutlined /> {selectedBooking.hotelAddress}
                </Text>
                <div className={styles.statusContainer}>
                  {getStatusTag(selectedBooking.status)}
                </div>
              </div>
            </div>

            <Divider />

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card
                  title="Thông tin đặt phòng"
                  bordered={false}
                  className={styles.detailCard}
                >
                  <div className={styles.roomImageContainer}>
                    <Image
                      src={selectedBooking.roomImage}
                      alt={selectedBooking.roomType}
                      className={styles.roomDetailImage}
                    />
                    <Badge.Ribbon
                      text={selectedBooking.roomType}
                      color="blue"
                    />
                  </div>

                  <Timeline
                    className={styles.timeline}
                    items={[
                      {
                        color: "green",
                        children: (
                          <>
                            <Text strong>Check-in:</Text>{" "}
                            {formatDate(selectedBooking.checkIn)}
                          </>
                        ),
                        dot: <CalendarOutlined />,
                      },
                      {
                        color: "red",
                        children: (
                          <>
                            <Text strong>Check-out:</Text>{" "}
                            {formatDate(selectedBooking.checkOut)}
                          </>
                        ),
                        dot: <CalendarOutlined />,
                      },
                    ]}
                  />

                  <Row gutter={16} className={styles.statsRow}>
                    <Col span={12}>
                      <Statistic
                        title="Số đêm"
                        value={calculateNights(
                          selectedBooking.checkIn,
                          selectedBooking.checkOut
                        )}
                        suffix="đêm"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Số khách"
                        value={selectedBooking.guests}
                        suffix="người"
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <div className={styles.amenitiesSection}>
                    <Text strong>Tiện nghi phòng:</Text>
                    <div className={styles.amenitiesTags}>
                      {selectedBooking.amenities.map((amenity, index) => (
                        <Tag key={index} color="blue">
                          {amenity}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="Thông tin khách hàng"
                  bordered={false}
                  className={styles.detailCard}
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="Họ tên">
                      <UserOutlined /> {selectedBooking.customerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <MailOutlined /> {selectedBooking.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      <PhoneOutlined /> {selectedBooking.phone}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card
                  title="Thông tin thanh toán"
                  bordered={false}
                  className={styles.detailCard}
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="Phương thức thanh toán">
                      <CreditCardOutlined /> {selectedBooking.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã thanh toán">
                      {selectedBooking.paymentId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt phòng">
                      {formatDate(selectedBooking.bookingDate)}
                    </Descriptions.Item>
                  </Descriptions>

                  <div className={styles.totalAmount}>
                    <Text>Tổng tiền:</Text>
                    <Text strong className={styles.amountValue}>
                      {formatCurrency(selectedBooking.totalAmount)}
                    </Text>
                  </div>
                </Card>

                {selectedBooking.review && (
                  <Card
                    title="Đánh giá của bạn"
                    bordered={false}
                    className={styles.detailCard}
                  >
                    <Rate
                      disabled
                      defaultValue={selectedBooking.rating}
                      allowHalf
                    />
                    <Paragraph className={styles.reviewText}>
                      {selectedBooking.review}
                    </Paragraph>
                  </Card>
                )}
              </Col>
            </Row>
          </Modal>
        )}
      </Content>
    </Layout>
  );
};

export default BookingHistory;
