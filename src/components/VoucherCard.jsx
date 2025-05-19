import React from "react";
import { Card, Button, Tag, Tooltip } from "antd";

const VoucherCard = ({ voucher }) => {
  return (
    <div className="voucher-card-outer">
      <Card
        className="voucher-card"
        bordered={false}
        style={{
          borderRadius: 18,
          minHeight: 180,
          boxShadow: "0 2px 12px #eee",
        }}
        bodyStyle={{ padding: 20, position: "relative" }}
      >
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
        <Button
          type="primary"
          style={{
            background: "#ff9800",
            border: "none",
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Lưu Voucher
        </Button>
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

export default VoucherCard;
