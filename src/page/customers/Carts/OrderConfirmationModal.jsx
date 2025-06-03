// src/components/cart/OrderConfirmationModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Spin,
  Typography,
  Divider,
  List,
  message,
  Checkbox,
  Tag,
  Row,
  Col,
  Image, // Thêm Image để hiển thị ảnh
} from "antd";
import fetchUtils from "../../../utils/fetchUtils";
import { useNavigate } from "react-router-dom";
import styles from "./OrderConfirmationModal.module.css";

const { Text, Title, Paragraph } = Typography;

const OrderConfirmationModal = ({
  visible,
  onClose,
  cartItems,
  totalAmount,
  onOrderPlaced,
}) => {
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      setLoadingData(true);
      const fetchUserInfo = async () => {
        try {
          const res = await fetchUtils.get("/user/profile/me", true);
          if (res) {
            setUserInfo(res);
            form.setFieldsValue({
              editFirstName: res.first_name || "",
              editLastName: res.last_name || "",
              editPhone: res.phone || "",
              editAddress: res.address || "",
            });
            if (
              !res.address ||
              !res.phone ||
              !(res.first_name && res.last_name)
            ) {
              setIsEditingAddress(true);
              setSaveInfo(true);
            } else {
              setIsEditingAddress(false);
              setSaveInfo(false);
            }
          } else {
            message.warning("Không thể tải thông tin. Vui lòng nhập thủ công.");
            setIsEditingAddress(true);
            setSaveInfo(true);
            form.setFieldsValue({
              editFirstName: "",
              editLastName: "",
              editPhone: "",
              editAddress: "",
            });
          }
        } catch (error) {
          message.error(
            "Lỗi tải thông tin người dùng. Vui lòng nhập thủ công."
          );
          setIsEditingAddress(true);
          setSaveInfo(true);
          form.setFieldsValue({
            editFirstName: "",
            editLastName: "",
            editPhone: "",
            editAddress: "",
          });
        } finally {
          setLoadingData(false);
        }
      };
      fetchUserInfo();
    } else {
      form.resetFields([
        "editFirstName",
        "editLastName",
        "editPhone",
        "editAddress",
        "saveInfoForNextTime",
      ]);
      setIsEditingAddress(false);
      setSaveInfo(true);
      setUserInfo(null);
      setLoadingData(false);
      setIsSubmitting(false);
    }
  }, [visible, form]);

  const handleFinish = async (formValues) => {
    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtOrder: item.productId.price,
        appliedVoucherId: item.appliedVoucherDetails
          ? item.appliedVoucherDetails._id
          : null,
        voucherDetailsAtOrder: item.appliedVoucherDetails
          ? {
              code: item.appliedVoucherDetails.code,
              discountType: item.appliedVoucherDetails.discountType,
              discountValue: item.appliedVoucherDetails.discountValue,
              calculatedDiscount: item.appliedVoucherDetails.calculatedDiscount,
            }
          : null,
      }));

      let shippingFirstName, shippingLastName, shippingPhone, shippingAddress;
      if (isEditingAddress) {
        shippingFirstName = (form.getFieldValue("editFirstName") || "").trim(); // Lấy từ form trực tiếp
        shippingLastName = (form.getFieldValue("editLastName") || "").trim();
        shippingPhone = (form.getFieldValue("editPhone") || "").trim();
        shippingAddress = (form.getFieldValue("editAddress") || "").trim();
      } else if (userInfo) {
        shippingFirstName = userInfo.first_name || "";
        shippingLastName = userInfo.last_name || "";
        shippingPhone = userInfo.phone || "";
        shippingAddress = userInfo.address || "";
      } else {
        message.error("Lỗi: Không có thông tin người dùng.");
        setIsSubmitting(false);
        return;
      }

      if (
        !shippingLastName ||
        !shippingFirstName ||
        !shippingPhone ||
        !shippingAddress
      ) {
        message.error("Vui lòng điền đầy đủ thông tin giao hàng.");
        if (!isEditingAddress) setIsEditingAddress(true); // Buộc edit nếu thông tin thiếu
        // Focus vào trường đầu tiên bị thiếu
        if (!shippingLastName) form.getFieldInstance("editLastName")?.focus();
        else if (!shippingFirstName)
          form.getFieldInstance("editFirstName")?.focus();
        else if (!shippingPhone) form.getFieldInstance("editPhone")?.focus();
        else if (!shippingAddress)
          form.getFieldInstance("editAddress")?.focus();
        setIsSubmitting(false);
        return;
      }

      const shippingFullNameForOrder =
        `${shippingLastName} ${shippingFirstName}`.trim();
      const orderPayload = {
        items: orderItems,
        shippingInfo: {
          name: shippingFullNameForOrder,
          phone: shippingPhone,
          address: shippingAddress,
        },
        totalAmount: totalAmount,
      };

      const response = await fetchUtils.post("/orders", orderPayload, true); // Đảm bảo API endpoint đúng

      // SỬA CÁCH KIỂM TRA RESPONSE Ở ĐÂY
      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data.orders) &&
        response.data.orders.length > 0
      ) {
        if (
          saveInfo &&
          (isEditingAddress ||
            !userInfo?.address ||
            !userInfo?.phone ||
            !userInfo?.first_name ||
            !userInfo?.last_name)
        ) {
          // ... (logic cập nhật profile giữ nguyên)
          const profileUpdatePayload = {};
          let needsProfileUpdate = false;
          const currentProfileFirstName = userInfo?.first_name || "";
          const currentProfileLastName = userInfo?.last_name || "";
          const currentProfilePhone = userInfo?.phone || "";
          const currentProfileAddress = userInfo?.address || "";
          const currentProfileFullName =
            userInfo?.fullName ||
            `${currentProfileLastName} ${currentProfileFirstName}`.trim();

          if (shippingFirstName !== currentProfileFirstName) {
            profileUpdatePayload.firstName = shippingFirstName;
            needsProfileUpdate = true;
          }
          if (shippingLastName !== currentProfileLastName) {
            profileUpdatePayload.lastName = shippingLastName;
            needsProfileUpdate = true;
          }
          if (
            shippingFullNameForOrder &&
            shippingFullNameForOrder !== currentProfileFullName
          ) {
            profileUpdatePayload.fullName = shippingFullNameForOrder;
            needsProfileUpdate = true;
          }
          if (shippingPhone !== currentProfilePhone) {
            profileUpdatePayload.phone = shippingPhone;
            needsProfileUpdate = true;
          }
          if (shippingAddress !== currentProfileAddress) {
            profileUpdatePayload.address = shippingAddress;
            needsProfileUpdate = true;
          }

          if (needsProfileUpdate) {
            try {
              await fetchUtils.put(
                `/user/profile/update`,
                profileUpdatePayload,
                true
              );
              message.success("Thông tin giao hàng đã cập nhật vào hồ sơ.");
            } catch (updateError) {
              message.warning(
                "Đặt hàng thành công, nhưng cập nhật hồ sơ thất bại: " +
                  (updateError.response?.data?.message || updateError.message)
              );
            }
          }
        }
        try {
          await fetchUtils.remove("/user/carts/clear", true);
        } catch (clearCartError) {
          console.error("Failed to clear cart:", clearCartError);
        }

        onOrderPlaced();
        onClose();
        Modal.success({
          title: "Chúc mừng bạn đã đặt hàng thành công!", // THAY ĐỔI TITLE
          icon: null, // Bỏ icon mặc định của Modal.success
          width: 450, // Điều chỉnh width nếu cần
          content: (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Image
                width={100} // Kích thước ảnh
                src="https://cdn-icons-png.flaticon.com/512/6808/6808197.png"
                alt="Order Success"
                preview={false} // Không cho phép preview khi click
                style={{ marginBottom: 20 }}
              />
              <Paragraph>
                {response.data.message ||
                  `Đã tạo ${response.data.orders.length} đơn hàng.`}
              </Paragraph>
              {/* Hiển thị mã đơn hàng đầu tiên nếu có nhiều đơn hàng */}
              {response.data.orders[0]?.orderCode && (
                <Paragraph>
                  Mã đơn hàng tham khảo:{" "}
                  <strong>{response.data.orders[0].orderCode}</strong>
                </Paragraph>
              )}
            </div>
          ),
          okText: "Vào xem đơn hàng", // THAY ĐỔI OK TEXT
          onOk: () => navigate(`/information/order-history`),
          centered: true,
        });
      } else {
        message.error(
          response?.message || "Đặt hàng thất bại. Vui lòng thử lại."
        );
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || error.message || "Có lỗi khi đặt hàng."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayFirstName = userInfo?.first_name || "";
  const displayLastName = userInfo?.last_name || "";
  const displayedFullName =
    `${displayLastName} ${displayFirstName}`.trim() || userInfo?.username || "";
  const displayPhone = userInfo?.phone || "";
  const displayAddress = userInfo?.address || "";

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          {" "}
          Xác nhận Đơn Hàng{" "}
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
      className={styles.orderModal}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Spin spinning={loadingData && visible} tip="Đang tải thông tin...">
          {" "}
          {/* Spin khi đang fetch */}
          <div className={styles.formSection}>
            <Title level={5}>Thông tin giao hàng</Title>
            {!isEditingAddress && userInfo ? (
              <div className={styles.shippingInfoDisplay}>
                <Paragraph>
                  <strong>Tên người nhận:</strong>{" "}
                  {displayedFullName || (
                    <Text type="secondary" italic>
                      (Chưa có)
                    </Text>
                  )}
                </Paragraph>
                <Paragraph>
                  <strong>Số điện thoại:</strong>{" "}
                  {displayPhone || (
                    <Text type="secondary" italic>
                      (Chưa có)
                    </Text>
                  )}
                </Paragraph>
                <Paragraph>
                  <strong>Địa chỉ:</strong>{" "}
                  {displayAddress || (
                    <Text type="secondary" italic>
                      (Chưa có)
                    </Text>
                  )}
                </Paragraph>
                <Button
                  type="link"
                  onClick={() => {
                    setIsEditingAddress(true);
                    setSaveInfo(true); // Mặc định muốn lưu khi bắt đầu edit
                    // Đảm bảo form được điền lại giá trị từ userInfo khi chuyển sang edit
                    form.setFieldsValue({
                      editFirstName: userInfo?.first_name || "",
                      editLastName: userInfo?.last_name || "",
                      editPhone: userInfo?.phone || "",
                      editAddress: userInfo?.address || "",
                    });
                  }}
                  style={{ paddingLeft: 0 }}
                >
                  Thay đổi thông tin
                </Button>
              </div>
            ) : (
              <>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="editLastName"
                      label="Họ"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ!" },
                        {
                          whitespace: true,
                          message: "Họ không được để trống!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập họ" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="editFirstName"
                      label="Tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập tên!" },
                        {
                          whitespace: true,
                          message: "Tên không được để trống!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="editPhone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  name="editAddress"
                  label="Địa chỉ giao hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ giao hàng!",
                    },
                    {
                      whitespace: true,
                      message: "Địa chỉ không được để trống!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                </Form.Item>

                {isEditingAddress &&
                  userInfo &&
                  (userInfo.first_name ||
                    userInfo.last_name ||
                    userInfo.phone ||
                    userInfo.address) && (
                    <Button
                      type="link"
                      onClick={() => {
                        form.setFieldsValue({
                          editFirstName: userInfo.first_name || "",
                          editLastName: userInfo.last_name || "",
                          editPhone: userInfo.phone || "",
                          editAddress: userInfo.address || "",
                        });
                        setIsEditingAddress(false);
                        setSaveInfo(false);
                      }}
                      style={{ paddingLeft: 0 }}
                    >
                      {" "}
                      Hủy thay đổi{" "}
                    </Button>
                  )}
                <Form.Item
                  name="saveInfoForNextTime"
                  valuePropName="checked"
                  initialValue={saveInfo}
                >
                  <Checkbox
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    checked={saveInfo}
                  >
                    Lưu thông tin này cho lần đặt hàng sau
                  </Checkbox>
                </Form.Item>
              </>
            )}
          </div>
          <Divider />
          {/* ... Phần sản phẩm và tổng tiền ... */}
          <div className={styles.formSection}>
            <Title level={5}>Sản phẩm đã chọn</Title>
            <List
              className={styles.productList}
              itemLayout="horizontal"
              dataSource={cartItems}
              size="small"
              renderItem={(item) => (
                <List.Item
                  key={item.productId._id}
                  actions={[
                    <Text strong>
                      {" "}
                      {(
                        item.productId.price * item.quantity
                      ).toLocaleString()}đ{" "}
                    </Text>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <img
                        src={
                          item.productId.images?.[0] || "/placeholder-image.png"
                        }
                        alt={item.productId.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    }
                    title={
                      <Text
                        ellipsis={{ tooltip: item.productId.name }}
                        style={{ fontWeight: 500, display: "block" }}
                      >
                        {" "}
                        {item.productId.name} (x{item.quantity}){" "}
                      </Text>
                    }
                    description={
                      item.appliedVoucherDetails ? (
                        <Tag color="green" style={{ marginTop: "4px" }}>
                          {" "}
                          Đã áp dụng: {item.appliedVoucherDetails.code} (-{" "}
                          {item.appliedVoucherDetails.calculatedDiscount?.toLocaleString()}{" "}
                          đ){" "}
                        </Tag>
                      ) : (
                        <Text type="secondary" style={{ fontSize: "0.8em" }}>
                          {" "}
                          Không có voucher{" "}
                        </Text>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          </div>
          <div className={styles.totalAmountSection}>
            <Text strong style={{ fontSize: "1.1em" }}>
              {" "}
              Tổng tiền thanh toán:{" "}
            </Text>
            <Title level={3} type="danger" style={{ margin: 0 }}>
              {" "}
              {totalAmount.toLocaleString()}đ{" "}
            </Title>
          </div>
        </Spin>
        <div className={styles.formActions}>
          <Button
            onClick={onClose}
            style={{ marginRight: 12 }}
            disabled={isSubmitting || loadingData}
          >
            {" "}
            Hủy{" "}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            danger
            size="large"
            disabled={loadingData}
          >
            {" "}
            Xác nhận Đặt Hàng{" "}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default OrderConfirmationModal;
