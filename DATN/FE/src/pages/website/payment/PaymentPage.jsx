import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  List,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";

const { Title, Text } = Typography;

const products = [
  { name: "Cóc trái/ Cóc cây - 1kg X 1", price: 15000 },
  { name: "Nho đen không hạt nhập khẩu - 500gr X 1", price: 106820 },
  { name: "Quýt đường Lai Vung - 1kg X 1", price: 34000 },
  { name: "Chuối cau - 1kg X 1", price: 24000 },
];

const OrderForm = () => {
  const [form] = Form.useForm();

  const totalPrice = products.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      {/* Left Side: Form */}
      <Col span={16}>
        <Card title="Thông tin khách hàng">
          <Form form={form} layout="vertical">
            <Form.Item
              label="Họ và Tên"
              name="fullname"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Đặt hàng
            </Button>
          </Form>
        </Card>
      </Col>

      {/* Right Side: Order Summary */}
      <Col span={8}>
        <Card>
          <Title level={4}>Sản phẩm</Title>
          <List
            dataSource={products}
            renderItem={(item) => (
              <List.Item>
                <Text>{item.name}</Text>
                <Text>{item.price.toLocaleString()} đ</Text>
              </List.Item>
            )}
          />

          <Divider />

          <Row justify="space-between">
            <Text>Phí giao hàng</Text>
            <Text strong style={{ color: "green" }}>
              Miễn phí
            </Text>
          </Row>

          <Divider />

          <Row justify="space-between">
            <Title level={5}>Giá trị đơn hàng</Title>
            <Title level={5} style={{ color: "green" }}>
              {totalPrice.toLocaleString()} đ
            </Title>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default OrderForm;
