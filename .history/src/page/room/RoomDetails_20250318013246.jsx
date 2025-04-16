import {
  Button,
  DatePicker,
  message,
  Slider,
  Space,
  Tabs,
  Tag,
  Spin,
  Checkbox,
} from "antd";
import {
  AppstoreOutlined,
  CarOutlined,
  CheckOutlined,
  HomeOutlined,
  StarOutlined,
  UserOutlined,
  WifiOutlined,
  ShoppingCartOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import styles from "../../static/css/RoomDetails.module.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Disabled from "../../components/DetailItems/Disabled";
import FeesAndPolicy from "../../components/DetailItems/FeesAndPolicy";
import ModalDetails from "../../components/DetailItems/ModalDetails";
import OverView from "../../components/DetailItems/OverView";
import { getRoomById } from "../../services/RoomService";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs với plugin isSameOrBefore
dayjs.extend(isSameOrBefore);

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const roomId = "67d5a06360523dae096a6bbc";
  const [room, setRoom] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [totalNights, setTotalNights] = useState(1);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const BREAKFAST_PRICE = 200000; // 200.000 VNĐ
  const overviewRef = useRef(null);
  const policyRef = useRef(null);
  const disabledRef = useRef(null);
  const roomRef = useRef(null);
  const informationRef = useRef(null);

  const handleScrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onChange = (key) => {
    switch (key) {
      case "1":
        handleScrollTo(overviewRef);
        break;
      case "2":
        handleScrollTo(informationRef);
        break;
      case "3":
        handleScrollTo(roomRef);
        break;
      case "4":
        handleScrollTo(disabledRef);
        break;
      case "5":
        handleScrollTo(policyRef);
        break;
      default:
        handleScrollTo(overviewRef);
    }
    console.log(key);
  };

  // Hàm xử lý khi ngày checkin thay đổi
  const onCheckinChange = (date) => {
    setCheckinDate(date);
    // Nếu đã có ngày checkout và ngày checkout <= ngày checkin mới
    if (checkoutDate && date && checkoutDate.isSameOrBefore(date)) {
      // Tự động cập nhật ngày checkout thành ngày sau ngày checkin
      setCheckoutDate(date.add(1, "day"));
    }
    // Cập nhật số đêm
    updateTotalNights(date, checkoutDate);
  };

  // Hàm xử lý khi ngày checkout thay đổi
  const onCheckoutChange = (date) => {
    setCheckoutDate(date);
    // Cập nhật số đêm
    updateTotalNights(checkinDate, date);
  };

  // Hàm tính số đêm giữa hai ngày
  const updateTotalNights = (startDate, endDate) => {
    if (startDate && endDate) {
      const nights = endDate.diff(startDate, "day");
      setTotalNights(nights > 0 ? nights : 1);
    } else {
      setTotalNights(1);
    }
  };

  // Hàm vô hiệu hóa ngày trong quá khứ cho ngày checkin
  const disabledCheckinDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < dayjs().startOf("day");
  };

  // Hàm vô hiệu hóa ngày không hợp lệ cho ngày checkout
  const disabledCheckoutDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    if (current && current < dayjs().startOf("day")) {
      return true;
    }

    // Không cho phép chọn ngày trước hoặc bằng ngày checkin
    return checkinDate && current && current.isSameOrBefore(checkinDate, "day");
  };

  const items = [
    {
      key: "1",
      label: <h4>Tổng quan</h4>,
      // children: "Content of Tab Pane 1",
    },
    {
      key: "2",
      label: <h4>Thông tin</h4>,
      // children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: <h4>Phòng</h4>,
      // children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: <h4>Hỗ trợ người khuyết tật</h4>,
      // children: "Content of Tab Pane 3",
    },
    {
      key: "5",
      label: <h4>Chính sách</h4>,
      // children: "Content of Tab Pane 3",
    },
  ];

  // Tạo marks dựa trên giá phòng từ API
  const getMarks = (price) => {
    if (!price)
      return {
        0: "0 đ",
        20: "2.984.127 đ",
        50: "5.680.541 đ",
        80: "8.520.812 đ",
        100: "",
      };

    const basePrice = price;
    return {
      0: "0 đ",
      20: `${formatPrice(basePrice * 0.8)} đ`,
      50: `${formatPrice(basePrice)} đ`,
      80: `${formatPrice(basePrice * 1.2)} đ`,
      100: "",
    };
  };

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Tính tổng giá dựa trên số đêm và tùy chọn bữa sáng
  const calculateTotalPrice = (price) => {
    if (!price) return 0;
    let total = price * totalNights;
    if (includeBreakfast) {
      total += BREAKFAST_PRICE * totalNights;
    }
    return total;
  };

  // Xử lý khi thay đổi tùy chọn bữa sáng
  const handleBreakfastChange = (e) => {
    setIncludeBreakfast(e.target.checked);
  };

  // Load room details information
  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await getRoomById(id);
        console.log("response", response);
        setRoom(response);
      } catch (error) {
        console.log(error);
        message.error("Không thể lấy thông tin phòng");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoom();
  }, [id]);

  const hanleViewDetail = () => {
    setIsModal(!isModal);
  };

  // Xử lý khi nhấn nút đặt phòng
  const handleBooking = () => {
    if (!checkinDate || !checkoutDate) {
      message.warning("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    // Lưu thông tin đặt phòng vào localStorage hoặc state global
    const bookingInfo = {
      roomId: room._id,
      roomNumber: room.room_number,
      roomType: room.type,
      check_in: checkinDate.format("YYYY-MM-DD"),
      check_out: checkoutDate.format("YYYY-MM-DD"),
      nights: totalNights,
      breakfast: includeBreakfast ? true : false,
      price: room.price,
      total_price: calculateTotalPrice(room.price),
    };

    // Chuyển đến trang checkout với dữ liệu bookingInfo
    navigate("/checkout", { state: { bookingInfo } });
  };

  // Lấy marks dựa trên giá phòng
  const marks = room ? getMarks(room.price) : getMarks();

  return (
    <div className={styles.container}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Spin size="large" tip="Đang tải thông tin phòng..." />
        </div>
      ) : (
        <>
          {/* gallery image */}
          <div className={styles.gallery}>
            <img
              alt="image"
              src={
                room?.images
                  ? room.images[0]
                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHx8MHx8fDA%3D"
              }
              className={styles.image1}
            />
            <img
              alt="image"
              src={
                room?.images
                  ? room.images[1]
                  : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG90ZWx8ZW58MHx8MHx8fDA%3D"
              }
              className={styles.image2}
            />
            <img
              alt="image"
              src={
                room?.images
                  ? room.images[2]
                  : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D"
              }
              className={styles.image3}
            />
            <img
              alt="image"
              src={
                room?.images
                  ? room.images[3]
                  : "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsfGVufDB8fDB8fHww"
              }
              className={styles.image4}
            />
            <img
              alt="image"
              src={
                room?.images
                  ? room.images[4]
                  : "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHww"
              }
              className={styles.image5}
            />
          </div>

          {/* tab */}
          <div className={styles.tab}>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>

          {/* Booking */}
          <div className={styles.content} ref={informationRef}>
            {/* Description about hotel */}
            <div className={styles.description}>
              <h2 className={styles.name}>
                {room
                  ? `Phòng ${room.room_number} - ${
                      room.type.charAt(0).toUpperCase() + room.type.slice(1)
                    }`
                  : "Đang tải..."}
              </h2>
              <div className={styles.starContainer}>
                <StarOutlined />
                <StarOutlined />
                <StarOutlined />
                <StarOutlined />
                <StarOutlined />
              </div>

              <div className={styles.check}>
                <div className={styles.checkItem}>
                  <CheckOutlined className={styles.star} />
                  <p className={styles.checkTitle}>Hoàn tiền toàn bộ</p>
                </div>
                <div className={styles.checkItem}>
                  <CheckOutlined className={styles.star} />
                  <p className={styles.checkTitle}>Đặt ngay, thanh toán sau</p>
                </div>
              </div>

              {/* point */}
              <div className={styles.pointContainer}>
                <p className={styles.point}>8,8</p>
                <h3 className={styles.pointTitle}>Xuất sắc</h3>
              </div>

              {/* Information about this place */}
              <div className={styles.resortContainer}>
                <h2 className={styles.resortTitle}>Thông tin về phòng</h2>
                <p className={styles.resortDescription}>
                  {room ? room.description : "Đang tải thông tin phòng..."}
                </p>
                <div style={{ marginTop: "15px" }}>
                  <h3>Tiện nghi:</h3>
                  {room && room.facility_id && room.facility_id.length > 0 ? (
                    <ul className={styles.resortFeatures}>
                      {room.facility_id.map((facility) => (
                        <li key={facility._id}>
                          ✅ {facility.name} - {facility.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có thông tin về tiện nghi</p>
                  )}
                </div>

                <div style={{ marginTop: "15px" }}>
                  <h3>Thông tin thêm:</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    <Tag color="blue">Phòng {room?.type || "Đang tải..."}</Tag>
                    <Tag color="green">
                      Sức chứa: {room?.capacity || "?"} người
                    </Tag>
                    <Tag color="orange">
                      Trạng thái:{" "}
                      {room?.status === "available" ? "Còn trống" : "Đã đặt"}
                    </Tag>
                    <Tag color="purple">
                      Giá: {room ? formatPrice(room.price) : "?"} đ/đêm
                    </Tag>
                  </div>
                </div>
              </div>
            </div>
            {/* map */}
            <div className={styles.containerMap}>
              <h2 className={styles.titleMap}>Khám phá khu vực</h2>
              <div className={styles.cardMap}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.498351738144!2d105.52350832503093!3d21.012736680632578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2sFPT%20University!5e0!3m2!1sen!2s!4v1740818921172!5m2!1sen!2s"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "10px" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                <div className={styles.infoMap}>
                  <p>Bắc Bán đảo Cam Ranh, Nha Trang, Cam Lâm, Khánh Hòa</p>
                  <a
                    href="https://maps.app.goo.gl/N6USmDVRsBkocHNQ8"
                    className={styles.linkMap}
                  >
                    Xem trong bản đồ
                  </a>
                </div>
              </div>

              <ul className={styles.roomFeatures}>
                <li className={styles.greenText}>
                  <CarOutlined /> Bãi đậu xe tự phục vụ miễn phí
                </li>
                <li style={{ color: "#3a3a3a" }}>
                  <WifiOutlined /> Wifi miễn phí
                </li>
                <li style={{ color: "#3a3a3a" }}>
                  <AppstoreOutlined /> 35 mét vuông
                </li>
                <li style={{ color: "#3a3a3a" }}>
                  <UserOutlined /> {room?.capacity || "?"} khách
                </li>
                <li style={{ color: "#3a3a3a" }}>
                  <CheckOutlined /> Đặt ngay, thanh toán sau
                </li>
                <li style={{ color: "#3a3a3a" }}>
                  <HomeOutlined /> 1 giường cỡ king
                </li>
                <li style={{ color: "#3a3a3a" }}>
                  <AppstoreOutlined /> Quang cảnh biển
                </li>
              </ul>
            </div>
          </div>

          {/* View detail room */}
          <Button
            color="purple"
            variant="outlined"
            onClick={() => hanleViewDetail()}
          >
            View Detail
          </Button>

          {/* Detail date checkin-checkout */}
          <div className={styles.roomSelection} ref={roomRef}>
            <h2 className={styles.header}>Chọn phòng</h2>

            {/* Date selection */}
            <div className={styles.dateSelection}>
              <div className={styles.pickPerson}>
                <Space direction="vertical">
                  <DatePicker
                    onChange={onCheckinChange}
                    disabledDate={disabledCheckinDate}
                    placeholder="Chọn ngày nhận phòng"
                    value={checkinDate}
                    format="DD/MM/YYYY"
                  />
                </Space>
                <h4 className={styles.customerTitle}>Checkin</h4>
              </div>

              <div className={styles.pickPerson}>
                <Space direction="vertical">
                  <DatePicker
                    onChange={onCheckoutChange}
                    disabledDate={disabledCheckoutDate}
                    placeholder="Chọn ngày trả phòng"
                    value={checkoutDate}
                    format="DD/MM/YYYY"
                    disabled={!checkinDate}
                  />
                </Space>
                <h4 className={styles.customerTitle}>Checkout</h4>
              </div>

              <div className={styles.pickPerson}>
                <UserOutlined />
                <div className={styles.customer}>
                  <h4 className={styles.customerTitle}>Khách</h4>
                  <p className={styles.customerNumber}>
                    {room?.capacity || 2} khách, 1 phòng
                  </p>
                </div>
              </div>
            </div>

            {/* Breakfast option - only show when dates are selected */}
            {checkinDate && checkoutDate && (
              <div className={styles.breakfastOption}>
                <Checkbox
                  onChange={handleBreakfastChange}
                  checked={includeBreakfast}
                  className={styles.breakfastCheckbox}
                >
                  <div className={styles.breakfastLabel}>
                    <CoffeeOutlined className={styles.breakfastIcon} />
                    <span>Thêm bữa sáng</span>
                    <span className={styles.breakfastPrice}>
                      {formatPrice(BREAKFAST_PRICE)} đ/người/đêm
                    </span>
                  </div>
                </Checkbox>
                <div className={styles.breakfastDescription}>
                  Bữa sáng buffet đầy đủ với nhiều món ăn đa dạng, phục vụ từ
                  6:00 - 10:00
                </div>
              </div>
            )}

            {/* Price info */}
            <div className={styles.price}>
              <div className={styles.priceInfo}>
                <div className={styles.priceHeader}>
                  {room?.status === "available"
                    ? "Phòng còn trống"
                    : "Phòng đã được đặt"}
                </div>
                <div className={styles.priceDetails}>
                  <div>
                    Giá mỗi đêm:{" "}
                    <strong>{room ? formatPrice(room.price) : "?"} đ</strong>
                  </div>
                  {includeBreakfast && (
                    <div>
                      Bữa sáng ({totalNights} đêm):{" "}
                      <strong>
                        {formatPrice(BREAKFAST_PRICE * totalNights)} đ
                      </strong>
                    </div>
                  )}
                  {totalNights > 1 && (
                    <div>
                      Tổng ({totalNights} đêm):{" "}
                      <strong>
                        {room
                          ? formatPrice(calculateTotalPrice(room.price))
                          : "?"}{" "}
                        đ
                      </strong>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    (chưa bao gồm thuế và phí)
                  </div>
                </div>
              </div>
              {/* Price Slider */}
              <div className={styles.priceSlider}>
                <Slider
                  marks={marks}
                  defaultValue={50}
                  tooltip={{
                    open: true,
                    formatter: (value) => marks[value] || `${value} đ`,
                  }}
                />
              </div>

              {/* Checkout Button */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleBooking}
                  style={{
                    width: "100%",
                    height: "50px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    background: "#1890ff",
                    borderRadius: "8px",
                  }}
                  disabled={
                    room?.status !== "available" ||
                    !checkinDate ||
                    !checkoutDate
                  }
                >
                  {room?.status === "available"
                    ? "Tiến hành đặt phòng"
                    : "Phòng đã được đặt"}
                </Button>
                {(!checkinDate || !checkoutDate) &&
                  room?.status === "available" && (
                    <div
                      style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Vui lòng chọn ngày nhận phòng và trả phòng
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div ref={overviewRef}>
            <OverView />
          </div>

          {/* disabled */}
          <div ref={disabledRef}>
            <Disabled />
          </div>

          {/* Fees & Policies */}
          <div ref={policyRef}>
            <FeesAndPolicy />
          </div>

          {isModal && (
            <div
              className={styles.modalOverlay}
              onClick={() => setIsModal(false)}
            >
              <ModalDetails room={room} onClose={() => setIsModal(false)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomDetails;
