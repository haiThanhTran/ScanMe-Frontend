// src/components/voucherComponent/VoucherCard.jsx
import React, { useState } from "react";
import {
  Card,
  Button,
  Tag,
  Tooltip,
  Typography,
  Space,
  message,
  Avatar,
  Progress,
} from "antd"; // Thêm Progress
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  TagOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { notifySuccess, notifyError } from "../notification/ToastNotification";
import fetchUtils from "../../utils/fetchUtils";
import styles from "./VoucherCard.module.css";

const { Text, Paragraph } = Typography;

const VoucherCard = ({ voucher, isSaved, onSaveSuccess }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveVoucher = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      notifyError("Vui lòng đăng nhập để lưu voucher.");
      return;
    }
    if (isSaved) return;

    setIsSaving(true);
    try {
      const response = await fetchUtils.post(
        "/user/storage/voucher/vouchers",
        { voucherId: voucher._id },
        true
      );
      if (response.success) {
        notifySuccess(response.message || "Đã lưu voucher thành công!");
        if (onSaveSuccess) onSaveSuccess(voucher._id);
      } else {
        notifyError(
          response.message ||
            "Lưu voucher thất bại. Có thể bạn đã lưu voucher này rồi hoặc voucher đã hết lượt."
        );
      }
    } catch (error) {
      notifyError(
        error.response?.data?.message || error.message || "Lỗi khi lưu voucher."
      );
      console.error("Save voucher error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  let buttonText = "Lưu Voucher";
  let buttonDisabled = isSaving;
  let buttonType = "primary";
  let buttonIcon = <SaveOutlined />;

  const isExpired = new Date(voucher.endDate) < new Date();
  const usedCount = voucher.usedQuantity || 0;
  const totalCount = voucher.totalQuantity;
  const canStillBeSaved = totalCount > 0 ? usedCount < totalCount : true; // Nếu không giới hạn số lượng thì luôn có thể lưu

  if (isExpired) {
    buttonText = "Đã Hết Hạn";
    buttonDisabled = true;
    buttonType = "default";
    buttonIcon = <ClockCircleOutlined />;
  } else if (!canStillBeSaved) {
    buttonText = "Hết Lượt Lưu";
    buttonDisabled = true;
    buttonType = "default";
    buttonIcon = <CloseCircleOutlined />;
  } else if (isSaved) {
    buttonText = "Đã Lưu";
    buttonDisabled = true;
    buttonType = "default";
    buttonIcon = <CheckCircleOutlined />;
  }

  const remainingPercentage =
    totalCount && totalCount > 0
      ? Math.max(0, ((totalCount - usedCount) / totalCount) * 100)
      : 100; // Mặc định 100% nếu không có totalQuantity (không giới hạn)

  const progressPercent =
    totalCount && totalCount > 0 ? (usedCount / totalCount) * 100 : 0; // % đã dùng

  return (
    <div className={styles.voucherCardOuter}>
      <Card
        className={`${styles.voucherCard} ${isExpired ? styles.expired : ""} ${
          isSaved && !isExpired && canStillBeSaved ? styles.saved : ""
        } ${!canStillBeSaved && !isExpired ? styles.fullyUsed : ""}`}
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <div className={styles.voucherCardContent}>
          <div className={styles.voucherCardHeader}>
            {voucher.storeId?.logo && (
              <Avatar
                src={voucher.storeId.logo}
                size={38}
                className={styles.storeLogo}
              />
            )}
            <div className={styles.headerText}>
              <Tooltip title={voucher.code}>
                <Text strong className={styles.voucherCode} ellipsis>
                  {voucher.code}
                </Text>
              </Tooltip>
              {voucher.discountType === "percentage" ? (
                <Tag
                  icon={<TagOutlined />}
                  color="#2db7f5"
                  className={styles.discountTag}
                >
                  Giảm {voucher.discountValue}%
                </Tag>
              ) : (
                <Tag
                  icon={<TagOutlined />}
                  color="#87d068"
                  className={styles.discountTag}
                >
                  Giảm {voucher.discountValue.toLocaleString()}đ
                </Tag>
              )}
            </div>
          </div>

          <Tooltip title={voucher.description}>
            <Paragraph
              className={styles.voucherDescription}
              ellipsis={{ rows: 2, expandable: false }}
            >
              {voucher.description || "Không có mô tả chi tiết."}
            </Paragraph>
          </Tooltip>

          <div className={styles.voucherInfo}>
            {voucher.minPurchaseAmount > 0 && (
              <Text type="secondary" className={styles.infoText}>
                Đơn tối thiểu: {voucher.minPurchaseAmount.toLocaleString()}đ
              </Text>
            )}
            <Text type="secondary" className={styles.infoText}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              HSD: {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
            </Text>
          </div>
        </div>

        {/* Phần hiển thị số lượng và thanh progress */}
        {totalCount > 0 &&
          !isExpired && ( // Chỉ hiển thị nếu có totalQuantity và chưa hết hạn
            <div className={styles.usageDetails}>
              <Progress
                percent={progressPercent}
                showInfo={false} // Tự custom text
                strokeColor={{
                  from: "#FFB74D", // Cam nhạt
                  to: "#FF7043", // Cam đậm
                }}
                trailColor="#E0E0E0"
                size="small"
                className={styles.usageProgressBar}
              />
              <Text className={styles.usageText}>
                {usedCount >= totalCount
                  ? "Đã hết lượt"
                  : `Đã dùng ${usedCount}/${totalCount}`}
              </Text>
            </div>
          )}

        <div className={styles.voucherCardFooter}>
          {isExpired && (
            <Text type="danger" strong className={styles.expiredTextFull}>
              ĐÃ HẾT HẠN
            </Text>
          )}
          {!isExpired && !canStillBeSaved && (
            <Text type="secondary" strong className={styles.expiredTextFull}>
              ĐÃ HẾT LƯỢT LƯU
            </Text>
          )}

          {!isExpired && canStillBeSaved && (
            <Button
              type={buttonType}
              className={styles.saveButton}
              onClick={handleSaveVoucher}
              disabled={buttonDisabled}
              loading={isSaving}
              icon={buttonIcon}
              block
            >
              {buttonText}
            </Button>
          )}
        </div>
        <div className={`${styles.voucherNotch} ${styles.left}`} />
        <div className={`${styles.voucherNotch} ${styles.right}`} />
      </Card>
    </div>
  );
};

export default VoucherCard;
