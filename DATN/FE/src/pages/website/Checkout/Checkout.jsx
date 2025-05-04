import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  List,
  Divider,
  Row,
  Col,
  message,
} from "antd";
import { useQueryClient } from "@tanstack/react-query";
import API from "../../../services/api";
import ShippingFeeForm from "./ShippingFeeForm";

const Checkout = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCODLoading, setIsCODLoading] = useState(false);
  const [isVNPayLoading, setIsVNPayLoading] = useState(false);
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const selectedItems = location.state?.selectedItems || [];
  const userInfo = JSON.parse(localStorage.getItem("user")) || {};

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  const createOrderData = (paymentMethod) => ({
    order_items: selectedItems.map((item) => ({
      product_variant_id: item.product_variant?.id,
      quantity: item.quantity,
      cart_item_id: item.cart_item_id,
    })),
    payment_method: paymentMethod,
    voucher_code: voucherCode || null,
    phone_number: form.getFieldValue("phone"),
    address: form.getFieldValue("address"),
    shipping_fee: shippingFee,
    final_total: getFinalTotal(),
  });

  const applyVoucher = async () => {
    try {
      setIsVoucherLoading(true);
      const response = await API.post("/vouchers/apply", {
        code: voucherCode,
        cart_total: totalAmount,
      });
      setDiscount(response.data.discount);
      setVoucherError("");
      messageApi.success("Áp dụng voucher thành công!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Mã giảm giá không hợp lệ!";
      setVoucherError(errorMsg);
      setDiscount(0);
      messageApi.error(errorMsg);
    } finally {
      setIsVoucherLoading(false);
    }
  };

  const getFinalTotal = () => {
    return totalAmount - discount + shippingFee;
  };

  const handleCODCheckout = async () => {
    try {
      await form.validateFields();
      setIsCODLoading(true);
      const orderData = createOrderData("COD");

      await API.post("/orders", orderData);

      await Promise.all(
        selectedItems.map((item) =>
          API.delete(`/cart/items/${item.cart_item_id}`).catch(() => null)
        )
      );

      messageApi.success("Đặt hàng thành công! Chờ thanh toán khi nhận hàng.");
      queryClient.invalidateQueries(["CART_ITEM"]);
      navigate("/my-order");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Lỗi khi tạo đơn hàng COD: " + error.message;
      messageApi.error(errorMsg);
    } finally {
      setIsCODLoading(false);
    }
  };

  const handleVNPayCheckout = async () => {
    try {
      await form.validateFields();
      setIsVNPayLoading(true);
      const orderData = createOrderData("VNPay");

      localStorage.setItem("pending_order", JSON.stringify(orderData));

      const resVNPay = await API.post("/vnpay/payment", {
        total_vnpay: getFinalTotal(),
      });

      if (resVNPay.data.data) {
        window.location.href = resVNPay.data.data;
      } else {
        messageApi.error("Không nhận được URL thanh toán VNPay.");
      }
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Lỗi thanh toán VNPay!"
      );
    } finally {
      setIsVNPayLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.address) {
      const addressLower = userInfo.address.toLowerCase();
      if (addressLower.includes("hà nội")) {
        setShippingFee(0);
      } else {
        setShippingFee(20000);
      }
    }
  }, [userInfo.address]);

  return (
    <div className="container p-5 w-100">
      {contextHolder}
      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={14}>
          <Card>
            <h2>Thông tin khách hàng</h2>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: userInfo.name || "",
                email: userInfo.email || "",
                phone: userInfo.phone || "",
                address: userInfo.address || "",
              }}
            >
              <Form.Item
                label="Họ và Tên"
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Form>

            <Divider />
            <ShippingFeeForm
              userAddress={userInfo.address}
              onFeeChange={setShippingFee}
              onAddressChange={(address) => {
                form.setFieldsValue({ address });
              }}
            />
          </Card>
        </Col>

        <Col span={10}>
          <Card>
            <h2>Sản phẩm</h2>
            <Divider />
            <List
              dataSource={selectedItems}
              renderItem={(item) => (
                <List.Item>
                  <div>
                    <strong>{item.product_variant?.name}</strong>
                    <div style={{ color: "#888" }}>
                      Màu: {item.product_variant?.color} - Dung lượng:{" "}
                      {item.product_variant?.storage}
                    </div>
                    <div>Số lượng: {item.quantity}</div>
                  </div>
                  <div>{item.total_price?.toLocaleString("vi-VN")} VNĐ</div>
                </List.Item>
              )}
            />

            <Divider />
            <Row justify="space-between">
              <h6>Tổng tiền:</h6>
              <h6 style={{ color: "red" }}>
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </h6>
            </Row>

            <Divider />
            <Row justify="space-between">
              <h6>Phí vận chuyển</h6>
              <h6 style={{ color: shippingFee === 0 ? "green" : "#000" }}>
                {shippingFee === 0
                  ? "Miễn phí"
                  : `${shippingFee.toLocaleString("vi-VN")} VNĐ`}
              </h6>
            </Row>

            <Divider />
            <Row justify="space-between" align="middle">
              <h6>Voucher</h6>
              <div>
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value);
                    setVoucherError("");
                    setDiscount(0);
                  }}
                  style={{ width: 150, marginRight: 10 }}
                />
                <Button
                  type="primary"
                  onClick={applyVoucher}
                  loading={isVoucherLoading}
                >
                  Áp dụng
                </Button>
              </div>
            </Row>

            {voucherError && (
              <Row>
                <div style={{ color: "red", marginTop: 5 }}>{voucherError}</div>
              </Row>
            )}

            {discount > 0 && (
              <>
                <Divider />
                <Row justify="space-between">
                  <h6>Giảm giá</h6>
                  <h6 style={{ color: "red" }}>
                    -{discount.toLocaleString("vi-VN")} VNĐ
                  </h6>
                </Row>
              </>
            )}

            <Divider />
            <Row justify="space-between">
              <h4>Thành tiền:</h4>
              <h4 style={{ color: "red" }}>
                {getFinalTotal().toLocaleString("vi-VN")} VNĐ
              </h4>
            </Row>
          </Card>

          <Card style={{ marginTop: 30 }}>
            <Form>
              <Form.Item wrapperCol={{ style: { textAlign: "center" } }}>
                <Button
                  type="primary"
                  style={{ width: 300, height: 50, backgroundColor: "green" }}
                  size="large"
                  onClick={handleCODCheckout}
                  loading={isCODLoading}
                >
                  Thanh toán khi nhận hàng
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ style: { textAlign: "center" } }}>
                <Button
                  type="primary"
                  style={{ width: 300, height: 50, backgroundColor: "red" }}
                  size="large"
                  onClick={handleVNPayCheckout}
                  loading={isVNPayLoading}
                >
                  Thanh toán Online VNPay
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
