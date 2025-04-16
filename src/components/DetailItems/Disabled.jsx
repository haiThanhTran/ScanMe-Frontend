import { HomeOutlined } from "@ant-design/icons";
import styles from "../../static/css/disabled.module.css";

const Disabled = () => {
  return (
    <div className={styles.containerDisabled}>
      <div className={styles.supportSectionD}>
        <h2 className={styles.title}>Hỗ trợ người khuyết tật</h2>
        <p className={styles.descriptionD}>
          Nếu có nhu cầu cụ thể về hỗ trợ người khuyết tật, hãy liên hệ với nơi
          lưu trú qua thông tin trong xác nhận đặt phòng.
        </p>
      </div>
      <div className={styles.commonAreaD}>
        <HomeOutlined className={styles.iconD} />
        <div>
          <h3 className={styles.subtitleD}>Khu vực chung</h3>
          <p className={styles.descriptionD}>Thang máy</p>
        </div>
      </div>
    </div>
  );
};

export default Disabled;
