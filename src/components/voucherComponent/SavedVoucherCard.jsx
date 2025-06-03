import React from "react";
import { Card, Button, Tag, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { notifySuccess, notifyError } from "../notification/ToastNotification";
import fetchUtils from "../../utils/fetchUtils"; // Import the default export

const SavedVoucherCard = ({ voucher, onDelete }) => {
  const handleDeleteVoucher = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      notifyError("Please login to delete vouchers.");
      return;
    }

    try {
      const response = await fetchUtils.remove(
        `/user/storage/voucher/vouchers/${voucher._id}`,
        true
      ); // requiresAuth is true
      if (response.success) {
        notifySuccess(response.message);
        onDelete(voucher._id); // Call the onDelete callback to update the parent state
      } else {
        notifyError(response.message || "Failed to delete voucher");
      }
    } catch (error) {
      notifyError("An error occurred while deleting the voucher.");
      console.error("Delete voucher error:", error);
    }
  };

  return (
    <div className="voucher-card-outer">
      <Card
        className="voucher-card"
        bordered={false}
        style={{
          borderRadius: 18,
          minHeight: 180,
          boxShadow: "0 2px 12px #eee",
          position: "relative", // Needed for absolute positioning of delete button
        }}
        bodyStyle={{ padding: 20, position: "relative" }}
      >
        {/* Delete Button */}
        <Button
          type="text"
          danger // Use danger for red color
          icon={<DeleteOutlined />}
          onClick={handleDeleteVoucher}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 3,
          }}
          shape="circle"
          size="small"
        />

        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          {voucher.storeId?.logo && (
            <img
              src={voucher.storeId.logo}
              alt="store"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                marginRight: 12,
              }}
            />
          )}
          <span style={{ fontWeight: 600, fontSize: 18 }}>{voucher.code}</span>
          {voucher.discountType === "percentage" ? (
            <Tag color="green" style={{ marginLeft: 12 }}>
              Giảm {voucher.discountValue}%
            </Tag>
          ) : (
            <Tag color="blue" style={{ marginLeft: 12 }}>
              Giảm {voucher.discountValue.toLocaleString()}đ
            </Tag>
          )}
        </div>
        <div style={{ fontSize: 15, marginBottom: 8 }}>
          {voucher.description}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
          Đơn tối thiểu: {voucher.minPurchaseAmount?.toLocaleString()}đ
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
          HSD: {new Date(voucher.endDate).toLocaleDateString()}
        </div>
        {/* "Lưu Voucher" button is removed from here */}

        {/* 2 bên khuyết tròn */}
        <div className="voucher-notch left" />
        <div className="voucher-notch right" />
      </Card>
      <style>{`
        .voucher-card-outer { position: relative; }
        .voucher-card { position: relative; overflow: visible; }
        .voucher-notch {
          position: absolute;
          top: 50%;
          width: 24px;
          height: 48px;
          background: #f7f7f7;
          border-radius: 50%;
          z-index: 2;
          transform: translateY(-50%);
        }
        .voucher-notch.left {
          left: -12px;
        }
        .voucher-notch.right {
          right: -12px;
        }
      `}</style>
    </div>
  );
};

export default SavedVoucherCard;
