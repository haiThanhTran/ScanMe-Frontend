import { CarOutlined, CheckOutlined, WifiOutlined } from "@ant-design/icons";
import styles from "../../static/css/overview.module.css";

const OverView = () => {
  return (
    <div className={styles.overview}>
      <h1>Tổng quan</h1>
      <div>
        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined style={{ fontSize: "16px" }} />
            <h3 className={styles.overviewHeaderTitle}>Quy mô khách sạn</h3>
          </div>
          <ul>
            <li>242 khu phòng</li>
            <li>Gồm 10 tầng</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>Nhận phòng/Trả phòng</h3>
          </div>
          <ul>
            <li>
              Bắt đầu nhận phòng: 15:00, kết thúc nhận phòng: mọi thời điểm
            </li>
            <li>Tuổi tối thiểu để nhận phòng: 18</li>
            <li>Giờ trả phòng là 12:00</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>
              Hướng dẫn nhận phòng đặc biệt
            </h3>
          </div>
          <ul>
            <li>
              Nơi lưu trú này cung cấp dịch vụ đón khách từ sân bay. Để sử dụng
              dịch vụ, khách phải liên hệ nơi lưu trú qua thông tin liên hệ được
              cung cấp trong xác nhận đặt phòng 48 giờ trước khi đến
            </li>
            <li>Nhân viên tiếp tân sẽ đón tiếp khi khách đến nơi lưu trú</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>
              Cần cung cấp khi nhận phòng
            </h3>
          </div>
          <ul>
            <li>
              Cần đặt cọc chi phí phát sinh bằng thẻ tín dụng, ghi nợ hoặc tiền
              mặt
            </li>
            <li>Có thể cần giấy tờ tùy thân (ID) có ảnh hợp lệ</li>
            <li>Tuổi nhận phòng tối thiểu là 18</li>
          </ul>
        </div>
      </div>

      {/* right */}
      <div>
        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>Trẻ em</h3>
          </div>
          <ul>
            <li>Trông trẻ*</li>
            <li>Chăm sóc trẻ có người giám sát*</li>
            <li>Câu lạc bộ trẻ em miễn phí</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>Vật nuôi</h3>
          </div>
          <ul>
            <li>
              Không được mang theo thú cưng lẫn vật nuôi hỗ trợ người khuyết tật
            </li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <WifiOutlined />
            <h3 className={styles.overviewHeaderTitle}>Internet</h3>
          </div>
          <ul>
            <li>Wifi miễn phí tại các khu vực chung</li>
            <li>Wifi miễn phí tại phòng</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CarOutlined />
            <h3 className={styles.overviewHeaderTitle}>Bãi đậu xe</h3>
          </div>
          <ul>
            <li>Có bãi đậu xe tự phục vụ miễn phí trong khuôn viên</li>
            <li>Có bãi đậu xe có người phục vụ miễn phí trong khuôn viên</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>Dịch vụ đưa đón</h3>
          </div>
          <ul>
            <li>Đón khách từ sân bay miễn phí 24 giờ*</li>
          </ul>
        </div>

        <div>
          <div className={styles.overviewHeader}>
            <CheckOutlined />
            <h3 className={styles.overviewHeaderTitle}>Thông tin khác</h3>
          </div>
          <ul>
            <li>Nơi lưu trú không khói thuốc</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OverView;
