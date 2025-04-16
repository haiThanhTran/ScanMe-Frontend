import styles from "../../static/css/feeandpolicy.module.css";

const FeesAndPolicy = () => {
  return (
    <div className={styles.containerFees}>
      <h2 className={styles.titleFees}>Phí & Chính sách</h2>
      <div className={styles.contentFess}>
        <div className={styles.sectionFees}>
          <h3>Trẻ em & giường bổ sung</h3>
          <ul>
            <li>Có hoạt động cho trẻ có người giám hộ với phụ phí</li>
            <li>Có dịch vụ trông trẻ với phụ phí</li>
            <li>
              Có thể yêu cầu cung cấp giường phụ với phụ phí 2.500.000 VND mỗi
              đêm
            </li>
          </ul>

          <h3>Hồ bơi, spa & gym (nếu có)</h3>
          <ul>
            <li>Hồ bơi mở cửa từ 6:00 đến 19:00.</li>
          </ul>

          <h3>Chính sách</h3>
          <ul className={styles.policy}>
            <li>Chỉ khách đã đăng ký được lưu trú tại phòng.</li>
            <li>Có thể tổ chức tiệc và sự kiện trong khuôn viên.</li>
            <li>
              Khách có thể an tâm nghỉ ngơi khi biết có bình cứu hỏa, máy phát
              hiện khói, hệ thống an ninh và hộp sơ cứu trong khuôn viên.
            </li>
            <li>
              Nơi lưu trú này chào đón khách thuộc mọi xu hướng tình dục và nhận
              dạng giới (thân thiện với cộng đồng LGBTQ+).
            </li>
            <li>
              Tên trên thẻ tín dụng sử dụng khi nhận phòng để thanh toán các chi
              phí phát sinh phải là tên khách chính trong hồ sơ đặt phòng.
            </li>
            <li>
              Nơi lưu trú này nhận thanh toán bằng thẻ tín dụng. Không nhận tiền
              mặt.
            </li>
            <li>
              Thẻ tín dụng được chấp nhận: Visa, Mastercard, American Express,
              JCB International
            </li>
            <li>Chấp nhận giao dịch không dùng tiền mặt.</li>
          </ul>

          <h3>Tên khác</h3>
          <ul>
            <li>Cam Ranh Riviera Beach Resort Cam Lam</li>
            <li>Cam Ranh Riviera Beach Resort</li>
            <li>Cam Ranh Riviera Beach Cam Lam</li>
            <li>Cam Ranh Riviera Beach</li>
            <li>Cam Ranh Riviera Cam Lam</li>
            <li>Cam Ranh Riviera & Spa Cam Lam</li>
            <li>Cam Ranh Riviera Beach Resort & Spa Resort</li>
            <li>Cam Ranh Riviera Beach Resort & Spa Cam Lam</li>
            <li>Cam Ranh Riviera Beach Resort & Spa Resort Cam Lam</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeesAndPolicy;
