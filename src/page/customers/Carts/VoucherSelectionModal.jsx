// src/components/cart/VoucherSelectionModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Modal,
  List,
  Typography,
  Button,
  Spin,
  Empty,
  Tag,
  Radio,
  message,
  Alert,
} from "antd";
import fetchUtils from "../../../utils/fetchUtils"; // Đảm bảo đường dẫn đúng
import styles from "./VoucherSelectionModal.module.css"; // Đảm bảo file CSS tồn tại
import {
  TagOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Text, Paragraph, Title } = Typography;

const VoucherSelectionModal = ({
  visible,
  onClose,
  product,
  currentCartItem,
  onVoucherApplied,
}) => {
  const [allUserVouchers, setAllUserVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  useEffect(() => {
    if (visible) {
      setSelectedVoucherId(currentCartItem?.appliedVoucherDetails?._id || null);
      console.log(
        "[VoucherModal] Opened for product:",
        JSON.stringify(product, null, 2)
      );
      console.log(
        "[VoucherModal] Current cart item state:",
        JSON.stringify(currentCartItem, null, 2)
      );
    }
  }, [visible, currentCartItem?.appliedVoucherDetails, product]);

  const itemTotalPrice = useMemo(() => {
    if (
      !product ||
      !currentCartItem ||
      typeof product.price !== "number" ||
      typeof currentCartItem.quantity !== "number"
    )
      return 0;
    const total = product.price * currentCartItem.quantity;
    console.log(
      `[VoucherModal] Item Total Price for ${product.name}: ${total}`
    );
    return total;
  }, [product, currentCartItem]);

  const fetchUserVouchers = useCallback(async () => {
    if (!visible) return;
    setLoading(true);
    console.log(
      "[VoucherModal] Fetching user vouchers from /user/storage/voucher/vouchers..."
    );
    try {
      const response = await fetchUtils.get(
        "/user/storage/voucher/vouchers",
        true
      );
      console.log(
        "[VoucherModal] API Response for user vouchers:",
        JSON.stringify(response, null, 2)
      );
      if (response && response.success && Array.isArray(response.data)) {
        setAllUserVouchers(response.data);
        console.log(
          "[VoucherModal] Fetched user vouchers:",
          response.data.length,
          "items"
        );
      } else {
        setAllUserVouchers([]);
        console.log(
          "[VoucherModal] No vouchers fetched or API error in response data."
        );
        if (response && !response.success) {
          message.error(
            response.message || "Không thể tải danh sách voucher của bạn."
          );
        }
      }
    } catch (error) {
      console.error("[VoucherModal] Error fetching user vouchers:", error);
      let errorMessage = "Lỗi khi tải voucher của bạn.";
      if (error && error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      message.error(errorMessage);
      setAllUserVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    fetchUserVouchers();
  }, [fetchUserVouchers]);

  const isVoucherApplicable = useCallback((voucher, productData, quantity) => {
    // Log ngay từ đầu để biết đang check voucher nào với sản phẩm nào
    console.log(
      `[isVoucherApplicable] START CHECK: Voucher Code: ${voucher.code}, Product: ${productData.name}`
    );

    if (
      !productData ||
      !voucher ||
      typeof productData.price !== "number" ||
      typeof quantity !== "number"
    ) {
      console.log(`[${voucher.code}] Invalid input data.`);
      return {
        applicable: false,
        reason: "Thiếu thông tin voucher hoặc sản phẩm",
      };
    }

    const currentItemTotalPrice = productData.price * quantity;
    console.log(
      `[${voucher.code}] currentItemTotalPrice: ${currentItemTotalPrice}`
    );

    if (voucher.isUsed) {
      console.log(`[${voucher.code}] REJECTED: isUsed`);
      return { applicable: false, reason: "Voucher đã được sử dụng" };
    }

    const now = new Date();
    const effectiveStartDate = new Date(voucher.startDate);
    const effectiveEndDate = voucher.expiresAt
      ? new Date(voucher.expiresAt)
      : new Date(voucher.endDate);
    if (effectiveStartDate > now || effectiveEndDate < now) {
      console.log(
        `[${voucher.code}] REJECTED: Date invalid. Start: ${effectiveStartDate}, End: ${effectiveEndDate}, Now: ${now}`
      );
      return {
        applicable: false,
        reason: "Voucher đã hết hạn hoặc chưa có hiệu lực",
      };
    }

    if (
      voucher.totalQuantity !== null &&
      voucher.totalQuantity > 0 &&
      (voucher.usedQuantity || 0) >= voucher.totalQuantity
    ) {
      console.log(
        `[${voucher.code}] REJECTED: Quantity. Total: ${
          voucher.totalQuantity
        }, Used: ${voucher.usedQuantity || 0}`
      );
      return { applicable: false, reason: "Voucher đã hết lượt sử dụng" };
    }

    if (
      voucher.minPurchaseAmount &&
      currentItemTotalPrice < voucher.minPurchaseAmount
    ) {
      console.log(
        `[${voucher.code}] REJECTED: MinPurchase. ItemTotal: ${currentItemTotalPrice}, Min: ${voucher.minPurchaseAmount}`
      );
      return {
        applicable: false,
        reason: `Cần tổng sản phẩm tối thiểu ${voucher.minPurchaseAmount.toLocaleString()}đ`,
      };
    }

    // ----- KIỂM TRA STORE ID -----
    let productStoreIdString = null;
    if (productData.storeId) {
      if (typeof productData.storeId === "string")
        productStoreIdString = productData.storeId;
      else if (
        typeof productData.storeId === "object" &&
        productData.storeId._id
      )
        productStoreIdString = productData.storeId._id.toString();
      else if (productData.storeId.$oid)
        productStoreIdString = productData.storeId.$oid.toString();
    }

    let voucherStoreIdString = null;
    if (voucher.storeId) {
      if (typeof voucher.storeId === "string")
        voucherStoreIdString = voucher.storeId;
      else if (typeof voucher.storeId === "object" && voucher.storeId._id)
        voucherStoreIdString = voucher.storeId._id.toString();
      else if (voucher.storeId.$oid)
        voucherStoreIdString = voucher.storeId.$oid.toString();
    }

    console.log(
      `[${voucher.code}] Product Store ID (raw):`,
      productData.storeId
    );
    console.log(`[${voucher.code}] Voucher Store ID (raw):`, voucher.storeId);
    console.log(
      `[${voucher.code}] Parsed Product Store ID: '${productStoreIdString}', Parsed Voucher Store ID: '${voucherStoreIdString}'`
    );

    if (voucherStoreIdString) {
      // Chỉ kiểm tra nếu voucher có ràng buộc storeId
      if (!productStoreIdString) {
        console.log(
          `[${voucher.code}] REJECTED: Product has no storeId, but voucher requires one.`
        );
        return {
          applicable: false,
          reason: "Sản phẩm không có thông tin cửa hàng để so sánh.",
        };
      }
      if (voucherStoreIdString !== productStoreIdString) {
        console.log(
          `[${voucher.code}] REJECTED: storeId mismatch. Product: ${productStoreIdString}, Voucher: ${voucherStoreIdString}`
        );
        return {
          applicable: false,
          reason: "Không áp dụng cho cửa hàng của sản phẩm này",
        };
      }
      console.log(
        `[${voucher.code}] PASSED: storeId matched or voucher has no store restriction.`
      );
    } else {
      console.log(
        `[${voucher.code}] INFO: Voucher has no storeId restriction, skipping store check.`
      );
    }

    // ----- KIỂM TRA APPLICABLE PRODUCTS -----
    const productDataIdString =
      productData._id?.$oid?.toString() || productData._id?.toString(); // Đảm bảo productData._id là string
    console.log(
      `[${voucher.code}] Product ID for check: '${productDataIdString}'`
    );
    console.log(
      `[${voucher.code}] Voucher applicableProducts (raw):`,
      voucher.applicableProducts
    );

    if (voucher.applicableProducts && voucher.applicableProducts.length > 0) {
      const voucherApplicableProductIds = voucher.applicableProducts.map(
        (p) => p?.$oid?.toString() || p?.toString()
      );
      console.log(
        `[${voucher.code}] Parsed Voucher applicableProductIds:`,
        voucherApplicableProductIds
      );
      const isProductMatch =
        voucherApplicableProductIds.includes(productDataIdString);
      if (!isProductMatch) {
        console.log(`[${voucher.code}] REJECTED: Not in applicableProducts.`);
        return { applicable: false, reason: "Không áp dụng cho sản phẩm này" };
      }
      console.log(`[${voucher.code}] PASSED: applicableProducts.`);
      console.log(`[${voucher.code}] SUCCESS: Applicable via product list.`);
      return { applicable: true, reason: "" }; // Nếu khớp sản phẩm cụ thể, không cần check category nữa
    }

    // ----- KIỂM TRA APPLICABLE CATEGORIES (chỉ khi không có applicableProducts) -----
    console.log(
      `[${voucher.code}] Voucher applicableCategories (raw):`,
      voucher.applicableCategories
    );
    if (
      voucher.applicableCategories &&
      voucher.applicableCategories.length > 0
    ) {
      let productCategoryIds = [];
      if (Array.isArray(productData.categories)) {
        productCategoryIds = productData.categories.map(
          (cat) => cat?.$oid?.toString() || cat?.toString()
        );
      } else if (typeof productData.categories === "string") {
        // Trường hợp categories là một string ID đơn
        productCategoryIds = [productData.categories];
      }
      const voucherCategoryIds = voucher.applicableCategories.map(
        (cat) => cat?.$oid?.toString() || cat?.toString()
      );

      console.log(
        `[${voucher.code}] Parsed Product Category IDs:`,
        productCategoryIds
      );
      console.log(
        `[${voucher.code}] Parsed Voucher applicableCategory IDs:`,
        voucherCategoryIds
      );

      const hasMatchingCategory = productCategoryIds.some((pCatId) =>
        voucherCategoryIds.includes(pCatId)
      );
      if (!hasMatchingCategory) {
        console.log(`[${voucher.code}] REJECTED: No matching categories.`);
        return {
          applicable: false,
          reason: "Không áp dụng cho ngành hàng của sản phẩm này",
        };
      }
      console.log(`[${voucher.code}] PASSED: applicableCategories.`);
    } else {
      // Nếu không có applicableProducts và không có applicableCategories,
      // và đã qua kiểm tra storeId (nếu voucher có storeId), thì voucher được coi là áp dụng chung
      console.log(
        `[${voucher.code}] PASSED: General applicability (no specific product/category, or store-wide if store matched/not restricted).`
      );
    }

    console.log(`[${voucher.code}] SUCCESS: Voucher IS APPLICABLE.`);
    return { applicable: true, reason: "" };
  }, []);

  const calculateDiscount = useCallback((voucher, currentItemTotalPrice) => {
    if (!voucher) return 0;
    let discount = 0;
    if (voucher.discountType === "percentage") {
      discount = (currentItemTotalPrice * voucher.discountValue) / 100;
      if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
        discount = voucher.maxDiscountAmount;
      }
    } else if (voucher.discountType === "fixed") {
      discount = voucher.discountValue;
    }
    const finalDiscount = Math.min(discount, currentItemTotalPrice);
    console.log(
      `[calculateDiscount] For voucher ${voucher.code}: Calculated discount = ${finalDiscount}, Item Total Price = ${currentItemTotalPrice}`
    );
    return finalDiscount;
  }, []);

  const processedVouchers = useMemo(() => {
    if (!product || !currentCartItem || !allUserVouchers) return [];
    console.log("[VoucherModal] Processing vouchers for display...");
    const result = allUserVouchers
      .map((userVoucher) => {
        const applicabilityCheck = isVoucherApplicable(
          userVoucher,
          product,
          currentCartItem.quantity
        );
        let calculatedDisc = 0;
        if (applicabilityCheck.applicable) {
          calculatedDisc = calculateDiscount(userVoucher, itemTotalPrice);
        }
        return {
          ...userVoucher,
          applicability: applicabilityCheck,
          calculatedDiscount: calculatedDisc,
        };
      })
      .sort((a, b) => {
        if (a.applicability.applicable && !b.applicability.applicable)
          return -1;
        if (!a.applicability.applicable && b.applicability.applicable) return 1;
        if (a.applicability.applicable && b.applicability.applicable) {
          return b.calculatedDiscount - a.calculatedDiscount;
        }
        if (!a.applicability.applicable && !b.applicability.applicable) {
          return new Date(a.endDate) - new Date(b.endDate);
        }
        return 0;
      });
    console.log(
      "[VoucherModal] Processed Vouchers list:",
      JSON.stringify(
        result.map((v) => ({
          code: v.code,
          applicable: v.applicability.applicable,
          reason: v.applicability.reason,
          discount: v.calculatedDiscount,
        })),
        null,
        2
      )
    );
    return result;
  }, [
    allUserVouchers,
    product,
    currentCartItem,
    isVoucherApplicable,
    calculateDiscount,
    itemTotalPrice,
  ]);

  const handleApplyOrRemove = () => {
    // ... (Giữ nguyên logic từ câu trả lời trước)
    if (selectedVoucherId === null) {
      if (currentCartItem?.appliedVoucherDetails) {
        onVoucherApplied(product._id, null);
      } else {
        onClose();
      }
    } else {
      const voucherToApply = processedVouchers.find(
        (v) => v._id === selectedVoucherId
      );
      if (voucherToApply && voucherToApply.applicability.applicable) {
        onVoucherApplied(product._id, {
          _id: voucherToApply._id,
          code: voucherToApply.code,
          description: voucherToApply.description,
          discountType: voucherToApply.discountType,
          discountValue: voucherToApply.discountValue,
          maxDiscountAmount: voucherToApply.maxDiscountAmount,
          calculatedDiscount: voucherToApply.calculatedDiscount,
        });
      } else {
        message.warning("Vui lòng chọn một voucher hợp lệ.");
      }
    }
  };

  const currentSelectedVoucherObject = selectedVoucherId
    ? processedVouchers.find((v) => v._id === selectedVoucherId)
    : null;
  const discountDisplayForFooter =
    currentSelectedVoucherObject?.applicability.applicable &&
    currentSelectedVoucherObject?.calculatedDiscount > 0
      ? currentSelectedVoucherObject.calculatedDiscount
      : 0;

  let mainButtonText = "Lưu Voucher";
  let mainButtonDisabled = loading;
  const isRemovingVoucher =
    currentCartItem?.appliedVoucherDetails && selectedVoucherId === null;

  if (isRemovingVoucher) {
    mainButtonText = "Gỡ Voucher";
  } else if (selectedVoucherId && currentSelectedVoucherObject) {
    if (!currentSelectedVoucherObject.applicability.applicable) {
      mainButtonDisabled = true;
    } else {
      mainButtonText = "Áp dụng Voucher";
    }
  } else if (!selectedVoucherId && !currentCartItem?.appliedVoucherDetails) {
    mainButtonText = "Đóng";
    mainButtonDisabled = false;
  }

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          <TagOutlined /> Chọn Voucher cho "{product?.name}"
        </Title>
      }
      open={visible}
      onCancel={onClose}
      width={750}
      className={styles.voucherModal}
      destroyOnClose
      footer={[
        <div key="footer-info" className={styles.footerInfo}>
          {selectedVoucherId && discountDisplayForFooter > 0 && (
            <Text type="success" strong>
              <CheckCircleOutlined /> Giảm:{" "}
              {discountDisplayForFooter.toLocaleString()}đ
            </Text>
          )}
          {selectedVoucherId &&
            currentSelectedVoucherObject &&
            !currentSelectedVoucherObject.applicability.applicable && (
              <Text type="danger">
                <InfoCircleOutlined />{" "}
                {currentSelectedVoucherObject.applicability.reason ||
                  "Voucher không hợp lệ"}
              </Text>
            )}
          {isRemovingVoucher && (
            <Text type="warning">
              <CloseCircleOutlined /> Gỡ voucher đang áp dụng
            </Text>
          )}
        </div>,
        <Button key="cancel" onClick={onClose} className={styles.actionButton}>
          Hủy
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleApplyOrRemove}
          className={styles.actionButton}
          disabled={mainButtonDisabled}
        >
          {mainButtonText}
        </Button>,
      ]}
    >
      <Spin spinning={loading} tip="Đang tìm voucher tốt nhất cho bạn...">
        {processedVouchers.length > 0 ? (
          <Radio.Group
            onChange={(e) => setSelectedVoucherId(e.target.value)}
            value={selectedVoucherId}
            style={{ width: "100%" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={processedVouchers}
              renderItem={(voucher) => {
                const { applicable, reason } = voucher.applicability;
                return (
                  <List.Item
                    className={`${styles.voucherItem} ${
                      !applicable ? styles.disabledVoucher : ""
                    }`}
                    onClick={
                      applicable
                        ? () => setSelectedVoucherId(voucher._id)
                        : undefined
                    }
                    style={applicable ? { cursor: "pointer" } : {}}
                    actions={
                      applicable
                        ? [
                            <Radio
                              value={voucher._id}
                              checked={selectedVoucherId === voucher._id}
                            />,
                          ]
                        : []
                    }
                  >
                    <div className={styles.voucherContent}>
                      <Tag
                        color={applicable ? "blue" : "default"}
                        className={styles.voucherTag}
                      >
                        {voucher.discountType === "percentage"
                          ? `GIẢM ${voucher.discountValue}%`
                          : `GIẢM ${voucher.discountValue.toLocaleString()}K`}
                      </Tag>
                      <div className={styles.voucherDetails}>
                        <Text
                          strong
                          className={styles.voucherCode}
                          disabled={!applicable}
                        >
                          {voucher.code}{" "}
                          {voucher.name ? `(${voucher.name})` : ""}
                        </Text>
                        <Paragraph
                          className={styles.voucherDescriptionText}
                          ellipsis={{ rows: 1 }}
                          type={applicable ? undefined : "secondary"}
                        >
                          {voucher.description}
                        </Paragraph>
                        {applicable && voucher.calculatedDiscount > 0 && (
                          <Text
                            type="success"
                            strong
                            className={styles.savingsText}
                          >
                            Tiết kiệm:{" "}
                            {voucher.calculatedDiscount.toLocaleString()}đ
                          </Text>
                        )}
                        {!applicable && reason && (
                          <Text type="danger" className={styles.reasonText}>
                            {reason}
                          </Text>
                        )}
                        <Paragraph className={styles.expiryText}>
                          HSD:{" "}
                          {new Date(
                            voucher.endDate || voucher.expiresAt
                          ).toLocaleDateString("vi-VN")}
                          {voucher.minPurchaseAmount
                            ? ` | Đơn tối thiểu: ${voucher.minPurchaseAmount.toLocaleString()}đ`
                            : ""}
                        </Paragraph>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          </Radio.Group>
        ) : (
          <Empty
            description={
              loading
                ? "Đang tải..."
                : "Bạn không có voucher nào hoặc không có voucher phù hợp."
            }
          />
        )}
        {currentCartItem?.appliedVoucherDetails && (
          <Button
            type="link"
            danger
            onClick={() => setSelectedVoucherId(null)}
            style={{ marginTop: "10px", display: "block", textAlign: "center" }}
            icon={<CloseCircleOutlined />}
          >
            Không sử dụng voucher này nữa
          </Button>
        )}
      </Spin>
    </Modal>
  );
};

export default VoucherSelectionModal;
