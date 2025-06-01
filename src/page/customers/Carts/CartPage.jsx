import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Empty,
  Spin,
  message,
  Avatar,
  Tooltip,
  Popconfirm,
  Card,
  Divider,
  InputNumber,
  Tag,
} from "antd";
import {
  ShoppingCartOutlined,
  TagOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowLeftOutlined,
  ClearOutlined, // Đổi từ DeleteFilled
  LoadingOutlined,
} from "@ant-design/icons";
import fetchUtils from "../../../utils/fetchUtils";
import VoucherSelectionModal from "./VoucherSelectionModal";
import OrderConfirmationModal from "./OrderConfirmationModal";
import styles from "./CartPage.module.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const HEADER_HEIGHT = 70; // Giả sử header chính của app cao 70px
const PAGE_PADDING_TOP = 20; // Padding trên của trang CartPage
const PAGE_PADDING_RIGHT = "3%"; // Padding phải của trang CartPage (hoặc giá trị px)

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false); // State riêng cho việc submit order
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedProductForVoucher, setSelectedProductForVoucher] =
    useState(null);
  const navigate = useNavigate();
  // const sidebarRef = useRef(null); // Không cần nếu dùng fixed

  const calculateTotals = useCallback((items) => {
    let sub = 0;
    let discount = 0;
    items.forEach((item) => {
      if (
        !item.productId ||
        typeof item.productId.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return;
      }
      const itemPrice = item.productId.price * item.quantity;
      sub += itemPrice;
      if (
        item.appliedVoucherDetails &&
        typeof item.appliedVoucherDetails.calculatedDiscount === "number"
      ) {
        discount += item.appliedVoucherDetails.calculatedDiscount;
      }
    });
    return {
      subTotal: sub,
      totalDiscount: discount,
      totalAmount: Math.max(0, sub - discount),
    };
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUtils.get("/user/carts/cart", true);
      if (res && res.success && Array.isArray(res.cart)) {
        setCartItems(
          res.cart
            .filter(
              (item) =>
                item.productId &&
                typeof item.productId === "object" &&
                item.productId._id
            )
            .map((item) => ({ ...item, key: item.productId._id }))
        );
      } else {
        setCartItems([]);
        if (res && res.message && !res.success) message.error(res.message);
      }
    } catch (err) {
      message.error(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải giỏ hàng."
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const { subTotal, totalDiscount, totalAmount } = calculateTotals(cartItems);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    const originalCartItems = [...cartItems];
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: newQuantity, appliedVoucherDetails: null }
          : item
      )
    );
    try {
      const res = await fetchUtils.put(
        "/user/carts/cart",
        { productId, quantity: newQuantity },
        true
      );
      if (!res.success) {
        message.error(res.message || "Cập nhật thất bại.");
        setCartItems(originalCartItems);
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || error?.message || "Lỗi cập nhật."
      );
      setCartItems(originalCartItems);
    }
  };

  const handleRemoveItem = async (productId) => {
    const originalCartItems = [...cartItems];
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId._id !== productId)
    );
    try {
      const res = await fetchUtils.remove(
        `/user/carts/cart/${productId}`,
        true
      );
      if (!res.success) {
        message.error(res.message || "Xóa thất bại.");
        setCartItems(originalCartItems);
      } else {
        message.success("Xóa sản phẩm thành công!");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || error?.message || "Lỗi khi xóa."
      );
      setCartItems(originalCartItems);
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const res = await fetchUtils.remove("/user/carts/clear", true);
      if (res.success) {
        setCartItems([]);
        message.success("Đã xóa toàn bộ giỏ hàng!");
      } else {
        message.error(res.message || "Xóa giỏ hàng thất bại.");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi khi xóa giỏ hàng."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVoucherModal = (cartItemRecord) => {
    if (
      cartItemRecord &&
      cartItemRecord.productId &&
      typeof cartItemRecord.productId === "object"
    ) {
      setSelectedProductForVoucher({
        ...cartItemRecord,
        productDetails: cartItemRecord.productId,
      });
      setIsVoucherModalVisible(true);
    } else {
      message.error("Lỗi sản phẩm.");
    }
  };

  const handleVoucherApplied = (productIdOfItem, voucherDetails) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId._id === productIdOfItem
          ? { ...item, appliedVoucherDetails: voucherDetails }
          : item
      )
    );
    setIsVoucherModalVisible(false);
    setSelectedProductForVoucher(null);
    if (voucherDetails) {
      message.success(`Đã áp dụng voucher "${voucherDetails.code}"!`);
    } else {
      message.info("Đã gỡ voucher.");
    }
  };

  const handleOpenOrderModal = () => {
    if (cartItems.length === 0) {
      message.warning("Giỏ hàng của bạn đang trống.");
      return;
    }
    setIsOrderModalVisible(true);
  };

  const handleOrderPlaced = () => {
    setCartItems([]);
    fetchCart(); // Tải lại giỏ hàng (sẽ trống)
  };

  const getShortenedProductName = (
    name = "",
    wordLimit = 3,
    charLimit = 20
  ) => {
    if (!name) return "Sản phẩm";
    const words = name.split(" ");
    if (words.length <= wordLimit) {
      return name.length > charLimit
        ? name.substring(0, charLimit - 3) + "..."
        : name;
    }
    const shortName = words.slice(0, wordLimit).join(" ");
    return shortName.length > charLimit
      ? shortName.substring(0, charLimit - 3) + "..."
      : shortName + "...";
  };

  const renderCartItemMain = (item) => {
    if (!item.productId) return null;
    return (
      <Col
        xs={24}
        sm={12}
        md={12}
        lg={8}
        xl={8}
        key={item.productId._id}
        className={styles.productCardCol}
      >
        <Card
          hoverable
          className={styles.productDisplayCard}
          cover={
            <img
              alt={item.productId.name}
              src={item.productId.images?.[0] || "/placeholder-image.png"}
              className={styles.productDisplayImage}
            />
          }
          bodyStyle={{ padding: "0" }} // Bỏ padding của AntD Card body
        >
          <div className={styles.productInfoWrapper}>
            {" "}
            {/* Wrapper này sẽ có padding */}
            <Tooltip title={item.productId.name}>
              <Title
                level={5}
                className={styles.productDisplayName}
                ellipsis={{ rows: 2 }}
              >
                {item.productId.name}
              </Title>
            </Tooltip>
            <div className={styles.priceAndDeleteContainer}>
              <Text className={styles.productDisplayPrice}>
                {item.productId.price?.toLocaleString()}đ
              </Text>
              <Popconfirm
                title="Xóa sản phẩm này?"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleRemoveItem(item.productId._id);
                }}
                okText="Xóa"
                cancelText="Không"
                placement="topRight"
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.productDisplayDeleteButton}
                  size="small"
                >
                  Xóa
                </Button>
              </Popconfirm>
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  const renderCartItemSidebar = (item) => {
    if (!item.productId) return null;
    const itemSubTotal = item.productId.price * item.quantity;
    const discountForThisItem =
      item.appliedVoucherDetails?.calculatedDiscount || 0;
    const itemFinalTotal = itemSubTotal - discountForThisItem;

    return (
      <div key={item.productId._id} className={styles.sidebarItem}>
        <Avatar
          src={item.productId.images?.[0] || "/placeholder-image.png"}
          size={40}
          className={styles.sidebarItemAvatar}
        />
        <div className={styles.sidebarItemInfo}>
          <Tooltip title={item.productId.name}>
            <Text strong ellipsis className={styles.sidebarItemName}>
              {getShortenedProductName(item.productId.name, 25)}{" "}
              {/* Cắt ngắn tên */}
            </Text>
          </Tooltip>
          <Text type="secondary" className={styles.sidebarItemPriceDetail}>
            {item.productId.price.toLocaleString()}đ
            {item.appliedVoucherDetails && (
              <Tag color="success" className={styles.sidebarItemVoucherTag}>
                -{discountForThisItem.toLocaleString()}đ
              </Tag>
            )}
          </Text>
        </div>
        <Space className={styles.sidebarItemQuantity} size={4}>
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={() =>
              handleQuantityChange(item.productId._id, item.quantity - 1)
            }
            disabled={loading}
            className={styles.quantityButton}
          />
          <Text className={styles.quantityText}>{item.quantity}</Text>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              handleQuantityChange(item.productId._id, item.quantity + 1)
            }
            disabled={loading}
            className={styles.quantityButton}
          />
        </Space>
        {/* Không hiển thị thành tiền của từng item ở đây theo mẫu */}
        {/* <Text strong className={styles.sidebarItemTotal}>{itemFinalTotal > 0 ? itemFinalTotal.toLocaleString() : 0}đ</Text> */}
        <Tooltip
          title={
            item.appliedVoucherDetails
              ? `Sửa voucher: ${item.appliedVoucherDetails.code}`
              : "Chọn voucher"
          }
        >
          <Button
            type="text"
            icon={
              <TagOutlined
                style={{
                  color: item.appliedVoucherDetails ? "#52c41a" : "#1890ff",
                }}
              />
            }
            onClick={() => handleOpenVoucherModal(item)}
            className={styles.sidebarVoucherButton}
            size="small"
          />
        </Tooltip>
      </div>
    );
  };

  if (
    loading &&
    cartItems.length === 0 &&
    !isOrderModalVisible &&
    !isVoucherModalVisible
  ) {
    return (
      <div className={styles.fullPageLoad}>
        <Spin size="large" tip="Đang tải giỏ hàng..." />
      </div>
    );
  }
  const pageLoading =
    loading &&
    cartItems.length === 0 &&
    !isOrderModalVisible &&
    !isVoucherModalVisible;
  return (
    <div className={styles.cartPageContainer}>
      <Link to="/products" className={styles.backToHomeLink}>
        <Button type="text" className={styles.backToHomeButton}>
          <span className={styles.backToHomeIconCircle}>
            <ArrowLeftOutlined />
          </span>
          <span className={styles.backToHomeText}>Tiếp Tục Mua Sắm</span>
        </Button>
      </Link>

      {pageLoading ? (
        <div className={styles.fullPageLoad}>
          <Spin size="large" tip="Đang tải giỏ hàng..." />
        </div>
      ) : cartItems.length === 0 ? (
        <div className={styles.emptyCartContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty cart"
            className={styles.emptyCartImage}
          />
          <div className={styles.emptyCartText}>
            Giỏ Hàng Của Bạn Trống Trơn !
          </div>
        </div>
      ) : (
        <Row gutter={[24, 24]} className={styles.cartLayoutRow}>
          <Col xs={24} lg={16} xl={17} className={styles.mainProductListingCol}>
            <Spin
              spinning={loading && cartItems.length > 0}
              tip="Đang cập nhật..."
              size="default"
            >
              {cartItems.length > 0 ? (
                <Row gutter={[20, 24]}>{cartItems.map(renderCartItemMain)}</Row>
              ) : (
                <Empty description="Không có sản phẩm nào trong giỏ." />
              )}
            </Spin>
          </Col>

          <Col xs={24} lg={8} xl={7} className={styles.sidebarCol}>
            {/* Container này sẽ được style position:fixed và các thuộc tính top, right, height */}
            <div className={styles.sidebarFixedContainer}>
              <div className={styles.sidebarContentInner}>
                <Title level={3} className={styles.sidebarTitle}>
                  CARD
                </Title>
                <div className={styles.sidebarItemList}>
                  {cartItems.length > 0 ? (
                    cartItems.map(renderCartItemSidebar)
                  ) : (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                      <ShoppingCartOutlined
                        style={{ fontSize: "40px", color: "#595959" }}
                      />
                      <Text block type="secondary" style={{ marginTop: 10 }}>
                        Chọn sản phẩm
                      </Text>
                    </div>
                  )}
                </div>
                <div className={styles.sidebarSummary}>
                  {/* ... (Tạm tính, Giảm giá) ... */}
                </div>
                <Divider className={styles.sidebarDividerStrong} />
                <div className={`${styles.summaryRow} ${styles.finalTotalRow}`}>
                  <Text strong className={styles.summaryLabelLarge}>
                    Tổng cộng
                  </Text>
                  <Text strong className={styles.summaryValueLarge}>
                    {totalAmount.toLocaleString()}đ
                  </Text>
                </div>
                <div className={styles.sidebarActions}>
                  <Button
                    className={styles.checkoutButtonMain}
                    onClick={handleOpenOrderModal}
                    disabled={
                      cartItems.length === 0 || loading || isSubmittingOrder
                    } // Sử dụng isSubmittingOrder
                    block
                  >
                    {totalAmount.toLocaleString()}đ
                  </Button>
                  <Popconfirm
                    title="Xóa tất cả sản phẩm?"
                    onConfirm={handleClearCart}
                    okText="Xóa hết"
                    cancelText="Không"
                    disabled={
                      cartItems.length === 0 || loading || isSubmittingOrder
                    } // Sử dụng isSubmittingOrder
                    placement="top"
                  >
                    <Button
                      className={styles.clearCartButton}
                      disabled={
                        cartItems.length === 0 || loading || isSubmittingOrder
                      }
                      icon={<ClearOutlined />}
                    >
                      Close
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {selectedProductForVoucher &&
        selectedProductForVoucher.productDetails && (
          <VoucherSelectionModal
            visible={isVoucherModalVisible}
            onClose={() => {
              setIsVoucherModalVisible(false);
              setSelectedProductForVoucher(null);
            }}
            product={selectedProductForVoucher.productDetails}
            currentCartItem={selectedProductForVoucher}
            onVoucherApplied={handleVoucherApplied}
          />
        )}

      <OrderConfirmationModal
        visible={isOrderModalVisible}
        onClose={() => setIsOrderModalVisible(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
        onOrderPlaced={handleOrderPlaced}
        // Truyền isSubmittingOrder và callback để cập nhật nó
        isSubmitting={isSubmittingOrder}
        onSubmittingChange={setIsSubmittingOrder}
      />
    </div>
  );
};

export default CartPage;
