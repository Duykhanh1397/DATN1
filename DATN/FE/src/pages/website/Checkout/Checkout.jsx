import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import API from "../../../services/api";

const Checkout = () => {
  const { orderId } = useParams(); // lấy orderId từ URL
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Query lấy chi tiết đơn hàng
  const { data: order, isLoading } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async () => {
      const { data } = await API.get(`/orders/${orderId}`);
      console.log(data);
      return data.data;
    },
  });

  // Mutation để submit đơn hàng
  const { mutate } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await API.put(`orders/${orderId}`, formData);
      return data;
    },
    onSuccess: () => {
      messageApi.success("Cập nhật thông tin đơn hàng thành công!");
    },
    onError: () => {
      messageApi.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
    },
  });

  if (isLoading) {
    return <div className="text-center">Đang tải...</div>;
  }

  const products = order.order_items.map((item) => ({
    id: item.id,
    name: item.product_variant.product.name,
    color: item.product_variant.color?.value,
    storage: item.product_variant.storage?.value,
    quantity: item.quantity,
    total_price: item.total_price,
    image:
      item.product_variant.images[0]?.image_url ||
      "https://via.placeholder.com/60",
  }));

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
                fullname: order.user?.name || "",
                email: order.user?.email || "",
                phone: order.user?.phone || "",
                address: order.address || "",
                note: order.note || "",
              }}
              onFinish={(values) => mutate(values)}
            >
              <Form.Item
                label="Họ và Tên"
                name="fullname"
                rules={[{ required: true, message: "Nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Nhập email" }]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Nhập địa chỉ nhận hàng" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={10}>
          <Card>
            <h2>Sản phẩm</h2>
            <hr style={{ borderTop: "2px dashed #444", marginTop: 30 }} />
            <div style={{ maxHeight: 350, overflowY: "auto" }}>
              <List
                dataSource={products}
                renderItem={(item) => (
                  <List.Item>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ color: "#888" }}>
                        Màu: {item.color} | Dung lượng: {item.storage}
                      </div>
                      <div>Số lượng: {item.quantity}</div>
                    </div>
                    <div>
                      {item.total_price
                        ? `${Number(item.total_price).toLocaleString(
                            "vi-VN"
                          )} VNĐ`
                        : "0 VNĐ"}
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <Divider />

            <Row justify="space-between">
              <div>Phí giao hàng</div>
              <div strong style={{ color: "green" }}>
                Miễn phí
              </div>
            </Row>

            <Divider />

            <Row justify="space-between">
              <h4 level={5}>Tổng tiền: </h4>
              <h4 level={5} style={{ color: "red" }}>
                {order.total_amount
                  ? `${Number(order.total_amount).toLocaleString("vi-VN")} VNĐ`
                  : "0 VNĐ"}
              </h4>
            </Row>
          </Card>
          <Card style={{ marginTop: 30 }}>
            <Form>
              <Form.Item wrapperCol={{ style: { textAlign: "center" } }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: 300, height: 50, backgroundColor: "green" }}
                  size="large"
                >
                  Thanh toán khi nhận hàng
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ style: { textAlign: "center" } }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: 300, height: 50 }}
                  size="large"
                >
                  Thanh toán Online(VNPay)
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
