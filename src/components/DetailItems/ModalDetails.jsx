import {
  AppstoreOutlined,
  CarOutlined,
  CheckOutlined,
  CloseOutlined,
  HomeOutlined,
  UserOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import styles from "../../static/css/modalDetail.module.css";
import { Button, Tooltip, Tag, Empty } from "antd";

const ModalDetails = ({ room, onClose }) => {
  // const [selectedOption, setSelectedOption] = useState("buffet");

  // Ngăn sự kiện click lan truyền lên phần tử cha
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Xử lý đóng modal khi click vào nút X
  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  // Danh sách tính năng phòng
  const features = [
    { icon: <CheckOutlined />, text: "Ban công hoặc sân hiên" },
    { icon: <i className="fas fa-headphones"></i>, text: "Phòng cách âm" },
    { icon: <i className="fas fa-snowflake"></i>, text: "Máy điều hòa" },
    {
      icon: <i className="fas fa-bed"></i>,
      text: "Nôi/cũi/giường cho trẻ sơ sinh miễn phí",
    },
    { icon: <CheckOutlined />, text: "Menu gối" },
    { icon: <i className="fas fa-hot-tub"></i>, text: "Áo choàng tắm" },
  ];

  // Danh sách tiện nghi phòng
  const amenities = [
    {
      category: "Phòng tắm",
      icon: "fas fa-shower",
      items: [
        "Áo choàng tắm",
        "Đồ dùng nhà tắm miễn phí",
        "Máy sấy tóc",
        "Phòng tắm riêng",
        "Vòi sen phun mưa (cố định)",
        "Buồng tắm vòi sen",
        "Dép đi trong nhà",
        "Khăn tắm",
      ],
    },
    {
      category: "Phòng ngủ",
      icon: "fas fa-bed",
      items: [
        "Máy điều hòa nhiệt độ",
        "Không có bộ trải giường",
        "Nôi/giường cho trẻ sơ sinh miễn phí",
        "Danh sách gối cho khách chọn lựa",
        "Giường gấp/giường phụ",
      ],
    },
    {
      category: "Giải trí",
      icon: <CheckOutlined />,
      items: [
        "Truyền hình cáp",
        "TV LCD",
        "Các kênh phim phải trả tiền",
        "Truyền hình cao cấp",
      ],
    },
    {
      category: "Ăn uống",
      icon: "fas fa-utensils",
      items: [
        "Dịch vụ phòng 24 giờ",
        "Dụng cụ pha cà phê/trà",
        "Ấm điện",
        "Nước đóng chai miễn phí",
        "Minibar",
        "Tủ lạnh",
        "Bếp nấu",
      ],
    },
    {
      category: "Internet",
      icon: "fas fa-wifi",
      items: ["Wifi miễn phí"],
    },
    {
      category: "Khác",
      icon: <CheckOutlined />,
      items: [
        "Dịch vụ dọn phòng hàng ngày",
        "Bàn",
        "Bàn ủi/dụng cụ ủi quần áo (theo yêu cầu)",
        "Điện thoại",
        "Két an toàn",
        "Phòng cách âm",
        "Dịch vụ dọn phòng buổi tối",
        "Quang cảnh - biển",
      ],
    },
    {
      category: "Không gian ngoài trời",
      icon: "fas fa-house-chimney-window",
      items: ["Ban công hoặc hiên"],
    },
  ];

  // Nếu không có dữ liệu phòng
  if (!room) {
    return (
      <div className={styles.container} onClick={handleModalContentClick}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            height: "640px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Empty description="Không có thông tin phòng" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} onClick={handleModalContentClick}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          height: "640px",
          overflowY: "scroll",
        }}
      >
        <div className={styles.modal}>
          <div className={styles.infor}>
            <Tooltip title="Đóng">
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={handleCloseClick}
              />
            </Tooltip>
            <h4 className={styles.inforTitle}>Thông tin phòng</h4>
          </div>
          {/* Image */}
          <div className={styles.modalImg}>
            <img
              alt="image"
              src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsfGVufDB8fDB8fHww"
            />
          </div>

          {/* Feature */}
          <div>
            <h2 className={styles.roomTitle}>
              Phòng {room.room_number} -{" "}
              {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
            </h2>
            <div style={{ marginBottom: "15px" }}>
              <Tag color="blue">Loại: {room.type}</Tag>
              <Tag color="green">Sức chứa: {room.capacity} người</Tag>
              <Tag color="orange">
                Trạng thái:{" "}
                {room.status === "available" ? "Còn trống" : "Đã đặt"}
              </Tag>
            </div>
            <p className={styles.roomSubtitle}>{room.description}</p>

            {/* Hiển thị tiện nghi từ API */}
            {room.facility_id && room.facility_id.length > 0 && (
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <h3>Tiện nghi: </h3>
                <div className={styles.roomFeaturesContainer}>
                  <div className={styles.featuresGrid}>
                    {room.facility_id.map((facility) => (
                      <div key={facility._id} className={styles.featureItem}>
                        <CheckOutlined />
                        <span>{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className={styles.roomFeaturesContainer}>
              <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    {feature.icon}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Room feature */}
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
              <UserOutlined /> {room.capacity} khách
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

          {/* Room amenities */}
          <div className={styles.amenitiesContainer}>
            <h2 className={styles.title}>Tiện nghi phòng</h2>
            <div className={styles.amenitiesGrid}>
              {amenities.map((section, index) => (
                <div key={index} className={styles.amenitySection}>
                  <div className={styles.sectionHeader}>
                    {typeof section.icon === "string" ? (
                      <i className={section.icon}></i>
                    ) : (
                      section.icon
                    )}
                    <p style={{ fontWeight: "bold", fontSize: "15px" }}>
                      {section.category}
                    </p>
                  </div>
                  <ul>
                    {section.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Room selection */}
          {/* <div className={styles.roomSelection}>
            <h2 className={styles.title}>Tùy chọn phòng</h2>

            <div className={styles.section}>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  margin: "2px 0",
                }}
              >
                Bổ sung
              </p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Radio.Group
                  onChange={(e) => setSelectedOption(e.target.value)}
                  value={selectedOption}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Radio value="buffet">
                    <span className={styles.optionTitle}>Bữa sáng buffet</span>
                  </Radio>
                  <Radio value="combo">
                    <span className={styles.optionTitle}>
                      Trọn gói (thức ăn/nước uống/đồ ăn nhẹ)
                    </span>
                  </Radio>
                </Radio.Group>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <span className={styles.price}>+ 0 đ</span>
                  <span className={styles.price}>
                    + {formatPrice(room.price * 0.2)} đ
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.refundPolicy}>
              <div>
                <span className={styles.greenTextP}>Hoàn tiền toàn bộ</span>
                <Tooltip title="Bạn có thể hủy miễn phí trước ngày 01/03">
                  <InfoCircleOutlined className={styles.infoIcon} />
                </Tooltip>
                <p className={styles.refundDate}>Trước T7, 01/03</p>
              </div>
            </div>

            <div className={styles.priceSection}>
              <Badge count="Giảm 20%" color="#e61e43" />
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <p className={styles.oldPrice}>{formatPrice(room.price)} đ</p>
                <p className={styles.newPrice}>
                  {formatPrice(getDiscountedPrice(room.price))} đ
                </p>
              </div>
              <p className={styles.totalPrice}>
                Tổng{" "}
                {formatPrice(getTotalPrice(getDiscountedPrice(room.price)))} đ
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p className={styles.numberRoom}>
                  {room.status === "available" ? "Còn phòng" : "Hết phòng"}
                </p>
                <p className={styles.totalPrice}>bao gồm thuế & phí</p>
              </div>
            </div>

            <Button
              type="primary"
              className={styles.bookButton}
              disabled={room.status !== "available"}
            >
              {room.status === "available" ? "Đặt ngay" : "Phòng đã được đặt"}
            </Button>
            <p className={styles.note}>Sẽ chưa thu tiền ngay</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ModalDetails;
